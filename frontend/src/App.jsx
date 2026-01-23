import React from 'react'
import { Button } from './components/ui/button'
import Login from './pages/Login.jsx'
import { Toaster } from 'react-hot-toast'
import AddCertificate from './pages/AddCertificate'
import { BrowserRouter, Link, Routes, Route } from 'react-router'
import VerifyCertificate from './pages/VerifyCertificate'
import ViewCertificate from './pages/ViewCertificate'
import QrVerification from './pages/QrVerification.jsx'
import AdminDashboard from './pages/AdminDashboard'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddCertificate />} />
        <Route path='/verify/:id' element={<VerifyCertificate />} />
        <Route path='/login' element={<Login />} />
        <Route path='/view/:certId' element={<ViewCertificate />} />
        <Route path='/qr/verify/:certId' element={<QrVerification />} />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
      <Toaster />
    </BrowserRouter>

  )
}

export default App