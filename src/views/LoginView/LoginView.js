import React, { useState } from "react";
import LoginForm from "./LoginForm";
import FirebaseAuthService from "../../FirebaseAuthService";
import RegisterForm from "./RegisterForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoginView = ({ existingUser }) => {
  const [activeForm, setActiveForm] = useState("login");
  const [displayLoading, setDisplayLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const logOut = () => {
    setButtonLoading(true);
    setDisplayLoading(true);
    FirebaseAuthService.logoutUser();
    setButtonLoading(false);
    setDisplayLoading(false);
  };

  const changeForm = (formName) => {
    if (formName !== activeForm) {
      setDisplayLoading(true);
      setActiveForm(formName);
      setDisplayLoading(false);
    }
    return;
  };

  return (
    <div className="loginView">
      <div className="loginView__wrapper">
        <div className="loginView__image"></div>
        <div className="loginView__content">
          {displayLoading && (
            <div className="loading">
              <FontAwesomeIcon icon={faSpinner} spin />
            </div>
          )}
          {!displayLoading && (
            <>
              {existingUser ? (
                <div>
                  <h1>Welkom!</h1>
                  <button className="primary-btn" onClick={logOut}>
                    {buttonLoading ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      "Uitloggen"
                    )}
                  </button>
                </div>
              ) : (
                <>
                  {activeForm === "login" ? (
                    <LoginForm changeForm={changeForm} />
                  ) : (
                    <RegisterForm changeForm={changeForm} />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginView;
