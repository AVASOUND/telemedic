'use client'
import Hero from "../../components/Hero";
import Team from "../../components/Team";
import {deleteWebinar, insertSpecialty,querySpecialty,insertDoctor,queryDoctors,insertPatient,queryPatient,
  insertAppointment,updateWebinarImage,updateAppointmentNotes,updateAppointmentStatus,updateDoctorPicture,updateWebinarFee
  ,updateDoctor,updatePatient,queryDoctor,insertWebinar,updateWebinar,updateWebinarStatus,queryWebinar,queryWebinars, updatePatientId,deletePatient,deleteAppointment } from "@/mypolybase/polybase";
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
   //const result = await updateDoctor("901969fa-f4bf-4839-bd39-799123b50382","Dr. Jordan","Kink","0fb59ff0-15af-4aa5-bdb8-3909196b4993","Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.","30 Years","1-868-555-0101","mikhail@telemedic.com","14 Smith Street","Brooklyn","New York","11203","United State",50,"Star",await signer?.getAddress())
   //const result = await queryDoctor("901969fa-f4bf-4839-bd39-799123b50382")
   //console.log(result)
  //const results = await queryDoctors();
  ///console.log(results)
 await updateDoctorPicture("c14ea435-5c75-44d6-ac7a-89dd8b8d4cb8","https://telemedic.vercel.app/eth.jpg")

 ///await insertDoctor("Dr. Devica","Singh","cc93429a-43aa-4992-be1c-0663a7dcea36","A general practitioner (GP) is a primary care physician who provides comprehensive medical care to patients of all ages and backgrounds. They serve as the first point of contact for individuals seeking healthcare services and play a vital role in promoting overall well-being and disease prevention. GPs have broad knowledge and expertise in various areas of medicine, allowing them to diagnose and treat a wide range of common illnesses and health conditions. They conduct physical examinations, order diagnostic tests, and prescribe medications to manage acute and chronic diseases. GPs also provide preventive care, such as vaccinations, health screenings, and lifestyle counseling, to help patients maintain optimal health and prevent future health problems.","5 Years","1-868-555-0301","devica@telemedic.com","321 11th Avenue","New York","New York","11203","United States",60,"Star","0x77DDd0f344771D97951fB2307901B5B5d5EB5D35")
   

}

const _insertPatient = async()=>{
   const dob = new Date()
   const results = await insertPatient("0x77DDd0f344771D97951fB2307901B5B5d5EB5D35","Kevin","Smith","Male",dob.getTime(),"+43 123 456 789"
   ,"kevin@prabitz.com","112 Brooklyn Avenue","Brooklyn","New York","11203","United States","347-555-5555")
   //await insertPatient("0x7F36cba7Da4F7915bf5775cBF91f08F2F8f7b67a","Karthik","Kane","Male",dob.getTime(),"+43 123 456 789"
   //,"harry@kane.com","Musterstraße 123","Wien","Vienna","1010","Austria","+43 123 456 789")
  // const results = await queryPatient("a72e5e2c-5e16-4390-9c97-439d006bef43");
   //console.log(results)
   //await updatePatientId()
   //await deletePatient("a72e5e2c-5e16-4390-9c97-439d006bef43")
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
/*const results = await queryAppointments()
console.log(results)
const _address = await signer?.getAddress()
console.log(results[0])
if(results[0]?.encryptedSymmetricKey)

{const encryptedSymmetricKey = results[0].encryptedSymmetricKey
const encryptedString = new Blob([results[0].notes], { type: "application/octet-stream" });
const {decryptedString} = await decryptNotes( encryptedString,_address,_address,encryptedSymmetricKey)
console.log(decryptedString)}*/
await deleteAppointment("926a931a-0600-451d-85a0-6dd2ba6dacd0")
await deleteAppointment("30b78cab-a831-4a6a-8a8e-b2f24bacca4d")
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
 //await updateWebinarImage("81abf391-a069-474c-bd5c-b43f0422d4dd","https://bafybeibt7xik2quxj5mzzm43wp5lmgl4jatmq3qwr4hfsrwzjgzvyr2yx4.ipfs.dweb.link/diabetes.jpg")
 //await updateWebinarFee("0c74f745-934f-4094-85c6-ebb8f39d892b",10)
  await deleteWebinar("a6e2ed95-012c-4ee2-87ff-b02d54a3b981")
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
