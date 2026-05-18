import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Logo from "../images/Logo.png";
import paste from "../images/paste.png";
import { logoutUser, selectCurrentUser } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  async function handleLogout() {
    await dispatch(logoutUser()).unwrap();
    toast.success("Signed out");
    navigate("/login", { replace: true });
  }

  return (
    <nav className="topbar">
      <div className="topbar__inner">
        <div className="brand">
          <img src={Logo} alt="Clip Nest logo" className="brand__logo" />
          <div>
            <div className="brand__title">
              Clip_Nest
              <img src={paste} alt="" className="brand__mark" />
            </div>
            <p className="brand__subtitle">Private snippets, saved locally in your browser</p>
          </div>
        </div>

        <div className="navlinks">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navlink ${isActive ? "navlink--active" : ""}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/pastes"
            className={({ isActive }) => `navlink ${isActive ? "navlink--active" : ""}`}
          >
            All Pastes
          </NavLink>

          <div className="navlinks__meta">
            {currentUser ? (
              <>
                <span className="user-chip">
                  <span>{currentUser.name?.[0]?.toUpperCase() || "U"}</span>
                  <span>{currentUser.name}</span>
                </span>
                <button type="button" className="navbutton" onClick={handleLogout}>
                  Sign out
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
