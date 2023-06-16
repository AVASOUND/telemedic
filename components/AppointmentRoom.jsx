"use client";

import { useSigner } from "wagmi";
import landingSC from "../public/landingSC.png";
import Image from "next/image";
import Header from "./Header";
import { useRouter,usePathname } from "next/navigation";
import { useEventListener, useHuddle01 } from '@huddle01/react';
import { useVideo,useAudio,useRoom,useLobby ,usePeers,useRecording} from '@huddle01/react/hooks';
import { useEffect,useState ,useRef} from 'react';
import { Audio, Video } from '@huddle01/react/components';
import {  getToken} from '@/utils/utils';
import {format} from 'date-fns'
import { useSignMessage,useAccount } from "wagmi";
import { getAccessToken } from "@huddle01/auth";
import { useDisplayName } from "@huddle01/react/app-utils";
import { queryAppointmentByRoomId,updateAppointmentNotes } from "@/mypolybase/polybase";
import { encryptNotes,decryptNotes } from "@/lit/lit";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
export default function Appointment() {
  const { data: signer} = useSigner()
    const videoRef = useRef();
    const {address} = useAccount()
    const [roomId,setRoomId] = useState()   
    const pathname = usePathname() 
    const [appointment,setAppoinment] = useState(null) 
    const [accessToken,setAccessToken] = useState()
    const [notes,setNotes] = useState("")
    const router = useRouter()
    const [hostUrl,setHostUrl] = useState()
    const [redirectUrl,setRedirectUrl] = useState()
    const { initialize, isInitialized } = useHuddle01();
    const {recordingFile,setRecordingFile} = useState()
    const [displayNameText, setDisplayNameText] = useState("Dominic Hackett");
    const { setDisplayName, error: displayNameError } = useDisplayName();


    useEffect(()=>{
      function getRoomId()
      {
       
       const endPart = pathname.split('/').pop();
       setRoomId(endPart)
       //console.log(endPart)
      }
     if(pathname)
       getRoomId()
   },[pathname])
 

   useEffect(()=>{
    async function getAppointment()
    {
     
      const result = await queryAppointmentByRoomId(roomId)
      console.log(result)     
      setAppoinment(result[0])
      if(result[0]?.encryptedSymmetricKey)

      { 
        const encryptedSymmetricKey = result[0].encryptedSymmetricKey
        const encryptedString = new Blob([result[0].notes], { type: "application/octet-stream" });
        const {decryptedString} = await decryptNotes( encryptedString,result[0].doctor.ethAddress,result[0].patient.id,encryptedSymmetricKey)
        console.log(decryptedString)
        setNotes(decryptedString)
       }

    //  console.log(result)
    }
  
    if(roomId)
     getAppointment()
 },[roomId])


useEffect(()=>{
    async function getAccessToken(){
    const userType = (address == appointment.doctor.ethAddress ? "host": "guest")  
    const displayName = (address == appointment.doctor.ethAddress ? `${appointment.doctor.firstname}  ${appointment.doctor.lastname}` : `${appointment.patient.firstname} ${appointment.patient.lastname}`)
    const result = await getToken(roomId,userType,displayName)
    setAccessToken(result.token)
    //setHostUrl(result.hostUrl)
    ///setRedirectUrl(result.redirectUrl)
    //console.log(result)
}  

  if(appointment)
    getAccessToken()
},[appointment])

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
       // console.log(_error)
    },[_error])
    useEffect(() => {
        // its preferable to use env vars to store projectId
        initialize(process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID);
      }, []);


    

    const goToLobby = () =>
    {
         //alert(`${roomId}   ${hostToken}`)
         joinLobby(roomId,accessToken)
    }


 const saveNotes = async() =>{
  
   const _notes = document.getElementById("notes").value
   if(_notes == "")
      return

  const _address = await signer?.getAddress()
  const {encryptedString,encryptedSymmetricKey} =await  encryptNotes(_notes,_address,appointment.patient.id)
  const str = new Uint8Array(await encryptedString.arrayBuffer())
   await updateAppointmentNotes(appointment.id,str,encryptedSymmetricKey)

   
 }

  function backToPrev() {
    router.push("/dashboard");
  }

  useEventListener("lobby:cam-on", () => {
    if (videoStream && videoRef.current) videoRef.current.srcObject = videoStream;
  });


  return (
    <div className="bg-white py-12 w-full">
      <div className="mx-auto max-w px-6 text-center lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* insert title here */}
          <img
                    src="/telemedic.png"
                    alt=""
                    className="h-32 w-32 bg-white"
                  />
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            {appointment ? appointment.reason : ""}
          </h2>
          <p className=" text-xs italic leading-7 text-gray-600">
            powered by Telemedic
          </p>
          <hr></hr>
          {/*  Insert Room #, Date & Time and Description*/}
          <div className="flex flex-row items-center justify-evenly">
            <p className="my-4 text-base leading-7 text-gray-600">Room # {roomId}</p>

            <p className="my-4 text-base leading-7 text-gray-600">
            Date & Time: {( appointment ? format(new Date(appointment.date), 'eee do MMMM yyyy hh:mm a'):"")}
            </p>
          </div>
         
          <div className="min-h-[500px] rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-4xl lg:p-4 flex overflow-hidden">
  <div className={`flex flex-col mr-4 ${(joinLobby.isCallable || !joinLobby ? "hidden": "")}`}  >
  <button 
    className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
        disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
          Leave Room
        </button>
        <button 
                          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
        disabled={!fetchAudioStream.isCallable} onClick={fetchAudioStream}>
          Allow Audio
        </button>

        <button 
          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
        disabled={!fetchVideoStream.isCallable} onClick={fetchVideoStream}>
          Allow Camera
        </button>
        <button 
                          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
        disabled={!produceVideo.isCallable} onClick={() => produceVideo(videoStream)}>
         Camera On  
        </button>
     
        <button 
                          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
        disabled={!produceAudio.isCallable} onClick={() => produceAudio(audioStream)}>
          Mic On  
        </button>

        <button                   className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
  disabled={!stopProducingVideo.isCallable} onClick={stopProducingVideo}>
         Cam Off  
        </button>

        <button                  
        
        className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
 disabled={!stopProducingAudio.isCallable} onClick={stopProducingAudio}>
          Mic Off  
        </button>

       
        <button
          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
            disabled={!startRecording.isCallable}
            onClick={() =>
              startRecording(`${process.env.NEXT_PUBLIC_HOST_URL}/rec/${roomId}`)
            }
          >
            Record
          </button>
          <button 
          className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
          disabled={!stopRecording.isCallable} onClick={stopRecording}>
            Stop Record
          </button>

          
 
         
      
  
  </div>
  <div>
    <Video peerId={peers[0]?.peerId}       hidden={joinLobby.isCallable} 
  autoPlay muted className="h-[400px] w-[600px] bg-black"/>
    <h2               hidden={!joinLobby || joinLobby.isCallable} 
 className="text-center mt-2 text-black">{(address && appointment !=null ? (address == appointment.doctor.ethAddress  ? `${appointment.doctor.firstname}  ${appointment.doctor.lastname}` : `${appointment.patient.firstname} ${appointment.patient.lastname}` ) : "")}</h2>
  </div>
  <div className="ml-6"               hidden={!joinLobby || joinLobby.isCallable} >
    <video ref={videoRef}  autoPlay muted className="m-2 h-[200px] w-[250px] bg-black"peerId={peers[0]?.peerId} /> 
    <Audio peerId={peers[0]?.peerId} />    <h2 className="text-center mt-2 text-black">{(address && appointment !=null ? (address == appointment.doctor.ethAddress  ? `${appointment.doctor.firstname}  ${appointment.doctor.lastname}` : `${appointment.patient.firstname} ${appointment.patient.lastname}` ) : "")}</h2>
  </div>
</div>






          <div className="my-8"         
>
            <button
              type="button"
              className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={backToPrev}
            >
              Leave Consultation
            </button>


           

            <button 
                          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"
        hidden={!joinRoom.isCallable} 
        disabled={!joinRoom.isCallable} onClick={joinRoom}>
          Join Room
        </button>
 
            <button
              type="button"
              className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              hidden={!joinLobby.isCallable} 
              onClick={()=>goToLobby()}
            >
              Join Lobby
            </button>
            {address == appointment?.doctor?.ethAddress && (
    <button
      type="button"
      className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => saveNotes()}
    >
      Save Notes
    </button>
  )}
          </div>
        
          <div className="relative">
  <label
    htmlFor="name"
    className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
  >
    Notes
  </label>
  <textarea
    type="text"
    name="notes"
    id="notes"
    rows={10}
    defaultValue={notes}
    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //   placeholder="Notes"
  />
 
</div>


        
        </div>
      </div>
    </div>
  );
}
