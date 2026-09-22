import { getUpcomingProjects, getProjectDetails } from "../models/projects.js";
import { getCategoriesByProjectId } from "../models/categories.js";


const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
}

const showProjectDetailsPage = async(req, res) => {
    const project_id = req.params.id
    const projectDetails = await getProjectDetails(project_id);
    const categoriesByProject = await getCategoriesByProjectId(project_id);
    const title = 'Service Project Details';

    res.render("project", {title, project_id, projectDetails, categoriesByProject})
}

export { showProjectPage, showProjectDetailsPage };