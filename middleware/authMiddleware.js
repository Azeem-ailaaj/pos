const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            await req.user.populate('role');
            const userPermissions = req.user.role.permissions;

            if (!userPermissions.includes(requiredPermission)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Error checking permissions' });
        }
    };
};

module.exports = { checkPermission };
