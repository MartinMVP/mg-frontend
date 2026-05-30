import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Auctions from './pages/Auctions'
import AuctionRoom from './pages/AuctionRoom'
import { AuctionSocketProvider } from './context/AuctionSocketProvider'
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/auctions', element: <Auctions /> },
  { path: '/auctions/:id', element: <AuctionRoom /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuctionSocketProvider>
      <RouterProvider router={router} />
    </AuctionSocketProvider>
  </React.StrictMode>,
)