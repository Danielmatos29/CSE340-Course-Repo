import bcrypt from 'bcrypt';
import { 
    createUser,
    authenticateUser,
    getAllUsers,
    volunteerForProject,
    deleteVolunteerForProject,
    getVolunteersByUsers
} from '../models/users.js';

const showUserRegistrationForm = async(req, res) => {
    const title = 'Create Account'

    res.render('register', {title})
};

const processUserRegistrationForm = async(req, res) => {
    const { name, password, email } = req.body;

    try {
        const saltRounds = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, saltRounds);
        await createUser(name, passwordHash, email);
        
        req.flash('success', 'Registration successful! Please log in.');
        return res.redirect('/');
    }
    catch(error){
        console.error('Error registering user:', error);
        req.flash('error', 'An error occured during registration. Please try again.');
        return res.redirect('/register');
    }
};

const showLoginForm = async(req, res) => {
    const title = "Login"

    res.render('login', { title });
}

const processLoginForm = async(req, res) => {
    const { email, password } = req.body

    try{
        const user = await authenticateUser(email, password);
        if (user !== null){
            req.session.user = user;
            req.flash('success', 'login successful!');
            
            if (res.locals.NODE_ENV === 'development'){
                console.log('User logged in: ', user);
            }
            return res.redirect('/dashboard');
        }
        req.flash('error', "Email or password doesn't match with the account. Please try again");
        return res.redirect('/login');
    }
    catch(error){
        console.error('Error during login: ', error);
        req.flash('error', 'An error occurred during logging. Please try again');
        return res.redirect('/login');
    }
}

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

const requireLogin = async(req, res, next) => {
    if (!req.session || !req.session.user){
        req.flash('error', 'You must be logged in to access this page')
        return res.redirect('/login');
    }
    next();
}

const showDashboard = async(req, res) => {
    const user = req.session.user
    const volunteeredProjects = await getVolunteersByUsers(user.user_id)
    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email,
        volunteeredProjects
    });
}

const requireRole = (role) => {
    return async(req, res, next) => {
        if (!req.session || !req.session.user){
            req.flash('error', 'You must be logged in to access this page')
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role){
            req.flash('error', "You do not have permission to access this page")
            return res.redirect('/');
        }
        next()
    }
}

const showAllUsers = async(req, res) => {
    try {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page');
            return res.redirect('/login');
        };
        if (req.session.user.role_name !== 'admin') {
            req.flash('error', 'You do not have permission to access this page');
            return res.redirect('/dashboard');
        }
        const users = await getAllUsers();
        res.render('users', { title: 'All Users', users });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        req.flash('error', 'An error occurred while fetching users. Please try again.');
        res.redirect('/');
    }
};

const volunteerProject = async(req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;

    try {
        await volunteerForProject(userId, projectId);
        req.flash('success', 'You have successfully volunteered for the project!');
        return res.redirect(`/project/${projectId}`);
    }
    catch (error) {
        console.error('Error volunteering for project:', error);
        req.flash('error', 'An error occurred while volunteering for the project. Please try again.');
        return res.redirect(`/project/${projectId}`);
    }
};

const deleteVolunteerProject = async(req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;
    
    try {
        await deleteVolunteerForProject(userId, projectId);
        req.flash('success', 'You have successfully withdrawn your volunteer application for the project.');
        return res.redirect(`/dashboard`);
    }
    catch (error) {
        console.error('Error withdrawing volunteer application:', error);
        req.flash('error', 'An error occurred while withdrawing your volunteer application. Please try again.');
        return res.redirect(`/dashboard`);
    }
};

export {
     showUserRegistrationForm,
     processUserRegistrationForm,
     showLoginForm,
     processLoginForm,
     processLogout,
     requireLogin,
     showDashboard,
     requireRole,
     showAllUsers,
     volunteerProject,
    deleteVolunteerProject
};