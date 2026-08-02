const login = (req, res) => {

    const { email, password } = req.body;

    if (
        email === "admin@freshfashion.com" &&
        password === "admin123"
    ) {

        return res.json({
            success: true,
            message: "Login Successful"
        });

    }

    res.status(401).json({
        success: false,
        message: "Invalid Credentials"
    });

};

module.exports = { login };