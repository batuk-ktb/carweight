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

export type OperatorStatus = "on" | "off";

export default function PuuPage() {
  const { id } = useParams(); // dynamic route param
  const [data, setData] = useState<any>(null);
  const [loader, setLoader] = useState(false);

  const [status, setStatus] = useState<OperatorStatus>("off");
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

  const fetchAllData = async () => {
    setLoader(true);

    try {
      const [
        allInfo,
        // rfidRes,
        // lightRes,
        // lprRes,
        // cam1Res,
        // cam2Res,
        // cam3Res,
        // cam4Res,
        // cam5Res,
        // cam6Res,
        // cam7Res,
        // cam8Res,
      ] = await Promise.all([
        axios.get(`http://127.0.0.1:30511/read/3/${29 + (parseInt(id.toString())-1) * 30}/30`),
        // axios.get(`/api/puu/${id}/rfid`),
        // axios.get(`/api/puu/${id}/light`),
        // axios.get(`/api/puu/${id}/lpr`),
        // axios.get(`/api/puu/${id}/cam/1`),
        // axios.get(`/api/puu/${id}/cam/2`),
        // axios.get(`/api/puu/${id}/cam/3`),
        // axios.get(`/api/puu/${id}/cam/4`),
        // axios.get(`/api/puu/${id}/cam/5`),
        // axios.get(`/api/puu/${id}/cam/6`),
        // axios.get(`/api/puu/${id}/cam/7`),
        // axios.get(`/api/puu/${id}/cam/8`),
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
        // cam1: cam1Res?.data?.value || null,
        // cam2: cam2Res?.data?.value || null,
        // cam3: cam3Res?.data?.value || null,
        // cam4: cam4Res?.data?.value || null,
        // cam5: cam5Res?.data?.value || null,
        // cam6: cam6Res?.data?.value || null,
        // cam7: cam7Res?.data?.value || null,
        // cam8: cam8Res?.data?.value || null,
      });
      setRed(allInfo?.data[7] === 1 )
      setYellow(allInfo?.data[6] === 1)
      setGreen(allInfo?.data[5] === 1)
    } catch (error) {
      console.error("PUU API error:", error);
      // Error гарвал хоосон эсвэл default data
    } finally {
      setLoader(false);
    }
  };

  fetchAllData();
}, [id]);


  if (loader) {
    return <div>
      <Loader></Loader>
    </div >
  }

  return (
    <div >
      <div className="w-full flex justify-center items-center">
        <h1>Puu {id}</h1>
      </div>
      <div className="w-full flec- justify-end items-center">
        <RadioButton value={status}
        onChange={setStatus}
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
                className={`w-4 h-4 rounded-full
                ${green
                  ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                  : "bg-slate-300"}`}
              />
              <div
                className={`w-4 h-4 rounded-full
                ${yellow
                  ? "bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.6)]"
                  : "bg-slate-300"}`}
              />
              <div
                className={`w-4 h-4 rounded-full
                ${red
                  ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                  : "bg-slate-300"}`}
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