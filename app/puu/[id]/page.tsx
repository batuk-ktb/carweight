"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import RDsensor from "@/components/puu/rdSensor";
import Bracket from "@/components/puu/bracket";
import CarHead from "@/components/puu/carHead";
import Trailer from "@/components/puu/trailer";
import axios from "axios";
import { url } from "inspector";
export default function PuuPage() {
  const { id } = useParams(); // dynamic route param
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    
    // TODO id gaar ni api aa set-leed daraa ni data-g ni avna
    const data = {
      id: 1,
      rfid: '12341234',
      light: 'green', // green, orange, red
      lpr: 'LPR-1234',
      cam1: '134',
      cam2: '134',
      cam3: '1234',
      cam4: '1234',
      cam5: '134',
      cam6: '134',
      cam7: '1234',
      cam8: '1234',
    }
    setData(data)
    const webcamUrl =''// TODO here insert url web url
    axios
    .get(webcamUrl)
    .then((response) => {
      console.log("Success:", response.data);
      setData({...data,cam1:response?.data?.container})
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
  }, []);

  console.log(data);
  if (data === null) {
    return <div>
      <Loader></Loader>
    </div >
  }

  return (
    <div>
      <div className="w-full flex justify-center items-center">
        <h1>Puu {id}</h1>
      </div>
      <div className="flex mt-4">
        <div className="flex flex-col gap-2">
          <p>Гэрлийн төлөв</p>
          <div className="flex flex-col gap-2 items-center">
            <div className={`w-5 h-5 rounded-full ${data?.light === 'green' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`w-5 h-5 rounded-full ${data?.light === 'orange' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div className={`w-5 h-5 rounded-full ${data?.light === 'red' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-4">
          <div className="flex justify-between items-center mb-2 w-[50vw]">
            {/* deed heseg 2 heseg medregchuud */}
            <div className=" flex justify-center items-end">
              <RDsensor />
              <Bracket />
              <RDsensor />
            </div>
            <div className=" flex justify-center items-end">
              <RDsensor />
              <Bracket />
              <RDsensor />
            </div>
          </div>
          <div className="flex ">
            {/* suuri heseg */}
            <div className="w-[100px] h-[30px] bg-blue-500 [clip-path:polygon(0_100%,100%_100%,100%_0)] transition-transform duration-300 hover:scale-105" />
            <div className="w-[50vw] h-[30px] bg-blue-500 [clip-path:polygon(0_0,0_100%,100%_100%,100%_0)] transition-transform duration-300 hover:scale-105" />
            <div className="w-[100px] h-[30px] bg-blue-500 [clip-path:polygon(0_0,0_100%,100%_100%)] transition-transform duration-300 hover:scale-105" />
          </div>
        </div>
        <div>
          <p>RFID: {data?.rfid}</p>
        </div>
      </div>
      <div className="flex gap-1 py-4 mt-5">
        {/* mashin bolood camera heseg */}
        <CarHead data={data} />
        <Trailer data={{ cam1: data.cam1, cam2: data.cam2 }} />
        <div className="flex gap-2">
          <Trailer data={{ cam1: data.cam3, cam2: data.cam4 }} />
          <Trailer data={{ cam1: data.cam5, cam2: data.cam6 }} />
        </div>
        <Trailer data={{ cam1: data.cam7, cam2: data.cam8 }} />
      </div>
    </div>
  );
}