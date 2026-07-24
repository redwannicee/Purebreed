"use client";

import { useState } from "react";
import { X, Printer, Download } from "lucide-react";
import OrderReceipt from "./OrderReceipt";

export default function ReceiptModal({ order, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  if (!order) return null;

  function handlePrint() {
    window.print();
  }

  async function handleDownloadPdf() {
    setDownloading(true);
    setDownloadError("");
    try {
      // Loaded client-side only — html2pdf.js touches the DOM/canvas APIs
      // that don't exist during Next.js's server render.
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("printable-receipt");

      await html2pdf()
        .set({
          margin: 10,
          filename: `Purebreed-Receipt-${order.orderNumber}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    } catch (err) {
      setDownloadError("Could not generate the PDF. Please try the Print button instead.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-sage-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar — stripped out entirely for both print and PDF export via .no-print */}
        <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-t-2xl border-b border-forest/10 bg-white px-5 py-3">
          <p className="text-sm font-semibold text-ink">Order Receipt</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handlePrint} className="btn-secondary !py-1.5 !px-4 text-xs">
              <Printer size={14} /> Print
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="btn-primary !py-1.5 !px-4 text-xs"
            >
              <Download size={14} /> {downloading ? "Preparing…" : "Download PDF"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-ink/50 hover:bg-sage-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {downloadError && (
          <p className="no-print px-5 pt-3 text-xs font-semibold text-red-600">{downloadError}</p>
        )}

        <div className="p-4 sm:p-6">
          <OrderReceipt order={order} />
        </div>
      </div>
    </div>
  );
}
