import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-neutral-primary-soft">
      <div className="mx-auto w-full max-w-7xl p-4 py-6 lg:py-8">

        <div className="md:flex md:justify-between">
          
          <div className="mb-6 md:mb-0">
            <a href="https://flowbite.com/" className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-7 me-3"
                alt="FlowBite Logo"
              />
              <span className="text-heading self-center text-2xl font-semibold whitespace-nowrap">
                Athlete Arena
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            
            <div>
              <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Resources</h2>
              <ul className="text-body font-medium">
                <li className="mb-4">
                  <a href="https://flowbite.com/" className="hover:underline">Athlete Arena</a>
                </li>
                <li>
                  <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Follow us</h2>
              <ul className="text-body font-medium">
                <li className="mb-4">
                  <a href="https://github.com/themesberg/flowbite" className="hover:underline">Github</a>
                </li>
                <li>
                  <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Legal</h2>
              <ul className="text-body font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">Terms & Conditions</a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <hr className="my-6 border-default sm:mx-auto lg:my-8" />

        <div className="sm:flex sm:items-center sm:justify-between">
          
          <span className="text-sm text-body sm:text-center">
            © 2026 <a href="#" className="hover:underline">AthleteArena</a>. All Rights Reserved.
          </span>

          <div className="flex mt-4 sm:justify-center sm:mt-0">

            <a href="#" className="text-body hover:text-heading">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"/>
              </svg>
            </a>

          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer