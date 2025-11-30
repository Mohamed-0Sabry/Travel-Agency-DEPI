import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "@/styles/globals.css"

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
