import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import ResponsivePaste from './components/ResponsivePaste';
import ResponsiveViewPaste from './components/ResponsiveViewPaste';
import AuthPage from './components/AuthPage';
import { AppLayout, ProtectedRoute, PublicRoute } from './components/RouteGuards';

function App() {
  const router = createBrowserRouter([
    {
      element: <PublicRoute />,
      children: [
        {
          path: '/login',
          element: <AuthPage mode="login" />,
        },
        {
          path: '/signup',
          element: <AuthPage mode="signup" />,
        },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: 'pastes',
              element: <ResponsivePaste />,
            },
            {
              path: 'view/:id',
              element: <ResponsiveViewPaste />,
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
