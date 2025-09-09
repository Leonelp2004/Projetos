import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from '@/App.tsx';
import '@/index.css';
import StudentsPage from './pages/StudentsPage.tsx';

const LoadingPage = lazy(() => import('./pages/LoadingPage.tsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx'))

const Redirect = lazy(() => import('./router/Redirect.tsx'))

const Anonymous = lazy(() => import('./router/Anonymous.tsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'))

const NotAnonymous = lazy(() => import('./router/NotAnonymous.tsx'))
const Sidebar = lazy(() => import('./components/Sidebar.tsx'))
const Homepage = lazy(() => import('./pages/Homepage.tsx'))
const HistoricPage = lazy(() => import('./pages/HistoricPage.tsx'))
const ScannerPage = lazy(() => import('./pages/ScannerPage.tsx'))
const VehiclesPage = lazy(() => import('./pages/VehiclesPage.tsx'))
const DriversPage = lazy(() => import('./pages/DriversPage.tsx'))
const SignOutPage = lazy(() => import('./pages/SignOutPage.tsx'))

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '',
        element: <Redirect />,
      },
      {
        element: <Anonymous />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
        ],
      },
      {
        element: <NotAnonymous />,
        children: [
          {
            element: <Sidebar />,
            children: [
              {
                path: 'homepage',
                element: <Homepage />,
              },
              {
                path: 'historic',
                element: <HistoricPage />,
              },
              {
                path: 'scanner',
                element: <ScannerPage />,
              },
              {
                path: 'vehicles',
                element: <VehiclesPage />,
              },
              {
                path: 'drivers',
                element: <DriversPage />,
              },
              {
                path: 'students',
                element: <StudentsPage />,
              },
              {
                path: 'sign-out',
                element: <SignOutPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingPage />}>
      <RouterProvider
        router={router}
      />
    </Suspense>
  </React.StrictMode>,
)