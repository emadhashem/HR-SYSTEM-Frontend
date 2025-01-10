import React, { useEffect, useState } from "react";
import { FaAlignJustify, FaXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { authenticatedUser } from "../services/auth/authenticated-user";
import { Button } from "../components/ui/button";
import { LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthed(authenticatedUser.isAuthenticated());
  }, []);

  const navigationPages = [
    {
      href: "/",
      label: "Dashboard",
    },
    {
      href: "/employees",
      label: "Employees",
    },
    {
      href: "/attendance",
      label: "Attendance",
    },
  ];

  const logout = () => {
    authenticatedUser.logout();
    setIsAuthed(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-3xl">
          HR SYSTEM
        </Link>

        <div className="hidden md:flex gap-x-10">
          {isAuthed ? (
            <>
              {navigationPages.map((page, index) => (
                <Link
                  key={index}
                  to={page.href}
                  className="text-gray-300 hover:text-white text-2xl"
                >
                  {page.label}
                </Link>
              ))}
              <Button
                size={"icon"}
                variant={"outline"}
                className="bg-black text-white border-0"
                onClick={logout}
              >
                {" "}
                <LogOut className="font-extrabold" />{" "}
              </Button>
            </>
          ) : (
            <Link
              to={"/login"}
              className="text-gray-300 hover:text-white text-2xl"
            >
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"} // Accessibility
          >
            {isMobileMenuOpen ? (
              <FaXmark size={30} />
            ) : (
              <FaAlignJustify size={30} />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-700 mt-2 p-2 rounded">
          {isAuthed ? (
            <>
              {navigationPages.map((page, index) => (
                <Link
                  key={index}
                  to={page.href}
                  className="block text-gray-300 hover:text-white py-1"
                >
                  {page.label}
                </Link>
              ))}
            </>
          ) : (
            <Link
              to={"/login"}
              className="text-gray-300 hover:text-white text-2xl"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
