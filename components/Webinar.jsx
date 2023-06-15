"use client";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

import { useEffect, useState, useRef } from "react";
import { createWebinar, addWebinarParticipant } from "@/utils/utils";
import { useSigner } from "wagmi";
import landingSC from "../public/landingSC.png";
import Image from "next/image";
import Header from "../components/Header";

export default function Webinar() {
  const { data: signer } = useSigner();

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

  return (
    <div className="bg-white py-12 w-full">
      {/* <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div> */}
      <div className="mx-auto max-w px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Telemedic Webinars
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Sign in for an upcoming webinar or create one yourself.
          </p>

          <div className="my-8">
            <button
              type="button"
              className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={() => _createWebinar()}
            >
              Create Webinar
            </button>

            <button
              type="button"
              className=" m-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={() => _addWebinarParticipant()}
            >
              Join Webinar
            </button>
          </div>

          <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <Image
              src={landingSC}
              alt="App screenshot"
              width={2432}
              height={1442}
              className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
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
