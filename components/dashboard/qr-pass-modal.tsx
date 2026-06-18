"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

type QrPassModalProps = {
  userId: string;
  eventId: string;
  eventTitle: string;
};

export function QrPassModal({ userId, eventId, eventTitle }: QrPassModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // The payload we encode into the QR code
  const qrData = JSON.stringify({ userId, eventId });

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors text-sm"
      >
        Show Entry Pass
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card/80 backdrop-blur-xl shadow-2xl border border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative flex flex-col items-center">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Entry Pass</h3>
            <p className="text-zinc-400 text-sm text-center mb-6">{eventTitle}</p>
            
            <div className="bg-white p-4 rounded-xl">
              <QRCode value={qrData} size={200} />
            </div>
            
            <p className="text-zinc-500 text-xs text-center mt-6">
              Show this QR code at the venue to mark your physical attendance.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
