import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Cart from "../components/Cart";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Cart />

      <div className="flex flex-col min-h-screen">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;