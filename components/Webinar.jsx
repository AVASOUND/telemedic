'use client'
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

import { useEffect,useState ,useRef} from 'react';
import { createWebinar,addWebinarParticipant } from '@/utils/utils';
import { useSigner  } from 'wagmi'

export default function Webinar() {
    const { data: signer} = useSigner()
   
    const [roomId,setRoomId] = useState("c191e514-f6ac-4651-b707-5ef66b132a91")
    const [pToken,setPToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRG9taW5pYyBIYWNrZXR0IiwidmlkZW8iOnsicm9vbUpvaW4iOnRydWUsInJvb20iOiJjMTkxZTUxNC1mNmFjLTQ2NTEtYjcwNy01ZWY2NmIxMzJhOTEifSwiaWF0IjoxNjg2NTI1Mjg1LCJuYmYiOjE2ODY1MjUyODUsImV4cCI6MTY4NjUyNTU4NSwiaXNzIjoiQVBJNTRENHc4c0Nmd2VWIiwic3ViIjoiZGFjNWY0NzAtOWIyYy00MTA1LWFkOGEtZmM2ZWFlYjUwMzhlIiwianRpIjoiZGFjNWY0NzAtOWIyYy00MTA1LWFkOGEtZmM2ZWFlYjUwMzhlIn0.n0NznkSRXVWxxgE0hoSJtE9kEf6PYbIr5tNOdGqazTY")
    
    const _createWebinar = async ()=>{
      
     try{
        const result = await createWebinar()

        
        console.log(result)
        setPToken(result?.token)
     }catch(err)
     {
         console.log(err)
     }  
    }   

    
    const _addWebinarParticipant = async ()=>{
      
        try{
           const result = await addWebinarParticipant("Dominic Hackett",roomId)
           console.log(result)
        }catch(err)
        {
            console.log(err)
        }  
       }   
     
  
    return (
      <div className="bg-white pb-16 w-full z-50">
        <div className="mx-auto max-w px-6 text-center lg:px-8">
       
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Webinar
            </h2>
           
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Welcome to your Webinar.    

            </p>
          
          
            <div>
            <button 
             type='button'
        
          className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "

          onClick={() => _createWebinar()
        }>
          Create Webinar
        </button>    

        <button 
             type='button'
        
          className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "

          onClick={() => _addWebinarParticipant()
        }>
          Join Webinar
        </button>
            </div>
       
          {pToken &&  <LiveKitRoom  audio={true}
          video={true} data-lk-theme="default"  token={pToken}
             serverUrl={`${process.env.NEXT_PUBLIC_LK_SERVER_URL}`} connect={true}>
      <VideoConference />
    </LiveKitRoom> }
      
     
          </div>

         
     
</div>
</div>
    )
}  