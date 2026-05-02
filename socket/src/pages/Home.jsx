import React, { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../App';
import { MyContext } from '../context/MyContext.jsx';

const Home = () => {
    const {room, setroom, username, setusername} = useContext(MyContext);
    const navigate = useNavigate();

    function join(roomId, name) {
        if (!roomId || !name) return
        socket.emit('join-room', { roomId, name });
        navigate(`/room/${roomId}`)
    }
    return (
        <div className='h-screen w-screen flex flex-col justify-center items-center'>
            <div className='bg-red-300 flex flex-col p-2 rounded w-70 '>
                <label htmlFor="room">Enter room Id </label>
                <input className='border px-2 py-1.5 outline-none rounded' id='room' type="text" onChange={(e) => setroom(e.target.value)} />
                <br />
                <label htmlFor="username">Enter your Name </label>
                <input className='border px-2 py-1.5 outline-none rounded' id='username' type="text" onChange={(e) => setusername(e.target.value)} />
                <br />
                <button className='bg-sky-300 py-1.5 rounded shadow-xs shadow-black hover:shadow-none' type='submit' onClick={() => join(room, username)}>Join</button>
            </div>
        </div>
    )
}

export default Home