import { Link } from "react-router-dom";
import React from "react";

export default function Header() {
  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        <Link to="/gallery" style={linkStyle}>
          Gallery
        </Link>
        <Link to="/about" style={linkStyle}>
          About
        </Link>
      </nav>
    </header>
  );
}

const headerStyle: React.CSSProperties = {
  background: "#222",
  padding: "1rem",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "1.5rem",
  justifyContent: "center",
};

const linkStyle: React.CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "1.1rem",
};
