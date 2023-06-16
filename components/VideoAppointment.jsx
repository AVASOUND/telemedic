'use client'
import { useEventListener, useHuddle01 } from '@huddle01/react';
import { useVideo,useAudio,useRoom,useLobby ,usePeers,useRecording} from '@huddle01/react/hooks';
import { useEffect,useState ,useRef} from 'react';
import { Audio, Video } from '@huddle01/react/components';
import { createAppointmentRoom ,getToken} from '@/utils/utils';
import {format} from 'date-fns'
import { useSigner  } from 'wagmi'
import { useSignMessage } from "wagmi";
import { getAccessToken, getMessage } from "@huddle01/auth";
import { useDisplayName } from "@huddle01/react/app-utils";
import { HuddleIframe  } from "@huddle01/iframe";

export default function AppointmentVideo() {
    const { data: signer} = useSigner()
    const videoRef = useRef();

    const [roomId,setRoomId] = useState("sny-wsbx-nri")   //shp-kvqz-zcn
    const [hostToken,setHostToken] = useState()
    const [hostUrl,setHostUrl] = useState()
    const [redirectUrl,setRedirectUrl] = useState()
    const { initialize, isInitialized } = useHuddle01();
    const {recordingFile,setRecordingFile} = useState()
    const [displayNameText, setDisplayNameText] = useState("Dominic Hackett");
    const { setDisplayName, error: displayNameError } = useDisplayName();

    const { signMessage } = useSignMessage({
        onSuccess: async (_data) => {
          const token = await getAccessToken(_data, await signer?.getAddress());
          setHostToken(token.accessToken);
        },
      });
    const { joinLobby } = useLobby();
        const { peers } = usePeers();
        const {
            startRecording,
            stopRecording,
            error:_error,
            data: recordingData,
          } = useRecording();
            

    const { 
        fetchAudioStream, stopAudioStream, error: micError, 
        produceAudio, stopProducingAudio ,stream: audioStream
      } = useAudio();
   
      const { 
        fetchVideoStream, stopVideoStream, error: camError, 
        produceVideo, stopProducingVideo ,stream: videoStream 
      } = useVideo();  
    const { joinRoom, leaveRoom } = useRoom();

    useEffect(()=>{
        console.log(_error)
    },[_error])
    useEffect(() => {
        // its preferable to use env vars to store projectId
        initialize(process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID);
      }, []);


    const getHostToken = async ()=>{
        const result = await getToken(roomId,"host","Dominic Hackett")
        setHostToken(result.token)
        setHostUrl(result.hostUrl)
        setRedirectUrl(result.redirectUrl)
        console.log(result)
    }  


    const goToLobby = () =>
    {
         alert(`${roomId}   ${hostToken}`)
         joinLobby(roomId,hostToken)
    }

    const createRoom = async ()=>{
      const start = new Date()
      const end = start
      end.setHours(end.getHours() + 1); //add an hour to date
     try{
        console.log(await signer.getAddress())
      const result = await createAppointmentRoom(start.toISOString(),end.toISOString(),"12",await signer.getAddress())
      console.log(result)
      setRoomId(result.data.roomId)
     }catch(err)
     {
         console.log(err)
     }  
    }   

    useEventListener("room:joined", () => {
 alert("joined")      });
     // Event Listner
  useEventListener("lobby:cam-on", () => {
    if (videoStream && videoRef.current) videoRef.current.srcObject = videoStream;
  });

useEventListener("room:recording-started",()=>{
    alert("Recording Started")
})
useEventListener("room:recording-stopped",()=>{
    alert("Recording Stopped")
    const objectUrl = URL.createObjectURL(data)
    setRecordingFile(objectUrl)
})
    return (
      <div className="bg-white pb-16 w-full">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Doctors Appointment
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Welcome to your Appointment.      

            </p>
            <div>
             
             </div>
             <div>{isInitialized ? 'Hello World!' : 'Please initialize'}
             <div className="grid grid-cols-4">
          {Object.values(peers)
            .filter((peer) => peer.cam)
            .map((peer) => (
              <Video
                key={peer.peerId}
                peerId={peer.peerId}
                track={peer.cam}
                // debug
              />
            ))}
          {Object.values(peers)
            .filter((peer) => peer.mic)
            .map((peer) => (
              <Audio key={peer.peerId} peerId={peer.peerId} track={peer.mic} />
            ))}
        </div>
     IG
       
      <video ref={videoRef} autoPlay muted></video>
      <input
            type="text"
            placeholder="Your Room Id"
            value={displayNameText}
            onChange={(e) => setDisplayNameText(e.target.value)}
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none mr-2"
          />
          <button
            disabled={!setDisplayName.isCallable}
            className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "

            onClick={() => {
              setDisplayName(displayNameText);
            }}
          >
            {`SET_DISPLAY_NAME error: ${displayNameError}`}
          </button>
             <button 
        
          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "

          onClick={() => createRoom()
        }>
          Create Room
        </button>    

        <button 
        
        className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "

        onClick={() => getHostToken()
      }>
        Host Token
      </button>    


      <button 
        onClick={ async() => {
          const msg = await getMessage(await signer?.getAddress());
          signMessage({ message: msg.message });
        }}> 
        Sign Message
      </button>
        <button 
          disabled={!joinLobby.isCallable} 
          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

          onClick={() => goToLobby()
        }>
          Join Lobby
        </button>
 
        {/* Mic */} 
        <button 
                          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

        disabled={!fetchAudioStream.isCallable} onClick={fetchAudioStream}>
          FETCH_AUDIO_STREAM 
        </button>
 
        {/* Webcam */} 
        <button 
                          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

        disabled={!fetchVideoStream.isCallable} onClick={fetchVideoStream}>
          FETCH_VIDEO_STREAM
        </button>
 
        <button 
                          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

        disabled={!joinRoom.isCallable} onClick={joinRoom}>
          JOIN_ROOM 
        </button>
 
        <button 
                          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

        disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
          LEAVE_ROOM 
        </button>
 
        <button 
                          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

        disabled={!produceVideo.isCallable} onClick={() => produceVideo(videoStream)}>
          Produce Cam  
        </button>
 
        <button 
                          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

        disabled={!produceAudio.isCallable} onClick={() => produceAudio(audioStream)}>
          Produce Mic  
        </button>
 
        <button                   className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
  disabled={!stopProducingVideo.isCallable} onClick={stopProducingVideo}>
          Stop Producing Cam  
        </button>
 
        <button                  
        
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
 disabled={!stopProducingAudio.isCallable} onClick={stopProducingAudio}>
          Stop Producing Mic  
        </button>
        <button
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
            disabled={!startRecording.isCallable}
            onClick={() =>
              startRecording(`${process.env.NEXT_PUBLIC_HOST_URL}/rec/${roomId}`)
            }
          >
            {`START_RECORDING error: ${_error}`}
          </button>
          <button 
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
          disabled={!stopRecording.isCallable} onClick={stopRecording}>
            STOP_RECORDING
          </button>

      </div>
      {recordingFile && <a href={recordingFile}>Download Recording</a>}


     { hostUrl && <HuddleIframe roomUrl={hostUrl}  className="w-full aspect-video" />}


          </div>
</div>

</div>
    )
}  