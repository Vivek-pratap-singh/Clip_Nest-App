import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ResponsivePaste from './components/ResponsivePaste';
import ResponsiveViewPaste from './components/ResponsiveViewPaste';
import Home from './components/Home';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar />
          <Home/>
        </>
      ),
    },
    {
  path: '/Pastes',
  element: (
    <>
      <Navbar />
      <ResponsivePaste />
    </>
  ),
},
   {
  path: '/view/:id',
  element: (
    <>
      <Navbar />
      <ResponsiveViewPaste />
    </>
  ),
},

  ]);

  return <RouterProvider router={router} />;
}

export default App;
