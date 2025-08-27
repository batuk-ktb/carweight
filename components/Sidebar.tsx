"use client";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white px-3 py-2 rounded"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <Link href="/" className="hover:bg-gray-700 px-3 py-2 rounded">
            Home
          </Link>
          <Link href="/services" className="hover:bg-gray-700 px-3 py-2 rounded">
            Services
          </Link>
          <Link href="/about" className="hover:bg-gray-700 px-3 py-2 rounded">
            About
          </Link>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
