import { useState } from "react";
import FirebaseAuthService from "../../FirebaseAuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const LoginForm = ({ changeForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonLoading(true);

    try {
      await FirebaseAuthService.loginUser(username, password);
      setUsername("");
      setPassword("");
      setButtonLoading(false);
    } catch (error) {
      alert(error.message);
      setButtonLoading(false);
    }
  };

  const handleSendResetPasswordEmail = async () => {
    if (!username) {
      alert("Vul je e-mailadres in en klik dan op 'Wachtwoord vergeten'");
      return;
    }

    try {
      await FirebaseAuthService.sendPasswordResetEmail(username);
      alert(
        "Als het e-mailadres bekend is bij ons, ontvang je daar een e-mail met een reset-link."
      );
    } catch (error) {
      alert(error.message);
    }
  };

  // async function handleLoginWithGoogle() {
  //   try {
  //     await FirebaseAuthService.loginWithGoogle();
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // }

  return (
    <div className="loginView__content--wrapper login">
      <div className="loginView__content--intro">
        <h1>Login</h1>
        <p>
          Welkom terug. Log in bij je account om een wereld vol gemak en smaken
          te openen.
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
          <div className="password-inputfield">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-text"
              placeholder="Wachtwoord"
            />
            <button
              type="button"
              className="togglePasswordVisibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
        </label>
        <div className="input-row-horizontal">
          <label className="input-label hor small custom-checkbox">
            <input
              className="input-checkbox"
              type="checkbox"
              id="stay-logged-in"
              name="stay-logged-in"
            />
            <span className="checkbox checkbox-small">
              <div className="checkbox-inner">
                <FontAwesomeIcon icon={faCheck} />
              </div>
            </span>
            Blijf ingelogd
          </label>
          <button
            className="no-btn small"
            onClick={() => handleSendResetPasswordEmail}
          >
            Wachtwoord vergeten?
          </button>
        </div>
        {/* <div className="btn-wrapper">
          <button type="button" className="btn" onClick={handleLoginWithGoogle}>
            Login with Google
          </button>
        </div> */}
        <div className="btn-wrapper">
          <button className="primary-btn">
            {buttonLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Login"
            )}
          </button>
        </div>
        <div className="form-footer">
          <p>
            Nog geen account?{" "}
            <button
              type="button"
              className="no-btn"
              onClick={() => changeForm("register")}
            >
              Registreer account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
