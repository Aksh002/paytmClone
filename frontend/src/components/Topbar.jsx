import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Topbar({ name }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate=useNavigate()

  // Toggles the dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className="shadow-md">
      <div className="flex justify-between mx-4 mb-4 mt-2">
        <div className="mt-3">PayTm App</div>

        <div className="relative flex items-center space-x-4 mb-2">
          {/* User greeting */}
          <div>Hello {name}</div>

          {/* User avatar that toggles dropdown */}
          <div
            className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <span className="text-xl text-gray-800 font-semibold">{name[0]}</span>
          </div>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-44 w-48 bg-white rounded-md shadow-lg py-2 z-50">
              {/* Adjust `mt-12` to control how far below the top bar the dropdown appears */}
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => alert('Update Data Clicked')}
              >
                Update Data
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() =>{
                    localStorage.removeItem("token")
                    navigate("/signup") 
                }}
              >
                Ceate Account
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                    localStorage.removeItem("token")
                    navigate("/signin")              
                }
                }
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
