import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { avatar } from "../../../assets/getAssets";
import { logout } from "../../../features/auth/authSlice";

const TopNav = () => {
  const { store } = useSelector((state) => state.auth);
  const { fileUrl } = store || {};
  const dispatch = useDispatch();
  return (
    <div className="navbar bg-primaryMainDarkest px-6 py-2">
      {/* top nav left */}
      <div className="flex-1 text-whiteHigh">
        <h1 className="text-2xl">
          <Link to="/">logo</Link>
        </h1>
      </div>
      {/* top nav right */}
      <div className="flex-none">
        {/* user avater */}
        <div className="dropdown dropdown-end ">
          <label
            tabIndex={3}
            className="btn btn-ghost btn-circle outline-none border-none avatar"
          >
            <div className="w-10 h-10 rounded-full">
              <img
                src={fileUrl || avatar}
                alt=""
                className="w-full object-cover bg-cover"
              />
            </div>
          </label>
          <ul
            tabIndex={3}
            className="menu menu-compact dropdown-content  items-center mt-3 shadow bg-whiteHigh rounded-box w-28  z-50 divide-y divide-whiteLow "
          >
            <li className="">
              <Link to="/store-profile" className=" active:bg-primaryMain">
                Profile
                {/* <span className="badge">New</span> */}
              </Link>
            </li>
            <li>
              <button
                onClick={() => dispatch(logout())}
                className="active:bg-primaryMain text-errorLightColor hover:text-errorLightColor"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
