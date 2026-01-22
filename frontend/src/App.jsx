import React from 'react'
import { Button } from './components/ui/button'
import Login from './pages/Login.jsx'
import { Toaster } from 'react-hot-toast'
import AddCertificate from './pages/AddCertificate'
import {BrowserRouter,Link,Routes,Route} from 'react-router'
const App = () => {
  return (
    <BrowserRouter>
      {/* <Login /> */}
      <Routes>
        <Route path="/" element={<AddCertificate />} />
        <Route path='/verify/:id' element={<div>Verify Page</div>} />
      </Routes>
      <Toaster/>
    </BrowserRouter>

  )
}

export default App