import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoPerson } from "react-icons/io5";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../contexts/authContext.jsx";
import Logo from "../assets/logo.png";
import Breadcrumbs from "./breadcrumbs.jsx";
import MenuOverlay from "./menuOverlay.jsx";

/**************************************************************************************************/

/**
 * @file        header.jsx
 * @description Header of the application
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang, Faaez Ahmed Kamal]
 * @created     17/08/2025
 * @license     -- tbd
 */

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { user, login, logout } = useAuth();
  const isHomePage = location.pathname === '/';

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    navigate('/');
    await logout();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close overlay when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white">
      <div className="flex justify-between items-center 
      border-b border-b-gray-100 px-4 md:px-20 2xl:px-100 pt-10 pb-5">
        <img src={Logo} alt="Logo" className="h-10" />

        <div className="flex justify-end items-start font-sans gap-5 relative">
          {user ?
            <button onClick={handleLogout} className="flex justify-center items-center flex-col" style={{ padding: 0 }}>
              <IoPerson className="text-2xl text-heading" />
              <span className="text-heading text-sm">logout</span>
              <span className="text-heading text-sm">{user['cognito:username'] || user.given_name || 'User'}</span>
            </button> :
            <button onClick={login} className="flex justify-center items-center flex-col" style={{ padding: 0 }}>
              <IoPerson className="text-2xl text-heading" />
              <span className="text-heading text-sm">login</span>
            </button>
          }

          <div className="flex justify-center items-start flex-col">
            <button className="flex justify-center items-center flex-col"
              style={{ padding: 0 }}
              onClick={toggleMenu}>
              {isMenuOpen ? <><AiOutlineClose className="text-2xl text-heading" />
                <span className="text-heading text-sm">close</span></> : <><AiOutlineMenu className="text-2xl text-heading" />
                <span className="text-heading text-sm">menu</span></>}
            </button>
          </div>

          {isMenuOpen && <MenuOverlay
            menuRef={menuRef}
            onNavigate={() => setIsMenuOpen(false)} />}
        </div>
      </div>

      {!isHomePage && <div className="py-2 border-b border-b-gray-100 px-4 md:px-20 2xl:px-100">
        <Breadcrumbs />
      </div>}

    </header>);
};

export default Header;
