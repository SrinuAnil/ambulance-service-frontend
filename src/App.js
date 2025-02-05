import { BrowserRouter, Route, Switch } from "react-router-dom"; // Keep using Switch for v5
import Booking from './components/BookingPage';
import './App.css';
import Login from './components/LoginPage';
import CaptainHome from './components/CaptainHome';
import Dashboard from './components/Dashboard';
import BookAmb from './components/BookAmb';
import PaymentPage from './components/PaymentPage';
import { AdminProtectedRoute, ProtectedRoute } from './components/ProtectedRoute';
import AdminLogin from './components/AdminLogin';
import SignupPage from './components/SignUpPage';
import CustomerLoginForm from "./components/CustomerLogin";
import Recharge from "./components/RechargePage";

function App() {
  return (
    <BrowserRouter>
      <Switch> {/* Use Switch for React Router v5 */}
        <Route exact path="/" component={Booking} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/customer" component={CustomerLoginForm} />
        <Route exact path="/signUpPage" component={SignupPage} />
        <Route exact path="/payment" component={PaymentPage} />
        <Route exact path="/recharge" component={Recharge} />
        <ProtectedRoute path="/home" component={BookAmb} />
        <ProtectedRoute path="/statusOnline" component={CaptainHome} />
        <Route exact path="/admin" component={AdminLogin} />
        <AdminProtectedRoute path="/dashboard" component={Dashboard} />
      </Switch> 
    </BrowserRouter>
  );
}

export default App;
