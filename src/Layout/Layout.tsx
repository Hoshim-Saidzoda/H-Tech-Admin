 import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md transition 
     ${isActive ? "bg-emerald-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`;

  return (
    <div className="flex min-h-screen">
       <aside className="w-56 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-2">
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>

          <NavLink to="/" className={linkClass}>
            Products
          </NavLink>

          <NavLink to="/brands" className={linkClass}>
            Brands
          </NavLink>

          <NavLink to="/categories" className={linkClass}>
            Categories
          </NavLink>
 

          <NavLink to="/colors" className={linkClass}>
            Colors
          </NavLink>
        </nav>
      </aside>

       <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
