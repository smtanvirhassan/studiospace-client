"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Aperture } from "lucide-react";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about-us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    setDropdownOpen(false);
    toast.success("Logged out successfully");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    `font-medium transition-colors hover:text-indigo-500 ${
      isActive(href) ? "border-b-2 border-indigo-500 text-indigo-500" : ""
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-base-100/95 backdrop-blur shadow-sm">
      <div className="navbar max-w-7xl mx-auto px-4">
        {/* Left: Logo */}
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Aperture className="text-indigo-500 size-7" />
            <span>StudioSpace</span>
          </Link>
        </div>

        {/* Center: Nav Links (desktop) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right */}
        <div className="navbar-end flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            className="btn btn-ghost btn-circle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <FaSun className="text-lg" />
            ) : (
              <FaMoon className="text-lg" />
            )}
          </button>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <div
                  className="avatar cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-10 rounded-full ring ring-indigo-500 ring-offset-base-100 ring-offset-2">
                    <img
                      src={user.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                      alt="User avatar"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {dropdownOpen && (
                  <ul className="menu dropdown-content bg-base-200 rounded-box w-56 p-2 shadow-lg absolute right-0 top-14 z-50">
                    <li className="menu-title px-4 py-2 font-semibold">
                      {user.displayName || "User"}
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                      <Link href="/" onClick={() => setDropdownOpen(false)}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/add-studio" onClick={() => setDropdownOpen(false)}>
                        Add New Studio
                      </Link>
                    </li>
                    <li>
                      <Link href="/my-listings" onClick={() => setDropdownOpen(false)}>
                        My Studio Listings
                      </Link>
                    </li>
                    <li>
                      <Link href="/my-bookings" onClick={() => setDropdownOpen(false)}>
                        My Bookings
                      </Link>
                    </li>
                    <div className="divider my-0"></div>
                    <li>
                      <button onClick={handleLogout} className="text-error">
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white border-none"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="btn btn-ghost lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? (
              <IoClose className="text-2xl" />
            ) : (
              <HiMenuAlt3 className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-base-100 border-t border-base-300 pb-4">
          <ul className="menu px-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={linkClass(link.href)}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="divider my-1 px-4"></div>

          <div className="px-4 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={user.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                        alt="User avatar"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <span className="font-semibold">{user.displayName || "User"}</span>
                </div>
                <Link
                  href="/"
                  className="btn btn-ghost btn-sm justify-start"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/add-studio"
                  className="btn btn-ghost btn-sm justify-start"
                  onClick={() => setMobileOpen(false)}
                >
                  Add New Studio
                </Link>
                <Link
                  href="/my-listings"
                  className="btn btn-ghost btn-sm justify-start"
                  onClick={() => setMobileOpen(false)}
                >
                  My Studio Listings
                </Link>
                <Link
                  href="/my-bookings"
                  className="btn btn-ghost btn-sm justify-start"
                  onClick={() => setMobileOpen(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="btn btn-error btn-sm btn-outline justify-start"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white border-none"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
