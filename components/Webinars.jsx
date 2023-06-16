"use client";


import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { queryWebinars } from "@/mypolybase/polybase";
import { useState, useEffect } from "react";
import Notification from "./Notification/Notification";
import { queryPatient } from "@/mypolybase/polybase";
import { useSigner } from "wagmi";
import { ethers } from "ethers";
import {format} from 'date-fns'

import {
 TokenGateAddress,
 TokenGateABI,
  ApeCoinABI,
  ApeCoinAddress,
} from "./Contracts/Contracts";

export default function Example() {
  const [webinars, setWebinars] = useState([]);
  const [doctor, setDoctor] = useState();
  const [patient, setPatient] = useState();
  const { data: signer } = useSigner();

  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
  // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
    setShow(false);
  };

  useEffect(() => {
    async function getWebinars() {
      try {
        const results = await queryWebinars();
        setWebinars(results);
      } catch (error) {}
    }

    getWebinars();
  }, []);

  useEffect(() => {
    async function getPatient() {
      try {
        const result = await queryPatient(await signer.getAddress());
        setPatient(result);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }

    if (signer) getPatient();
  }, [signer]);
  //  INSERT BOOKING LOGIC BELOW

  

  const buyWebinar = async (_webinar) => {
   
   
    const apeCoinContract = new ethers.Contract(
      ApeCoinAddress,
      ApeCoinABI,
      signer
    );
    const tokenGateContract = new ethers.Contract(
      TokenGateAddress,
      TokenGateABI,
      signer
    );
    try {
    
        const amount = ethers.utils.parseUnits(_webinar.fee.toString(), 18);

      let tx = await apeCoinContract.callStatic.approve(
        TokenGateAddress,
        amount,
        {
          gasLimit: 3000000,
        }
      );

      let tx1 = await apeCoinContract.approve(TokenGateAddress, amount, {
        gasLimit: 3000000,
      });
      await tx1.wait();

      let tx2 = await tokenGateContract.callStatic.enrolWebinar(
       _webinar.tokenId
      );
      let tx3 =await tokenGateContract.enrolWebinar(
        _webinar.tokenId
       );

       await tx3.wait();

      setDialogType(1); //Success
      setNotificationTitle("Purchase Webinar");
      setNotificationDescription("Webinar purchased successfully.");
      setShow(true);
    } catch (error) {
      if (error.code === "TRANSACTION_REVERTED") {
        console.log("Transaction reverted");
        let revertReason = ethers.utils.parseRevertReason(error.data);
        setNotificationDescription(revertReason);
      } else if (error.code === "ACTION_REJECTED") {
        setNotificationDescription("Transaction rejected by user");
      } else {
        console.log(error);
        //const errorMessage = ethers.utils.revert(error.reason);
        setNotificationDescription(
          `Transaction failed with error: ${error.reason}`
        );
      }
      setDialogType(2); //Error
      setNotificationTitle("Purchase Webinar");

      setShow(true);
    }
  };

  

  return (
    <div className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-5">
        <div className="max-w-2xl xl:col-span-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Health Webinars
          </h2>
          <p className="my-6 text-lg leading-8 text-gray-600">
          Unlock a World of Health: Discover, Learn, and Thrive with Our Webinars.
          </p>
          <hr></hr>
          <h2 className=" text-xl mt-6 font-bold tracking-tight text-gray-900">
            Are you a doctor?
          </h2>
          <p className="my-6 text-lg leading-8 text-gray-600">
            Sign up here and get verified as TELEMEDIC doctor and start earning.
          </p>
          <div className="flex flex-row">
            <button
              className=" items-center justify-center flex-row rounded-lg border-2 p-2 text-sm font-semibold text-green-700"
            >
              Sign up as doctor
            </button>
          </div>
        </div>
        <ul
          role="list"
          className="-mt-12 space-y-12 divide-y divide-gray-200 xl:col-span-3"
        >
          {webinars.map((webinar) => (
            <li
              key={webinar.id}
              className="flex flex-col gap-10 pt-12 sm:flex-row"
            >
              <img
                className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover"
                src={webinar.image}
                alt=""
              />
              <div className="max-w-xl flex-auto">
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {webinar.title}
                </h3>
                <p className="text-base leading-7 text-gray-600">
                 {`Start: ${format(new Date(webinar.starttime), 'eee do MMMM yyyy hh:mm a')}`}

                </p>
                <p className="text-base leading-7 text-green-700">
                {`End:     ${format(new Date(webinar.endtime), 'eee do MMMM yyyy hh:mm a')}`}
                </p>
                <p className="text-base leading-7 text-gray-800">
                  {webinar.fee} APECOIN
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  {webinar.description}
                </p>
                <ul role="list" className="mt-6 flex gap-x-6">
                  <div className="-ml-px flex w-0 flex-1">
                    <button
                      onClick={() => buyWebinar(webinar)}
                      className="relative inline-flex w-0 border-2 flex-1 items-center justify-center gap-x-3 rounded-lg  py-4 text-sm font-semibold text-gray-900"
                    >
                      <CurrencyDollarIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      Purchase Webinar
                    </button>
                  </div>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
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
