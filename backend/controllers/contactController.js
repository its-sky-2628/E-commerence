const supabase = require("../config/supabase");

const formatMessage = (row) => ({
    ...row,
    _id: row.id,
    createdAt: row.created_at
});

// PUBLIC: SEND MESSAGE
const sendMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email address"
            });
        }

        const { data, error } = await supabase
            .from("contacts")
            .insert({
                name: name.trim(),
                email: normalizedEmail,
                phone: phone?.trim() || "",
                message: message.trim(),
                status: "new"
            })
            .select("id")
            .single();

        if (error) throw error;

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            id: data.id
        });

    } catch (error) {
        console.error("Send Message Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to send message"
        });
    }
};

// ADMIN: GET MESSAGES
const getMessages = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("contacts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        res.render("messages", {
            messages: (data || []).map(formatMessage)
        });

    } catch (error) {
        console.error("Messages Error:", error);
        res.status(500).send("Unable to load messages");
    }
};

// ADMIN: MARK READ
const markAsRead = async (req, res) => {
    try {
        const { error } = await supabase
            .from("contacts")
            .update({ status: "read" })
            .eq("id", req.params.id);

        if (error) throw error;

        res.redirect("/admin/messages");

    } catch (error) {
        console.error("Mark Read Error:", error);
        res.status(500).send("Unable to update message");
    }
};

// ADMIN: DELETE MESSAGE
const deleteMessage = async (req, res) => {
    try {
        const { error } = await supabase
            .from("contacts")
            .delete()
            .eq("id", req.params.id);

        if (error) throw error;

        res.redirect("/admin/messages");

    } catch (error) {
        console.error("Delete Message Error:", error);
        res.status(500).send("Unable to delete message");
    }
};

module.exports = {
    sendMessage,
    getMessages,
    markAsRead,
    deleteMessage
};
