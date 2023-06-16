"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import coop from "../public/coop.jpg";
import kink from "../public/kink.jpg";
import ActivityList from "../components/dashboard/ActivityList";
import MyWebinars from "../components/dashboard/MyWebinars"
import DoctorAppointmentList from "../components/dashboard/DoctorAppointmentList";
import PatientAppointmentList from "../components/dashboard/PatientAppointmentList";
import WebinarList from "../components/dashboard/WebinarList";
import { useSigner } from "wagmi";

const navigation = [
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Deployments", href: "#", icon: ServerIcon, current: true },
  { name: "Activity", href: "#", icon: SignalIcon, current: false },
  { name: "Domains", href: "#", icon: GlobeAltIcon, current: false },
  { name: "Usage", href: "#", icon: ChartBarSquareIcon, current: false },
  { name: "Settings", href: "#", icon: Cog6ToothIcon, current: false },
];
const teams = [
  { id: 1, name: "Doctor", href: "#", initial: "+", current: false },
  { id: 2, name: "Patient", href: "#", initial: "+", current: false },
  { id: 3, name: "Webinars", href: "#", initial: "+", current: false },
   { id: 4, name: "My Webinars", href: "#", initial: "+", current: false },
];

const stats = [
  { name: "Number of appointments", value: "5" },
  { name: "Average time per appointment", value: "20.65", unit: "mins" },
  { name: "Number of clients seen", value: "2" },
  { name: "Success-rate", value: "100%" },
];
const statuses = {
  Completed: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10",
};
const activityItems = [
  {
    user: {
      name: "Dr. Kink",
      img: kink,
    },
    commit: "2d89f0c8",
    branch: "general",
    status: "Completed",
    duration: "20min",
    date: "45 minutes ago",
    dateTime: "2023-01-23T11:00",
  },
  {
    user: {
      name: "Dr. Cooper",
      img: coop,
    },
    commit: "2d89f108",
    branch: "dental",
    status: "Completed",
    duration: "30min",
    date: "3 days ago",
    dateTime: "2023-01-23T11:00",
  },
  // More items...
];
import { useEffect, useState } from "react";
import { queryPatient, queryDoctor } from "@/mypolybase/polybase";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patientStats, setPatientStats] = useState([]);
  const [doctorStats, setDoctorStats] = useState([]);

  const [selectedTab, setSelectedTab] = useState("Doctor");
  const [doctor,setDoctor] = useState()
  const [patient,setPatient] = useState()
  const { data: signer} = useSigner()

  const doctorStatsCallback = (_stats) => {
    setDoctorStats(_stats);
  };

  const patientStatsCallback = (_stats) => {
    setPatientStats(_stats);
  };

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

  useEffect(() => {
    async function getDoctor() {
      try {
        const result = await queryDoctor(await signer.getAddress());
        setDoctor(result);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }

    if (signer) getDoctor();
  }, [signer]);
  return (
    <>
      <div className="w-full">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 xl:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Your teams
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                              <li key={team.name}>
                                <a
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="-mx-6 mt-auto">
                          <a
                            href="#"
                            className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                          >
                            <img
                              className="h-8 w-8 rounded-full bg-gray-800"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""
                            />
                            <span className="sr-only">Your profile</span>
                            <span aria-hidden="true">Tom Cook</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
            <div className="flex h-16 shrink-0 items-center">
              {/* <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              /> */}
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                {/* <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li> */}
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Navigation
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          onClick={() => {
                            setSelectedTab(team.name);
                          }}
                          className={classNames(
                            selectedTab == team.name
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="xl:pl-72">
          {/* Sticky search header */}

          <main>
            <header>
              {/* Secondary navigation */}
              {/* <nav className="flex overflow-x-auto border-b border-white/10 py-4">
                <ul
                  role="list"
                  className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
                >
                  {secondaryNavigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={item.current ? "text-indigo-400" : ""}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav> */}

              {/* Heading */}
              <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
                <div>
                  <div className="flex items-center gap-x-3">
                    <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                      <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <h1 className="flex gap-x-3 text-base leading-7">
                      <span className="font-semibold text-white">
                        Telemedic
                      </span>
                      <span className="text-gray-600">/</span>
                      <span className="font-semibold text-white">
                        dashboard
                      </span>
                    </h1>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-gray-400">
                    All your information in one location.
                  </p>
                </div>
                <div className="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
                  Verified
                </div>
              </div>

              {/* Stats */}
              <div hidden={selectedTab != "Doctor"}>
                <div className="grid grid-cols-1 bg-gray-700 sm:grid-cols-2 lg:grid-cols-4">
                  {doctorStats.map((stat, statIdx) => (
                    <div
                      key={stat.name}
                      className={classNames(
                        statIdx % 2 === 1
                          ? "sm:border-l"
                          : statIdx === 2
                          ? "lg:border-l"
                          : "",
                        "border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8"
                      )}
                    >
                      <p className="text-sm font-medium leading-6 text-gray-400">
                        {stat.name}
                      </p>
                      <p className="mt-2 flex items-baseline gap-x-2">
                        <span className="text-4xl font-semibold tracking-tight text-white">
                          {stat.value}
                        </span>
                        {stat.unit ? (
                          <span className="text-sm text-gray-400">
                            {stat.unit}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {(selectedTab == "Doctor" && doctor) &&  (
                <div>
                  <DoctorAppointmentList
                    doctor={doctor}
                    stats={doctorStatsCallback}
                  />
                </div>
              )}
              <div hidden={selectedTab != "Patient"}>
                <div className="grid grid-cols-1 bg-gray-700 sm:grid-cols-2 lg:grid-cols-4">
                  {patientStats.map((stat, statIdx) => (
                    <div
                      key={stat.name}
                      className={classNames(
                        statIdx % 2 === 1
                          ? "sm:border-l"
                          : statIdx === 2
                          ? "lg:border-l"
                          : "",
                        "border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8"
                      )}
                    >
                      <p className="text-sm font-medium leading-6 text-gray-400">
                        {stat.name}
                      </p>
                      <p className="mt-2 flex items-baseline gap-x-2">
                        <span className="text-4xl font-semibold tracking-tight text-white">
                          {stat.value}
                        </span>
                        {stat.unit ? (
                          <span className="text-sm text-gray-400">
                            {stat.unit}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {selectedTab == "Patient" && <div>
                <PatientAppointmentList patient={patient} stats={patientStatsCallback} />
              </div>}
              {selectedTab == "Webinars" &&<div >
              <WebinarList presenter={`${doctor?.firstname} ${doctor?.lastname}`} />

              </div>}
              {selectedTab == "My Webinars" &&<div >
                <MyWebinars />
                                          </div>}
            </header>
          </main>
        </div>
      </div>
    </>
  );
}
