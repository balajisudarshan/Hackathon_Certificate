import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router'
import AddCertificate from './pages/AddCertificate'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login.jsx'
import QrVerification from './pages/QrVerification.jsx'
import VerifyCertificate from './pages/VerifyCertificate'
import ViewCertificate from './pages/ViewCertificate'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/issue-certificate" element={<AddCertificate />} />
        <Route path='/verify' element={<VerifyCertificate />} />
        <Route path='/' element={<Login />} />
        <Route path='/view/:certId' element={<ViewCertificate />} />
        <Route path='/qr/verify/:certId' element={<QrVerification />} />
        <Route path='/admin' element={<AdminDashboard />} />
      </Routes>
      <Toaster />
    </BrowserRouter>

  )
}

export default App