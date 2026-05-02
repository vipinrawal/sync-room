import React, { useEffect, useRef, useState, useContext } from 'react';
import { socket } from '../App.jsx';
import { MyContext } from '../context/MyContext.jsx';

const YouTubePlayer = () => {
    const playerRef = useRef(null);
    const internalPlayerRef = useRef(null);
    const { videoId, setIsPlaying, isPlaying, currentTime, setcurrentTime } = useContext(MyContext)
    const [isvideoLoaded, setisvideoLoaded] = useState(false)
    const [volume, setvolume] = useState(50)
    const [mute, setmute] = useState(false)
    const [url, seturl] = useState('')
    let video = ''
    // let isPlaying = false


    useEffect(() => {
        const loadVideo = () => {
            internalPlayerRef.current = new window.YT.Player(playerRef.current, {
                height: '100%',
                width: '100%',
                playerVars: {
                    controls: 0,
                    disablekb: 1,
                    modestbranding: 1
                },
                events: {
                    onReady: () => {
                        getSync();
                    },
                    onStateChange: (e) => {
                        if (e.data == 0) {
                            socket.emit('play-next')
                        }
                    }
                },
            });
        };

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            window.onYouTubeIframeAPIReady = loadVideo;
            document.body.appendChild(tag);
        } else {
            loadVideo();
        }

        return () => {
            if (internalPlayerRef.current?.destroy) {
                internalPlayerRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        socket.on('sync', (data) => {
            if (!internalPlayerRef.current) return;

            if (data.videoId) {
                setisvideoLoaded(true)
            }

            const currentVideoUrl = internalPlayerRef.current.getVideoUrl();
            if (data.videoId && !currentVideoUrl.includes(data.videoId)) {
                internalPlayerRef.current.loadVideoById(data.videoId, data.currentTime);
                setisvideoLoaded(true);
            }

            const playerTime = internalPlayerRef.current.getCurrentTime();
            if (Math.abs(playerTime - data.currentTime) > 2) {
                internalPlayerRef.current.seekTo(data.currentTime);
            }

            if (data.isPlaying) {
                internalPlayerRef.current.playVideo();
                setIsPlaying(false);
            } else {
                internalPlayerRef.current.pauseVideo();
                setIsPlaying(true);
            }
        });

        return () => socket.off('sync');
    }, [setIsPlaying]);



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

    function getSync() {
        socket.emit('get-sync', (response) => {
            console.log(response, currentTime)
            video = response.videoId
            internalPlayerRef.current.loadVideoById(response.videoId, response.currentTime);

            if (response.isPlaying) {
                socket.emit('play', { currentTime: internalPlayerRef.current.getCurrentTime() })
            }

            if (!response.isPlaying) {
                socket.emit('pause', { currentTime: internalPlayerRef.current.getCurrentTime() })
            }
            setIsPlaying(response.isPlaying)
        })
        volumeControl()
    }

    function togglePlay() {
        if (isPlaying) {
            socket.emit('play', { currentTime: internalPlayerRef.current.getCurrentTime() })
        }
        if (!isPlaying) {
            socket.emit('pause', { currentTime: internalPlayerRef.current.getCurrentTime() })
        }
    }
    function seekForward() {
        socket.emit('seek', { currentTime: internalPlayerRef.current.getCurrentTime() + 10 })
    }
    function seekBackward() {
        socket.emit('seek', { currentTime: internalPlayerRef.current.getCurrentTime() - 10 })
    }
    function newVideo(url) {
        const extractUrl = extractVideoId(url)
        socket.emit('load-video', { videoId: extractUrl })
        seturl('')
        getSync()
    }

    function volumeControl() {
        if (!mute) {
            internalPlayerRef.current.setVolume(volume);
        }
    }

    function muteControl() {
        if (!mute) {
            internalPlayerRef.current.setVolume(0);
            setmute(prev => !prev)
        } else {
            internalPlayerRef.current.setVolume(volume);
            setmute(prev => !prev)
        }
    }

    return (
        <div className="video-container h-full w-full p-3">

            <div className='flex w-full h-12 gap-2'>
                <input value={url} placeholder='Enter Youtube Video Url' onChange={(e) => seturl(e.target.value)} type="text" className='w-full border my-2 py-0.5 px-1' />
                <button className='w-30 bg-sky-300 my-2 rounded shadow-xs shadow-black hover:shadow-none' onClick={() => newVideo(url)}>Load <i className="ri-upload-2-line"></i></button>
            </div>

            <div className='h-full w-full rounded overflow-hidden relative'>
                <div ref={playerRef}></div>
                <div className={`bg-red-300 absolute h-full w-full top-0 left-0 ${isvideoLoaded ? 'opacity-0' : 'opacity-100'}`} ></div>
            </div>

            <div className='flex justify-between items-center my-2'>
                <div>
                    <button className='bg-sky-300 px-2 py-1 m-1 rounded-full' onClick={seekBackward}><i className="ri-rewind-fill"></i></button>
                    <button className='bg-sky-300 px-2 py-1 m-1 rounded-full' onClick={togglePlay}>{isPlaying ? <i className="ri-play-fill"></i> : <i className="ri-pause-fill"></i>}</button>
                    <button className='bg-sky-300 px-2 py-1 m-1 rounded-full' onClick={seekForward}><i className="ri-speed-fill"></i></button>
                </div>
                <p>{internalPlayerRef.current?.videoTitle}</p>
                <div className='flex justify-center items-center text-2xl gap-1'>
                    {mute ? <i onClick={() => setmute(!mute)} className="ri-volume-mute-fill"></i> : volume > 50 ? <i onClick={() => setmute(!mute)} className="ri-volume-up-fill"></i> : <i onClick={() => setmute(!mute)} className="ri-volume-down-fill"></i>}
                    <input className='accent-sky-300 h-1' type="range" name="volume" id="volume" value={volume} onChange={(e) => { setvolume(e.target.value) }} />
                    <p className='text-lg'>{volume}%</p>
                </div>
            </div>

        </div>
    );
};

export default YouTubePlayer;