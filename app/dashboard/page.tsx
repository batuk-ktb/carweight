"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [status, setStatus] = useState<boolean[]>([])
  useEffect(() => {
    setStatus([true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true,])
  }, [])

  return (
    <div>
      <Navbar />
      <div className="w-full flex justify-center items-center pt-2">
        <div className="flex max-w-[1100px]">
          <div className="flex flex-col p-1 w-[100px]">
            {
              status.map((s, i) => (
                <Link key={i} href={`/puu/${i + 1}`}>
                  <div className="flex gap-2 justify-center items-start text-m" >
                    <div className={`rounded-full w-3 h-3 ${s ? "bg-green-500" : "bg-red-500"}`}></div>
                    <p>Пүү {i + 1}</p>
                  </div>
                </Link>
              ))
            }
          </div>
          <div className="flex w-full justify-center ">
            {/* //TODO zurag taviad teren deeer nersiin bairshiliig haruulna */}
            <div className="relative w-full">
              <div className="w-full max-w-[800px]">
                <img
                  src="/mine-map.jpg"
                  alt="pin"
                  className="w-full aspect-video object-cover rounded-lg"
                />

              </div>


              {
                status.map((s, i) => (
                  <Link key={i} href={`/puu/${i + 1}`}>
                    <div className={`absolute w-5 h-5 ${s ? "bg-green-500" : "bg-red-500"}`} style={{
                      top: `${i * 20}px`,
                      left: `${i * 20}px`,
                      WebkitMaskImage: "url('/map-pin.png')",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskSize: "cover",
                      maskImage: "url('/map-pin.png')",
                      maskRepeat: "no-repeat",
                      maskSize: "cover",
                    }}>
                    </div>
                  </Link>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
