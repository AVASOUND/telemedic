import { Polybase } from "@polybase/client";
import * as eth from '@polybase/eth'
import { v4 as uuidv4 } from 'uuid';

const db = new Polybase({
    defaultNamespace: "pk/0x2db5463dadb9b282cd24c24722af50021ca5160f5d4858da6d0cac8dde03d56290de41571d77d105d57a4e4406b78fbe62ecf8638494fd4565a0b50738fada31/TeleMedic",
  });

  db.signer(async (data: string) => {
    // A permission dialog will be presented to the user
    const accounts = await eth.requestAccounts();
  
    // If there is more than one account, you may wish to ask the user which
    // account they would like to use
    const account = accounts[0];
    const sig = await eth.sign(data, account);
    console.log(account)
  
    return { h: "eth-personal-sign", sig };
  })

  export const insertSpecialty = async (name:string,description:string) =>{

     
    const specialtyCollection = db.collection("Specialty");
    const id = uuidv4()
    try{
        const recordData = await specialtyCollection.create([id,name,description])
    }catch(error:any) 
    {
        throw Error(error.message)
    }
}

export const querySpecialty = async ( )=>{

  const specialtyCollection = db.collection("Specialty");
  
  try{
    const records = await specialtyCollection.get();
    let _data:any = []
   for(const index in records.data){
        _data.push(records.data[index].data)
    }
     return _data
  }catch(error:any){
    throw Error(error.message)
  } 
   
}

export const insertDoctor = async (firstname:string
  ,lastname:string
  ,specialty:string
  ,qualifications:string
  ,experience:string
  ,phone:string
  ,email:string
  ,street:string
  ,city:string
  ,state:string
  ,zip:string,country:string,fee:number,profile:string,ethAddress:string)=>{

    const  doctorCollection = db.collection("Doctor");

    const id = uuidv4()
    try{
        const recordData = await doctorCollection.create([id,firstname,lastname
          ,db.collection("Specialty").record(specialty)
          ,qualifications,experience,phone,email,street,city,state,zip,country,fee,profile,ethAddress])
    }catch(error:any) 
    {
        throw Error(error.message)
    }
  

}

export const updateDoctor = async (id:string,firstname:string
  ,lastname:string
  ,specialty:string
  ,qualifications:string
  ,experience:string
  ,phone:string
  ,email:string
  ,street:string
  ,city:string
  ,state:string
  ,zip:string,country:string,fee:number,profile:string,ethAddress:string)=>{

    const  doctorCollection = db.collection("Doctor");

    try{
        const recordData = await doctorCollection.record(id).call("updateDoctor",[firstname,lastname
          ,db.collection("Specialty").record(specialty)
          ,qualifications,experience,phone,email,street,city,state,zip,country,fee,profile,ethAddress])
    }catch(error:any) 
    {
        throw Error(error.message)
    }
  

}

export const updateDoctorPicture = async(id:string,picture:string) =>{
  const  doctorCollection = db.collection("Doctor");
  try{
    const recordData = await doctorCollection.record(id).call("setPicture",[picture])
}catch(error:any) 
{
    throw Error(error.message)
}


}

export const queryDoctors = async ()=>{

  const doctorCollection = db.collection("Doctor");
  const specialtyCollection = db.collection("Specialty")
  try{
    const records = await doctorCollection.get();
    let _data:any = []
   for(const index in records.data){
        const specialty = await specialtyCollection.record(records.data[index].data.specialty.id).get()
        const doctor = records.data[index].data
        doctor.specialtyname = specialty?.data.name
        _data.push(doctor)
    }
     return _data
  }catch(error:any){
    throw Error(error.message)
  } 
   
}

export const queryDoctor = async (address:string)=>{

  const doctorCollection = db.collection("Doctor");
  const specialtyCollection = db.collection("Specialty")
  try{
        const record = await doctorCollection.where("ethAddress","==",address).get();
       console.log(record)
        const specialty = await specialtyCollection.record(record.data[0].data.specialty.id).get()
        const doctor = record.data[0].data
        doctor.specialtyname = specialty?.data.name
        return doctor
      }catch(error:any){
    throw Error(error.message)
  } 
   
}

export const insertPatient = async (id:string,firstname:string
  ,lastname:string
  
  ,gender:string
  ,dob:number
  ,phone:string
  ,email:string
  ,street:string
  ,city:string
  ,state:string
  ,zip:string,country:string,emergencyContact:string)=>{

    const  patientCollection = db.collection("Patient");

    
    try{
        const recordData = await patientCollection.create([id,firstname,lastname
          ,gender
          ,dob,phone,email,street,city,state,zip,country,emergencyContact])
    }catch(error:any) 
    {
        throw Error(error.message)
    }
  

}


