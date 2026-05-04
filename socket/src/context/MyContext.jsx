import { createContext, useEffect, useState } from 'react';
import { socket } from '../App.jsx';

export const MyContext = createContext(null);

export const MyContextProvider = ({ children }) => {
  const [room, setroom] = useState(null);
  const [username, setusername] = useState(null);
  const [messages, setmessages] = useState([]);
  const [queues, setqueues] = useState([])
  const [videoId, setvideoId] = useState(null);
  const [currentTime, setcurrentTime] = useState(null)
  const [users, setusers] = useState(null)
  const [color, setcolor] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    socket.on('room-state', (data) => {
      setmessages(prev => [...prev, ...data.messages]);
      setqueues(prev => [...prev, ...data.queue]);
      setcurrentTime(data.currentTime)
      setusers(data.users)
      setIsPlaying(data.isPlaying)
      setvideoId(data.videoId)
      console.log(data)
    })
    return () => {
      socket.off('room-state')
    }
  }, [])

  useEffect(() => {
    socket.on('sync', (data) => {
      if (data.currentTime != null) {
        setcurrentTime(data.currentTime)
      }
      setqueues(data.queue)
      setusers(data.users)
      setIsPlaying(data.isPlaying)
      setvideoId(data.videoId)
      console.log(data)
    });

    return () => {
      socket.off('sync');
    };
  }, []);


  const context = {
    users, setusers,
    room, setroom,
    username, setusername,
    messages, setmessages,
    videoId, setvideoId,
    currentTime, setcurrentTime,
    color, setcolor,
    isPlaying, setIsPlaying,
    queues, setqueues
  }


  return (
    <MyContext.Provider value={context} >
      {children}
    </MyContext.Provider>
  );
};