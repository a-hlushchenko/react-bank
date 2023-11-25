import React, { useContext } from "react";

import { AuthContext } from "../../App";
import { Navigate } from "react-router-dom";

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const user = auth?.state.user;

  if (user && "isConfirm" in user) {
    const isConfirm = user.isConfirm;

    if (isConfirm) {
      return <Navigate to="/balance" replace />;
    }

    return <Navigate to="/signup-confirm" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
