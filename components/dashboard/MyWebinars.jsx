import coop from "../../public/coop.jpg";
import kink from "../../public/kink.jpg";
import Image from "next/image";
import {useState,useEffect} from 'react'
import { useSigner  } from 'wagmi'
import { PRTAddress ,RATAddress} from "../Contracts/Contracts";
import { useRouter } from "next/navigation";

const activityItems = [
  {
    user: {
      name: "Dr. Kink",
      img: kink,
    },
    commit: "2d89f0c8",
    branch: "webinar",
    status: "Download",
    duration: "20min",
    // date: "45 minutes ago",
    date: "2023-01-23 - 3:00 PM",
  },
  {
    user: {
      name: "Dr. Cooper",
      img: coop,
    },
    commit: "2d89f108",
    branch: "webinar",
    status: "Download",
    duration: "30min",
    // date: "3 days ago",
    date: "2023-01-23 - 11:00 AM",
  },
  // More items...
];

const statuses = {
  Completed: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DocumentList() {
    const { data: signer} = useSigner()
    const [webinars,setWebinars] = useState([])
    const router = useRouter();

    useEffect(()=>{
        async function getMyWebinars()
        {
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json'
                }
              };
              let _data = []
            try {
            const owner = await signer?.getAddress()
            const url = `https://eth-goerli.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForOwner?&owner=${owner}&withMetadata=true&pageSize=100`;
            const response = await fetch(url,options)
            const nfts = await response.json()
            const ownedNfts = nfts.ownedNfts 
            
            for(const index in ownedNfts)
            {
                if(ownedNfts[index].contract.address ==RATAddress )
                {const options = {method: 'GET', headers: {accept: 'application/json'}};
                const _url = `https://eth-goerli.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForContract?contractAddress=${PRTAddress}&withMetadata=true&startToken=${ownedNfts[index].tokenId}&limit=1`
                 const response = await fetch(_url, options)
                const nfts = await response.json()
                 const nftData = nfts.nfts
                 const data = await fetch(nftData[0].tokenUri,options)
                 console.log(await data.json())
               //  console.log(nftData)
              _data.push({ image:nftData[0].image.cachedUrl,name:nftData[0].name
                ,tokenId:nftData[0].tokenId})   
            }
            }

            console.log(_data)
            setWebinars(_data)
            }catch(error)
            {
                console.log(error)
            } 
        }
        
        if(signer)
          getMyWebinars() 
    
    },[signer])

  return (
<section className="overflow-x-auto">
  <div className="border-t border-white/10 bg-gray-700 pt-11">
    <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
      Latest activity
    </h2>
    <div className="m-4 mb-12 ">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {webinars.map((object, index) => (
          <div key={object.tokenId}>
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
              <img 
                  onClick={()=>router.push(`/webinar/${object.tokenId}`)} 
                src={object.image}
                alt="Image"
                className="cursor-pointer h-[300px] w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-medium text-white">
              <h3>{object.name}</h3>
            </div>
            <div className="mt-1 flex items-center justify-between text-base font-medium text-white">
              <button 
              onClick={()=>router.push(`/webinar/${object.tokenId}`)}
              className="mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary px-5 text-base font-semibold text-white transition-all hover:bg-opacity-90">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

  );
}
