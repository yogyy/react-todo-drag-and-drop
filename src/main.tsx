import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import ErrorPage from './error-page.tsx';
import Navbar from './components/layout/navbar.tsx';

// const router = createBrowserRouter(
//   [
//     {
//       path: '/',
//       element: <App />,
//       errorElement: <ErrorPage />,
//     },
//     {
//       path: '/root',
//       element: <Root />,
//       errorElement: <ErrorPage />,
//     },
//   ],
//   { basename: '/react-todo-localhost/' }
// );

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />} errorElement={<ErrorPage />}>
      <Route index element={<App />} />
      {/* <Route path="/root" element={<Root />} /> */}
    </Route>
  ),
  { basename: '/react-todo-localhost/' }
);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
