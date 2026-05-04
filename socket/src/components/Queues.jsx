import { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/MyContext.jsx";
import { socket } from '../App'

const Queues = () => {
   const { queues } = useContext(MyContext);
   const [queue, setqueue] = useState('')

   function extractVideoId(url) {
      const patterns = [
         /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
         /^([a-zA-Z0-9_-]{11})$/
      ];
      for (const p of patterns) {
         const m = url.match(p);
         if (m) return m[1];
      }
      return null;
   }

   async function addToQueue(url) {
      if (!url) return
      const res = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
      const data = await res.json();
      const videoId = extractVideoId(url)
      socket.emit('add-to-queue', {title: data.title, author: data.author_name, thumbnail: data.thumbnail_url, videoId: videoId});
      setqueue('')
   }
   return (
      <div className="w-full h-full">
         <div className="w-full h-[92%] overflow-y-scroll">
            {
               queues.map((queue, q) => (
                  <div key={q} className="flex items-center border m-1 my-2 text-xs rounded">
                     <div className="m-1 overflow-hidden rounded bg-amber-200">
                        <img className="w-20" src={queue.thumbnail} alt="" />
                     </div>
                     <div>
                        <p>{queue.title.slice(0,35)}...</p>
                        <p className="text-zinc-400 my-1">{queue.author.slice(0,20)}...</p>
                     </div>
                  </div>
               ))
            }
         </div>
         <form onSubmit={(e) => { e.preventDefault() }} className='flex h-[8%] p-1 w-full gap-2'>
            <input className='w-full border px-2 py-1.5 outline-none rounded' type="text" value={queue} placeholder='Enter a youtube url' onChange={(e) => setqueue(e.target.value)} />
            <button className='w-15 bg-sky-300 rounded shadow-xs shadow-black hover:shadow-none' onClick={() => addToQueue(queue)}><i className="ri-play-list-add-line"></i></button>
         </form>
      </div>
   )
}

export default Queues