"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import RDsensor from "@/components/puu/rdSensor";
import Bracket from "@/components/puu/bracket";
import CarHead from "@/components/puu/carHead";
import Trailer from "@/components/puu/trailer";
import RadioButton from "@/components/RadioButton"
import ToggleButton from "@/components/twoWayButton";
import axios from "axios";
import { url } from "inspector";
import { send } from "process";

import Header from '@/components/dashboard/Header';
import ControlPanel from '@/components/dashboard/ControlPanel';
import WeightDisplay from '@/components/dashboard/WeightDisplay';
import StatsPanel from '@/components/dashboard/StatsPanel';
import CameraView from '@/components/dashboard/CameraView';
import TransactionTable, { Transaction } from '@/components/dashboard/TransactionTable';
import TruckVisualization from '@/components/dashboard/TruckVisualization';
import NewTruckModal, { TruckFormData } from '@/components/dashboard/NewTruckModal';
import SaveSuccessModal from '@/components/dashboard/SaveSuccessModal';


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

  const [operatorMode, setOperatorMode] = useState(false);
  const [entryGate, setEntryGate] = useState(false);
  const [exitGate, setExitGate] = useState(false);
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewTruckModal, setShowNewTruckModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSavedTransaction, setLastSavedTransaction] = useState<{ id: string; netWeight: number } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Current weighing session
  const [currentWeight, setCurrentWeight] = useState(44852);
  const [currentTruck, setCurrentTruck] = useState({
    plateNumber: '1234 УБХ',
    material: 'Coal',
    containerId1: '2565480',
    containerId2: '2565480',
    tareWeight: 15200
  });
  const [cameraSnapshots, setCameraSnapshots] = useState<{ c3: string | null; c4: string | null }>({
    c3: null,
    c4: null
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayTransactions = transactions.filter(t => t.timestamp.startsWith(today));
  const totalNetWeight = todayTransactions.reduce((sum, t) => sum + t.netWeight, 0) / 1000;
  const averageLoad = todayTransactions.length > 0 ? totalNetWeight / todayTransactions.length : 0;

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage));
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNewTruck = () => {
    setShowNewTruckModal(true);
  };

  const handleNewTruckSubmit = (data: TruckFormData) => {
    setCurrentTruck({
      plateNumber: data.plateNumber,
      material: data.material,
      containerId1: data.containerId1 || '0000000',
      containerId2: data.containerId2 || '0000000',
      tareWeight: data.tareWeight
    });
    setCurrentWeight(15200);
    setCameraSnapshots({ c3: null, c4: null });
    setShowNewTruckModal(false);
  };

  const handleCaptureCamera = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setCameraSnapshots({
        c3: 'captured',
        c4: 'captured'
      });
      setIsCapturing(false);
    }, 1500);
  };

  const handleSaveTransaction = async () => {
    setIsSaving(true);
    
    try {
      const netWeight = currentWeight - currentTruck.tareWeight;
      const containerWeight = Math.floor(netWeight / 4);
      
      const newTransaction: Transaction = {
        id:'1',
        plateNumber: currentTruck.plateNumber,
        material: currentTruck.material,
        grossWeight: currentWeight,
        tareWeight: currentTruck.tareWeight,
        netWeight: netWeight,
        containerWeights: {
          c1: containerWeight + 1,
          c2: containerWeight + 20,
          c3: containerWeight + 60,
          c4: containerWeight + 100
        },
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
      
      // Save to database
      // const savedTx = await saveTransaction(
      //   newTransaction,
      //   'admin',
      //   currentTruck.containerId1,
      //   currentTruck.containerId2
      // );
      
      // Update local state (real-time subscription will also update, but this is faster)
      // setTransactions(prev => {
      //   if (prev.some(t => t.id === savedTx.id)) return prev;
      //   return [savedTx, ...prev];
      // });
      
      // setLastSavedTransaction({ id: savedTx.id, netWeight: savedTx.netWeight });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert('Failed to save transaction. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
        // cam1Res,
        // cam2Res,
        // cam3Res,
        // cam4Res,
        // cam5Res,
        // cam6Res,
        // cam7Res,
        // cam8Res,
      ] = await Promise.all([
        axios.get(`http://127.0.0.1:30511/read/3/${(parseInt(id.toString())-1) * 30}/30`),
        // axios.get(`/api/puu/${id}/rfid`),
        // axios.get(`/api/puu/${id}/light`),
        // axios.get(`/api/puu/${id}/lpr`),
        // axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        // axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        // axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        // axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        // axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        // axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        // axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
        // axios.get(`http://127.0.0.1:8000/api/camera/?ipaddress=${ipCameraList[(id)]}`),
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
        // cam1: cam1Res?.data?.container || null,
        // cam2: cam2Res?.data?.container || null,
        // cam3: cam3Res?.data?.container || null,
        // cam4: cam4Res?.data?.container || null,
        // cam5: cam5Res?.data?.container || null,
        // cam6: cam6Res?.data?.container || null,
        // cam7: cam7Res?.data?.container || null,
        // cam8: cam8Res?.data?.container || null,
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
  // const interval = setInterval(fetchAllData, 5000); // 5000ms = 5 sec

  //   // 4. component unmount болох үед clean-up хийх
  //   return () => clearInterval(interval);

}, [id]);


  if (loader) {
    return <div>
      <Loader></Loader>
    </div >
  }

  async function sendSmallData(value: any) {
  try {
    const payload = {
    "reg_addr": 11,
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

async function controlPuuByRemote(name :string, value:any){
  let registerAdd = 11;
  let registerValue = value;
  if(name = "operatore"){
    registerAdd = 11
    registerValue = value ? 1 : 0
  }
  if(name = "entryGate"){
    registerAdd = value ? 9: 10;
    registerValue = 1
  }
  if(name = "exitGate"){
    registerAdd = value ? 7: 8;
    registerValue = 1
  }
  try {
    const payload = {
    "reg_addr": registerAdd,
    "reg_value": registerValue
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
  if(name = "entryGate"){
      setEntryGate(value)
    }
  if(name = "exitGate"){
    setExitGate(value)
  }
  if(name = "operator"){
    setOperatorMode(value)
  }
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
      {/* <div className=" flex justify-center items-center gap-1 py-4 mt-10">
        <CarHead data={data} />
        <Trailer data={{ cam1: data?.cam1, cam2: data?.cam2 }} />
        <div className="flex gap-2">
          <Trailer data={{ cam1: data?.cam3, cam2: data?.cam4 }} />
          <Trailer data={{ cam1: data?.cam5, cam2: data?.cam6 }} />
        </div>
        <Trailer data={{ cam1: data?.cam7, cam2: data?.cam8 }} />
      </div> */}

      <div className="min-h-screen bg-[#0d1117]">
        
        <div className="flex">
          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
            {/* Weight Display & System Diagram */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              {/* Left: System Diagram */}
              <div className="bg-[#1a2332] rounded-lg overflow-hidden shadow-xl flex gap-2">
                <ControlPanel
                    onNewTruck={handleNewTruck}
                    onCaptureCamera={handleCaptureCamera}
                    onSaveTransaction={handleSaveTransaction}
                    isCapturing={isCapturing}
                    isSaving={isSaving}
                  />
                                    
                  {/* Database sync indicator */}
                  <div className="mt-4 px-4 py-4">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-semibold tracking-wide text-slate-300">
                        Оператор төлөв
                      </p>

                      <ToggleButton
                        onText="ON"
                        offText="OFF"
                        value={operatorMode}
                        disabled={false}
                        onToggle={() => controlPuuByRemote("operator",!operatorMode)}
                      />
                    </div>

                    {/* Light Status */}
                    <div className="flex flex-col items-center gap-3 mt-2">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Гэрлийн төлөв
                      </p>

                      <div className="flex gap-4">

                        {/* GREEN */}
                        <div
                          onClick={() => {
                            if (operatorMode) {
                              setGreen(!green)
                              sendSmallData(!green ? 1 : 0)
                            }
                          }}
                          className={`w-5 h-5 rounded-full transition-all duration-200
                          ${green 
                            ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)] scale-110"
                            : "bg-slate-500/50"}
                          ${!operatorMode ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
                          `}
                        />

                        {/* YELLOW */}
                        <div
                          onClick={() => {
                            if (operatorMode) {
                              setYellow(!yellow)
                              sendSmallData(!yellow ? 1 : 0)
                            }
                          }}
                          className={`w-5 h-5 rounded-full transition-all duration-200
                          ${yellow 
                            ? "bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.9)] scale-110"
                            : "bg-slate-500/50"}
                          ${!operatorMode ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
                          `}
                        />

                        {/* RED */}
                        <div
                          onClick={() => {
                            if (operatorMode) {
                              setRed(!red)
                              sendSmallData(!red ? 1 : 0)
                            }
                          }}
                          className={`w-5 h-5 rounded-full transition-all duration-200
                          ${red 
                            ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] scale-110"
                            : "bg-slate-500/50"}
                          ${!operatorMode ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
                          `}
                        />

                      </div>
                    </div>
                    <div className="mt-4 px-3 py-2 bg-[#1a2332] rounded-lg text-white grid grid-cols-2 gap-2">
            
                      <div className="flex flex-col gap-2">
                        <p>Орох хаал</p>
                      <ToggleButton onText = "Нээх" offText="Хаах" value = {entryGate} disabled={!operatorMode} onToggle = {()=> controlPuuByRemote("entryGate",!entryGate)}/>
                      </div>
                      <div className="flex flex-col gap-2">
                      <p>Гарах хаалт</p>                   
                      <ToggleButton onText = "Нээх" offText="Хаах" value = {exitGate}  disabled={!operatorMode} onToggle = {()=> controlPuuByRemote("exitGate",!exitGate)}/>
                      </div>
                    </div>
                  </div>

                  
                  <div className="mt-6">
                    <StatsPanel
                      totalTransactions={todayTransactions.length}
                      totalNetWeight={totalNetWeight}
                      averageLoad={averageLoad}
                    />
                  </div>
              </div>
              {/* Right: Weight Display & Truck Visualization */}
              <div className="space-y-6">
                <div className="bg-[#1a2332] rounded-lg p-6 shadow-xl">
                  <WeightDisplay weight={int16PairToFloat(data?.allInfo[22], data?.allInfo[21])} isLive={true} />
                  
                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="bg-[#0d1117] rounded px-3 py-2">
                      <span className="text-gray-400 text-sm">Plate: </span>
                      <span className="text-white font-bold">{currentTruck.plateNumber}</span>
                    </div>
                    <div className="bg-[#0d1117] rounded px-3 py-2">
                      <span className="text-gray-400 text-sm">Material: </span>
                      <span className="text-white">{currentTruck.material}</span>
                    </div>
                    <div className="bg-[#0d1117] rounded px-3 py-2">
                      <span className="text-gray-400 text-sm">Tare: </span>
                      <span className="text-white font-mono">{currentTruck.tareWeight.toLocaleString()} kg</span>
                    </div>
                    <div className="bg-[#0d1117] rounded px-3 py-2">
                      <span className="text-gray-400 text-sm">Net: </span>
                      <span className="text-yellow-500 font-bold font-mono">
                        {(currentWeight - currentTruck.tareWeight).toLocaleString()} kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              
            </div>
            
            <div>
              <TruckVisualization 
                  containerId1={currentTruck.containerId1}
                  containerId2={currentTruck.containerId2}
                />
            </div>
            {/* Camera Views */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <CameraView 
                title="Container 3 - Side View" 
                cameraId="C3-2"
                snapshot={cameraSnapshots.c3}
                isCapturing={isCapturing}
              />
              <CameraView 
                title="Container 4 - Side View" 
                cameraId="C4-2"
                snapshot={cameraSnapshots.c4}
                isCapturing={isCapturing}
              />
            </div>
            
            {/* Transaction Table */}
            <TransactionTable
              transactions={paginatedTransactions}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </main>
        </div>
        
        {/* Modals */}
        <NewTruckModal
          isOpen={showNewTruckModal}
          onClose={() => setShowNewTruckModal(false)}
          onSubmit={handleNewTruckSubmit}
        />
      </div>
      
    </div>
  );
}