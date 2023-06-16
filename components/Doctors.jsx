"use client";

import Image from "next/image";
import doc1 from "../public/coop.jpg";
import doc2 from "../public/eth.jpg";
import doc3 from "../public/eksyz.jpg";
import doc4 from "../public/kink.jpg";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { queryDoctors } from "@/mypolybase/polybase";
import { useState, useEffect } from "react";
import AppointmentDialog from "@/components/Appointment/Appointment";
import Notification from "./Notification/Notification";
import { queryPatient } from "@/mypolybase/polybase";
import { useSigner } from "wagmi";
import { ethers } from "ethers";
import {
  TeleAppointmentABI,
  TeleAppointmentAddress,
  ApeCoinABI,
  ApeCoinAddress,
} from "./Contracts/Contracts";
import { createAppointmentRoom } from "@/utils/utils";
import { insertAppointment } from "@/mypolybase/polybase";
export default function Example() {
  const [doctors, setDoctors] = useState([]);
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
    async function getDoctors() {
      try {
        const results = await queryDoctors();
        setDoctors(results);
      } catch (error) {}
    }

    getDoctors();
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

  function handleClick(_doctor) {
    // insert logic here
    setDoctor(_doctor);
    setOpenAppointmentDialog(true);
  }

  const setAppoinment = async (_date, _doctor, reason) => {
    if (reason == "") {
      setDialogType(2); //Error
      setNotificationTitle("Book Appointment");
      setNotificationDescription("You have not entered a reason.");
      setShow(true);
      return;
    }

    if (patient == undefined) {
      setDialogType(2); //Error
      setNotificationTitle("Book Appointment");
      setNotificationDescription("You have not registered as a patient.");
      setShow(true);
      return;
    }
    if (isNaN(_date.getTime())) {
      setDialogType(2); //Error
      setNotificationTitle("Book Appointment");
      setNotificationDescription("You have not selected a date.");
      setShow(true);

      return;
    }

    const apeCoinContract = new ethers.Contract(
      ApeCoinAddress,
      ApeCoinABI,
      signer
    );
    const teleAppointmentContract = new ethers.Contract(
      TeleAppointmentAddress,
      TeleAppointmentABI,
      signer
    );
    try {
      console.log(_doctor);
      console.log(patient);

      const start = new Date();
      const end = start;
      end.setHours(end.getHours() + 1); //add an hour to date

      const result = await createAppointmentRoom(
        start.toISOString(),
        end.toISOString(),
        "12",
        await signer.getAddress()
      );

      const roomId = result.data.roomId;

      const patientName = `${patient.data.firstname} ${patient.data.lastname}`;
      const doctorName = `${doctor.firstname} ${doctor.lastname}`;
      const amount = ethers.utils.parseUnits(_doctor.fee.toString(), 18);
      let tx = await apeCoinContract.callStatic.approve(
        TeleAppointmentAddress,
        amount,
        {
          gasLimit: 3000000,
        }
      );

      let tx1 = await apeCoinContract.approve(TeleAppointmentAddress, amount, {
        gasLimit: 3000000,
      });
      await tx1.wait();

      let tx2 = await teleAppointmentContract.callStatic.bookAppointment(
        doctorName,
        patientName,
        1,
        _date.getTime(),
        "APECOIN",
        {
          gasLimit: 3000000,
        }
      );
      let tx3 = await teleAppointmentContract.bookAppointment(
        doctorName,
        patientName,
        1,
        _date.getTime(),
        "APECOIN",
        {
          gasLimit: 3000000,
        }
      );
      await tx3.wait();

      await insertAppointment(
        start.getTime(),
        _doctor.id,
        patient.data.id,
        reason,
        1,
        roomId
      );
      setDialogType(1); //Success
      setNotificationTitle("Book Appointment");
      setNotificationDescription("Appointment set successfully.");
      setShow(true);
    } catch (error) {
      if (error.code === "TRANSACTION_REVERTED") {
        console.log("Transaction reverted");
        //let revertReason = ethers.utils.parseRevertReason(error.data);
        setNotificationDescription("Reverted");
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
      setNotificationTitle("Book Appointment");

      setShow(true);
    }
  };

  const closeAppointmentDialog = () => {
    setOpenAppointmentDialog(false);
  };

  return (
    <div className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-5">
        <div className="max-w-2xl xl:col-span-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose a doctor
          </h2>
          <p className="my-6 text-lg leading-8 text-gray-600">
            who fits your medical needs, get in touch with them by simply
            booking an appointment.
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
              onClick={handleClick}
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
          {doctors.map((person) => (
            <li
              key={person.id}
              className="flex flex-col gap-10 pt-12 sm:flex-row"
            >
              <img
                className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover"
                src={person.picture}
                alt=""
              />
              <div className="max-w-xl flex-auto">
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {person.firstname} {person.lastname}
                </h3>
                <p className="text-base leading-7 text-gray-600">
                  {person.specialtyname}
                </p>
                <p className="text-base leading-7 text-green-700">
                  {person.city}, {person.state}, {person.country}
                </p>
                <p className="text-base leading-7 text-gray-800">
                  {person.fee} APECOIN / Hour
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  {person.qualifications}
                </p>
                <ul role="list" className="mt-6 flex gap-x-6">
                  <div className="-ml-px flex w-0 flex-1">
                    <button
                      onClick={() => handleClick(person)}
                      className="relative inline-flex w-0 border-2 flex-1 items-center justify-center gap-x-3 rounded-lg  py-4 text-sm font-semibold text-gray-900"
                    >
                      <CalendarIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      Book appointment
                    </button>
                  </div>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <AppointmentDialog
        open={openAppointmentDialog}
        doctor={doctor}
        setOpen={closeAppointmentDialog}
        setAppointment={setAppoinment}
      />
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