export const updatePatient = async (id:string,firstname:string
  ,lastname:string
  
  ,gender:string
  ,dob:number
  ,phone:string
  ,email:string
  ,street:string
  ,city:string
  ,state:string
  ,zip:string,country:string,emergencyContact:string)=>{

    const  patientCollection = db.collection("Patient");

    
    try{
        const recordData = await patientCollection.record(id).call("updatePatient",[firstname,lastname
          ,gender
          ,dob,phone,email,street,city,state,zip,country,emergencyContact])
    }catch(error:any) 
    {
        throw Error(error.message)
    }
  

}

export const updatePatientId = async (id:string)=>{

    const  patientCollection = db.collection("Patient");

    
    try{
        const recordData = await patientCollection.record(id).call("updateId",[id])
    }catch(error:any) 
    {
        throw Error(error.message)
    }
  

}

export const queryPatient = async (id:string )=>{

  const patientCollection = db.collection("Patient");
  try{
    const record = await patientCollection.record(id).get();
   
     return record
  }catch(error:any){
    throw Error(error.message)
  } 
   
}

export const deletePatient = async (id:string)=>{

  const  patientCollection = db.collection("Patient");

  
  try{
      const recordData = await patientCollection.record(id).call("del",[])
  }catch(error:any) 
  {
      throw Error(error.message)
  }


}

export const insertAppointment = async (date:number,doctor:string,patient:string
  ,reason:string,status:number,roomId:string)=>{

    const  appointmentCollection = db.collection("Appointment");

    const id = uuidv4()
    try{
        const recordData = await appointmentCollection.create([id,date, db.collection("Doctor").record(doctor)
          , db.collection("Patient").record(patient)
          ,reason,status,roomId])
    }catch(error:any) 
    {
        throw Error(error.message)
    }
  

}

export const updateAppointmentNotes = async(id:string,notes:Uint8Array,encryptedSymmetricKey:string) =>{
  const  appointmentCollection = db.collection("Appointment");
  try{
    const recordData = await appointmentCollection.record(id).call("updateNotes",[notes,encryptedSymmetricKey])
}catch(error:any) 
{
    throw Error(error.message)
}


}

export const updateAppointmentStatus = async(id:string,status:number) =>{
  const  appointmentCollection = db.collection("Appointment");
  try{
    const recordData = await appointmentCollection.record(id).call("setStatus",[status])
}catch(error:any) 
{
    throw Error(error.message)
}


}


export const queryAppointmentByRoomId = async (roomId:string)=>{

  const appointmentCollection = db.collection("Appointment");
  const doctorCollection = db.collection("Doctor");
  const patientCollection = db.collection("Patient");
  const specialtyCollection = db.collection("Specialty")

  try{
        const records = await appointmentCollection.where("roomId","==",roomId).get();
        let _data:any = []
        for(const index in records.data){
            const appointment = records.data[index].data
        
               const doctor = await doctorCollection.record(appointment.doctor.id).get() 
               console.log(doctor)
               const specialty = await specialtyCollection.record(doctor.data.specialty.id).get()
               appointment.doctor = doctor.data
               const patient = await patientCollection.record(appointment.patient.id).get() 
               console.log(patient)
               appointment.patient  = patient.data
               appointment.doctor.specialtyname = specialty?.data.name
              _data.push(appointment)
            
        }
         return _data
      
      }catch(error:any){
    throw Error(error.message)
  } 
   
}
export const queryAppointmentsForDoctor = async (id:string )=>{
  const appointmentCollection = db.collection("Appointment")
  const doctorCollection = db.collection("Doctor");
  const patientCollection = db.collection("Patient");

   const specialtyCollection = db.collection("Specialty")
  try{
    const records = await appointmentCollection.get();
    let _data:any = []
    for(const index in records.data){
        const appointment = records.data[index].data
        if(appointment.doctor.id==id)   
        {
           const doctor = await doctorCollection.record(appointment.doctor.id).get() 
           console.log(doctor)
           const specialty = await specialtyCollection.record(doctor.data.specialty.id).get()
           appointment.doctor = doctor.data
           const patient = await patientCollection.record(appointment.patient.id).get() 
           console.log(patient)
           appointment.patient  = patient.data
           appointment.doctor.specialtyname = specialty?.data.name
          _data.push(appointment)
        } 
    }
     return _data
  }catch(error:any){
    throw Error(error.message)
  } 
   
}


