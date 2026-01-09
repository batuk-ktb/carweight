"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [status, setStatus] = useState<boolean[]>([]);

  useEffect(() => {
    // sample status data
    setStatus([
      true, false, true, true, false, true, true, false, true, true,
      false, true, true, false, true, true, false, true, true, false,
      true, true, false, true,
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full flex justify-center items-start pt-6 px-4">
        <div className="flex flex-col md:flex-row max-w-[1200px] w-full gap-6">
          
          {/* Sidebar */}
          <div className="flex flex-col md:w-[150px] gap-1 bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Пүү Status</h2>
            {status.map((s, i) => (
              <Link key={i} href={`/puu/${i + 1}`}>
                <div className="flex gap-3 items-center p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div
                    className={`w-4 h-4 rounded-full shadow-inner ${
                      s
                        ? "bg-green-400 hover:bg-green-500"
                        : "bg-red-400 hover:bg-red-500"
                    } transition-colors`}
                  ></div>
                  <p className="text-sm font-medium text-gray-800">Пүү {i + 1}</p>
                </div>
              </Link>
            ))}
          </div>


          {/* Map Area */}
          <div className="flex-1 relative bg-white rounded-lg shadow-md p-4">
            <img
              src="/mine-map.jpg"
              alt="map"
              className="w-full aspect-video object-cover rounded-lg"
            />
            {status.map((s, i) => (
              <Link key={i} href={`/puu/${i + 1}`}>
                <div
                  className={`absolute w-6 h-6 ${s ? "bg-green-500" : "bg-red-500"} cursor-pointer`}
                  style={{
                    top: `${i * 25}px`,
                    left: `${i * 25}px`,
                    WebkitMaskImage: "url('/map-pin.png')",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "cover",
                    maskImage: "url('/map-pin.png')",
                    maskRepeat: "no-repeat",
                    maskSize: "cover",
                  }}
                  title={`Пүү ${i + 1} - ${s ? "Available" : "Unavailable"}`}
                ></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
