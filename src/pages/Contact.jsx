import "./Contact.css";

import {
  Mail,
  MapPin,
  Phone,
  Send
} from "lucide-react";

import { useState } from "react";

import Navbar from
  "../components/Navbar/Navbar";

import Footer from
  "../components/Footer/Footer";

import API from "../config/api";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState({
      type: "",
      message: ""
    });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

    setStatus({
      type: "",
      message: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setStatus({
        type: "",
        message: ""
      });

      const response = await fetch(
        API.contact,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(form)
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to send message"
        );
      }

      setStatus({
        type: "success",
        message:
          "Thank you! Your message has been sent successfully."
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "Something went wrong."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-heading">
          <span>GET IN TOUCH</span>

          <h1>
            We'd love to
            <br />
            hear from you.
          </h1>

          <p>
            Questions about a product,
            collection or Fresh Fashion
            Studio? Send us a message and
            we'll be happy to help.
          </p>
        </section>

        <section className="contact-layout">
          <div className="contact-info">
            <span className="contact-label">
              CONTACT
            </span>

            <h2>
              Let's start a conversation.
            </h2>

            <p>
              Reach out using the form or
              contact us directly through
              the details below.
            </p>

            <div className="contact-details">
              <div>
                <Mail size={19} />

                <span>
                  <small>Email</small>
                  freshfashion@example.com
                </span>
              </div>

              <div>
                <Phone size={19} />

                <span>
                  <small>Phone</small>
                  +91 00000 00000
                </span>
              </div>

              <div>
                <MapPin size={19} />

                <span>
                  <small>Location</small>
                  India
                </span>
              </div>
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <div className="contact-field">
              <label>Name</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="contact-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="contact-field">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91"
              />
            </div>

            <div className="contact-field">
              <label>Message</label>

              <textarea
                name="message"
                rows="6"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help?"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Message"}

              {!loading && (
                <Send size={16} />
              )}
            </button>

            {status.message && (
              <p
                className={
                  status.type === "success"
                    ? "contact-success"
                    : "contact-error"
                }
              >
                {status.message}
              </p>
            )}
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;