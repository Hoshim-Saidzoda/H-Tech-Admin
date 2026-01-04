import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import AccountPage from "../pages/AccountPage";
import BrandPage from "../pages/BrandPage";
import Login from "../pages/Login";
import CategoryPage from "../pages/CategoryPage";
import SuperAdminPage from "../pages/SuperAdminPage";
import ProtectedRoute from "../components/ProtectRouter";
import ProductPage from "../pages/ProductPage"
import ColorPage from "../pages/ColorPage";
import CategoryDetailPage from "../pages/CategoryDetailPage";
import SubCategoryPage from "../pages/SubCategoryPage";
 const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<ProductPage />} />
        <Route path="brands" element={<BrandPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="colors" element={<ColorPage />} />
      <Route path="category/:categoryId" element={<CategoryDetailPage />} />
 <Route path="sub-category/:subCategoryId" element={<SubCategoryPage />} />

      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App; // ✅ обязательно!
