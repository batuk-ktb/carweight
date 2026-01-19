"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import RDsensor from "@/components/puu/rdSensor";
import Bracket from "@/components/puu/bracket";
import CarHead from "@/components/puu/carHead";
import Trailer from "@/components/puu/trailer";
import RadioButton from "@/components/RadioButton"
import axios from "axios";
import { url } from "inspector";
import { send } from "process";

export type OperatorStatus = "on" | "off";

type CameraGroup = {
  [key: `cam${number}`]: string;
};

const ipCameraList: Record<number, CameraGroup> = {
  1: {
    cam1: "172.16.92.21",
    cam2: "172.16.92.25",
    cam3: "172.16.92.22",
    cam4: "172.16.92.26",
    cam5: "172.16.92.23",
    cam6: "172.16.92.27",
    cam7: "172.16.92.24",
    cam8: "172.16.92.28",
  },
  2: {
    cam1: "172.16.92.36",
    cam2: "172.16.92.40",
    cam3: "172.16.92.37",
    cam4: "172.16.92.41",
    cam5: "172.16.92.38",
    cam6: "172.16.92.42",
    cam7: "172.16.92.39",
    cam8: "172.16.92.43",
  },
  3: {
    cam1: "172.16.92.52",
    cam2: "172.16.92.56",
    cam3: "172.16.92.53",
    cam4: "172.16.92.57",
    cam5: "172.16.92.54",
    cam6: "172.16.92.58",
    cam7: "172.16.92.55",
    cam8: "172.16.92.59",
  },
  4: {
    cam1: "172.16.92.68",
    cam2: "172.16.92.72",
    cam3: "172.16.92.69",
    cam4: "172.16.92.73",
    cam5: "172.16.92.70",
    cam6: "172.16.92.74",
    cam7: "172.16.92.71",
    cam8: "172.16.92.75",
  },
  5: {
    cam1: "172.16.92.84",
    cam2: "172.16.92.88",
    cam3: "172.16.92.85",
    cam4: "172.16.92.89",
    cam5: "172.16.92.86",
    cam6: "172.16.92.90",
    cam7: "172.16.92.87",
    cam8: "172.16.92.91",
  },
};

