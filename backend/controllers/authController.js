const supabase = require("../config/supabase");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email?.trim().toLowerCase(),
            password
        });

        if (error || !data.user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

        if (profileError || profile?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access only"
            });
        }

        return res.json({
            success: true,
            message: "Login Successful"
        });
    } catch (error) {
        console.error("API Login Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to login"
        });
    }
};

module.exports = { login };
