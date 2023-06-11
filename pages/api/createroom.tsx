import { request } from "http";

export default function handler(req, res) {
 const body = req.body

 
  

  fetch(process.env.NEXT_PUBLIC_HUDDLE_URL+ 'api/v1/create-room',  {
    method: 'POST',
   body: JSON.stringify({
        "title": "Doctor's Appointment",
      //  "tokenType": "ERC1155",
       // "chain": "POLYGONMUMBAI",
        //"contractAddress": ["0xf4683d08092FF8101FdaD71092c155a71D039840"],
        "starttime":body.starttime,
        "expirytime":body.expirytime,
        //"conditionValue":body.tokenId,
        "hostWallets":[body.host]
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
