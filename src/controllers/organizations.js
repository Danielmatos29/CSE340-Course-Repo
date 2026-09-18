<<<<<<< HEAD
import { getAllOrganizations, getOrganizationDetails } from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";
=======
import { getAllOrganizations } from "../models/organizations.js";
>>>>>>> origin/main

const showOrganizationPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

<<<<<<< HEAD
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId)
    const title = 'Organization Details';

    res.render('organization', {title, organizationDetails, projects});
};

export { showOrganizationPage, showOrganizationDetailsPage };
=======
export { showOrganizationPage };
>>>>>>> origin/main
