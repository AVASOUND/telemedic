export default function Example() {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto  lg:px-8 w-full ">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            {/* <img
              className="h-7"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Company name"
            /> */}
            <p className="text-sm leading-6 text-gray-600">
              Making the world a better place through constructing elegant web3
              solutions.
            </p>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 py-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy; 2023 Telemedic.
          </p>
        </div>
      </div>
    </footer>
  );
}
