import React, { useState, useRef } from "react";
import axios from "axios";

const API_BASE_URL = "https://tanmaysingh12r-queryflow-ai.hf.space";

const CSVImportModal = ({ isOpen, onClose, onImportComplete, userId, vaultId }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState([]);
  const [importMode, setImportMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  if (!isOpen) return null;

  // Download template
  const handleDownloadTemplate = () => {
    const csv = [
      "name,cost_price,price,stock,category",
      "iPhone 15,50000,75000,10,Electronics",
      "Nike Shoes,2000,4500,25,Clothing",
      "Basmati Rice,80,150,100,Food & Beverage"
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "QueryFlow_Import_Template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse CSV
  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());

    const required = ["name", "price", "stock"];
    const missing = required.filter(r => !headers.includes(r));
    if (missing.length > 0) {
      setErrors([`Missing required columns: ${missing.join(", ")}`]);
      setPreview([]);
      return;
    }

    const rows = [];
    const parseErrors = [];

    lines.slice(1).forEach((line, i) => {
      if (!line.trim()) return;
      const values = line.split(",").map(v => v.trim());
      const row = {};
      headers.forEach((h, j) => { row[h] = values[j] || ""; });

      if (!row.name) {
        parseErrors.push(`Row ${i + 2}: Name is required`);
        return;
      }
      if (isNaN(parseFloat(row.price))) {
        parseErrors.push(`Row ${i + 2}: Price must be a number`);
        return;
      }
      if (isNaN(parseInt(row.stock))) {
        parseErrors.push(`Row ${i + 2}: Stock must be a number`);
        return;
      }

      rows.push({
        name: row.name,
        costPrice: parseFloat(row.cost_price) || 0,
        cost_price: parseFloat(row.cost_price) || 0,
        price: parseFloat(row.price) || 0,
        stock: parseInt(row.stock) || 0,
        category: row.category || null,
        userId: userId,
        vaultId: vaultId
      });
    });

    setErrors(parseErrors);
    setPreview(rows);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      setErrors(["Please upload a .csv file only"]);
      return;
    }
    setFile(f);
    setResult(null);
    setErrors([]);
    setPreview([]);

    const reader = new FileReader();
    reader.onload = (evt) => parseCSV(evt.target.result);
    reader.readAsText(f);
  };

  // Handle import
  const handleImport = async () => {
    if (preview.length === 0) return;
    setLoading(true);
    setResult(null);

    try {
      // If replace mode — delete existing items first
      if (importMode === "replace") {
        const existing = await axios.get(`${API_BASE_URL}/api/products?vaultId=${vaultId}`);
        const existingItems = Array.isArray(existing.data) ? existing.data : [];
        await Promise.all(
          existingItems.map(item =>
            axios.delete(`${API_BASE_URL}/api/products/${item.id}`)
          )
        );
      }

      const res = await axios.post(`${API_BASE_URL}/api/products/bulk`, preview);
      setResult({
        success: true,
        count: res.data.imported,
        message: res.data.message
      });
      onImportComplete();
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.error || "Import failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview([]);
    setErrors([]);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 bg-[#080A0F]/95 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div className="bg-[#0D1117] border border-[#C9A84C]/20 p-6 md:p-10 rounded-2xl w-full max-w-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto relative">

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent"></div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 relative">
          <div>
            <h2 className="text-[#C9A84C] font-syne font-bold uppercase text-sm tracking-[0.3em]">
              CSV_Bulk_Import
            </h2>
            <p className="text-white/20 text-[14px] md:text-[9px] uppercase tracking-widest mt-1 font-dm">
              Import multiple items at once
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-[14px] md:text-[10px] font-syne font-bold border border-white/10 px-3 py-1 rounded-md transition-all uppercase"
          >
            Close
          </button>
        </div>

        {/* DOWNLOAD TEMPLATE */}
        <button
          onClick={handleDownloadTemplate}
          className="w-full flex items-center justify-between bg-[#4182ff]/5 border border-[#C9A84C]/20 p-4 rounded-2xl mb-6 hover:bg-[#C9A84C]/10 transition-all group"
        >
          <div className="text-left">
            <p className="text-[#C9A84C] text-[14px] md:text-[10px] font-black uppercase tracking-widest">Download Template</p>
            <p className="text-white/20 text-[14px] md:text-[8px] uppercase font-black mt-1">QueryFlow_Import_Template.csv</p>
          </div>
          <span className="text-[#C9A84C] text-[14px] md:text-[9px] font-black uppercase group-hover:scale-110 transition-all">↓ Download</span>
        </button>

        {/* IMPORT MODE */}
        <div className="mb-6">
          <p className="text-[14px] md:text-[8px] text-white/20 uppercase font-syne font-bold tracking-widest mb-3">Import Mode</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setImportMode("add")}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                importMode === "add"
                  ? "bg-[#C9A84C]/10 border-[#C9A84C] text-[#C9A84C] shadow-[0_0_15px_rgba(201,168,76,0.1)]"
                  : "bg-transparent border-white/10 text-white/30 hover:text-white hover:border-white/20"
              }`}
            >
              <p className="text-[14px] md:text-[10px] font-syne font-bold uppercase tracking-widest">Add to Existing</p>
              <p className="text-[14px] md:text-[8px] mt-1 opacity-60 font-dm">Keep current items, add new ones</p>
            </button>
            <button
              onClick={() => setImportMode("replace")}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                importMode === "replace"
                  ? "bg-[#E05555]/10 border-[#E05555] text-[#E05555] shadow-[0_0_15px_rgba(224,85,85,0.1)]"
                  : "bg-transparent border-white/10 text-white/30 hover:text-white hover:border-white/20"
              }`}
            >
              <p className="text-[14px] md:text-[10px] font-syne font-bold uppercase tracking-widest">Replace All</p>
              <p className="text-[14px] md:text-[8px] mt-1 opacity-60 font-dm">Delete current items, import fresh</p>
            </button>
          </div>
        </div>

        {/* FILE UPLOAD */}
        <div
          className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center mb-6 hover:border-[#C9A84C]/30 transition-all cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div>
              <p className="text-[#2ECC8A] text-[14px] md:text-[10px] font-black uppercase">{file.name}</p>
              <p className="text-white/20 text-[14px] md:text-[8px] uppercase font-black mt-1">
                {preview.length} items ready to import
              </p>
            </div>
          ) : (
            <div>
              <p className="text-white/30 text-[14px] md:text-[10px] font-black uppercase">Click to upload CSV file</p>
              <p className="text-white/10 text-[14px] md:text-[8px] uppercase font-black mt-1">Only .csv files accepted</p>
            </div>
          )}
        </div>

        {/* ERRORS */}
        {errors.length > 0 && (
          <div className="bg-[#E05555]/10 border border-[#E05555]/20 rounded-2xl p-4 mb-6">
            <p className="text-red-400 text-[14px] md:text-[9px] font-black uppercase mb-2">Errors Found:</p>
            {errors.map((err, i) => (
              <p key={i} className="text-red-400/70 text-[14px] md:text-[8px] font-black">{err}</p>
            ))}
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className={`rounded-2xl p-4 mb-6 border ${
            result.success
              ? "bg-[#2ECC8A]/10 border-[#00ff88]/20"
              : "bg-[#E05555]/10 border-[#E05555]/20"
          }`}>
            <p className={`text-[14px] md:text-[10px] font-black uppercase ${result.success ? "text-[#2ECC8A]" : "text-red-400"}`}>
              {result.success ? `Successfully imported ${result.count} items!` : result.message}
            </p>
          </div>
        )}

        {/* PREVIEW TABLE */}
        {preview.length > 0 && !result && (
          <div className="mb-6">
            <p className="text-[14px] md:text-[8px] text-white/20 uppercase font-black tracking-widest mb-3">
              Preview — {preview.length} items
            </p>
            <div className="bg-[#0D1117]/80 border border-[#C9A84C]/15 rounded-2xl border border-white/5 overflow-hidden">
              <div className="grid grid-cols-5 gap-2 p-3 border-b border-white/5">
                {["Name", "Buy Price", "Sell Price", "Stock", "Category"].map(h => (
                  <p key={h} className="text-[14px] md:text-[7px] text-white/30 uppercase font-black">{h}</p>
                ))}
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {preview.slice(0, 20).map((item, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 border-b border-white/5 hover:bg-white/5">
                    <p className="text-[14px] md:text-[9px] text-white font-black uppercase truncate">{item.name}</p>
                    <p className="text-[14px] md:text-[9px] text-gray-400 font-black">Rs.{item.costPrice}</p>
                    <p className="text-[14px] md:text-[9px] text-white font-black">Rs.{item.price}</p>
                    <p className="text-[14px] md:text-[9px] text-[#C9A84C] font-black">{item.stock}</p>
                    <p className="text-[14px] md:text-[9px] text-white/40 font-black truncate">{item.category || "-"}</p>
                  </div>
                ))}
                {preview.length > 20 && (
                  <p className="text-[14px] md:text-[8px] text-white/20 uppercase font-black text-center p-3">
                    +{preview.length - 20} more items
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={result ? handleReset : onClose}
            className="flex-1 bg-transparent border border-white/10 p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-white/40 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            {result?.success ? "Import More" : "Cancel"}
          </button>
          {!result && (
            <button
              onClick={handleImport}
               disabled={loading || preview.length === 0 || errors.length > 0}
               className={`flex-1 p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] transition-all duration-200 disabled:opacity-50 ${
                importMode === "replace"
                  ? "bg-[#E05555] text-white shadow-[0_0_15px_rgba(224,85,85,0.3)] hover:brightness-110"
                  : "bg-[#C9A84C] text-[#080A0F] shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:brightness-110"
              }`}
            >
              {loading
                ? "Importing..."
                : importMode === "replace"
                  ? `Replace & Import ${preview.length}`
                  : `Import ${preview.length}`
              }
            </button>
          )}
          {result?.success && (
            <button
              onClick={onClose}
              className="flex-1 bg-[#C9A84C] p-4 rounded-xl font-syne font-bold uppercase text-[14px] md:text-[10px] tracking-[0.2em] text-[#080A0F] hover:brightness-110 transition-all duration-200 shadow-[0_0_15px_rgba(201,168,76,0.3)]"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;