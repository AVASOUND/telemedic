import coop from "../../public/coop.jpg";
import kink from "../../public/kink.jpg";
import Image from "next/image";
import { useEffect,useState } from "react";
import { queryWebinarsForOwner } from "@/mypolybase/polybase";
import { useSigner  } from 'wagmi'
import {format} from 'date-fns'
import CreateWebinarDialog from "./CreateWebinar";
import Notification from "@/components/Notification/Notification";
import { NFTStorage } from "nft.storage";
import {ethers} from 'ethers'
import { TokenGateAddress,TokenGateABI } from "../Contracts/Contracts";
import { insertWebinar } from "@/mypolybase/polybase";
import { createWebinar as createRoom } from "@/utils/utils";
import { useRouter } from "next/navigation";

const statuses = {
  2: "text-green-400 bg-green-400/10",
  3: "text-rose-400 bg-rose-400/10",
  1: "text-yellow-400 bg-yellow-400/10",
};
const statusNames = {
  2: "Completed",
  1: "Scheduled",
  3:"Canclled"
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function WebinarList(props) {
  const router = useRouter();

    const [webinars,setWebinars] = useState([]) 
    const { data: signer} = useSigner()
    const [openCreateWebinarDialog,setOpenCreateWebinarDialog] = useState(false)
    const [refreshData,setRefreshData] = useState(new Date())
    const [nftstorage] = useState(
      new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY})
    );
    // NOTIFICATIONS functions
   const [notificationTitle, setNotificationTitle] = useState();
   const [notificationDescription, setNotificationDescription] = useState();
   const [dialogType, setDialogType] = useState(1);
   const [show, setShow] = useState(false);
   const close = async () => {
     setShow(false);
   };

  
    useEffect(()=>{

        async function getWebinars(){
            const results = await  queryWebinarsForOwner(await signer?.getAddress())
            console.log(results)
            setWebinars(results)
            
        }
        
        if(signer )
           getWebinars()

          
    },[signer])  

    const closeCreateWebinarDialog = ()=>{
      setOpenCreateWebinarDialog(false)
     }

     const createWebinar = async(_title,_amount,_starttime,_endtime,_notes,_file)=>{
      
      
     if(_title == "")
     {
      setDialogType(2) //Error
      setNotificationTitle("Create Webinar")
      setNotificationDescription("You have not entered a title.")
      setShow(true)
      return
     }

     if(isNaN(parseFloat(_amount)))
     {
      setDialogType(2) //Error
      setNotificationTitle("Create Webinar")
      setNotificationDescription("You have not entered an amount.")
      setShow(true)
      return
     }
    
     if(isNaN(_starttime.getTime()))
     {
      setDialogType(2) //Error
      setDialogType(2) //Error
      setNotificationTitle("Create Webinar")
      setNotificationDescription("You have not entered a start time.")
      setShow(true)
      return
     }

     
     if(isNaN(_endtime.getTime()))
     {
       setDialogType(2) //Error
      setNotificationTitle("Create Webinar")
      setNotificationDescription("You have not entered an end time.")
      setShow(true)
      return
     }
     
     if(_notes == "")
     {
      setDialogType(2) //Error
      setNotificationTitle("Create Webinar")
      setNotificationDescription("You have not entered a description.")
      setShow(true)
      return
     }

     if(_file == null)
     {
      setDialogType(2) //Error
      setNotificationTitle("Create Webinar")
      setNotificationDescription("You have not selected an NFT image.")
      setShow(true)
      return
     }
     

     let metadata
     let imageUrl
     try {

      setDialogType(3) //Info
      setNotificationTitle("File Uploading")
      setNotificationDescription("Uploading Image File.")
      setShow(true)  
      const objectData = {name:_title, description:_notes,image:_file,_amount:_amount,starttime:_starttime.toISOString(),endtime:_endtime.toISOString()  }
      metadata = await nftstorage.store(objectData) 
     //console.log(metadata.data.image.href)
     const link =metadata.data.image.href
      imageUrl = link.replace('ipfs://', 'https://').replace(/\/[^/]+$/, (match) => {
      return match.replace('/', '.ipfs.dweb.link/');
    });    
    console.log(imageUrl)
     setShow(false)
     }catch(error)
     {
       setDialogType(2) //Error
       setNotificationTitle("Save File")
       setNotificationDescription("Error Saving File.")
       setShow(true)
       return
     }
       const tokenGateContract = new ethers.Contract(TokenGateAddress,TokenGateABI,signer)
       try{
      
        let tx  =  await tokenGateContract.callStatic.newWebinar(_title,props.presenter,_starttime.getTime(),"APECOIN",_amount,metadata.url,{
          gasLimit: 3000000})   
          
          let tx1  =  await tokenGateContract.newWebinar(_title,props.presenter,_starttime.getTime(),"APECOIN",_amount,metadata.url,{
            gasLimit: 3000000})     
          
          const receipt = await tx1.wait();

          const event = receipt.events.find((event) => event.event === 'NewWebinar');
          const tokenId = event.args.webinarId.toNumber();
          const result = await createRoom()
 
          await insertWebinar(_title,_notes,_starttime.getTime(),_endtime.getTime(),await signer?.getAddress(),tokenId,result.id,imageUrl,parseFloat(_amount)) 
          setRefreshData(new Date())
          setDialogType(1) //Success
          setNotificationTitle("Create Webinar")
          setNotificationDescription("Webinar created successfully.")
          setShow(true)   
       }catch(error)
       {

        if (error.code === 'TRANSACTION_REVERTED') {
          console.log('Transaction reverted');
          let revertReason = ethers.utils.parseRevertReason(error.data);
          setNotificationDescription(revertReason);
        }  else if (error.code === 'ACTION_REJECTED') {
        setNotificationDescription('Transaction rejected by user');
      }else {
       console.log(error)
       //const errorMessage = ethers.utils.revert(error.reason);
        setNotificationDescription(`Transaction failed with error: ${error.reason}`);
      
    }
        setDialogType(2) //Error
        setNotificationTitle("Create Webinar")
    
        setShow(true)
    
    
      }

       }
    

  

     return (
    <div className="border-t border-white/10 bg-gray-700 pt-11">
      <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
        Webinars   
      </h2>
      <button
                  className="p-3 ml-2 mt-2 mb-2 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary  px-5 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                onClick={()=>setOpenCreateWebinarDialog(true)}
                >
                 Create Webinar
                </button>   
      <table className="mt-6 w-full whitespace-nowrap text-left">
        <colgroup>
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b border-white/10 text-sm leading-6 text-white">
          <tr>
            <th
              scope="col"
              className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              Title
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
            >
              Start 
            </th>

            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
            >
              End
            </th>
           
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
            >
              Status
            </th>
           
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {webinars.map((item) => (
            <tr key={item.id}className="cursor-pointer"               onClick={()=>router.push(`/webinar/${item.tokenId}`)}
            >
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <img
                    src={(item.image ? item.image : "profile.jpg")}
                    alt=""
                    className="h-8 w-8 rounded-full bg-gray-800"
                  />
                  <div className="truncate text-sm font-medium leading-6 text-white">
                    {item.title} 
                  </div>
                </div>
              </td>
             
              <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
                {  format(new Date(item.starttime), 'eee do MMMM yyyy hh:mm a')
}
              </td>
              <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
                {  format(new Date(item.endtime), 'eee do MMMM yyyy hh:mm a')
}
              </td>
          
              <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                  
                  <div
                    className={classNames(
                      statuses[item.status],
                      "flex-none rounded-full p-1"
                    )}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <div className="hidden text-white sm:block">
                    {statusNames[item.status]}
                  </div>
                </div>
              </td>
             
             
            </tr>
          ))}
        </tbody>
      </table>
      <CreateWebinarDialog open={openCreateWebinarDialog}   setOpen={closeCreateWebinarDialog} createWebinar={createWebinar} refreshData={refreshData} />
      <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
    </div>
  );
}
