import { GiHamburgerMenu } from "react-icons/gi";
import SideBar from "./SideBar";

function Drawer({ children }) {
  return (
    <div className="drawer">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="flex flex-row justify-start ml-12 mt-2 max-md:ml-5">
          <label
            htmlFor="my-drawer-4"
            className="drawer-button bg-transparent border-0 shadow-none mr-4 mt-4 cursor-pointer"
          >
            <GiHamburgerMenu size={25} />
          </label>
        </div>
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <SideBar />
      </div>
    </div>
  );
}

export default Drawer;
