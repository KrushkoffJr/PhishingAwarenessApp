import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
import axios from "axios";

// Configures Axios to use JWT token
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

createRoot(document.getElementById("root")).render(<App />);
