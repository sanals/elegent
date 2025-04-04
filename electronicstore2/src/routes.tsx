import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/products" element={<ProductListingPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
};

export default AppRoutes; 