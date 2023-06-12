export const createAppointmentRoom = async (starttime:string,expirytime:string,tokenId:string,host:string)=>{
  console.log(JSON.stringify({
    starttime:starttime,expirytime:expirytime,tokenId:tokenId,host:host
   }))
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
         
        },
        body: JSON.stringify({
         starttime:starttime,expirytime:expirytime,tokenId:tokenId,host:host
        }),
      };

     console.log(JSON.parse(options.body))
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_HOST_URL+ '/api/createroom',
          options
        );
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          const errorResponse = await response.json();
           throw new Error(`Failed to create appointment room: ${errorResponse.message}`);

        }
      } catch (error) {
        console.error(error);
        throw error;
      }

}


export const getToken = async (roomId:string,userType:string,displayName:string)=>{
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
         
        },
        body: JSON.stringify({
         roomId:roomId,
         userType:userType,
         displayName:displayName
        }),
      };

     console.log(JSON.parse(options.body))
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_HOST_URL+ '/api/gettoken',
          options
        );
        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          const errorResponse = await response.json();
           throw new Error(`Failed to create appointment room: ${errorResponse.message}`);

        }
      } catch (error) {
        console.error(error);
        throw error;
      }

}



export const createWebinar = async ()=>{
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_HOST_URL+ '/api/createwebinar'    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorResponse = await response.json();
       throw new Error(`Failed to create webinar: ${errorResponse.message}`);

    }
  } catch (error) {
    console.error(error);
    throw error;
  }

}


export const addWebinarParticipant = async (name:string,roomid:string)=>{
  try {

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
       
      },
      body: JSON.stringify({
       name:name,
       roomid:roomid
      }),
    };
    const response = await fetch(
      process.env.NEXT_PUBLIC_HOST_URL+ '/api/addwebinarparticipant',options    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorResponse = await response.json();
       throw new Error(`Failed to add webinar participant: ${errorResponse.message}`);

    }
  } catch (error) {
    console.error(error);
    throw error;
  }

}