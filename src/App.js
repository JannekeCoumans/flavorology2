import AppContextProvider from "contexts/AppContext";
import "./assets/styles/styles.scss";
import { AppRouter } from "config/C4";

// eslint-disable-next-line no-unused-vars
import firebase from "./FirebaseConfig";

function App() {
  return (
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  );
}

export default App;
