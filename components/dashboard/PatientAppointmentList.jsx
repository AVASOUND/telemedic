import coop from "../../public/coop.jpg";
import kink from "../../public/kink.jpg";
import Image from "next/image";
import { useEffect,useState } from "react";
import { queryAppointmentsForPatient } from "@/mypolybase/polybase";
import { useSigner  } from 'wagmi'
import {format} from 'date-fns'
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

export default function PatientAppointmentList(props) {
    const [appointments,setAppointments] = useState([]) 
    const { data: signer} = useSigner()
    const router = useRouter();

    useEffect(()=>{
        async function getAppointments(){
            const results = await  queryAppointmentsForPatient(props.patient.id)
            console.log(results)
            setAppointments(results)
            props.stats([
                { name: "Number of appointments", value: results.length },
                { name: "Average time per appointment", value: 1, unit: "hours" },
                { name: "Number of Visits", value: results.length },
                { name: "Success-rate", value: (results.length > 0 ? "100%":"---") },
              ])  
        }
        
        if(signer && props.patient)
           getAppointments()

           console.log("Activty 3434")
           console.log(props.patient)
    },[signer])  
  return (
    <div className="border-t border-white/10 bg-gray-700 pt-11">
      <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
        Appointments
      </h2>
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
              Doctor
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
            >
              Appointment 
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
            >
              Date
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
          {appointments.map((item) => (
            <tr key={item.id}className="cursor-pointer"   onClick={()=>router.push(`/appointment/${item.roomId}`)}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <img
                    src={(item.doctor.picture ? item.doctor.picture  :"profile.jpg")}
                    alt=""
                    className="h-8 w-8 rounded-full bg-gray-800"
                  />
                  <div className="truncate text-sm font-medium leading-6 text-white">
                    {item.doctor.firstname}  {item.doctor.lastname}
                  </div>
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                <div className="flex gap-x-3">
                  <div className="font-mono text-sm leading-6 text-gray-400">
                    {item.specialtyname}
                  </div>
                  <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                    {item.reason}
                  </span>
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
                {  format(new Date(item.date), 'eee do MMMM yyyy hh:mm a')
}
              </td>
              <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                  <p
                    className="text-gray-400 sm:hidden"
                  >
                    {item.date}
                  </p>
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
    </div>
  );
}