export default function PuuPage() {
  const params = useParams();
  const rawId = params?.id;

  // хамгаалалт
  if (!rawId || Array.isArray(rawId)) {
    return null; // эсвэл error UI
  }

  const id = Number(rawId);
  const [data, setData] = useState<any>(null);
  const [loader, setLoader] = useState(false);

  const [operatorMode, setOperatorMode] = useState<OperatorStatus>("off");
  const [red, setRed] = useState(false)
  const [yellow, setYellow] = useState(false)
  const [green, setGreen] = useState(false)

  function int16PairToFloat(high: number, low: number): number {
  // Combine high and low into 32-bit unsigned integer
  const combined: number = (high << 16) | low;

  // Create an ArrayBuffer to store the 32-bit value
  const buffer: ArrayBuffer = new ArrayBuffer(4);
  const view: DataView = new DataView(buffer);

  // Set the 32-bit unsigned int in big-endian
  view.setUint32(0, combined, false); // false = big-endian

  // Read as 32-bit float
  return view.getFloat32(0, false);
}

 useEffect(() => {
  if (!id) return;
  let isFirstLoad = true;
  const fetchAllData = async () => {
    if (isFirstLoad) setLoader(true);

    try {
      const [
        allInfo,
        // rfidRes,
        // lightRes,
        // lprRes,
        cam1Res,
        cam2Res,
        cam3Res,
        cam4Res,
        cam5Res,
        cam6Res,
        cam7Res,
        cam8Res,
      ] = await Promise.all([
        axios.get(`http://127.0.0.1:30511/read/3/${29 + (parseInt(id.toString())-1) * 30}/30`),
        // axios.get(`/api/puu/${id}/rfid`),
        // axios.get(`/api/puu/${id}/light`),
        // axios.get(`/api/puu/${id}/lpr`),
        axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
      ]);

      // Data-г default утгатай болгох
      setData({
        allInfo:allInfo.data || null,
        id: Number(id),
        // rfid: rfidRes?.data?.rfid || null,
        barrier1:allInfo?.data[1],
        barrier2:allInfo?.data[2],
        barrier3:allInfo?.data[3],
        barrier4:allInfo?.data[4],
        // lpr: lprRes?.data?.lpr || null,
        cam1: cam1Res?.data?.container || null,
        cam2: cam2Res?.data?.container || null,
        cam3: cam3Res?.data?.container || null,
        cam4: cam4Res?.data?.container || null,
        cam5: cam5Res?.data?.container || null,
        cam6: cam6Res?.data?.container || null,
        cam7: cam7Res?.data?.container || null,
        cam8: cam8Res?.data?.container || null,
      });
      setRed(allInfo?.data[7] === 1 )
      setYellow(allInfo?.data[6] === 1)
      setGreen(allInfo?.data[5] === 1)
    } catch (error) {
      console.error("PUU API error:", error);
      // Error гарвал хоосон эсвэл default data
    } finally {
      if (isFirstLoad) setLoader(false);
      if (isFirstLoad) isFirstLoad = false;
    }
  };

  fetchAllData();
  const interval = setInterval(fetchAllData, 5000); // 5000ms = 5 sec

    // 4. component unmount болох үед clean-up хийх
    return () => clearInterval(interval);

}, [id]);


  if (loader) {
    return <div>
      <Loader></Loader>
    </div >
  }

  async function sendSmallData(value: any) {
  try {
    const payload = {
    "reg_addr": 12,
    "reg_value": value
  }

    const res = await axios.post(
      "http://127.0.0.1:30511/write/", // Django endpoint
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("POST Response:", res.data);
  } catch (err) {
    console.error("POST Error:", err);
  }
}

  return (
    <div >
      <div className="w-full flex justify-center items-center">
        <h1>Puu {id}</h1>
      </div>
      <div className="w-full flec- justify-end items-center">
        <RadioButton value={operatorMode} onChange={setOperatorMode}
      /> 
      </div>
      <div className="flex mt-4 justify-center items-center">
        {/* ===== LEFT (LIGHT STATUS) ===== */}
          <div className="flex flex-col gap-3 items-center">
            <p className="text-sm text-slate-600">
              Гэрлийн төлөв
            </p>

            <div className="flex flex-col gap-2">
              <div
                onClick={() => {
                  if (operatorMode === "on") {
                    setGreen(!green)
                    sendSmallData(green ? 1: 0); 
                    }
                }}
                className={`w-4 h-4 rounded-full cursor-pointer
                  ${green
                    ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                    : "bg-slate-300"}
                  ${operatorMode === "off" ? "opacity-40 cursor-not-allowed" : ""}
                `}
              />

              <div
                  onClick={() => {
                    if (operatorMode === "on") {setYellow(!yellow) , sendSmallData(yellow ? 1: 0); }
                  }}
                  className={`w-4 h-4 rounded-full cursor-pointer
                    ${yellow
                      ? "bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.6)]"
                      : "bg-slate-300"}
                    ${operatorMode === "off" ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                />

              <div
                onClick={() => {
                  if (operatorMode === "on") {setRed(!red), sendSmallData(red ? 1: 0);}
                }}
                className={`w-4 h-4 rounded-full cursor-pointer
                  ${red
                    ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                    : "bg-slate-300"}
                  ${operatorMode === "off" ? "opacity-40 cursor-not-allowed" : ""}
                `}
              />

            </div>
          </div>
        <div className="flex flex-col justify-center items-center mt-4">
          <div className="flex justify-between items-center mb-2 w-[50vw]">
            {/* deed heseg 2 heseg medregchuud */}
            <div className=" flex justify-center items-end">
              <RDsensor status = {data?.barrier1} />
              <Bracket />
              <RDsensor status = {data?.barrier2} />
            </div>
            <div className=" flex justify-center items-end">
              <RDsensor status = {data?.barrier3} />
              <Bracket />
              <RDsensor status = {data?.barrier4}/>
            </div>
          </div>
          <div className="flex ">
            {/* suuri heseg */}
            <div className="w-[100px] h-[30px] bg-blue-500 [clip-path:polygon(0_100%,100%_100%,100%_0)] transition-transform duration-300 hover:scale-105" />
            <div className="w-[50vw] h-[30px] bg-blue-500 [clip-path:polygon(0_0,0_100%,100%_100%,100%_0)] transition-transform duration-300 hover:scale-105">
              {int16PairToFloat(data?.allInfo[22], data?.allInfo[21])}
              </div> 
            <div className="w-[100px] h-[30px] bg-blue-500 [clip-path:polygon(0_0,0_100%,100%_100%)] transition-transform duration-300 hover:scale-105" />
          </div>
        </div>
        <div>
          <p>RFID: {data?.rfid}</p>
        </div>
      </div>
      <div className=" flex justify-center items-center gap-1 py-4 mt-10">
        {/* mashin bolood camera heseg */}
        <CarHead data={data} />
        <Trailer data={{ cam1: data?.cam1, cam2: data?.cam2 }} />
        <div className="flex gap-2">
          <Trailer data={{ cam1: data?.cam3, cam2: data?.cam4 }} />
          <Trailer data={{ cam1: data?.cam5, cam2: data?.cam6 }} />
        </div>
        <Trailer data={{ cam1: data?.cam7, cam2: data?.cam8 }} />
      </div>
    </div>
  );
}