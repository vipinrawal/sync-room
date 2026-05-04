import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import YouTubePlayer from '../components/YouTubePlayer.jsx'
import { useContext } from 'react'
import { MyContext } from '../context/MyContext.jsx'
import Messages from '../components/Messages.jsx'
import Queues from '../components/Queues.jsx'
import { socket } from '../App.jsx'

const Room = () => {
  const { roomId } = useParams();
  const { users } = useContext(MyContext);
  const [isActive, setisActive] = useState('chats')
  const [copied, setcopied] = useState(false)
  const navigate = useNavigate();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomId);
    setcopied(true);
    setTimeout(() => setcopied(false), 2000);
  }

  const handleLeave = () => {
    socket.emit("leave-room");
    navigate('/')
  }

  return (
    <div className='h-screen w-full grid grid-cols-[75%_25%] grid-rows-[5%_13%_82%]'>

      <div className='bg-zinc-700 col-span-full flex items-center justify-between px-3'>
        <div className='flex gap-2 items-center'>
          <p className='text-xl font-semibold text-sky-400'><i className="ri-refresh-line"></i> SyncRoom</p>
          <div className='text-zinc-400 flex gap-1'>
            | {roomId} 
            <button onClick={handleCopy}>{copied ? <i className="ri-check-line text-green-400"></i> : <i className="ri-file-copy-line"></i>}</button>
          </div>
        </div>
        <div className='flex gap-2 items-center text-sm text-zinc-400'>
          <p><i className="ri-group-line"></i> {users?.length} Watching</p>
          <button onClick={handleLeave} className='bg-zinc-600 px-1.5 py-0.5 rounded border border-zinc-400 hover:text-sky-400 hover:border-sky-400'><i class="ri-logout-box-r-line"></i> Leave</button>
        </div>
      </div>

      <div className='row-span-2'>
        <YouTubePlayer />
      </div>

      <div className='border rounded m-1 px-2'>
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


      <div className='flex flex-col border rounded m-1'>
          <div className='w-full h-[7%] flex items-center'>

            <p onClick={()=>setisActive('chats')} className={`h-full ${isActive == 'chats' && 'text-sky-400'} border-b-2 flex items-center px-3`}><i className="ri-message-2-line"></i> Chats</p>
            <p onClick={()=>setisActive('queues')} className={`h-full ${isActive == 'queues' && 'text-sky-400'} border-b-2 flex items-center px-3`}><i className="ri-play-list-2-fill"></i> Queue</p>

            <div className='w-full h-full border-b-2'></div>

          </div>

          <div className='h-[93%] w-full'>
            {isActive == 'chats' && <Messages/>}
            {isActive == 'queues' && <Queues/>}
          </div>
      </div>

    </div>
  )
}

export default Room