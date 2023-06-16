import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import {queryDoctors} from "@/mypolybase/polybase";
import {useState,useEffect} from 'react'
import {
  CalendarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const people = [
  {
    name: "Dr. Eth ",
    title: "General Physician",
    role: "English, German",
    cost: "30 Matic / Hour",
    email: "ethdoc@telemedic.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    name: "Dr.  Cooper",
    title: "Dental Physician",
    role: "English, Spanish",
    cost: "20 Matic / Hour",
    email: "cooper@telemedic.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    name: "Dr.  Kink",
    title: "General Physician",
    role: "English, Spanish",
    cost: "25 Matic / Hour",
    email: "cooper@telemedic.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },

  // More people...
];

export default function Example() {
  const [doctors,setDoctors] = useState([])
  useEffect(()=>{
    try {
          const results = queryDoctors()
          setDoctors(results)    
    }catch(error)
    {

    }
  },[])
  return (
    <div className="w-full flex flex-col items-center bg-white">
      <ul
        role="list"
        className=" w-full flex items-center justify-center flex-col space-y-4"
      >
        {doctors.map((person) => (
          <li
            key={person.email}
            className="col-span-1 px-4 divide-gray-200 rounded-lg bg-white shadow"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {person.firstname} {person.lastname}
                  </h3>
                  <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {person.secialtyname}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">
                  {person.description}
                </p>
                <p className="mt-1 truncate font-bold text-sm text-gray-500">
                  {person.fee} APECOIN / Hour
                </p>
              </div>
              <img
                className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                src={person?.picture}
                alt=""
              />
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <a
                    // href={`mailto:${person.email}`}
                    className="relative -mr-px inline-flex cursor-pointer w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <InformationCircleIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    About
                  </a>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <a
                    href={`tel:${person.telephone}`}
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <CalendarIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Appointment
                  </a>
                </div>
              </div>
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
