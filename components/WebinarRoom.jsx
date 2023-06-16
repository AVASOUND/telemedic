"use client";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

import { useEffect, useState, useRef } from "react";
import { createWebinar, addWebinarParticipant } from "@/utils/utils";
import { useSigner } from "wagmi";
import landingSC from "../public/landingSC.png";
import Image from "next/image";
import Header from "./Header";
import { useRouter,usePathname  } from "next/navigation";
import { queryWebinarByTokenId,queryPatient } from "@/mypolybase/polybase";
import format from "date-fns/format";
export default function Webinar() {
  const { data: signer } = useSigner();
  const router = useRouter();
  const pathname = usePathname() 
  const [roomId, setRoomId] = useState();
  const [pToken, setPToken] = useState();
  const [tokenId,setTokenId] = useState()
  const [webinar,setWebinar] = useState()
  const [patient,setPatient] = useState()
  
  const _createWebinar = async () => {
    try {
      const result = await createWebinar();

      console.log(result);

      setRoomId(result.id);
    } catch (err) {
      console.log(err);
    }
  };

  const JoinWebinar = async () => {
    try {

      const name = (patient ? `${patient.data.firstname} ${patient.data.lastname}` : "Guest")
      const result = await addWebinarParticipant(name, roomId);
      console.log(result);
      setPToken(result?.token);
    } catch (err) {
      console.log(err);
    }
  };

  function backToDashBoard() {
    router.push("/dashboard");
  }


  useEffect(()=>{
     function getTokenId()
     {
      
      const endPart = pathname.split('/').pop();
      setTokenId(parseInt(endPart))
      console.log(endPart)
     }
    if(pathname)
      getTokenId()
  },[pathname])


  useEffect(()=>{
    async function getWebinar()
    {
     
      const result = await queryWebinarByTokenId(tokenId)
      setWebinar(result)
      setRoomId(result[0]?.data.roomId)
      console.log(result)
    }
   if(tokenId)
     getWebinar()
 },[tokenId])

 
 useEffect(()=>{
  async function getPatient()
  {
   
    const result = await queryPatient(await signer.getAddress())
    setPatient(result)
    console.log(result)
  }
 if(signer)
   getPatient()
},[signer])

  return (
    <div className="bg-white py-12 w-full">
      <div className="mx-auto max-w px-6 text-center lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* insert title here */}
          <div className="flex items-center gap-x-4">
          <img
                    src={(webinar ? webinar[0].data.image : "profile.jpg")}
                    alt=""
                    className="h-32 w-32 rounded-full bg-black"
                  /></div>
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            {( webinar ? webinar[0]?.data.title:"")}
          </h2>
          <p className=" text-xs italic leading-7 text-gray-600">
            powered by Telemedic
          </p>
          <hr></hr>
          {/*  Insert Room #, Date & Time and Description*/}
          <div className="flex flex-row items-center justify-evenly">
            <p className="my-4 text-base leading-7 text-gray-600">Room #   {( webinar ? webinar[0]?.data.roomId:"")}</p>

            <p className="my-4 text-base leading-7 text-gray-600">
            {( webinar ? format(new Date(webinar[0].data.starttime), 'eee do MMMM yyyy hh:mm a'):"")}
            </p>
          </div>
          {/* P L A C E H O L D E R FOR IFRAME */}
          <div className="min-h-[500px] rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
           

            {pToken && (
            <LiveKitRoom

              audio={true}
              video={true}
              data-lk-theme="default"
              token={pToken}
              serverUrl={`${process.env.NEXT_PUBLIC_LK_SERVER_URL}`}
              connect={true}
            >
              <VideoConference />
            </LiveKitRoom>
          )}
          </div>
          <div className="my-8">
            <button
              type="button"
              className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={backToDashBoard}
            >
              Leave Webinar
            </button>
          {!pToken &&  <button
              
              type="button"
              className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={JoinWebinar}
            >
              Join Webinar
            </button>}
            {/* 
            <button
              type="button"
              className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={() => _addWebinarParticipant()}
            >
              Join Webinar
            </button> */}
          </div>
          
        </div>
      </div>
    </div>
  );
}
