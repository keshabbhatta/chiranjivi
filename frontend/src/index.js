import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

// Migrate any legacy/auth fallback token from localStorage into sessionStorage.
const legacyToken = window.localStorage.getItem("vidhyalaya-app-token") || window.localStorage.getItem("token");
if (!window.sessionStorage.getItem("vidhyalaya-app-token") && legacyToken) {
  window.sessionStorage.setItem("vidhyalaya-app-token", legacyToken);
}

// Clean up only legacy localStorage keys, keeping the current auth fallback token if needed.
window.localStorage.removeItem("token");
window.localStorage.removeItem("user");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
