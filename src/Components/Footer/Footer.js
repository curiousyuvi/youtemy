import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <p>
        Made with{" "}
        <span className="red">
          <i className="far fa-heart"></i>
        </span>{" "}
        by{" "}
        <a href="https://github.com/rosekamallove" className="name-us">
          Rosek
        </a>{" "}
        &{" "}
        <a href="https://github.com/Ritesh055" className="name-us">
          Ritesh
        </a>
      </p>
    </div>
  );
}

export default Footer;