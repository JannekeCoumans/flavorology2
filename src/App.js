import { useState } from "react";
// import AppContextProvider from "contexts/AppContext";
import "./assets/styles/styles.scss";
import { AppRouter } from "config/C4";
import FirebaseAuthServices from "./FirebaseAuthService";

function App() {
  const [user, setUser] = useState(null);

  FirebaseAuthServices.subscribeToAuthChanges(setUser);

  return (
    <>
      <AppRouter existingUser={user} />
    </>
  );
}

export default App;
