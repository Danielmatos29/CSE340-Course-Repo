import { getAllCategories, getCategoriesByID, getProjectsByCategoryId, getCategoriesByProjectId } from "../models/categories.js";

const showCategoryPage = async (req, res) => {
    const categories = await getAllCategories();

    const title = "Categories";
    res.render("categories", { title, categories })
}

const showCategoryDetails = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoriesByID(categoryId);
    const projectsByCategory = await getProjectsByCategoryId(categoryId);

    const title = "Category Details";
    res.render("category", { title, categoryDetails, projectsByCategory });
};

export { showCategoryPage, showCategoryDetails };