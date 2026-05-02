import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx';
import Room from './pages/Room.jsx';
import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000')

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/room/:roomId' element={<Room/>} />
    </Routes>
  )
}

export default App