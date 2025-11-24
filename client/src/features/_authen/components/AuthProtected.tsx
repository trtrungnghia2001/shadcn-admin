import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../data/store";
import type React from "react";

const AuthProtected = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuthStore();
  const location = useLocation();

  if (!auth) return <Navigate to={`/signin`} state={location} />;

  return children;
};

export default AuthProtected;
