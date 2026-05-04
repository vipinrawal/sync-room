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

    function createRoom(name) {
        if (!name) return
        const roomId = Math.random().toString(36).substring(2,8).toUpperCase();
        socket.emit('join-room', { roomId, name });
        navigate(`/room/${roomId}`)
    }
    return (
        <div className='h-screen w-screen flex flex-col justify-center items-center'>
            <div className='bg-sky-100 px-2 py-1 rounded-full text-sky-400 border border-sky-400'>Real-time sync Zero lag</div>
            <p className='text-5xl font-bold mt-5 mb-3'>Watch youtube</p>
            <p className='text-5xl font-bold text-sky-400 mb-5'>together.</p>
            <p className='text-center text-zinc-400 mb-5'>Create a room, share the code, and enjoy perfectly synced video with <br /> friends wherever they are.</p>

            <div className='border border-zinc-400 flex flex-col gap-2 p-2 rounded w-100 mb-4'>
                <p className='text-center text-zinc-400'>CREATE A NEW ROOM</p>

                <input placeholder='Enter your name' className='border border-zinc-400 px-2 py-1.5 outline-none rounded' id='username' type="text" onChange={(e) => setusername(e.target.value)} />

                <button className='bg-sky-300 py-1.5 rounded shadow-xs shadow-black hover:shadow-none' type='submit' onClick={() => createRoom(username)}>Create Room</button>
            </div>

            <div className='border border-zinc-400 flex flex-col gap-2 p-2 rounded w-100 '>
                <p className='text-center text-zinc-400'>JOIN EXISTING ROOM</p>

                <input placeholder='Enter room code (e.g. XYZABC)' className='border border-zinc-400 px-2 py-1.5 outline-none rounded' id='room' type="text" onChange={(e) => setroom(e.target.value)} />

                <input placeholder='Enter your name' className='border border-zinc-400 px-2 py-1.5 outline-none rounded' id='username' type="text" onChange={(e) => setusername(e.target.value)} />

                <button className='bg-sky-300 py-1.5 rounded shadow-xs shadow-black hover:shadow-none' type='submit' onClick={() => join(room, username)}>Join</button>
            </div>
        </div>
    )
}

export default Home