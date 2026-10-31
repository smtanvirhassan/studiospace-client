"use client";

import Link from "next/link";
import { BiCamera, BiFilm } from "react-icons/bi";
import { MdMovieFilter } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        {/* Creative illustration with film/camera icons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <BiFilm className="text-6xl text-indigo-300 animate-pulse" />
          <BiCamera className="text-7xl text-indigo-400" />
          <MdMovieFilter className="text-6xl text-indigo-300 animate-pulse" />
        </div>

        <h1 className="text-9xl font-bold text-indigo-500">404</h1>

        <h2 className="text-3xl font-bold mt-4">Oops! Studio Not Found</h2>

        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          The creative space you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="btn bg-indigo-600 hover:bg-indigo-700 text-white btn-lg mt-8"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
