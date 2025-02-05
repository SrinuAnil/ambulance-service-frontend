import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = Cookies.get("jwt_token");
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export const AdminProtectedRoute = ({ component: Component, ...rest }) => {
  const token = Cookies.get("admin_jwt_token");
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/admin" />
      }
    />
  );
};
