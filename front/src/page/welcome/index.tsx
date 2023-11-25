import React from "react";

import "../../normalize.css";
import "./index.css";

import Button from "../../component/button";
import Grid from "../../component/grid";

import { useNavigate } from "react-router-dom";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page welcome__page">
      <div className="welcome__heading">
        <h1 className="welcome__title">Hello!</h1>
        <p className="welcome__subtitle">Welcome to bank app</p>
      </div>

      <img className="welcome__img" src="/img/welcome.png" alt="picture" />

      <div className="welcome__actions">
        <Button text="Sign Up" onClick={() => navigate("/signup")} />
        <Button
          text="Sign In"
          onClick={() => navigate("/signin")}
          transparent
        />
      </div>
    </div>
  );
};

export default WelcomePage;
