import { getAllCategories, getCategoriesByID, getProjectsByCategoryId, getCategoriesByProjectId } from "../models/categories.js";

const showCategoryPage = async (req, res) => {
    const categories = await getAllCategories();

    const title = "Categories";
    res.render("categories", { title, categories })
}

const showCategoryDetails = async(req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoriesByID(categoryId);

    res.render("category", {categoryDetails})
}

const showCategoriesByProjectId = async(req, res) => {
    const project_id = req.params.id;
    const categoriesByProject = await getCategoriesByProjectId(project_id);

    res.render("category", {categoriesByProject})
}

const showProjectsByCategoryId = async(req, res) => {
    const category_id = req.params.id;
    const projectsByCategory = await getProjectsByCategoryId(category_id);

    res.render("category", {projectsByCategory})
}

export { showCategoryPage, showCategoryDetails, showCategoriesByProjectId, showProjectsByCategoryId };