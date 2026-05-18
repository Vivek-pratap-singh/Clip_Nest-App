import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

export function ProtectedRoute() {
  const currentUserEmail = useSelector((state) => state.auth.currentUserEmail);

  if (!currentUserEmail) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  const currentUserEmail = useSelector((state) => state.auth.currentUserEmail);

  if (currentUserEmail) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
