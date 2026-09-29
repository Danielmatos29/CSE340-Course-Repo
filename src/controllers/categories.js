import {
    getAllCategories,
    getCategoriesByID, 
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments
     } from "../models/categories.js";
     
import { 
    getProjectDetails
} from "../models/projects.js";

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

export { 
    showCategoryPage, 
    showCategoryDetails,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};