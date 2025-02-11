import { BrowserRouter, Routes, Route } from "react-router-dom";
import Booking from "./components/BookingPage";
import "./App.css";
import Login from "./components/LoginPage";
import CaptainHome from "./components/CaptainHome";
import Dashboard from "./components/Dashboard";
import BookAmb from "./components/BookAmb";
import PaymentPage from "./components/PaymentPage";
import { AdminProtectedRoute, ProtectedRoute, CustomerProtectedRoute } from "./components/ProtectedRoute";
import AdminLogin from "./components/AdminLogin";
// import SignupPage from "./components/SignUpPage";
import CustomerLoginForm from "./components/CustomerLogin";
import Recharge from "./components/RechargePage";
import AccountPage from "./components/AccountPage";
import TransactionPage from "./components/Transactions";
import BookingPage from "./components/BookingData";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer" element={<CustomerLoginForm />} />
        {/* <Route path="/signUpPage" element={<SignupPage />} /> */}
        <Route path="/payment" element={<CustomerProtectedRoute><PaymentPage /></CustomerProtectedRoute>} />
        <Route path="/recharge" element={<CustomerProtectedRoute><Recharge /></CustomerProtectedRoute>} />
        <Route path="/account" element={<CustomerProtectedRoute><AccountPage /></CustomerProtectedRoute>} />
        <Route path="/transactions" element={<CustomerProtectedRoute><TransactionPage /></CustomerProtectedRoute>} />
        <Route path="/booking" element={<CustomerProtectedRoute><BookingPage /></CustomerProtectedRoute>} />
        <Route path="/home" element={<CustomerProtectedRoute><BookAmb /></CustomerProtectedRoute>} />
        <Route path="/statusOnline" element={<ProtectedRoute><CaptainHome /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
