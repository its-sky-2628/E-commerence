const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        const token = req.cookies.token;

        if (!token) {

            if (req.originalUrl.startsWith("/api/")) {

                return res.status(401).json({
                    success: false,
                    message: "Admin authentication required"
                });
            }

            return res.redirect("/login");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {

            return res.status(403).json({
                success: false,
                message: "Admin access only"
            });
        }

        req.admin = decoded;

        next();

    } catch (error) {

        res.clearCookie("token");

        if (req.originalUrl.startsWith("/api/")) {

            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        return res.redirect("/login");
    }
};

module.exports = authMiddleware;