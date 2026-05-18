import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, signupUser } from "../redux/authSlice";
import Logo from "../images/Logo.png";

const features = [
  "Browser-only accounts that work instantly on Vercel",
  "Snippets are saved per user in localStorage",
  "Login once, refresh safely, and keep editing",
];

const AuthPage = ({ mode }) => {
  const isLogin = mode === "login";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        await dispatch(
          loginUser({ email: form.email, password: form.password }),
        ).unwrap();
        toast.success("Welcome back");
      } else {
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        await dispatch(
          signupUser({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        ).unwrap();
        toast.success("Account created");
      }

      navigate("/", { replace: true });
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error.message || "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__glow auth-page__glow--one" />
      <div className="auth-page__glow auth-page__glow--two" />

      <div className="auth-card">
        <section className="auth-card__hero">
          <div className="auth-brand">
            <img src={Logo} alt="Clip Nest logo" className="auth-brand__logo" />
            <div>
              <p className="auth-kicker">Clip_Nest</p>
              <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
            </div>
          </div>

          <p className="auth-intro">
            A lightweight browser vault for snippets, notes, and quick drafts.
          </p>

          <div className="auth-feature-list">
            {features.map((feature) => (
              <div key={feature} className="auth-feature">
                <span className="auth-feature__dot" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="auth-card__form">
          <div className="auth-tabs">
            <Link to="/login" className={`auth-tab ${isLogin ? "auth-tab--active" : ""}`}>
              Login
            </Link>
            <Link
              to="/signup"
              className={`auth-tab ${!isLogin ? "auth-tab--active" : ""}`}
            >
              Signup
            </Link>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin ? (
              <label className="auth-field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
            ) : null}

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </label>

            {!isLogin ? (
              <label className="auth-field">
                <span>Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
              </label>
            ) : null}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Working..." : isLogin ? "Login" : "Create account"}
            </button>
          </form>

          <p className="auth-footnote">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <Link to={isLogin ? "/signup" : "/login"}>
              {isLogin ? "Create one" : "Login instead"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
