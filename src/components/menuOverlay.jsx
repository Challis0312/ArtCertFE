import React from "react";
import { Link } from "react-router-dom";
import { MdDashboard, MdAdd, MdVerifiedUser, MdLocalOffer, MdHome, MdStorefront, MdGridView, MdInfo } from "react-icons/md";

/**************************************************************************************************/

/**
 * @file        menuOverlay.jsx
 * @description Menu overlay component with navigation options
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     16/09/2025
 * @license     -- tbd
 */

const columns = [
  {
    heading: "Dashboard",
    links: [
      { text: "Registry", to: "/registry", icon: MdDashboard },
      { text: "Add a new artwork", to: "/registry/new", icon: MdAdd },
      { text: "Verification requests", to: "/registry/verifications", icon: MdVerifiedUser },
      { text: "Offers", to: "/registry/offers", icon: MdLocalOffer }
    ]
  },
  {
    heading: "Platform",
    links: [
      { text: "Home", to: "/", icon: MdHome },
      { text: "Marketplace", to: "/marketplace", icon: MdStorefront },
      { text: "All artworks", to: "/marketplace/all", icon: MdGridView },
      { text: "About us", to: "/about", icon: MdInfo }
    ]
  }
];

const MenuOverlay = ({ menuRef, onNavigate = () => {} }) => {
  return (
    <div ref={menuRef} className="absolute top-full right-0 w-120 bg-white shadow-lg border border-gray-200 rounded-lg z-50">
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {columns.map((col, i) => (
            <div key={i}>
              <h2 className="font-serif mb-4"
                style={{ color: "var(--color-heading)" }}>
                {col.heading}
              </h2>

              <div className="space-y-1">
                {col.links.map((link, j) => {
                  const IconComponent = link.icon;
                  return (
                    <Link className="flex items-center gap-3 py-1"
                      style={{ color: "var(--color-body-text)" }}
                      key={j}
                      to={link.to}
                      onClick={onNavigate}>
                      <IconComponent className="text-lg" />
                      <span className="text-sm font-sans">{link.text}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;