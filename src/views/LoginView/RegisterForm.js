import React, { useState } from "react";
import FirebaseAuthService from "../../FirebaseAuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const RegisterForm = ({ changeForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonLoading(true);

    try {
      await FirebaseAuthService.registerUser(username, password);
      setUsername("");
      setPassword("");
      setButtonLoading(false);
    } catch (error) {
      alert(error.message);
      setButtonLoading(false);
    }
  };

  return (
    <div className="loginView__content--wrapper register">
      <div className="loginView__content--intro">
        <h1>Een account aanmaken</h1>
        <p>
          Vul onderstaande gegevens in om een account aan te maken bij
          Flavorology.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="loginView__content--form">
        <label className="input-label">
          E-mailadres
          <input
            type="email"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-text"
            placeholder="E-mailadres"
            autoFocus
            autoComplete="email"
          />
        </label>
        <label className="input-label ">
          Wachtwoord
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-text"
            placeholder="Wachtwoord"
          />
        </label>

        <div className="btn-wrapper">
          <button className="primary-btn">
            {buttonLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Registreer Account"
            )}
          </button>
        </div>
        <div className="form-footer">
          <p>
            Heb je al een account?{" "}
            <button
              type="button"
              className="no-btn"
              onClick={() => changeForm("login")}
            >
              Log in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
