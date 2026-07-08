import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Welcome from './pages/Welcome'
import ProfileOnboarding from './pages/ProfileOnboarding'
import Dashboard from './pages/Dashboard'
import Auctions from './pages/Auctions'
import AuctionRoom from './pages/AuctionRoom'
import Purchases from './pages/Purchases'
import Sales from './pages/Sales'
import AdminOperations from './pages/AdminOperations'
import NotFound from './pages/NotFound'
import { AuctionSocketProvider } from './context/AuctionSocketProvider'
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/verify-email', element: <VerifyEmail /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/reset-password/:token', element: <ResetPassword /> },
  { path: '/welcome', element: <Welcome /> },
  { path: '/onboarding', element: <ProfileOnboarding /> },
  { path: '/profile', element: <ProfileOnboarding /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/auctions', element: <Auctions /> },
  { path: '/auctions/:id', element: <AuctionRoom /> },
  { path: '/account/purchases', element: <Purchases /> },
  { path: '/account/sales', element: <Sales /> },
  { path: '/admin/operations', element: <AdminOperations /> },
  { path: '*', element: <NotFound /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuctionSocketProvider>
      <RouterProvider router={router} />
    </AuctionSocketProvider>
  </React.StrictMode>,
)
