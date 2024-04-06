import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

function SideBar() {
  const navigate = useNavigate();
  const onLogoutClick = () => {
    navigate("/logout");
  };

  return (
    <ul className="menu p-6 w-80 min-h-full bg-base-200 text-base-content">
      <li className="flex flex-row" onClick={onLogoutClick}>
        <div className="w-full text-red-600">
          <IoLogOutOutline size={22} />
          <a className="text-md">Log out</a>
        </div>
      </li>
    </ul>
  );
}

export default SideBar;
