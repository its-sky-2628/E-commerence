const Contact = require("../models/Contact");

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and message are required"
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message:
          "Enter a valid email address"
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      message: message.trim()
    });

    return res.status(201).json({
      success: true,
      message:
        "Message sent successfully",
      id: contact._id
    });
  } catch (error) {
    console.error(
      "Send Message Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send message"
    });
  }
};

// ADMIN - GET MESSAGES
const getMessages = async (req, res) => {
  try {
    const messages = await Contact
      .find()
      .sort({ createdAt: -1 });

    res.render("messages", {
      messages
    });
  } catch (error) {
    console.error(
      "Messages Error:",
      error
    );

    res.status(500).send(
      "Unable to load messages"
    );
  }
};

// ADMIN - MARK READ
const markAsRead = async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status: "read"
      }
    );

    res.redirect("/admin/messages");
  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Unable to update message"
    );
  }
};

// ADMIN - DELETE MESSAGE
const deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(
      req.params.id
    );

    res.redirect("/admin/messages");
  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Unable to delete message"
    );
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage
};