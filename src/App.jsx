import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import './App.css';
export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
