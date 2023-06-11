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