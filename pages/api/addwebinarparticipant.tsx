import { request } from "http";

export default function handler(req, res) {

 
  

  fetch(process.env.NEXT_PUBLIC_LIVEPEER_URL+ `api/room/${req.body.roomid}/user`,  {
    method: 'POST',
   
    headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
        'Content-type': 'application/json',

    },body:JSON.stringify({name:req.body.name})
   
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
