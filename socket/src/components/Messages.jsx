import { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/MyContext.jsx";
import { socket } from '../App'

const Messages = () => {
    const { messages, setmessages, users } = useContext(MyContext);
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
        <div className="w-full h-full">
            <div className="w-full h-[92%] overflow-y-scroll">
            {
                messages.map((msg, m) => (
                    msg.type == 'system' ?
                        (
                            <div key={m}>
                                <p className='text-center text-xs text-sky-400'>{msg.text}</p>
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

                ))
            }
            </div>
            <form onSubmit={(e) => { e.preventDefault() }} className='flex h-[8%] p-1 w-full gap-2'>
                <input className='w-full border px-2 py-1.5 outline-none rounded' type="text" value={message} placeholder='Type a message' onChange={(e) => setmessage(e.target.value)} />
                <button className='w-15 bg-sky-300 rounded shadow-xs shadow-black hover:shadow-none' onClick={() => addMessage(message)}><i className="ri-send-plane-fill text-2xl"></i></button>
            </form>
        </div>
    )
}
export default Messages