import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
            <Link to="/"></Link>
            <Link to="signup"></Link>
            <Link to="login"></Link>

      <Outlet />
    </>
  )
};

export default Layout;