export const queryAppointmentsForPatient = async (id:string )=>{
  const appointmentCollection = db.collection("Appointment")
  const doctorCollection = db.collection("Doctor");
  const patientCollection = db.collection("Patient");

   const specialtyCollection = db.collection("Specialty")
  try{
    const records = await appointmentCollection.get();
    let _data:any = []
    for(const index in records.data){
        const appointment = records.data[index].data
        if(appointment.patient.id==id)   
        {
           const doctor = await doctorCollection.record(appointment.doctor.id).get() 
           console.log(doctor)
           const specialty = await specialtyCollection.record(doctor.data.specialty.id).get()
           appointment.doctor = doctor.data
           const patient = await patientCollection.record(appointment.patient.id).get() 
           console.log(patient)
           appointment.patient  = patient.data
           appointment.doctor.specialtyname = specialty?.data.name
          _data.push(appointment)
        } 
    }
     return _data
  }catch(error:any){
    throw Error(error.message)
  } 
   
}



export const deleteAppointment = async (id:string)=>{

  const  appointmentCollection = db.collection("Appointment");

  
  try{
      const recordData = await appointmentCollection.record(id).call("del",[])
  }catch(error:any) 
  {
      throw Error(error.message)
  }


}

export const insertWebinar = async (title:string,description:string,starttime:number,endtime:number,owner:string,tokenId:number,roomId:string,image:string,fee:number)=>{

    const  webinarCollection = db.collection("Webinar");

    const id = uuidv4()
    try{
        const recordData = await webinarCollection.create([id,title,description,starttime,endtime,owner,tokenId,roomId,image,fee])
    }catch(error:any) 
    {
        throw Error(error.message)
    }
  

}


export const updateWebinar = async (id:string,title:string,description:string,starttime:number,endtime:number,tokenId:number,roomId:string,image:string,fee:number)=>{

  const  webinarCollection = db.collection("Webinar");

  
  try{
      const recordData = await webinarCollection.record(id).call("updateWebinar",[title,description,starttime,endtime,tokenId,roomId,image,fee])
  }catch(error:any) 
  {
      throw Error(error.message)
  }


}




export const updateWebinarImage = async (id:string,image:string)=>{

  const  webinarCollection = db.collection("Webinar");

  
  try{
      const recordData = await webinarCollection.record(id).call("setImage",[image])
  }catch(error:any) 
  {
      throw Error(error.message)
  }


}

export const updateWebinarFee = async (id:string,fee:number)=>{

  const  webinarCollection = db.collection("Webinar");

  
  try{
      const recordData = await webinarCollection.record(id).call("setFee",[fee])
  }catch(error:any) 
  {
      throw Error(error.message)
  }


}

export const updateWebinarStatus = async (id:string,status:number)=>{

  const  webinarCollection = db.collection("Webinar");

  
  try{
      const recordData = await webinarCollection.record(id).call("setStatus",[status])
  }catch(error:any) 
  {
      throw Error(error.message)
  }


}

export const deleteWebinar = async (id:string)=>{

  const  webinarCollection = db.collection("Webinar");

  
  try{
      const recordData = await webinarCollection.record(id).call("del",[])
  }catch(error:any) 
  {
      throw Error(error.message)
  }


}

export const queryWebinar = async (id:string)=>{

  const webinarCollection = db.collection("Webinar");
  try{
        const record = await webinarCollection.record(id).get();
  
               return record.data
      }catch(error:any){
    throw Error(error.message)
  } 
   
}

export const queryWebinarByTokenId = async (tokenId:number)=>{

  const webinarCollection = db.collection("Webinar");
  try{
        const record = await webinarCollection.where("tokenId","==",tokenId).get();
  
               return record.data
      }catch(error:any){
    throw Error(error.message)
  } 
   
}

export const queryWebinars = async ()=>{

  const webinarCollection = db.collection("Webinar");
  try{
    const records = await webinarCollection.get();
    let _data:any = []
    for(const index in records.data ){
       
      if(records.data[index].data.image)

        _data.push(records.data[index].data)
    }
     return _data
  }catch(error:any){
    throw Error(error.message)
  } 
   
}

export const queryWebinarsForOwner = async (owner:string)=>{

  const webinarCollection = db.collection("Webinar");
  try{
    const records = await webinarCollection.where("owner","==",owner).get();
    let _data:any = []
    for(const index in records.data ){
       
       if(records.data[index].data.image)
        _data.push(records.data[index].data)
    }
     return _data
  }catch(error:any){
    throw Error(error.message)
  } 
   
}
