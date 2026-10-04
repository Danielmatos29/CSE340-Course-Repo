import bcrypt from 'bcrypt';
import { 
    createUser,
    authenticateUser 
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
        if (user){
            req.session.user = user;
            req.flash('success', 'login successful!');
            
            if (res.locals.NODE_ENV === 'development'){
                console.log('User logged in: ', user);
            }
            return res.redirect('/dashboard');
        }
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

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
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
export {
     showUserRegistrationForm,
     processUserRegistrationForm,
     showLoginForm,
     processLoginForm,
     processLogout,
     requireLogin,
     showDashboard,
     requireRole
};