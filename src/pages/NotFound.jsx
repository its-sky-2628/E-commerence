import {
  Link
} from "react-router-dom";

import {
  Home,
  ShoppingBag
} from "lucide-react";

import Navbar from "../components/Navbar/Navbar";


function NotFound() {

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 20px 50px",
          background: "#fafafa"
        }}
      >

        <div>

          <span
            style={{
              fontSize: "100px",
              fontWeight: "900",
              color: "#eee",
              lineHeight: 1
            }}
          >
            404
          </span>

          <h1
            style={{
              fontSize: "35px",
              marginTop: "15px"
            }}
          >
            Page Not Found
          </h1>

          <p
            style={{
              color: "#777",
              maxWidth: "450px",
              lineHeight: "1.7",
              margin:
                "12px auto 30px"
            }}
          >
            The page you're looking for
            doesn't exist or may have
            been moved.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap"
            }}
          >

            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding:
                  "13px 20px",
                background: "#111",
                color: "#fff",
                borderRadius: "10px",
                textDecoration: "none"
              }}
            >
              <Home size={17} />
              Home
            </Link>

            <Link
              to="/collection"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding:
                  "13px 20px",
                border:
                  "1px solid #ddd",
                color: "#111",
                borderRadius: "10px",
                textDecoration: "none"
              }}
            >
              <ShoppingBag size={17} />
              Collection
            </Link>

          </div>

        </div>

      </main>
    </>
  );
}

export default NotFound;