import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../images/Logo.png';
import paste from '../images/paste.png';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-md px-10 py-4 rounded-2xl border-1 border-gray-950">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Logo or Title */}
        <div className="text-2xl font-bold text-blue-400 flex justify-center items-center ">
          <img  src={Logo} alt="Logo" className="h-18 w-18 mr-4 rounded-2xl" />
          Clip_Nest 
          <img  src={paste} alt="Logo" className="h-10 w-10 ml-4 " />
        </div>

        {/* Navigation Links */}
        <div className="flex gap-8 text-lg">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-400 font-semibold border-b-2 border-blue-400'
                : 'hover:text-blue-300 transition'
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/pastes"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-400 font-semibold border-b-2 border-blue-400'
                : 'hover:text-blue-300 transition'
            }
          >
            All Pastes
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
