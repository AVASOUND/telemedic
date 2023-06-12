import { request } from "http";

export default function handler(req, res) {
 const body = req.body

 
  

  fetch(process.env.NEXT_PUBLIC_HUDDLE_URL+ 'api/v1/join-room-token',  {
    method: 'POST',
   body: JSON.stringify({
        roomId:body.roomId,
        userType:"host"
      }),
    headers: {
        "Content-type": "application/json",
        'x-api-key': process.env.NEXT_PUBLIC_HUDDLE_API_KEY
    }
   
  })
    .then(async(response) => {
      if (!response.ok) {
        //res.status(200).json(response);     
        throw new Error(JSON.stringify(await response.json()));
      }
      return response.json();
    })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(err => {
     // console.error(err);
      res.status(500).json(err);
    });
  
}
