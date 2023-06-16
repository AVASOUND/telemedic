"use client";

const people = [
  {
    name: "ETH Global",
    role: "Hackathon organizer",
    location: "",
    imageUrl:
      "https://yt3.googleusercontent.com/ytc/AGIKgqMc57ZF1aaJeZbDCeDs4TKEHWgoVqdqkY22Fii2vg=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "FILECOIN",
    role: "Storage of Files",
    location: "",
    imageUrl:
      "https://assets-global.website-files.com/606f63778ec431ec1b930f1f/635014a250a14ec67868c504_file-coin-icon-logo-2JRlv67-600.jpg",
  },
  {
    name: "FVM",
    role: "Filecoin Virtual Machine",
    location: "",
    imageUrl:
      "data:image/jpeg;base64,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",
  },
  {
    name: "IPFS",
    role: "Interplanetary Filestorage",
    location: "",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/18/Ipfs-logo-1024-ice-text.png",
  },
  {
    name: "Ape Coin",
    role: "payment system",
    location: "",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/18876.png",
  },
  {
    name: "Huddle01",
    role: "videoplatform provider",
    location: "",
    imageUrl:
      "https://d3g5ywftkpzr0e.cloudfront.net/wp-content/uploads/2023/04/18134304/Huddle01-Logo.png",
  },
  {
    name: "LIT Protocol ",
    role: "Encryption service",
    location: "",
    imageUrl:
      "data:image/png;base64,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",
  },

  {
    name: "Push Control",
    role: "Notifications",
    location: "",
    imageUrl:
      "https://s3.coinmarketcap.com/static-gravity/image/4d024fb5751548ea9085c3c0efb7365d.png",
  },
  {
    name: "Livepeer",
    role: "Videoplatform",
    location: "",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/3640.png",
  },
  {
    name: "Polybase",
    role: "Database",
    location: "",
    imageUrl:
      "data:image/png;base64,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",
  },
];

export default function Example() {
  return (
    <div className="bg-white pb-16 w-full">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Sponsors
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Below are products we used for this hack.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {people.map((person) => (
            <li key={person.name}>
              <img
                className="mx-auto h-56 w-56 rounded-full"
                src={person.imageUrl}
                alt=""
              />
              <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
                {person.name}
              </h3>
              <p className="text-sm leading-6 text-gray-600">{person.role}</p>
              <p className="text-sm italic leading-6 text-gray-600">
                {person.location}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
