import React from 'react'
import { Button } from './components/ui/button'
import Login from './pages/Login.jsx'
import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
    <>
      <Login />
      <Toaster/>
    </>


  )
}

export default App