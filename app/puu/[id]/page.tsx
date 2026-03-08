"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import ToggleButton from "@/components/twoWayButton";
import axios from "axios";

import Navbar from "@/components/Navbar";
import ControlPanel from '@/components/dashboard/ControlPanel';
import WeightDisplay from '@/components/dashboard/WeightDisplay';
import CameraView from '@/components/dashboard/CameraView';
import TransactionTable, { Transaction } from '@/components/dashboard/TransactionTable';
import NewTruckModal from '@/components/dashboard/NewTruckModal';

import {ipCameraList} from '@/lib/utils';

const MODBUS_SERVER_URL = process.env.NEXT_PUBLIC_MODBUS_SERVER_URL;
const CAMERA_SERVER_URL = process.env.NEXT_PUBLIC_CAMERA_SERVER_URL;

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
  const [red, setRed] = useState(false);
  const [yellow, setYellow] = useState(false);
  const [green, setGreen] = useState(false);

  function int16PairToFloat(high: number, low: number): number {
    const combined: number = (high << 16) | low;
    const buffer: ArrayBuffer = new ArrayBuffer(4);
    const view: DataView = new DataView(buffer);
    view.setUint32(0, combined, false);
    return view.getFloat32(0, false);
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewTruckModal, setShowNewTruckModal] = useState(false);
  const [showAssistantPanel, setShowAssistantPanel] = useState(false);
  const [showCameras, setShowCameras] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 1500);
    return () => clearInterval(t);
  }, []);

  // Feature 1: operator can override container IDs per camera key (e.g. "cam1", "cam2"...)
  const [idOverrides, setIdOverrides] = useState<Record<string, string>>({});
  const [editingCam, setEditingCam] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Feature 2: operator can clear all container data from display
  const [cleared, setCleared] = useState(false);

  const handleEditStart = (camKey: string, currentId: string) => {
    setEditingCam(camKey);
    setEditValue(currentId || "");
  };
  const handleEditSave = (camKey: string) => {
    setIdOverrides(prev => ({ ...prev, [camKey]: editValue.trim() }));
    setEditingCam(null);
  };
  const handleClearTruck = () => {
    setCleared(true);
    setIdOverrides({});
  };
  // When new data arrives and sensors detect a truck, re-enable display
  const getContainerId = (camKey: string, apiId: string | undefined) => {
    if (cleared) return undefined;
    if (idOverrides[camKey] !== undefined) return idOverrides[camKey];
    return apiId;
  };
  const getContainerDate = (camKey: string, apiDate: string | undefined) => {
    if (cleared) return undefined;
    // If operator overrode the ID, don't show old date
    if (idOverrides[camKey] !== undefined) return undefined;
    return apiDate;
  };

  const handleNewTruck = () => setShowNewTruckModal(true);
  const handleNewTruckSubmit = () => setShowNewTruckModal(false);

  const handleCaptureCamera = async () => {
    const baseAdd = (parseInt(id.toString()) - 1) * 30;
    const registerAdd1 = baseAdd + 13;
    const payload1 = { "reg_addr": registerAdd1, "reg_value": 1 };
    await axios.post(`${MODBUS_SERVER_URL}/write/`, payload1, { headers: { "Content-Type": "application/json" } });
  };

  const handleSaveTransaction = async () => {
    setIsSaving(true);
    try {
      const puuName = Number(id) >= 1  && Number(id) <= 5  ? `Оролтын пүү: ${Number(id)}`
                    : Number(id) >= 6  && Number(id) <= 10 ? `Гаралтын пүү: ${Number(id) - 5}`
                    : Number(id) >= 11 && Number(id) <= 14 ? `Зүүн хяналтын пүү: ${Number(id) - 10}`
                    : `Баруун хяналтын пүү: ${Number(id) - 14}`;

      // Base data — always sent
      const baseData = {
        puuName,
        puuId: id,
        Weight: 10 * int16PairToFloat(parseInt(data?.allInfo[21]), parseInt(data?.allInfo[20])),
        tag: {
          id:   data?.rfid?.tag,
          date: data?.rfid?.date,
        },
      };

      // Container data — only for Оролт (id 1–5)
      const containerData = Number(id) <= 5 ? {
        conR1: { id: getContainerId("cam1", data?.cam1?.container) || data?.cam1?.container, date: data?.cam1?.date, control_digit: data?.cam1?.controldigit, readconfidence: data?.cam1?.readconfidence, plateImage: data?.cam1?.plateImage },
        conL1: { id: getContainerId("cam2", data?.cam2?.container) || data?.cam2?.container, date: data?.cam2?.date, control_digit: data?.cam2?.controldigit, readconfidence: data?.cam2?.readconfidence, plateImage: data?.cam1?.plateImage },
        conR2: { id: getContainerId("cam3", data?.cam3?.container) || data?.cam3?.container, date: data?.cam3?.date, control_digit: data?.cam3?.controldigit, readconfidence: data?.cam3?.readconfidence, plateImage: data?.cam1?.plateImage },
        conL2: { id: getContainerId("cam4", data?.cam4?.container) || data?.cam4?.container, date: data?.cam4?.date, control_digit: data?.cam4?.controldigit, readconfidence: data?.cam4?.readconfidence, plateImage: data?.cam1?.plateImage },
        conR3: { id: getContainerId("cam5", data?.cam5?.container) || data?.cam5?.container, date: data?.cam5?.date, control_digit: data?.cam5?.controldigit, readconfidence: data?.cam5?.readconfidence, plateImage: data?.cam1?.plateImage },
        conL3: { id: getContainerId("cam6", data?.cam6?.container) || data?.cam6?.container, date: data?.cam6?.date, control_digit: data?.cam6?.controldigit, readconfidence: data?.cam6?.readconfidence, plateImage: data?.cam1?.plateImage },
        conR4: { id: getContainerId("cam7", data?.cam7?.container) || data?.cam7?.container, date: data?.cam7?.date, control_digit: data?.cam7?.controldigit, readconfidence: data?.cam7?.readconfidence, plateImage: data?.cam1?.plateImage },
        conL4: { id: getContainerId("cam8", data?.cam8?.container) || data?.cam8?.container, date: data?.cam8?.date, control_digit: data?.cam8?.controldigit, readconfidence: data?.cam8?.readconfidence, plateImage: data?.cam1?.plateImage },
      } : {};

      const bodyData = { ...baseData, ...containerData };
      const url = `${CAMERA_SERVER_URL}/api/transaction/`;
      const response = await axios.post(url, bodyData, { headers: { "Content-Type": "application/json" } });
      if (response) {
        //TODO hed heden yum irne tegeed yum hiine
        // 0 - heviin
        // 1 - yavj bolno
        // 2 - yavj bolohgui
        const baseAdd = (parseInt(id.toString()) - 1) * 30;
        const registerAdd1 = baseAdd + 13;
        const registerValue1 = parseInt(response?.data?.authentication);
        const payload1 = { "reg_addr": registerAdd1, "reg_value": registerValue1 };
        await axios.post(`${MODBUS_SERVER_URL}/write/`, payload1, { headers: { "Content-Type": "application/json" } });
      }
      // Transaction saved successfully
    } catch (error) {
      console.error('Failed to save transaction:', error);
      alert('Failed to save transaction. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  console.log("-", MODBUS_SERVER_URL, CAMERA_SERVER_URL);

  const fetchTransactions = async (page: number) => {
    try {
      const res = await axios.get(`${CAMERA_SERVER_URL}/api/transaction/?puuId=${id}&page=${page}`);
      setTransactions(res.data.transactions);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  useEffect(() => {
    if (!id) return;
    let isFirstLoad = true;
    const fetchAllData = async () => {
      if (isFirstLoad) setLoader(true);
      try {
        const requests = [];

        // modbus
        requests.push(axios.get(`${MODBUS_SERVER_URL}/read/3/${(id - 1) * 30}/30`));

        // rfid
        requests.push(axios.get(`${CAMERA_SERVER_URL}/api/tagreader/?ipaddress=${ipCameraList[id].rfid}`));

        if (id < 6) {
          // cameras 1-8
          for (let i = 1; i <= 8; i++) {
            requests.push(axios.get(`${CAMERA_SERVER_URL}/api/camera/?ipaddress=${ipCameraList[id][`cam${i}`]}`));
          }
        }

        // helper
        const safeData = (r: any) => r.status === "fulfilled" ? r.value.data : null;

        // execute
        const [
          allInfo = null,
          rfidRes = null,
          cam1Res = null, cam2Res = null, cam3Res = null, cam4Res = null,
          cam5Res = null, cam6Res = null, cam7Res = null, cam8Res = null,
        ] = (await Promise.allSettled(requests)).map(safeData);

        setData({
          allInfo: allInfo || null,
          rfid: rfidRes || null,
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
        setRed(allInfo[6] === 1);
        setYellow(allInfo[5] === 1);
        setGreen(allInfo[4] === 1);
        setOperatorMode(allInfo[11] === 1);
        setEntryGate(allInfo[9] == 1);
        setExitGate(allInfo[7] == 1);
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

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  async function controlPuuByRemote(name: string, value: any) {
    const baseAdd = (parseInt(id.toString()) - 1) * 30;
    if (name == "entryGate" || name == "exitGate") {
      let registerAdd1 = 1;
      let registerValue1 = 0;
      if (name == "entryGate") { registerAdd1 = value ? baseAdd + 10 : baseAdd + 9; registerValue1 = 0; }
      if (name == "exitGate")  { registerAdd1 = value ? baseAdd + 8  : baseAdd + 7; registerValue1 = 0; }
      const payload1 = { "reg_addr": registerAdd1, "reg_value": registerValue1 };
      await axios.post(`${MODBUS_SERVER_URL}/write/`, payload1, { headers: { "Content-Type": "application/json" } });
    }
    let registerAdd = 11;
    let registerValue = value;
    if (name == "green")     { registerAdd = baseAdd + 18; registerValue = value ? 1 : 0; }
    if (name == "red")       { registerAdd = baseAdd + 17; registerValue = value ? 1 : 0; }
    if (name == "operator")  { registerAdd = baseAdd + 11; registerValue = value ? 1 : 0; }
    if (name == "entryGate") { registerAdd = value ? baseAdd + 9  : baseAdd + 10; registerValue = 1; }
    if (name == "exitGate")  { registerAdd = value ? baseAdd + 7  : baseAdd + 8;  registerValue = 1; }
    try {
      const payload = { "reg_addr": registerAdd, "reg_value": registerValue };
      const res = await axios.post(`${MODBUS_SERVER_URL}/write/`, payload, { headers: { "Content-Type": "application/json" } });
      // if (res) {
      //   if (name == "entryGate") setEntryGate(value)
      //   if (name == "exitGate")  setExitGate(value)
      //   if (name == "operator")  setOperatorMode(value)
      //   if (name == "green")     setGreen(value)
      //   if (name == "red")       setRed(value)
      // }
    } catch (err) {
      console.error("POST Error:", err);
    }
  }

  // Corner accents reusable style array
  const corners = [
    { top: 0,    left:  0, borderTop:    "2px solid rgba(255,255,255,0.25)", borderLeft:   "2px solid rgba(255,255,255,0.25)", borderRadius: "12px 0 0 0" },
    { top: 0,    right: 0, borderTop:    "2px solid rgba(255,255,255,0.25)", borderRight:  "2px solid rgba(255,255,255,0.25)", borderRadius: "0 12px 0 0" },
    { bottom: 0, left:  0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderLeft:   "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 0 12px" },
    { bottom: 0, right: 0, borderBottom: "2px solid rgba(255,255,255,0.25)", borderRight:  "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 12px 0" },
  ];
  const cardStyle = {
    fontFamily: "'Courier New', monospace",
    background: "linear-gradient(160deg, #0d1117 0%, #0a1628 60%, #060d1a 100%)",
    borderRadius: "16px",
    position: "relative" as const,
    overflow: "hidden",
    boxShadow: "0 0 60px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  };
  const gridBg = { position: "absolute" as const, inset: 0, pointerEvents: "none" as const, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" };

  return (
    <div>
      {loader && <Loader />}

      <div className="min-h-screen bg-[#0d1117]">
        <Navbar puuTitle={
          Number(id) >= 1  && Number(id) <= 5  ? `Оролтын пүү: ${Number(id)}`
          : Number(id) >= 6  && Number(id) <= 10 ? `Гаралтын пүү: ${Number(id) - 5}`
          : Number(id) >= 11 && Number(id) <= 14 ? `Зүүн хяналтын пүү: ${Number(id) - 10}`
          : Number(id) >= 15 && Number(id) <= 16 ? `Баруун хяналтын пүү: ${Number(id) - 14}`
          : String(id)
        } />

        <div className="flex">
          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden" style={{ paddingTop: 80 }}>

            {/* ── ROW 1: Single LIVE VIEW panel with 2 cameras inside ── */}
            <div className="mb-6">
              <div style={{ ...cardStyle, padding: "20px" }}>
                <div style={gridBg} />
                {corners.map((s, i) => <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />)}
                {/* Panel header */}
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>LIVE VIEW</div>
                </div>
                {/* Two camera feeds side by side */}
                <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {/* Axis camera */}
                  <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,0.8)" }} />
                      <span style={{ fontSize: 14, color: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>Ерөнхий хяналтын камер</span>
                      <span style={{ marginLeft: "auto", fontSize: 7, color: "rgba(255, 255, 255, 1)", letterSpacing: "0.15em" }}>{`cam${id}axis`}</span>
                    </div>
                    <CameraView cameraId={`cam${id}axis`} />
                  </div>
                  {/* LPR camera */}
                  <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(0,229,255,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderBottom: "1px solid rgba(0,229,255,0.08)", background: "rgba(0,229,255,0.03)" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5ff", boxShadow: "0 0 6px rgba(0,229,255,0.8)" }} />
                      <span style={{ fontSize: 14, color: "#ffffffff", fontWeight: 700, letterSpacing: "0.08em" }}>Дугаар таних камер</span>
                      <span style={{ marginLeft: "auto", fontSize: 7, color: "rgba(0,229,255,0.4)", letterSpacing: "0.15em" }}>{`cam${id}lpr`}</span>
                    </div>
                    <CameraView cameraId={`cam${id}lpr`} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── ROW 2: Weight + RFID + Container ID — full width ── */}
            <div className="mb-6">
              <div style={{ ...cardStyle, padding: "24px" }}>
                <div style={gridBg} />
                {corners.map((s, i) => <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />)}
                <div className="relative z-10">
                  <WeightDisplay weight={10 * int16PairToFloat(parseInt(data?.allInfo[21]), parseInt(data?.allInfo[20]))} isLive={true} />
                  {/* RFID — same table style as container ID */}
                  <div className="mt-5 mb-5" style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* Header */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "6px 12px", gap: 8 }}>
                      {["RFID", "TAG ID", "ОГНОО"].map((h, i) => (
                        <span key={i} style={{ fontSize: 7, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700 }}>{h}</span>
                      ))}
                    </div>
                    {/* Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", gap: 8, padding: "7px 12px", alignItems: "center", borderLeft: "2px solid rgba(255,165,0,0.35)" }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 700, letterSpacing: "0.03em" }}>Tag Reader</span>
                      <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.05em", color: data?.rfid?.tag ? "#ffa500" : "rgba(255,255,255,0.12)" }}>
                        {data?.rfid?.tag || "— NO READ —"}
                      </span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.02em" }}>{data?.rfid?.date || "—"}</span>
                    </div>
                  </div>

                  {/* Container ID table — only for Оролт пүү (id < 6) */}
                  {id < 6 && (() => {
                    const allCams = [
                      { side: "Баруун чингэлэг 1", camKey: "cam1", containerId: getContainerId("cam1", data?.cam1?.container), date: getContainerDate("cam1", data?.cam1?.date), confidence: cleared ? undefined : data?.cam1?.readconfidence, image: cleared ? undefined : data?.cam1?.plateImage },
                      { side: "Зүүн чингэлэг 1",   camKey: "cam2", containerId: getContainerId("cam2", data?.cam2?.container), date: getContainerDate("cam2", data?.cam2?.date), confidence: cleared ? undefined : data?.cam2?.readconfidence, image: cleared ? undefined : data?.cam2?.plateImage },
                      { side: "Баруун чингэлэг 2", camKey: "cam3", containerId: getContainerId("cam3", data?.cam3?.container), date: getContainerDate("cam3", data?.cam3?.date), confidence: cleared ? undefined : data?.cam3?.readconfidence, image: cleared ? undefined : data?.cam3?.plateImage },
                      { side: "Зүүн чингэлэг 2",   camKey: "cam4", containerId: getContainerId("cam4", data?.cam4?.container), date: getContainerDate("cam4", data?.cam4?.date), confidence: cleared ? undefined : data?.cam4?.readconfidence, image: cleared ? undefined : data?.cam4?.plateImage },
                      { side: "Баруун чингэлэг 3", camKey: "cam5", containerId: getContainerId("cam5", data?.cam5?.container), date: getContainerDate("cam5", data?.cam5?.date), confidence: cleared ? undefined : data?.cam5?.readconfidence, image: cleared ? undefined : data?.cam5?.plateImage },
                      { side: "Зүүн чингэлэг 3",   camKey: "cam6", containerId: getContainerId("cam6", data?.cam6?.container), date: getContainerDate("cam6", data?.cam6?.date), confidence: cleared ? undefined : data?.cam6?.readconfidence, image: cleared ? undefined : data?.cam6?.plateImage },
                      { side: "Баруун чингэлэг 4", camKey: "cam7", containerId: getContainerId("cam7", data?.cam7?.container), date: getContainerDate("cam7", data?.cam7?.date), confidence: cleared ? undefined : data?.cam7?.readconfidence, image: cleared ? undefined : data?.cam7?.plateImage },
                      { side: "Зүүн чингэлэг 4",   camKey: "cam8", containerId: getContainerId("cam8", data?.cam8?.container), date: getContainerDate("cam8", data?.cam8?.date), confidence: cleared ? undefined : data?.cam8?.readconfidence, image: cleared ? undefined : data?.cam8?.plateImage },
                    ];
                    return (
                      <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {/* Header */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr 125px 1fr 52px 32px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "6px 12px", gap: 8 }}>
                          {["ТАЛ", "ЧИНГЭЛЭГИЙН ДУГААР", "ЗУРАГ", "ОГНОО", "%", ""].map((h, i) => (
                            <span key={i} style={{ fontSize: 7, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700 }}>{h}</span>
                          ))}
                        </div>
                        {/* Rows */}
                        {allCams.map((cam, ci) => {
                          const hasId = cam.containerId && cam.containerId !== "" && cam.containerId !== "0";
                          const confNum = Number(cam.confidence);
                          const confColor = confNum > 80 ? "#22c55e" : confNum > 50 ? "#fb923c" : "#ef4444";
                          const isEditing = editingCam === cam.camKey;
                          const isEvenGroup = Math.floor(ci / 2) % 2 === 0;
                          const imgSrc = cam.image ? `data:image/jpeg;base64,${cam.image}` : null;
                          return (
                            <div
                              key={ci}
                              style={{
                                display: "grid", gridTemplateColumns: "1fr 1.8fr 125px 1fr 52px 32px",
                                gap: 8, padding: "7px 12px", alignItems: "center",
                                background: isEvenGroup ? "rgba(255,255,255,0.015)" : "transparent",
                                borderBottom: ci < allCams.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                borderLeft: `2px solid ${ci % 2 === 0 ? "rgba(0,229,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                              }}
                            >
                              {/* Side */}
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 700, letterSpacing: "0.03em" }}>{cam.side}</span>
                              {/* Container ID */}
                              {isEditing ? (
                                <input
                                  autoFocus
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value.toUpperCase())}
                                  onBlur={() => handleEditSave(cam.camKey)}
                                  onKeyDown={e => { if (e.key === "Enter") handleEditSave(cam.camKey); if (e.key === "Escape") setEditingCam(null); }}
                                  style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.4)", borderRadius: 4, color: "#00e5ff", fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 900, letterSpacing: "0.06em", padding: "2px 6px", outline: "none", width: "100%" }}
                                />
                              ) : (
                                <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.05em", color: hasId ? "#00e5ff" : "rgba(255,255,255,0.12)" }}>
                                  {hasId ? cam.containerId : "— NO READ —"}
                                </span>
                              )}
                              {/* Snapshot image — right of container ID */}
                              <div style={{ width: 125, height: 36, borderRadius: 4, overflow: "hidden", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                {imgSrc
                                  ? <img src={imgSrc} alt="snapshot" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>NO IMG</span></div>
                                }
                              </div>
                              {/* Date */}
                              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.02em" }}>{cam.date || "—"}</span>
                              {/* Confidence */}
                              <span style={{ fontSize: 12, fontWeight: 700, color: cam.confidence != null ? confColor : "rgba(255,255,255,0.15)" }}>
                                {cam.confidence != null ? `${cam.confidence}%` : "—"}
                              </span>
                              {/* Edit */}
                              {operatorMode && !isEditing ? (
                                <button onClick={() => handleEditStart(cam.camKey, cam.containerId || "")} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.35, fontSize: 12 }}>✏️</button>
                              ) : <span />}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Transaction Table */}
            <TransactionTable
              transactions={transactions}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />

          </main>
        </div>

        {/* ── FLOATING ASSISTANT BUTTON ── */}
        <button
          onClick={() => setShowAssistantPanel(true)}
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "2px solid rgba(0,229,255,0.5)",
            background: "linear-gradient(135deg, #0a1628 0%, #060d1a 100%)",
            boxShadow: "0 0 24px rgba(0,229,255,0.35), 0 0 60px rgba(0,229,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            transition: "all 0.2s",
          }}
          title="Удирдлагын самбар нээх"
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 36px rgba(0,229,255,0.6), 0 0 80px rgba(0,229,255,0.2)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(0,229,255,0.35), 0 0 60px rgba(0,229,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)"; }}
        >
          {/* Pulse ring */}
          <span style={{ position: "absolute", width: 64, height: 64, borderRadius: "50%", border: "2px solid rgba(0,229,255,0.3)", animation: "assistantPulse 2s ease-out infinite" }} />
          <span style={{ fontSize: 26 }}>⚡</span>
        </button>

        {/* Pulse keyframe */}
        <style>{`
          @keyframes assistantPulse {
            0%   { transform: scale(1);   opacity: 0.6; }
            100% { transform: scale(1.8); opacity: 0; }
          }
        `}</style>

        {/* ── ASSISTANT PANEL POPUP ── */}
        {showAssistantPanel && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 24 }}
            onClick={e => { if (e.target === e.currentTarget) setShowAssistantPanel(false); }}
          >
            {/* Backdrop */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} onClick={() => setShowAssistantPanel(false)} />

            {/* Panel */}
            <div style={{
              position: "relative", zIndex: 1,
              width: "min(720px, 95vw)", maxHeight: "90vh", overflowY: "auto",
              fontFamily: "'Courier New', monospace",
              background: "linear-gradient(160deg, #0b1120 0%, #080f1e 60%, #050c18 100%)",
              border: "1px solid rgba(0,229,255,0.18)",
              borderRadius: 20,
              boxShadow: "0 0 80px rgba(0,229,255,0.12), 0 32px 80px rgba(0,0,0,0.9)",
              padding: 24,
              display: "flex", flexDirection: "column", gap: 16,
            }}>

              {/* ── HEADER ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", letterSpacing: "0.06em" }}>ОПЕРАТОРЫН УДИРДЛАГЫН ХЭСЭГ</div>
                  </div>
                </div>
                <button onClick={() => setShowAssistantPanel(false)} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>×</button>
              </div>

              {/* ── CYAN DIVIDER ── */}
              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.35), transparent)" }} />

              {/* ── ROW 1: RFID + WEIGHT ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 0, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
                {/* RFID */}
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ fontSize: 7, letterSpacing: "0.3em", color: "rgba(255,165,0,0.6)", textTransform: "uppercase", marginBottom: 8 }}>RFID Tag Reader</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: data?.rfid?.tag ? "#ffa500" : "rgba(255,255,255,0.18)", letterSpacing: "0.05em", marginBottom: 6 }}>
                    {data?.rfid?.tag || "— NO READ —"}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>{data?.rfid?.date || "—"}</div>
                </div>
                {/* Vertical divider */}
                <div style={{ background: "rgba(255,255,255,0.06)" }} />
                {/* Weight — right aligned */}
                <div style={{ padding: "16px 20px", textAlign: "right" as const }}>
                  <div style={{ fontSize: 7, letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 8 }}>Нийт жин</div>
                  <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: "0.02em", lineHeight: 1 }}>
                    {(10 * int16PairToFloat(parseInt(data?.allInfo?.[21]), parseInt(data?.allInfo?.[20])) || 0).toFixed(2)}
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>тн</span>
                  </div>
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Live reading</span>
                    <span className="animate-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }} />
                  </div>
                </div>
              </div>

              {/* ── ROW 2: ACTIONS ── */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ fontSize: 14, letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 12 }}>Үйлдэл</div>
                <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
                  <div style={{ flex: 1 }}>
                    <ControlPanel
                      onNewTruck={handleNewTruck}
                      onCaptureCamera={handleCaptureCamera}
                      onSaveTransaction={handleSaveTransaction}
                      isCapturing={isCapturing}
                      isSaving={isSaving}
                    />
                  </div>
                  {/* Vertical divider */}
                  <div style={{ width: 1, background: "rgba(255,255,255,0.06)", borderRadius: 1 }} />
                  {/* Clear / Restore */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center", minWidth: 90 }}>
                    <div style={{ fontSize: 12, letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 2 }}>Цэвэрлэх</div>
                    <button
                      onClick={handleClearTruck}
                      style={{
                        padding: "9px 12px", borderRadius: 8,
                        border: cleared ? "1px solid rgba(251,146,60,0.5)" : "1px solid rgba(255,255,255,0.1)",
                        background: cleared ? "rgba(251,146,60,0.1)" : "rgba(255,255,255,0.03)",
                        color: cleared ? "#fb923c" : "rgba(255,255,255,0.4)",
                        fontFamily: "'Courier New', monospace", fontSize: 8, fontWeight: 700,
                        letterSpacing: "0.12em", textTransform: "uppercase" as const,
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
                      }}
                    >
                      <span>🚫</span>
                      {cleared ? "CLEARED" : "CLEAR"}
                    </button>
                    {cleared && (
                      <button
                        onClick={() => setCleared(false)}
                        style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.07)", color: "#22c55e", fontFamily: "'Courier New', monospace", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, cursor: "pointer" }}
                      >♻ RESTORE</button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── ROW 3: OPERATOR + LIGHTS (side by side) ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>

                {/* Operator mode */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ fontSize: 14, letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 10 }}>Оператор</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Оператор төлөв</span>
                    <ToggleButton onText="ON" offText="OFF" value={operatorMode} disabled={false} onToggle={() => controlPuuByRemote("operator", !operatorMode)} />
                  </div>
                  {/* Pos mode badges */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ flex: 1, textAlign: "center", padding: "5px 0", borderRadius: 6, background: data?.allInfo?.[15] == 1 ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.02)", border: `1px solid ${data?.allInfo?.[15] == 1 ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.06)"}` }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: data?.allInfo?.[15] == 1 ? "#22c55e" : "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>AUTO</span>
                    </div>
                    <div style={{ flex: 1, textAlign: "center", padding: "5px 0", borderRadius: 6, background: data?.allInfo?.[16] == 1 ? "rgba(251,146,60,0.12)" : "rgba(255,255,255,0.02)", border: `1px solid ${data?.allInfo?.[16] == 1 ? "rgba(251,146,60,0.35)" : "rgba(255,255,255,0.06)"}` }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: data?.allInfo?.[16] == 1 ? "#fb923c" : "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>LOCAL</span>
                    </div>
                  </div>
                </div>

                {/* Traffic lights */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ fontSize: 14, letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 10 }}>Гэрлийн төлөв</div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "space-around" }}>
                    {[
                      { key: "green",  label: "Ногоон", active: green,  dot: "#22c55e", glow: "rgba(34,197,94,0.8)",   activeClass: "bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.9)]" },
                      { key: "yellow", label: "Шар",    active: yellow, dot: "#fb923c", glow: "rgba(251,146,60,0.8)",  activeClass: "bg-orange-400 shadow-[0_0_14px_rgba(251,146,60,0.9)]" },
                      { key: "red",    label: "Улаан",  active: red,    dot: "#ef4444", glow: "rgba(239,68,68,0.8)",   activeClass: "bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.9)]" },
                    ].map((light) => (
                      <div key={light.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                        <div
                          onClick={() => { if (operatorMode) controlPuuByRemote(light.key, !light.active); }}
                          style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: light.active ? light.dot : "rgba(255,255,255,0.06)",
                            border: `2px solid ${light.active ? light.dot : "rgba(255,255,255,0.1)"}`,
                            boxShadow: light.active ? `0 0 16px ${light.glow}` : "none",
                            cursor: operatorMode ? "pointer" : "not-allowed",
                            opacity: operatorMode ? 1 : 0.35,
                            transition: "all 0.2s",
                          }}
                        />
                        <span style={{ fontSize: 14, color: light.active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)", letterSpacing: "0.06em", fontWeight: light.active ? 700 : 400 }}>{light.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── ROW 4: GATES + SENSORS (side by side) ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>

                {/* Gates */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ fontSize: 14, letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 10 }}>Хаалт</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Орох хаалт", value: entryGate, name: "entryGate" },
                      { label: "Гарах хаалт", value: exitGate, name: "exitGate" },
                    ].map((gate) => (
                      <div key={gate.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: "8px 10px" }}>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: "0.02em" }}>{gate.label}</span>
                        <ToggleButton onText="Хаах" offText="Нээх" value={gate.value} disabled={!operatorMode} onToggle={() => controlPuuByRemote(gate.name, !gate.value)} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sensors */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ fontSize: 14, letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 10 }}>Мэдрэгч</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {[0, 1, 2, 3].map((idx) => {
                      const active = data?.allInfo?.[idx] == 1;
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: active ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${active ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.05)"}`, borderRadius: 8, padding: "7px 10px", transition: "all 0.2s" }}>
                          <span style={{ fontSize: 11, color: active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", fontWeight: 600 }}>S-{idx + 1}</span>
                          <div style={{ width: 12, height: 12, borderRadius: "50%", background: active ? "#22c55e" : "rgba(255,255,255,0.12)", boxShadow: active ? "0 0 8px rgba(34,197,94,0.8)" : "none", transition: "all 0.2s" }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── CAMERA GRID TOGGLE (Оролт пүү only) ── */}
              {id < 6 && (
                <>
                  <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.2), transparent)" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "12px 16px" }}>
                    <div>
                      <div style={{ fontSize: 16, letterSpacing: "0.3em", color: "rgba(0,229,255,0.45)", textTransform: "uppercase", marginBottom: 3 }}>Container Monitoring</div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>8 Камерын харагдац</div>
                    </div>
                    <button
                      onClick={() => setShowCameras(v => !v)}
                      style={{
                        padding: "8px 18px", borderRadius: 8,
                        border: showCameras ? "1px solid rgba(0,229,255,0.4)" : "1px solid rgba(255,255,255,0.1)",
                        background: showCameras ? "rgba(0,229,255,0.08)" : "rgba(255,255,255,0.03)",
                        color: showCameras ? "#00e5ff" : "rgba(255,255,255,0.4)",
                        fontFamily: "'Courier New', monospace", fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.15em", textTransform: "uppercase" as const, cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {showCameras ? "▲ HIDE" : "▼ SHOW"}
                    </button>
                  </div>

                  {showCameras && (() => {
                    const camGroups = [
                      {
                        label: "1", title: "Чингэлэг — 1",
                        cams: [
                          { side: "Баруун", camKey: "cam1", camId: `cam${id}1`, containerId: getContainerId("cam1", data?.cam1?.container), date: getContainerDate("cam1", data?.cam1?.date), confidence: cleared ? undefined : data?.cam1?.readconfidence, image: cleared ? undefined : data?.cam1?.image },
                          { side: "Зүүн",   camKey: "cam2", camId: `cam${id}2`, containerId: getContainerId("cam2", data?.cam2?.container), date: getContainerDate("cam2", data?.cam2?.date), confidence: cleared ? undefined : data?.cam2?.readconfidence, image: cleared ? undefined : data?.cam2?.image },
                        ],
                      },
                      {
                        label: "2", title: "Чингэлэг — 2",
                        cams: [
                          { side: "Баруун", camKey: "cam3", camId: `cam${id}3`, containerId: getContainerId("cam3", data?.cam3?.container), date: getContainerDate("cam3", data?.cam3?.date), confidence: cleared ? undefined : data?.cam3?.readconfidence, image: cleared ? undefined : data?.cam3?.image },
                          { side: "Зүүн",   camKey: "cam4", camId: `cam${id}4`, containerId: getContainerId("cam4", data?.cam4?.container), date: getContainerDate("cam4", data?.cam4?.date), confidence: cleared ? undefined : data?.cam4?.readconfidence, image: cleared ? undefined : data?.cam4?.image },
                        ],
                      },
                      {
                        label: "3", title: "Чингэлэг — 3",
                        cams: [
                          { side: "Баруун", camKey: "cam5", camId: `cam${id}5`, containerId: getContainerId("cam5", data?.cam5?.container), date: getContainerDate("cam5", data?.cam5?.date), confidence: cleared ? undefined : data?.cam5?.readconfidence, image: cleared ? undefined : data?.cam5?.image },
                          { side: "Зүүн",   camKey: "cam6", camId: `cam${id}6`, containerId: getContainerId("cam6", data?.cam6?.container), date: getContainerDate("cam6", data?.cam6?.date), confidence: cleared ? undefined : data?.cam6?.readconfidence, image: cleared ? undefined : data?.cam6?.image },
                        ],
                      },
                      {
                        label: "4", title: "Чингэлэг — 4",
                        cams: [
                          { side: "Баруун", camKey: "cam7", camId: `cam${id}7`, containerId: getContainerId("cam7", data?.cam7?.container), date: getContainerDate("cam7", data?.cam7?.date), confidence: cleared ? undefined : data?.cam7?.readconfidence, image: cleared ? undefined : data?.cam7?.image },
                          { side: "Зүүн",   camKey: "cam8", camId: `cam${id}8`, containerId: getContainerId("cam8", data?.cam8?.container), date: getContainerDate("cam8", data?.cam8?.date), confidence: cleared ? undefined : data?.cam8?.readconfidence, image: cleared ? undefined : data?.cam8?.image },
                        ],
                      },
                    ];

                    return camGroups.map((group, gi) => (
                      <div key={gi} className="mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px" }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#00e5ff" }}>
                            {group.label}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>{group.title}</div>
                          <div className="ml-auto flex items-center gap-2" style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 20, padding: "2px 8px" }}>
                            <span className="animate-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#00e5ff", display: "inline-block", boxShadow: "0 0 5px rgba(0,229,255,0.8)" }} />
                            <span style={{ fontSize: 7, color: "#00e5ff", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>Live</span>
                          </div>
                        </div>

                        {/* Camera feeds — minimal footer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          {group.cams.map((cam, ci) => {
                            const hasId = cam.containerId && cam.containerId !== "" && cam.containerId !== "0";
                            return (
                              <div key={ci} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${hasId ? "rgba(0,229,255,0.3)" : "rgba(255,255,255,0.08)"}`, background: hasId ? "rgba(0,229,255,0.03)" : "rgba(255,255,255,0.02)" }}>
                                <CameraView cameraId={cam.camId} />
                                {/* Minimal footer — just side label + status dot */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: "rgba(0,0,0,0.5)", borderTop: `1px solid ${hasId ? "rgba(0,229,255,0.15)" : "rgba(255,255,255,0.05)"}` }}>
                                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: hasId ? "#00e5ff" : "rgba(255,255,255,0.2)", boxShadow: hasId ? "0 0 5px rgba(0,229,255,0.8)" : "none", flexShrink: 0 }} />
                                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.08em" }}>{cam.side}</span>
                                  <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em" }}>{cam.camId}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Container ID small table */}
                        <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                          {/* Table header */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr 125px 1fr 52px 36px", gap: 0, background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "5px 10px" }}>
                            {["ТАЛ", "ЧИНГЭЛЭГИЙН ДУГААР", "ЗУРАГ", "ОГНОО", "%", ""].map((h, i) => (
                              <span key={i} style={{ fontSize: 7, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 700 }}>{h}</span>
                            ))}
                          </div>
                          {/* Table rows */}
                          {group.cams.map((cam, ci) => {
                            const hasId = cam.containerId && cam.containerId !== "" && cam.containerId !== "0";
                            const confNum = Number(cam.confidence);
                            const confColor = confNum > 80 ? "#22c55e" : confNum > 50 ? "#fb923c" : "#ef4444";
                            const isEditing = editingCam === cam.camKey;
                            const imgSrc = cam.image ? `data:image/jpeg;base64,${cam.image}` : null;
                            return (
                              <div key={ci} style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr 125px 1fr 52px 36px", gap: 0, padding: "6px 10px", alignItems: "center", background: ci % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent", borderBottom: ci < group.cams.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                                {/* Side */}
                                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: "0.05em" }}>{cam.side}</span>
                                {/* Container ID */}
                                {isEditing ? (
                                  <input
                                    autoFocus
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value.toUpperCase())}
                                    onBlur={() => handleEditSave(cam.camKey)}
                                    onKeyDown={e => { if (e.key === "Enter") handleEditSave(cam.camKey); if (e.key === "Escape") setEditingCam(null); }}
                                    style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.4)", borderRadius: 4, color: "#00e5ff", fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 900, letterSpacing: "0.06em", padding: "2px 6px", outline: "none", width: "100%" }}
                                  />
                                ) : (
                                  <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: "0.06em", color: hasId ? "#00e5ff" : "rgba(255,255,255,0.15)" }}>
                                    {hasId ? cam.containerId : "— NO READ —"}
                                  </span>
                                )}
                                {/* Snapshot — right of container ID */}
                                <div style={{ width: 125, height: 36, borderRadius: 4, overflow: "hidden", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                  {imgSrc
                                    ? <img src={imgSrc} alt="snapshot" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 7, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>NO IMG</span></div>
                                  }
                                </div>
                                {/* Date */}
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.03em" }}>{cam.date || "—"}</span>
                                {/* Confidence */}
                                <span style={{ fontSize: 12, fontWeight: 700, color: cam.confidence != null ? confColor : "rgba(255,255,255,0.2)" }}>
                                  {cam.confidence != null ? `${cam.confidence}%` : "—"}
                                </span>
                                {/* Edit button */}
                                {operatorMode && !isEditing ? (
                                  <button onClick={() => handleEditStart(cam.camKey, cam.containerId || "")} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.4, fontSize: 13 }}>✏️</button>
                                ) : <span />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </>
              )}

            </div>{/* end panel */}
          </div>
        )}

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
