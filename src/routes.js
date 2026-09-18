import express from 'express';

import { showHomePage } from './controllers/index.js';
<<<<<<< HEAD
import { showOrganizationPage, showOrganizationDetailsPage } from './controllers/organizations.js';
=======
import { showOrganizationPage } from './controllers/organizations.js';
>>>>>>> origin/main
import { showProjectPage } from './controllers/projects.js';
import { showCategoryPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationPage);
router.get('/projects', showProjectPage);
router.get('/categories', showCategoryPage);
<<<<<<< HEAD
router.get('/organization/:id', showOrganizationDetailsPage);
=======
>>>>>>> origin/main

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;