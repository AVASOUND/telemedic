"use client";

import Image from "next/image";
import doc1 from "../public/coop.jpg";
import doc2 from "../public/eth.jpg";
import doc3 from "../public/eksyz.jpg";
import doc4 from "../public/kink.jpg";
import { CalendarIcon } from "@heroicons/react/24/outline";

const people = [
  {
    name: "Dr. Kink ",
    role: "General Physician",
    language: "English",
    cost: "25 Matic / hour",
    img: doc1,
    bio: "Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.",
    twitterUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Dr. Cooper ",
    role: "Dental Physician",
    language: "English, Spanish, Hindi",
    cost: "35 Matic / hour",
    img: doc2,

    bio: "Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.",
    twitterUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Dr. Eth ",
    role: "General Physician",
    language: "English, Spanish",
    cost: "25 Matic / hour",
    img: doc3,
    bio: "Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.",
    twitterUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Dr. Eksyz ",
    role: "General Physician",
    language: "English, Spanish",
    cost: "25 Matic / hour",
    img: doc4,
    bio: "Ultricies massa malesuada viverra cras lobortis. Tempor orci hac ligula dapibus mauris sit ut eu. Eget turpis urna maecenas cras. Nisl dictum.",
    twitterUrl: "#",
    linkedinUrl: "#",
  },
  // More people...
];

export default function Example() {
  //  INSERT BOOKING LOGIC BELOW

  function handleClick() {
    // insert logic here

    alert("appointment booked");
  }

  return (
    <div className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-5">
        <div className="max-w-2xl xl:col-span-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose a doctor
          </h2>
          <p className="my-6 text-lg leading-8 text-gray-600">
            who fits your medical needs, get in touch with them by simply
            booking an appointment via the image next to their description.
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
          {people.map((person) => (
            <li
              key={person.name}
              className="flex flex-col gap-10 pt-12 sm:flex-row"
            >
              <Image
                className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover"
                src={person.img}
                alt=""
              />
              <div className="max-w-xl flex-auto">
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-base leading-7 text-gray-600">
                  {person.role}
                </p>
                <p className="text-base leading-7 text-green-700">
                  {person.language}
                </p>
                <p className="text-base leading-7 text-gray-800">
                  {person.cost}
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  {person.bio}
                </p>
                <ul role="list" className="mt-6 flex gap-x-6">
                  <div className="-ml-px flex w-0 flex-1">
                    <button
                      onClick={handleClick}
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
    </div>
  );
}
