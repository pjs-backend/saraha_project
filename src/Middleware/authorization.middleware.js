export const authorizationMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.loggedInUser;

        console.log({
            allowedRoles,
            role
        });

        if (allowedRoles.includes(role)) {
            return next();
        }

        return res.status(401).json({ message: "Unauthorized" });
    };
};
