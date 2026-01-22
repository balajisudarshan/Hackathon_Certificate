import React from 'react'
import { Button } from './components/ui/button'
import Login from './pages/Login.jsx'
import { Toaster } from 'react-hot-toast'
import AddCertificate from './pages/AddCertificate'
import {BrowserRouter,Link,Routes,Route} from 'react-router'
import VerifyCertificate from './pages/VerifyCertificate'
const App = () => {
  return (
    <BrowserRouter>
      {/* <Login /> */}
      <Routes>
        <Route path="/" element={<AddCertificate />} />
        <Route path='/verify/:id' element={<VerifyCertificate />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <Toaster/>
    </BrowserRouter>

  )
}

export default App