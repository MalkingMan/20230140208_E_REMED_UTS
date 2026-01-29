/**
 * Role-Based Access Control Middleware
 * Handles authorization based on x-user-role and x-user-id headers
 */

/**
 * Valid roles in the system
 */
const VALID_ROLES = ['admin', 'user'];

/**
 * Middleware to validate and extract user role from headers
 * Attaches role and userId to request object
 */
const extractUserInfo = (req, res, next) => {
    const userRole = req.headers['x-user-role'];
    const userId = req.headers['x-user-id'];

    // Attach to request for downstream use
    req.userRole = userRole ? userRole.toLowerCase() : null;
    req.userId = userId ? parseInt(userId, 10) : null;

    next();
};

/**
 * Middleware factory to require specific role(s)
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.userRole;

        // Check if role header is present
        if (!userRole) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Missing required header: x-user-role'
            });
        }

        // Check if role is valid
        if (!VALID_ROLES.includes(userRole)) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: `Invalid role: '${userRole}'. Valid roles are: ${VALID_ROLES.join(', ')}`
            });
        }

        // Check if user has required role
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                message: `Access denied. This endpoint requires role: ${allowedRoles.join(' or ')}`
            });
        }

        next();
    };
};

/**
 * Middleware to require admin role
 * Shorthand for requireRole('admin')
 */
const requireAdmin = (req, res, next) => {
    return requireRole('admin')(req, res, next);
};

/**
 * Middleware to require user role and valid user ID
 * Validates that x-user-id is present and is a valid positive integer
 */
const requireUser = (req, res, next) => {
    const userRole = req.userRole;
    const userId = req.userId;

    // Check if role header is present
    if (!userRole) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Missing required header: x-user-role'
        });
    }

    // Check if role is 'user'
    if (userRole !== 'user') {
        return res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: 'Access denied. This endpoint requires role: user'
        });
    }

    // Check if user ID header is present
    if (!req.headers['x-user-id']) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Missing required header: x-user-id'
        });
    }

    // Check if user ID is valid
    if (isNaN(userId) || userId < 1) {
        return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Invalid x-user-id: must be a positive integer'
        });
    }

    next();
};

module.exports = {
    extractUserInfo,
    requireRole,
    requireAdmin,
    requireUser,
    VALID_ROLES
};
