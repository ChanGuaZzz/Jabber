import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/Home'
import Jabber from './pages/jabber'
import Profile from './pages/profile'



function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jabber" element={<Jabber />} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  )
}

export default App
