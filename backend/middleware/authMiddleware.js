const supabase = require("../config/supabase");

const authMiddleware = async (req, res, next) => {
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

        const { data: userData, error: userError } =
            await supabase.auth.getUser(token);

        if (userError || !userData.user) {
            res.clearCookie("token");
            if (req.originalUrl.startsWith("/api/")) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired session"
                });
            }
            return res.redirect("/login");
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userData.user.id)
            .maybeSingle();

        if (profileError || profile?.role !== "admin") {
            return res.status(403).send("Admin access only");
        }

        req.admin = {
            id: userData.user.id,
            email: userData.user.email,
            role: profile.role
        };

        next();
    } catch (error) {
        console.error("Admin Auth Error:", error.message);
        return res.status(500).send("Authentication error");
    }
};

module.exports = authMiddleware;
