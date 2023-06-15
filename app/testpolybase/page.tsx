'use client'
import Hero from "../../components/Hero";
import Team from "../../components/Team";
import { insertSpecialty,querySpecialty,insertDoctor,queryDoctors,insertPatient,queryPatient,
  insertAppointment,updateWebinarImage,updateAppointmentNotes,updateAppointmentStatus,updateDoctorPicture
  ,updateDoctor,updatePatient,queryDoctor,insertWebinar,updateWebinar,updateWebinarStatus,queryWebinar,queryWebinars } from "@/mypolybase/polybase";
  import { encryptNotes,decryptNotes } from "@/lit/lit";
  import { useSigner  } from 'wagmi'
  import * as LitJsSdk from "@lit-protocol/lit-node-client";

  export default function Home() {
    const { data: signer} = useSigner()

const _insertSpecialty = async()=>{
 // await insertSpecialty("Gynecologist","Specializes in women's reproductive health, including the female reproductive system, pregnancy, childbirth, and related disorders")
   const results = await querySpecialty()
   console.log(results)
}

const _insertDoctor = async()=>{
   const result = await updateDoctor("901969fa-f4bf-4839-bd39-799123b50382","Dr. Jordan","Kink","0fb59ff0-15af-4aa5-bdb8-3909196b4993","Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.","30 Years","1-868-555-0101","mikhail@telemedic.com","14 Smith Street","Brooklyn","New York","11203","United State",50,"Star",await signer?.getAddress())
   //const result = await queryDoctor("901969fa-f4bf-4839-bd39-799123b50382")
   //console.log(result)
  const results = await queryDoctors();
  console.log(results)
 // await updateDoctorPicture("901969fa-f4bf-4839-bd39-799123b50382","https://telemedic.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcoop.2b211598.jpg&w=1080&q=75")
}

const _insertPatient = async()=>{
    const dob = new Date()
   const results = await insertPatient(await signer?.getAddress(),"Leon","Hackett","Male",dob.getTime(),"1-868-555-0101"
   ,"dominic@telemedic.com","14 Smith Street","Brooklyn","New York","11203","United State","1-868-555-7777")
  // const results = await queryPatient("a72e5e2c-5e16-4390-9c97-439d006bef43");
   //console.log(results)
 }


 const _insertAppointment = async()=>{
  //const dob = new Date()
 //const results = await insertPatient("Mikhail","Khan","Male",dob.getTime(),"1-868-555-0101"
 //,"mikhail@telemedic.com","14 Smith Street","Brooklyn","New York","11203","United State","1-868-555-7777")
// const results = await queryPatient("a72e5e2c-5e16-4390-9c97-439d006bef43");
 //const date = new Date()
 //const results = await insertAppointment(date.getTime(),"901969fa-f4bf-4839-bd39-799123b50382","a72e5e2c-5e16-4390-9c97-439d006bef43","General Checkup",1,"wyl-lbbq-ehv")

// await updateAppointmentNotes("30b78cab-a831-4a6a-8a8e-b2f24bacca4d","You are ok.")
//await updateAppointmentStatus("30b78cab-a831-4a6a-8a8e-b2f24bacca4d",2)
const results = await queryAppointments()
console.log(results)
const _address = await signer?.getAddress()
console.log(results[0])
if(results[0]?.encryptedSymmetricKey)

{const encryptedSymmetricKey = results[0].encryptedSymmetricKey
const encryptedString = new Blob([results[0].notes], { type: "application/octet-stream" });
const {decryptedString} = await decryptNotes( encryptedString,_address,_address,encryptedSymmetricKey)
console.log(decryptedString)}
}

const webinar = async ()=>{

  //const starttime = new Date().getTime()
  //const endtime = new Date().getTime()  
//  await insertWebinar("Sleep Therapy","Why you should go to bed early.",starttime,endtime,await signer?.getAddress())
 // const results = await queryWebinar("deefcaf7-c11d-4f97-8565-4899dd65945a")
  // const results = await queryWebinars() 
 //console.log(results)
//await updateWebinarStatus("deefcaf7-c11d-4f97-8565-4899dd65945a",2)
 //  await updateWebinar("deefcaf7-c11d-4f97-8565-4899dd65945a","Sleep Therapy","Why you should go to bed early?",starttime,endtime,1)
 await updateWebinarImage("81abf391-a069-474c-bd5c-b43f0422d4dd","https://bafybeibt7xik2quxj5mzzm43wp5lmgl4jatmq3qwr4hfsrwzjgzvyr2yx4.ipfs.dweb.link/diabetes.jpg")
}

const lit = async ()=>{
  const _address = await signer?.getAddress()
  const {encryptedString,encryptedSymmetricKey} =await  encryptNotes("Hello World",_address,_address)
  try
  {const {decryptedString} = await decryptNotes( encryptedString,_address,_address,encryptedSymmetricKey)
  console.log(decryptedString)
} catch(error:any)
{
    console.log(error)
}
  console.log( encryptedString)
  const str = new Uint8Array(await encryptedString.arrayBuffer())
   await updateAppointmentNotes("30b78cab-a831-4a6a-8a8e-b2f24bacca4d",str,encryptedSymmetricKey)

}
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <div className="z-50 bg-white pb-16 w-full">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="mx-auto max-w-2xl">
             
     <button
               className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

       onClick={()=> _insertSpecialty()}
     >
      Insert Specialty

     </button>

     <button
               className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

       onClick={()=> _insertDoctor()}
     >
      Insert Doctor

     </button>

     <button
               className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

       onClick={()=> _insertPatient()}
     >
      Insert Patient

     </button>
     <button
               className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

       onClick={()=> _insertAppointment()}
     >
      Insert Appointment

     </button>
     <button
               className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

       onClick={()=> webinar()}
     >
      Webinar

     </button>

     <button
               className="m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-black"

       onClick={()=> lit()}
     >
      Lit

     </button>

     </div>
     </div>
     </div>
    </main>
  );
}
