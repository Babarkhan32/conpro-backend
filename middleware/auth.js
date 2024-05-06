const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
require("dotenv")

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    try {

        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader && authorizationHeader.split(' ')[1];

        if (!token) {
            return next(new ErrorHander("Please Login to access this resource", 401));
        }

        const decodedData = jwt.verify(token, process.env.SECRET);

        req.id = decodedData.id;
        next();

    } catch (error) {
        console.error("Token verification failed:", error);
        return next(new ErrorHander("Unauthorized - Invalid or expired token", 401));
    }
});





exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHander(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    };
};