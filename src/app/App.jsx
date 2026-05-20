import React from "react";
import AppRoutes from "./routes";
import { AuthProvider } from "../hooks/AuthContext";
import { OrganizationProvider } from "../hooks/OrganizationContext";
import { NotificationProvider } from "../hooks/NotificationContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <OrganizationProvider>
          <NotificationProvider>
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3000} />
          </NotificationProvider>
        </OrganizationProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
