import React from 'react'
import { data, useParams } from 'react-router-dom'
import { socket } from '../App'
import { useEffect } from 'react'
import { useState } from 'react'
import YouTubePlayer from '../components/YouTubePlayer.jsx'
import { useContext } from 'react'
import { MyContext } from '../context/MyContext.jsx'

const Room = () => {
  const { roomId } = useParams();
  const { users, messages, setmessages, isPlaying } = useContext(MyContext);
  const [message, setmessage] = useState('')

  useEffect(() => {
    socket.on('message', (data) => {
      setmessages(prev => [...prev, data])
    })

    return () => {
      socket.off('message')
    }
  }, [])

  function addMessage(msg) {
    if (!msg) return
    socket.emit('chat', { message: msg });
    setmessage('')
  }

  return (
    <div className='h-screen w-full'>
      <div className='bg-red-200 h-10 w-full'></div>
      <div className='flex h-full w-full'>
        <div className='h-[80%] w-[75%]'>
          <YouTubePlayer />
        </div>

        <div className='w-[25%] h-full flex flex-col p-2'>
          <div className='w-full border rounded px-2'>
            <p className='text-zinc-500'>In this room</p>
            <div className='flex gap-1.5'>
              {users && users.map((u, i) => (
                <div key={i} className='flex flex-col items-center'>
                  <div className={`border border-${u.color}-400 text-${u.color}-300 bg-${u.color}-100 w-10 h-10 flex justify-center items-center text-xl rounded-full`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <p className='text-sm text-zinc-500'>{u.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='w-full h-full border rounded my-3 overflow-y-scroll'>
            <div className='w-full h-10 flex items-center'>
              <p className='h-full hover:text-sky-400 border-b-2 flex items-center px-3'><i className="ri-message-2-line"></i> Chats</p>
              <p className='h-full hover:text-sky-400 border-b-2 flex items-center px-3'><i className="ri-play-list-2-fill"></i> Queue</p>
              <div className='w-full h-full border-b-2'></div>
            </div>
            {messages.map((msg, m) => (
              msg.type == 'system' ?
                (
                  <div key={m}>
                    <p className='text-center text-sky-400'>{msg.text}</p>
                  </div>
                ) : (
                  <div key={m} className='min-w-50 max-w-fit flex items-center m-3'>
                    <div className={`border border-${users.color}-400 text-${users.color}-400 bg-${users.color}-100 w-10 h-10 flex justify-center items-center text-xl rounded-full`}>
                      {msg.from.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className='flex items-center'>
                        <p className='text-sm  text-sky-400 mx-2'>{msg.from}</p>
                        <p className='text-[70%]  text-zinc-500'>{msg.time}</p>
                      </div>
                      <p className='text- mx-2'>{msg.text}</p>
                    </div>
                  </div>
                )

            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault() }} className='flex w-full gap-2'>
            <input className='w-full border px-2 py-1.5 outline-none rounded' type="text" value={message} placeholder='Type a message' onChange={(e) => setmessage(e.target.value)} />
            <button className='w-15 bg-sky-300 rounded shadow-xs shadow-black hover:shadow-none' onClick={() => addMessage(message)}><i className="ri-send-plane-fill text-2xl"></i></button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Room