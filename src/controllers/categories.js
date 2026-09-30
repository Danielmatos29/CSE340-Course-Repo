import { validationResult } from "express-validator";
import {
    getAllCategories,
    getCategoriesByID, 
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory
     } from "../models/categories.js";
     
import { 
    getProjectDetails
} from "../models/projects.js";

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required!')
        .isLength({min: 3, max: 200}).withMessage('Title must be between 3 and 200 characters!')
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

    const [project, categories, project_categories] = await Promise.all([
        getProjectDetails(projectId),
        getAllCategories(),
        getCategoriesByProjectId(projectId)
    ]);

    const title = "Assign Categories to Project";

    res.render('assign-categories', {title, project, categories, project_categories})
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id

    const selectedCategoryIds = req.body.cotegoryIds || [];
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Category updated successfully!');

    res.redirect(`project/${projectId}`);
}

const showNewCategoryForm = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Add your category'

    res.render('new-category', {title, categories});
}

const processNewCategoryForm = async (req, res) => {
    const { category_id, category_name } = req.body;
    
    const errors = validationResult(req)

    if (!errors.isEmpty){
        errors.array.forEach((error) => {
            req.flash('error', error.msg)
        });
        return res.redirect('/new-category');
    }

    try {
        await createCategory(category_id, category_name);
        req.flash('success', 'Category added successfully!');
        return res.redirect(`/category/${category_id}`);
    }
    catch(error){
        console.log('There was an error by creating the new category', error);
        req.flash('error', 'There was an error by creating new category!');
        return res.redirect('/new-category');
    }
}

export { 
    showCategoryPage, 
    showCategoryDetails,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation,
    showNewCategoryForm,
    processNewCategoryForm
};