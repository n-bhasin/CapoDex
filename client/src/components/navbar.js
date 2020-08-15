import React from "react";
import "../App.css";
const Navbar = ({ address }) => {
  return (
    <nav className="navbar navbar-expand-lg navbarColor">
      <h1 className="navbar-brand" style={{ fontSize: "2rem" }} to="/">
        Capo
      </h1>
      <div className="col-md-11 " id="navbarNavAltMarkup">
        <p class="text-right" style={{ fontSize: 15, marginBottom: 5 }}>
          {address}
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
