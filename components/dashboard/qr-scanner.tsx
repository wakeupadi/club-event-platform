"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { markAttendance } from "@/app/actions/attendance";

export function QrScannerKiosk() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleScan = async (result: any) => {
    if (!result || !result.length) return;
    const dataStr = result[0].rawValue;
    
    try {
      const payload = JSON.parse(dataStr);
      if (payload.userId && payload.eventId) {
        setStatus("scanning");
        setMessage("Verifying...");
        
        const res = await markAttendance(payload.userId, payload.eventId);
        if (res.success) {
          setStatus("success");
          setMessage(res.message || "Attendance verified!");
          setTimeout(() => {
            setStatus("idle");
            setMessage("");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(res.error || "Verification failed");
          setTimeout(() => setStatus("idle"), 3000);
        }
      } else {
        throw new Error("Invalid QR code format");
      }
    } catch (e: any) {
      setStatus("error");
      setMessage(e.message || `Invalid QR: ${typeof result === 'string' ? result : JSON.stringify(result)}`);
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-2"
      >
        <span>📷</span> Scan Attendance
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
          <div className="bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative flex flex-col items-center">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Scan Entry Pass</h3>
            <p className="text-zinc-400 text-sm text-center mb-6">Point the camera at the student's QR code</p>
            
            <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-zinc-800 relative bg-background">
              {status === "idle" || status === "scanning" ? (
                <Scanner onScan={handleScan} />
              ) : status === "success" ? (
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 text-emerald-400 font-bold text-lg">
                  ✅ {message}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 text-red-400 font-bold text-lg">
                  ❌ {message}
                </div>
              )}
              {status === "scanning" && (
                 <div className="absolute inset-0 flex items-center justify-center bg-background/50 text-white font-bold text-lg backdrop-blur-sm">
                   Verifying...
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
