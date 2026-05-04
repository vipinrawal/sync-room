import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx';
import Room from './pages/Room.jsx';
import { io } from 'socket.io-client';

export const socket = io('https://upgraded-potato-jwjvq46p49x2p775-3000.app.github.dev')

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/room/:roomId' element={<Room/>} />
    </Routes>
  )
}

export default App