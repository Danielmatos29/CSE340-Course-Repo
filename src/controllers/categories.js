import { body, validationResult } from "express-validator";
import {
    getAllCategories,
    getCategoriesByID, 
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    updateCategory,
    createCategory
     } from "../models/categories.js";
     
import { 
    getProjectDetails
} from "../models/projects.js";

const categoryValidation = [
    body('cname')
        .trim()
        .notEmpty().withMessage('Name is required!')
        .isLength({min: 3, max: 200}).withMessage('Name must be between 3 and 200 characters!')
];

const showCategoryPage = async (req, res) => {
    const categories = await getAllCategories();

    const title = "Categories";
    res.render("categories", { title, categories })
}

const showCategoryDetails = async (req, res) => {
    const categoryId = req.params.id;

    const [categoryDetails, projectsByCategory] = await Promise.all([
        getCategoriesByID(categoryId),
        getProjectsByCategoryId(categoryId)
    ]);
    
    const title = "Category Details";
    res.render("category", { title, categoryDetails, projectsByCategory });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    console.log('Looking up projectId:', projectId);

    const [project, categories, assignedCategories] = await Promise.all([
        getProjectDetails(projectId),
        getAllCategories(),
        getCategoriesByProjectId(projectId)
    ]);

    const title = "Assign Categories to Project";

    res.render('assign-categories', {title, projectId, project, categories, assignedCategories })
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId

    const selectedCategoryIds = req.body.categoryIds || [];
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Category updated successfully!');

    res.redirect(`/project/${projectId}`);
}

const showNewCategoryForm = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Add your category'

    res.render('new-category', {title, categories});
}

const processNewCategoryForm = async (req, res) => {
    const { cname } = req.body;
    
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        errors.array().forEach((error) => {
            req.flash('error', error.msg)
        });
        return res.redirect('/new-category');
    }

    try {
        const categoryId = await createCategory(cname);
        req.flash('success', 'Category added successfully!');
        return res.redirect(`/category/${categoryId}`);
    }
    catch(error){
        console.log('There was an error by creating the new category', error);
        req.flash('error', 'There was an error by creating new category!');
        return res.redirect('/new-category');
    }
}

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id

    const categories = await getCategoriesByID(categoryId);
    const title = 'Edit your category'

    res.render('edit-category', {title, categories});
}

const processEditCategoryForm = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        errors.array().forEach((error) => {
            req.flash('error', error.msg)
        });
        return res.redirect(`/edit-category/${req.params.id}`);
    }

    const categoryId = req.params.id;
    const { cname } = req.body;

    await updateCategory(categoryId, cname);
    req.flash('success', 'Category updated successfully!');
    return res.redirect(`/category/${categoryId}`);
}

export { 
    showCategoryPage, 
    showCategoryDetails,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};