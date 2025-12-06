import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "@/styles/globals.css"

const Layout = () => {
  const location = useLocation();
  const isAdminLocation = location.pathname.startsWith("/admin");

  return (
    <>
    {!isAdminLocation && <Header />}
      <main>
        <Outlet />
      </main>
    {!isAdminLocation && <Footer />}
    </>
  );
};

export default Layout;
