import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ApiKeys from "./pages/ApiKeys";
import Billing from "./pages/Billing";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/apikeys" element={
          <PrivateRoute><ApiKeys /></PrivateRoute>
        } />
        <Route path="/billing" element={
          <PrivateRoute><Billing /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
