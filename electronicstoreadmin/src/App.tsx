import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Import pages from the restructured directories
import { NotFoundPage } from './pages';
import { LoginPage } from './pages/auth';
import { CategoriesPage, CategoryEditPage } from './pages/categories';
import { DashboardPage } from './pages/dashboard';
import { OutletCreatePage, OutletEditPage, OutletsPage } from './pages/outlets';
import { ProductEditPage, ProductsPage } from './pages/products';
import { SettingsPage } from './pages/settings';
import { UserEditPage, UsersPage } from './pages/users';

// Import shared components
import { AuthProvider, ProtectedRoute } from './components/auth';
import { ErrorBoundary, Layout } from './components/shared';

// Import custom theme provider
import { CustomThemeProvider } from './context';

const App: React.FC = () => {
  console.log('App rendering with proper routing and components');

  return (
    <ErrorBoundary>
      <CustomThemeProvider>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Protected routes inside Layout */}
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<DashboardPage />} />

                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={<ProductEditPage />} />
                <Route path="/products/:id" element={<ProductEditPage />} />

                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/categories/new" element={<CategoryEditPage />} />
                <Route path="/categories/:id" element={<CategoryEditPage />} />

                <Route path="/outlets" element={<OutletsPage />} />
                <Route path="/outlets/new" element={<OutletCreatePage />} />
                <Route path="/outlets/:id" element={<OutletEditPage />} />

                <Route path="/users" element={
                  <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                    <UsersPage />
                  </ProtectedRoute>
                } />
                <Route path="/users/new" element={
                  <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                    <UserEditPage />
                  </ProtectedRoute>
                } />
                <Route path="/users/:id" element={
                  <ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
                    <UserEditPage />
                  </ProtectedRoute>
                } />

                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </CustomThemeProvider>
    </ErrorBoundary>
  );
};

export default App; 