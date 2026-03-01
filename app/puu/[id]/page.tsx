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

import Navbar from "@/components/Navbar";
import Header from '@/components/dashboard/Header';
import ControlPanel from '@/components/dashboard/ControlPanel';
import WeightDisplay from '@/components/dashboard/WeightDisplay';
import StatsPanel from '@/components/dashboard/StatsPanel';
import CameraView from '@/components/dashboard/CameraView';
import TransactionTable, { Transaction } from '@/components/dashboard/TransactionTable';
import TruckVisualization from '@/components/dashboard/TruckVisualization';
import NewTruckModal, { TruckFormData } from '@/components/dashboard/NewTruckModal';
import SaveSuccessModal from '@/components/dashboard/SaveSuccessModal';

import {ipCameraList} from '@/lib/utils';
import { Tag } from "lucide-react";
const MODBUS_SERVER_URL = process.env.NEXT_PUBLIC_MODBUS_SERVER_URL;
const CAMERA_SERVER_URL = process.env.NEXT_PUBLIC_CAMERA_SERVER_URL;
const TAG_READER_URL = process.env.NEXT_PUBLIC_TAG_READER_URL;

const sleep = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));

export default function PuuPage() {
  const params = useParams();
  const rawId = params?.id;

  if (!rawId || Array.isArray(rawId)) {
    return null;
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
    const combined: number = (high << 16) | low;
    const buffer: ArrayBuffer = new ArrayBuffer(4);
    const view: DataView = new DataView(buffer);
    view.setUint32(0, combined, false);
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

  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage));
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNewTruck = () => setShowNewTruckModal(true);

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

  const handleCaptureCamera = async() => {
    const baseAdd = (parseInt(id.toString())-1) * 30
        let registerAdd1 = baseAdd + 13;
        let registerValue1 =1;
        const payload1 = { "reg_addr": registerAdd1, "reg_value": registerValue1 }
        await axios.post(`${MODBUS_SERVER_URL}/write/`, payload1, { headers: { "Content-Type": "application/json" } });
  };

  const handleSaveTransaction = async () => {
    setIsSaving(true);
    try {
      const bodyData ={
          conR1:{
            id:data?.cam1?.container,
            date:data?.cam1?.date,
            control_digit:data?.cam1?.controldigit,
            readconfidence:data?.cam1?.readconfidence
          },
          conL1:{
            id:data?.cam2?.container,
            date:data?.cam2?.date,
            control_digit:data?.cam2?.controldigit,
            readconfidence:data?.cam2?.readconfidence
          },
          conR2:{
            id:data?.cam3?.container,
            date:data?.cam3?.date,
            control_digit:data?.cam3?.controldigit,
            readconfidence:data?.cam3?.readconfidence
          },
          conL2:{
            id:data?.cam4?.container,
            date:data?.cam4?.date,
            control_digit:data?.cam4?.controldigit,
            readconfidence:data?.cam4?.readconfidence
          },
          conR3:{
            id:data?.cam5?.container,
            date:data?.cam5?.date,
            control_digit:data?.cam5?.controldigit,
            readconfidence:data?.cam5?.readconfidence
          },
          conL3:{
            id:data?.cam6?.container,
            date:data?.cam6?.date,
            control_digit:data?.cam6?.controldigit,
            readconfidence:data?.cam6?.readconfidence
          },
          conR4:{
            id:data?.cam7?.container,
            date:data?.cam7?.date,
            control_digit:data?.cam7?.controldigit,
            readconfidence:data?.cam7?.readconfidence
          },
          conL4:{
            id:data?.cam8?.container,
            date:data?.cam8?.date,
            control_digit:data?.cam8?.controldigit,
            readconfidence:data?.cam8?.readconfidence
          },
          Weight: 10 * int16PairToFloat(parseInt(data?.allInfo[21]), parseInt(data?.allInfo[20])),
          tag:{
            id:data?.rfid?.tag,
            date:data?.rfid?.date
          }
      }
      const url = "https://your-api-url.com/endpoint" // JSON ETT server URL
      const response = await axios.post(
        url, 
        bodyData, // write data
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if(response){
        //TODO hed heden yum irne tegeed yum hiine
        // 0 - heviin 
        // 1 - yavj bolno 
        // 2 - yavj bolohgui
        const baseAdd = (parseInt(id.toString())-1) * 30
        let registerAdd1 = baseAdd + 13;
        let registerValue1 = parseInt(response?.data?.authentication);
        const payload1 = { "reg_addr": registerAdd1, "reg_value": registerValue1 }
        await axios.post(`${MODBUS_SERVER_URL}/write/`, payload1, { headers: { "Content-Type": "application/json" } });
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert('Failed to save transaction. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  console.log("-", MODBUS_SERVER_URL, CAMERA_SERVER_URL)

  useEffect(() => {
    if (!id) return;
    let isFirstLoad = true;
    const fetchAllData = async () => {
      if (isFirstLoad) setLoader(true);
      try {
        
        const requests = [];

        // modbus
        requests.push(
          axios.get(`${MODBUS_SERVER_URL}/read/3/${(id - 1) * 30}/30`)
        );

        // rfid
        requests.push(
          axios.get(`${CAMERA_SERVER_URL}/api/tagreader/?ipaddress=${ipCameraList[id].rfid}`)
        );
        if(id < 6){
          // cameras 1-8
          for (let i = 1; i <= 8; i++) {
            requests.push(
              axios.get(`${CAMERA_SERVER_URL}/api/camera/?ipaddress=${ipCameraList[id][`cam${i}`]}`)
            );
          }
        }

        // helper
        const safeData = (r:any) =>
          r.status === "fulfilled" ? r.value.data : null;

        // execute

        const [
          allInfo = null,
          rfidRes = null,
          cam1Res = null, cam2Res = null, cam3Res = null, cam4Res = null,
          cam5Res = null, cam6Res = null, cam7Res = null, cam8Res = null,
        ] = (await Promise.allSettled(requests)).map(safeData);

        setData({
          allInfo: allInfo || null,
          id: Number(id),
          rfid: rfidRes?.data || null,
          barrier1: allInfo[1],
          barrier2: allInfo[2],
          barrier3: allInfo[3],
          barrier4: allInfo[4],
          cam1: cam1Res || null,
          cam2: cam2Res || null,
          cam3: cam3Res || null,
          cam4: cam4Res || null,
          cam5: cam5Res || null,
          cam6: cam6Res || null,
          cam7: cam7Res || null,
          cam8: cam8Res || null,
        });
        setRed(allInfo[6] === 1)
        setYellow(allInfo[5] === 1)
        setGreen(allInfo[4] === 1)
        setOperatorMode(allInfo[11] === 1)
        setEntryGate(allInfo[9] ==1)
        setExitGate(allInfo[7]==1)
      } catch (error) {
        console.error("PUU API error:", error);
      } finally {
        if (isFirstLoad) setLoader(false);
        if (isFirstLoad) isFirstLoad = false;
      }
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 2000);
    return () => clearInterval(interval);
  }, [id]);

  if (loader) {
    return <div><Loader /></div>;
  }

  async function controlPuuByRemote(name: string, value: any) {
    const baseAdd = (parseInt(id.toString())-1) * 30
    if (name == "entryGate" || name == "exitGate") {
      let registerAdd1 = 1
      let registerValue1 = 0
      if (name == "entryGate") { registerAdd1 = value ? baseAdd + 10 : baseAdd + 9; registerValue1 = 0 }
      if (name == "exitGate")  { registerAdd1 = value ? baseAdd + 8  : baseAdd + 7; registerValue1 = 0 }
      const payload1 = { "reg_addr": registerAdd1, "reg_value": registerValue1 }
      await axios.post(`${MODBUS_SERVER_URL}/write/`, payload1, { headers: { "Content-Type": "application/json" } });
    }
    let registerAdd = 11;
    let registerValue = value;
    if (name == "green")    { registerAdd = baseAdd + 18;  registerValue = value ? 1 : 0 }
    if (name == "red")      { registerAdd = baseAdd + 17;  registerValue = value ? 1 : 0 }
    if (name == "operator") { registerAdd = baseAdd + 11; registerValue = value ? 1 : 0 }
    if (name == "entryGate") { registerAdd = value ? baseAdd + 9  : baseAdd + 10; registerValue = 1 }
    if (name == "exitGate")  { registerAdd = value ? baseAdd + 7  : baseAdd + 8;  registerValue = 1 }
    try {
      const payload = { "reg_addr": registerAdd, "reg_value": registerValue }
      const res = await axios.post(`${MODBUS_SERVER_URL}/write/`, payload, { headers: { "Content-Type": "application/json" } });
      if (res) {
        if (name == "entryGate") setEntryGate(value)
        if (name == "exitGate")  setExitGate(value)
        if (name == "operator")  setOperatorMode(value)
        if (name == "green")     setGreen(value)
        if (name == "red")       setRed(value)
      }
    } catch (err) {
      console.error("POST Error:", err);
    }
  }

  return (
    <div>
      <div className="min-h-screen bg-[#0d1117]">

        {/* ── Navbar ── */}
        <Navbar />

        <div className="flex">
          {/* Main Content — paddingTop: 80 to clear the fixed 56px navbar */}
          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden" style={{ paddingTop: 80 }}>

            {/* PUU Header */}
            <div
              className="mb-6"
              style={{
                fontFamily: "'Courier New', monospace",
                background: "linear-gradient(160deg, #0d1117 0%, #0a1628 60%, #060d1a 100%)",
                borderRadius: "16px",
                padding: "16px 24px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 0 60px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
              {[
                { top: 0, left: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "12px 0 0 0" },
                { top: 0, right: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 12px 0 0" },
                { bottom: 0, left: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 0 12px" },
                { bottom: 0, right: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 12px 0" },
              ].map((s, i) => <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />)}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>WIM — Vehicle Terminal</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1 }}>
                  АВТОЖИНГИЙН СИСТЕМ{" "}
                  <span style={{ color: "rgba(255,255,255,1)" }}>
                    {Number(id) >= 1  && Number(id) <= 5  ? `Оролтын пүү: ${Number(id)}`
                    : Number(id) >= 6  && Number(id) <= 10 ? `Гаралтын пүү: ${Number(id) - 5}`
                    : Number(id) >= 11 && Number(id) <= 14 ? `Зүүн хяналтын пүү: ${Number(id) - 10}`
                    : Number(id) >= 15 && Number(id) <= 16 ? `Баруун хяналтын пүү: ${Number(id) - 14}`
                    : id}
                  </span>
                </div>
                <div style={{ width: 60, height: 2, borderRadius: 2, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />
              </div>
            </div>

            {/* Weight Display & Control Panel */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

              {/* Left column: Control Panel + Weight Display stacked */}
              <div className="flex flex-col gap-6">

                {/* Control Panel */}
                <div style={{ fontFamily: "'Courier New', monospace", background: "linear-gradient(160deg, #0d1117 0%, #0a1628 60%, #060d1a 100%)", borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "16px" }}>
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                  {[
                    { top: 0, left: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "12px 0 0 0" },
                    { top: 0, right: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 12px 0 0" },
                    { bottom: 0, left: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 0 12px" },
                    { bottom: 0, right: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 12px 0" },
                  ].map((s, i) => <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />)}

                  <ControlPanel
                    onNewTruck={handleNewTruck}
                    onCaptureCamera={handleCaptureCamera}
                    onSaveTransaction={handleSaveTransaction}
                    isCapturing={isCapturing}
                    isSaving={isSaving}
                  />

                  <div className="flex flex-col gap-4 flex-1 relative z-10">
                    {/* Operator Status */}
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 14px" }}>
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div style={{ fontSize: 8, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 2 }}>Status</div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>Оператор төлөв</p>
                        </div>
                        <ToggleButton onText="ON" offText="OFF" value={operatorMode} disabled={false} onToggle={() => controlPuuByRemote("operator", !operatorMode)} />
                      </div>
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                        <p style={{ fontSize: 15, letterSpacing: "0.25em", color: "rgba(255, 255, 255, 0.61)", textTransform: "uppercase", marginBottom: 10 }}>Гэрлийн төлөв</p>
                        <div className="flex gap-4 justify-center">
                          {[
                            { key: "green",  label: "GREEN",  active: green,  activeClass: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]" },
                            { key: "yellow", label: "YELLOW", active: yellow, activeClass: "bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.9)]" },
                            { key: "red",    label: "RED",    active: red,    activeClass: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" },
                          ].map((light) => (
                            <div key={light.key} className="flex flex-col items-center gap-2">
                              <div
                                onClick={() => { if (operatorMode) controlPuuByRemote(light.key, !light.active); }}
                                className={`w-5 h-5 rounded-full transition-all duration-200 ${light.active ? `${light.activeClass} scale-110` : "bg-slate-500/50"} ${!operatorMode ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-110"}`}
                              />
                              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>{light.label}</span>
                            </div>
                          ))}
                        </div>
                        {/* position auto local */}
                        <div className="text-white">
                          {data?.allInfo[15] == 1 &&
                            <div>
                              pos Auto
                            </div>
                          }
                          {data?.allInfo[16] == 1 &&
                            <div>
                              pos Local
                            </div>
                          }
                        </div>
                      </div>
                    </div>

                    {/* Gates */}
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 14px" }}>
                      <div style={{ fontSize: 8, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 10 }}>Gate Control</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Орох хаалт</p>
                          <ToggleButton onText="Хаах" offText="Нээх" value={entryGate} disabled={!operatorMode} onToggle={() => controlPuuByRemote("entryGate", !entryGate)} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Гарах хаалт</p>
                          <ToggleButton onText="Хаах" offText="Нээх" value={exitGate} disabled={!operatorMode} onToggle={() => controlPuuByRemote("exitGate", !exitGate)} />
                        </div>
                      </div>
                    </div>

                    {/* Sensors */}
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 14px" }}>
                      <div style={{ fontSize: 8, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 10 }}>Sensors</div>
                      <div className="grid grid-cols-2 gap-3">
                        {[0, 1, 2, 3].map((idx) => (
                          <div key={idx} className="flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "6px 10px" }}>
                            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>sensor-{idx + 1}</p>
                            <div className={`w-4 h-4 rounded-full transition-all duration-200 ${data?.allInfo[idx] == 1 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] scale-110" : "bg-slate-600/60"}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weight Display */}
                <div style={{ fontFamily: "'Courier New', monospace", background: "linear-gradient(160deg, #0d1117 0%, #0a1628 60%, #060d1a 100%)", borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                  {[
                    { top: 0, left: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "12px 0 0 0" },
                    { top: 0, right: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 12px 0 0" },
                    { bottom: 0, left: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 0 12px" },
                    { bottom: 0, right: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 12px 0" },
                  ].map((s, i) => <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />)}
                  <div className="relative z-10">
                    <div style={{ fontSize: 8, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 12 }}>WIM — Live Weight</div>
                    <WeightDisplay weight={10 * int16PairToFloat(parseInt(data?.allInfo[21]), parseInt(data?.allInfo[20]))} isLive={true} />
                    <div className="mt-5 flex flex-wrap gap-3">
                      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 7, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Date</span>
                        <span style={{ fontSize: 12, color: "#fff", fontWeight: 700, letterSpacing: "0.05em" }}>{data?.rfid?.date}</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 7, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Tag Reader</span>
                        <span style={{ fontSize: 12, color: "#fff", fontWeight: 700, letterSpacing: "0.05em" }}>{data?.rfid?.tag}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>{/* end left column */}

              {/* Right column: Live Camera full height */}
              <div style={{ fontFamily: "'Courier New', monospace", background: "linear-gradient(160deg, #0d1117 0%, #0a1628 60%, #060d1a 100%)", borderRadius: "16px", padding: "20px", position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                {[
                  { top: 0, left: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "12px 0 0 0" },
                  { top: 0, right: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 12px 0 0" },
                  { bottom: 0, left: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 0 12px" },
                  { bottom: 0, right: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 12px 0" },
                ].map((s, i) => <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />)}

                {/* Camera header */}
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>LIVE VIEW</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px" }}>
                    <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block", boxShadow: "0 0 6px rgba(255,255,255,0.8)" }} />
                    <span style={{ fontSize: 8, color: "#fff", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>Live</span>
                  </div>
                </div>

                {/* Camera feed — grows to fill remaining height */}
                <div className="relative z-10 flex-1" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,0.8)" }} />
                    <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>Үндсэн камер</span>
                    <span style={{ marginLeft: "auto", fontSize: 7, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>{`cam${id}1`}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <CameraView title="Үндсэн камер" cameraId={`cam${id}axis`} />
                  </div>
                </div>
              </div>{/* end right column */}

            </div>

            {/* Truck Visualization */}
            {
              id < 6 &&
              <div>
                <TruckVisualization
                  containerId1={data?.cam1.container}
                  containerId2={data?.cam2.container}
                  containerId3={data?.cam3.container}
                  containerId4={data?.cam4.container}
                  containerId5={data?.cam5.container}
                  containerId6={data?.cam6.container}
                  containerId7={data?.cam7.container}
                  containerId8={data?.cam8.container}
                  containerDate1={data?.cam1.date}
                  containerDate2={data?.cam2.date}
                  containerDate3={data?.cam3.date}
                  containerDate4={data?.cam4.date}
                  containerDate5={data?.cam5.date}
                  containerDate6={data?.cam6.date}
                  containerDate7={data?.cam7.date}
                  containerDate8={data?.cam8.date}
                />
              </div>
            }

            {/* Camera Views */}
            {id < 6 &&
            [
              { label: "1", cams: [{ title: "Чингэлэг - 1 баруун", id: `cam${id}1` }, { title: "Чингэлэг - 1 зүүн", id: `cam${id}2` }] },
              { label: "2", cams: [{ title: "Чингэлэг - 2 баруун", id: `cam${id}3` }, { title: "Чингэлэг - 2 зүүн", id: `cam${id}4` }] },
              { label: "3", cams: [{ title: "Чингэлэг - 3 баруун", id: `cam${id}5` }, { title: "Чингэлэг - 3 зүүн", id: `cam${id}6` }] },
              { label: "4", cams: [{ title: "Чингэлэг - 4 баруун", id: `cam${id}7` }, { title: "Чингэлэг - 4 зүүн", id: `cam${id}8` }] },
            ].map((group, gi) => (
              <div key={gi} className="mb-6" style={{ fontFamily: "'Courier New', monospace", background: "linear-gradient(160deg, #0d1117 0%, #0a1628 60%, #060d1a 100%)", borderRadius: "16px", padding: "20px 24px", position: "relative", overflow: "hidden", boxShadow: "0 0 60px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                {[
                  { top: 0, left: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "12px 0 0 0" },
                  { top: 0, right: 0, borderTop: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 12px 0 0" },
                  { bottom: 0, left: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 0 12px" },
                  { bottom: 0, right: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 12px 0" },
                ].map((s, i) => <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />)}

                <div className="relative z-10 flex items-center gap-3 mb-4">
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff" }}>{group.label}</div>
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>Camera Feed</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>Чингэлэг — {group.label}</div>
                  </div>
                  <div className="ml-auto flex items-center gap-2" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "3px 10px" }}>
                    <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block", boxShadow: "0 0 6px rgba(255,255,255,0.8)" }} />
                    <span style={{ fontSize: 8, color: "#fff", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>Live</span>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.cams.map((cam, ci) => (
                    <div key={ci} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,0.8)" }} />
                          <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>{cam.title}</span>
                        </div>
                        <span style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{cam.id}</span>
                      </div>
                      <CameraView title={cam.title} cameraId={cam.id} />
                    </div>
                  ))}
                </div>

                <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
              </div>
            ))}

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
