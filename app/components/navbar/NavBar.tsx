'use client'
import { InformationCircleIcon } from "@heroicons/react/24/solid"
import About from "./about.mdx"

const NavBar = () => {
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1 px-2 font-bold">
          D&D Map
        </div>
        <button className="btn" onClick={()=>window.about_modal.showModal()}>
          <InformationCircleIcon className="h-6 w-6" />
        </button>
      </div>
      <dialog id="about_modal" className="modal">
        <form method="dialog" className="modal-box">
          <About />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default NavBar