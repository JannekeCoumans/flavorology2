import AppContextProvider from "contexts/AppContext";
import "./assets/styles/styles.scss";
import { AppRouter } from "config/C4";

import firebase from "./FirebaseConfig";

function App() {
  return (
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  );
}

export default App;
