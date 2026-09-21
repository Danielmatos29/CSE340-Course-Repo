import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { showProjectPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoryPage, showCategoryDetails, showCategoriesByProjectId, showProjectsByCategoryId } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationPage);
router.get('/projects', showProjectPage);
router.get('/categories', showCategoryPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetails);
router.get('/category/:id', showCategoriesByProjectId);
router.get('/project/:id', showProjectsByCategoryId);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;