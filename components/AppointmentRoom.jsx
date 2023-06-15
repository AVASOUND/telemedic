"use client";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

import { useEffect, useState, useRef } from "react";
import { createWebinar, addWebinarParticipant } from "@/utils/utils";
import { useSigner } from "wagmi";
import landingSC from "../public/landingSC.png";
import Image from "next/image";
import Header from "./Header";
import { useRouter } from "next/navigation";

export default function Webinar() {
  const { data: signer } = useSigner();
  const router = useRouter();

  const [roomId, setRoomId] = useState();
  const [pToken, setPToken] = useState();

  const _createWebinar = async () => {
    try {
      const result = await createWebinar();

      console.log(result);

      setRoomId(result.id);
    } catch (err) {
      console.log(err);
    }
  };

  const _addWebinarParticipant = async () => {
    try {
      const result = await addWebinarParticipant("Dominic Hackett", roomId);
      console.log(result);
      setPToken(result?.token);
    } catch (err) {
      console.log(err);
    }
  };

  function backToPrev() {
    router.push("/dashboard");
  }

  return (
    <div className="bg-white py-12 w-full">
      <div className="mx-auto max-w px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* insert title here */}
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Insert Title
          </h2>
          <p className=" text-xs italic leading-7 text-gray-600">
            powered by Telemedic
          </p>
          <hr></hr>
          {/*  Insert Room #, Date & Time and Description*/}
          <div className="flex flex-row items-center justify-evenly">
            <p className="my-4 text-base leading-7 text-gray-600">Room #</p>

            <p className="my-4 text-base leading-7 text-gray-600">
              Date & Time
            </p>
          </div>
          <p className="my-4 text-sm leading-7 text-gray-600">Description</p>
          {/* P L A C E H O L D E R FOR IFRAME */}
          <div className=" rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
            <p className="my-2 text-base leading-7 text-gray-600">
              Placeholder for iframe below
            </p>

            {/*  replace image tag with iframe */}
            <Image
              src={landingSC}
              alt="App screenshot"
              width={2432}
              height={1442}
              className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>
          <div className="my-8">
            <button
              type="button"
              className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={backToPrev}
            >
              Leave Consultation
            </button>
            {/* 
            <button
              type="button"
              className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={() => _addWebinarParticipant()}
            >
              Join Webinar
            </button> */}
          </div>

          <div className="relative">
            <label
              htmlFor="name"
              className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
            >
              Notes
            </label>
            <textarea
              type="text"
              name="notes"
              id="notes"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              //   placeholder="Notes"
            />
          </div>
          {pToken && (
            <LiveKitRoom
              audio={true}
              video={true}
              data-lk-theme="default"
              token={pToken}
              serverUrl={`${process.env.NEXT_PUBLIC_LK_SERVER_URL}`}
              connect={true}
            >
              <VideoConference />
            </LiveKitRoom>
          )}
        </div>
      </div>
    </div>
  );
}
