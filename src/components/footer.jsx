import React from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

/**************************************************************************************************/

/**
 * @file        footer.jsx
 * @description Footer of the application
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang, Faaez Ahmed Kamal]
 * @created     17/08/2025
 * @license     -- tbd
 */

const columns = [
  {heading: "Registry",
    links: [
      {text:"Sign Up", to:"/signup"},
      {text:"Registry FAQs", to:"/registry/faq"},
      {text:"Manage Verification", to:"/registry/verification"}]
  },
  {heading: "Marketplace",
    links: [
      {text:"Browse Artworks", to:"/marketplace/all"},
      {text:"Purchase Process", to:"/marketplace/faq"},
      {text:"Why sell artwork on ArtCert?", to:"/marketplace/faq#section"},]
  },
  {heading: "About",
    links: [
      {text:"The ArtCert difference", to:"/about#difference"},
      {text:"Verification Process", to:"/about#verification"},
      {text:"Digital Certificate", to:"/about#certificate"},
      {text:"Get in touch", to:"/about#contact"}]
  }
];

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 justify-around pt-12 px-4 md:px-20 2xl:px-100" style={{ height: "300px" }}>
      <div className="flex flex-row justify-between items-start">

        <div className="flex-1 flex-col items-center w-1/4 px-12">
          <img src={logo} alt="ArtCert Logo" className="h-8 mb-6" />
        </div>

        {/* Columns */}
        <div className="flex flex-row justify-between w-3/4 pl-32">
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col flex-1 px-4">
              <h3 className="font-sans text-heading text-xl mb-4">{col.heading}</h3>
              {col.links.map((link, j) => (
                <Link className="font-sans mb-2 hover:underline text-sm"
                  style={{ color: "var(--color-body-text)" }}
                  key={j}
                  to={link.to}>
                  {link.text}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 flex flex-row justify-left px-12 py-4">
        <div className="text-body-text font-sans text-sm">
          © 2025 ArtCert. All right reserved.
        </div>
        <div className="flex flex-row space-x-8 px-16">
          <Link className="font-sans text-sm hover:underline"
            style={{ color: "var(--color-body-text)" }}
            to="/privacy">
            Privacy Policy
          </Link>
          <Link className="font-sans text-sm hover:underline"
            style={{ color: "var(--color-body-text)" }}
            to="/terms">
            Terms of Service
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
