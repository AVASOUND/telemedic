const faqs = [
  {
    question: "How do I sign up for Telemedic?",
    answer:
      "Simply sign up via the Login / Sing up button, provide personal details and get started by making an appointment. All userdata is stored securly on IPFS with encryption via LIT protocol. You decide who can see your files and health resumes.",
  },
  {
    question: "How does it work?",
    answer:
      "Sign up on this platform and get started within minutes. Get your inital appointment with a doctor of your choice. From anywhere in the world, at any time.",
  },
  {
    question: "Why use Telemedic?",
    answer:
      "Certain issues require an in person meeting, for everything else we offer a remote solution for questions regarding your health.",
  },
  {
    question: "Other Questions?",
    answer: "Get in touch with our support team to get your questions covered.",
  },
  // More questions...
];

export default function Example() {
  return (
    <div className="bg-white h-screen w-full">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Can’t find the answer you’re looking for? Reach out to our{" "}
              <a
                href="/support"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                support
              </a>{" "}
              team.
            </p>
          </div>
          <div className="mt-10 lg:col-span-7 lg:mt-0">
            <dl className="space-y-10">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
