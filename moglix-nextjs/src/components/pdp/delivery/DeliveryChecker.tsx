"use client";

import { useState } from "react";
import { Truck, MapPin, Check, AlertCircle, Loader2 } from "lucide-react";

export default function DeliveryChecker() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [deliveryInfo, setDeliveryInfo] = useState<{
    deliveryDate?: string;
    cod?: boolean;
    express?: boolean;
  } | null>(null);

  const checkDelivery = async () => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));

    // Simulate response
    setDeliveryInfo({
      deliveryDate: "4-7 Business Days",
      cod: true,
      express: false,
    });
    setStatus("success");
  };

  return (
    <div className="border border-gray-1 rounded-xl p-4 bg-white space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Truck size={16} className="text-blue" />
        <h3 className="text-sm font-bold text-body">Check Delivery</h3>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-4" />
          <input
            type="text"
            placeholder="Enter Pincode"
            value={pincode}
            maxLength={6}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/, ""));
              setStatus("idle");
            }}
            onKeyDown={(e) => e.key === "Enter" && checkDelivery()}
            className="w-full pl-8 pr-3 py-2.5 border border-gray-2 rounded-lg text-sm outline-none focus:border-blue transition-colors font-medium"
            id="delivery-pincode-input"
          />
        </div>
        <button
          onClick={checkDelivery}
          disabled={status === "loading" || pincode.length < 6}
          className="px-4 py-2.5 bg-blue text-white rounded-lg text-sm font-bold hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          id="check-delivery-btn"
        >
          {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : "Check"}
        </button>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red text-xs font-medium">
          <AlertCircle size={13} />
          <span>Please enter a valid 6-digit pincode</span>
        </div>
      )}

      {status === "success" && deliveryInfo && (
        <div className="space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 text-sm">
            <Check size={15} className="text-green shrink-0" />
            <span className="text-body font-medium">
              Estimated Delivery:{" "}
              <span className="font-bold text-green">{deliveryInfo.deliveryDate}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-dark-3">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                deliveryInfo.cod
                  ? "bg-green/10 text-green"
                  : "bg-red/10 text-red"
              }`}
            >
              {deliveryInfo.cod ? "COD Available" : "Prepaid Only"}
            </span>
            {deliveryInfo.express && (
              <span className="px-2 py-0.5 rounded-full bg-orange/10 text-orange text-xs font-bold">
                Express Available
              </span>
            )}
          </div>
          <p className="text-xs text-gray-5">
            Free shipping on this order to {pincode}
          </p>
        </div>
      )}
    </div>
  );
}
