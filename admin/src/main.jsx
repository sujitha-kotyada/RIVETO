import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./Context/AuthProvider";
import AdminProvider from "./Context/AdminProvider";
import NotificationProvider from "./Context/NotificationContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <AdminProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AdminProvider>
    </AuthProvider>
  </BrowserRouter>,
);
