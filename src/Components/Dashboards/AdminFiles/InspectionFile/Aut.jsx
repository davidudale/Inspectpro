import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../../Auth/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  ShieldCheck, Activity, Ruler, Camera, 
  ChevronLeft, CheckCircle2, XCircle, FileText, Printer, Save, Plus, Trash2
} from "lucide-react";
import AdminNavbar from "../../AdminNavbar";
import AdminSidebar from "../../AdminSidebar";
import { toast } from "react-toastify";
import { useAuth } from "../../../Auth/AuthContext";

const Aut = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [reportMode, setReportMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State mapped to the "AUT Blank Template" structure [cite: 21, 47, 55, 173, 205]
  const [reportData, setReportData] = useState({
    general: { 
      platform: "", equipment: "", tag: "", reportNum: "", date: "",
      client: "", contract: "", procedure: "", testCode: "API 510", criteria: "Client's Requirement"
    },
    vesselData: { 
      serialNo: "", designPressure: "", testPressure: "", mdmt: "",
      shellThk: "", headThk: "", size: "", manufactureYear: "", vesselDia: "" 
    },
    visual: { 
      shell: "Satisfactory", nozzles: "Satisfactory", skirt: "Satisfactory", 
      heads: "Satisfactory", insulation: "Satisfactory", foundation: "Satisfactory" 
    },
    autMetrics: [{ id: Date.now(), axialX: "0", axialY: "0", nominal: "12.5", min: "12.5", location: "", remark: "" }],
    mutNozzles: [{ id: Date.now(), nozzleTag: "", dia: "", nominal: "", actual: "", minThk: "" }],
    shearWave: [{ id: Date.now(), nozzleNo: "", discontinuity: "", depth: "", result: "Accept" }],
    images: [] 
  });

  // Prefill from ViewInspection navigation state
  useEffect(() => {
    if (location.state?.preFill) {
      const p = location.state.preFill;
      setReportData(prev => ({
        ...prev,
        general: { 
          ...prev.general, 
          tag: p.tag, 
          equipment: p.equipment, 
          platform: p.location, 
          client: p.client,
          reportNum: p.reportNo, 
          date: new Date().toISOString().split('T')[0] 
        }
      }));
    }
  }, [location.state]);

  const updateRow = (id, field, val, table) => {
    const updated = reportData[table].map(row => row.id === id ? { ...row, [field]: val } : row);
    setReportData({ ...reportData, [table]: updated });
  };

  // Sn 1.4 Acceptance Logic: Reject if loss > 12.5% [cite: 13, 34]
  const getStatus = (nominal, min) => {
    const loss = nominal ? ((nominal - min) / nominal) * 100 : 0;
    return loss > 12.5 ? "REJECT" : "ACCEPT";
  };

  const handleSaveToFirebase = async () => {
    setIsSaving(true);
    try {
      await addDoc(collection(db, "inspection_reports"), {
        ...reportData,
        inspector: user?.displayName || "Technical Lead",
        timestamp: serverTimestamp()
      });
      toast.success("Inspection Data Saved to Firebase");
      setReportMode(true); // Toggle to web report view after save
    } catch (error) {
      toast.error("Error saving report: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (reportMode) {
    return <WebView reportData={reportData} setReportMode={setReportMode} user={user} getStatus={getStatus} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 ml-16 lg:ml-64 p-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
          <div className="max-w-6xl mx-auto">
            
            <header className="flex justify-between items-center mb-8 bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:text-orange-500 transition-colors"><ChevronLeft size={20} /></button>
                <h1 className="text-2xl font-bold uppercase tracking-tighter flex items-center gap-2">
                   <ShieldCheck className="text-orange-500" /> API 510 Inspection Hub
                </h1>
              </div>
              <button 
                onClick={handleSaveToFirebase}
                disabled={isSaving}
                className="bg-orange-600 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-orange-700 shadow-lg disabled:opacity-50"
              >
                <Save size={14} /> {isSaving ? "Saving..." : "Submit for Review"}
              </button>
            </header>

            {/* Navigation Tabs based on PDF S/N  */}
            <div className="flex border-b border-slate-800 mb-8 gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {['general', 'vesselData', 'visual', 'autMetrics', 'nozzleMut', 'shearWave'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? "text-orange-500 border-b-2 border-orange-500 pb-2" : "text-slate-500"}`}
                >
                  {tab === 'vesselData' ? '2. Vessel Data' : tab === 'autMetrics' ? '5. AUT Mapping' : tab === 'nozzleMut' ? '6. Nozzle MUT' : tab === 'shearWave' ? '7. Shear Wave' : tab.replace(/([A-Z])/g, ' $1')}
                </button>
              ))}
            </div>

            <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 backdrop-blur-md">
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                  <InputField label="Client" value={reportData.general.client} onChange={(v) => setReportData({...reportData, general: {...reportData.general, client: v}})} />
                  <InputField label="Platform" value={reportData.general.platform} onChange={(v) => setReportData({...reportData, general: {...reportData.general, platform: v}})} />
                  <InputField label="Tag Number" value={reportData.general.tag} onChange={(v) => setReportData({...reportData, general: {...reportData.general, tag: v}})} />
                  <InputField label="Test Code" value={reportData.general.testCode} onChange={(v) => setReportData({...reportData, general: {...reportData.general, testCode: v}})} />
                </div>
              )}

              {activeTab === 'vesselData' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                  <InputField label="Serial No." value={reportData.vesselData.serialNo} onChange={(v) => setReportData({...reportData, vesselData: {...reportData.vesselData, serialNo: v}})} />
                  <InputField label="Design Pressure" value={reportData.vesselData.designPressure} onChange={(v) => setReportData({...reportData, vesselData: {...reportData.vesselData, designPressure: v}})} />
                  <InputField label="Shell Thk" value={reportData.vesselData.shellThk} onChange={(v) => setReportData({...reportData, vesselData: {...reportData.vesselData, shellThk: v}})} />
                  <InputField label="Vessel Dia" value={reportData.vesselData.vesselDia} onChange={(v) => setReportData({...reportData, vesselData: {...reportData.vesselData, vesselDia: v}})} />
                </div>
              )}

              {activeTab === 'autMetrics' && (
                <div className="space-y-4">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="text-slate-500 uppercase tracking-widest font-bold">
                        <th className="p-4">X/Y Axis (mm)</th><th className="p-4">Nominal</th><th className="p-4">Min Found</th><th className="p-4">Loss %</th><th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.autMetrics.map((row) => (
                        <tr key={row.id} className="border-b border-slate-800/50">
                          <td className="p-4 flex gap-2">
                            <input className="bg-slate-900 border border-slate-800 rounded p-1 w-12 text-center" value={row.axialX} onChange={(e) => updateRow(row.id, "axialX", e.target.value, "autMetrics")} />
                            <input className="bg-slate-900 border border-slate-800 rounded p-1 w-12 text-center" value={row.axialY} onChange={(e) => updateRow(row.id, "axialY", e.target.value, "autMetrics")} />
                          </td>
                          <td className="p-4"><input className="bg-transparent outline-none w-16" value={row.nominal} onChange={(e) => updateRow(row.id, "nominal", e.target.value, "autMetrics")} /></td>
                          <td className="p-4"><input className={`bg-transparent outline-none w-16 font-bold ${getStatus(row.nominal, row.min) === 'REJECT' ? 'text-red-500' : 'text-emerald-500'}`} value={row.min} onChange={(e) => updateRow(row.id, "min", e.target.value, "autMetrics")} /></td>
                          <td className="p-4 font-mono">{row.nominal ? (((row.nominal - row.min) / row.nominal) * 100).toFixed(1) : 0}%</td>
                          <td className="p-4 text-center"><button onClick={() => setReportData({...reportData, autMetrics: reportData.autMetrics.filter(r => r.id !== row.id)})} className="text-slate-600 hover:text-red-500"><Trash2 size={14}/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={() => setReportData({...reportData, autMetrics: [...reportData.autMetrics, { id: Date.now(), axialX: "0", axialY: "0", nominal: "12.5", min: "12.5" }]})} className="w-full py-3 border-2 border-dashed border-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:border-orange-500/50 hover:text-orange-500 transition-all"><Plus size={14} className="inline mr-2"/> Add Scan Point</button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- TECHNICAL WEB REPORT VIEW (Maps to Sn 1-16) [cite: 23, 103, 220] ---
const WebView = ({ reportData, setReportMode, user, getStatus }) => (
  <div className="min-h-screen bg-white text-slate-900 p-12 font-serif">
    <div className="max-w-4xl mx-auto border-2 border-slate-900 p-10 relative">
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase">Client: {reportData.general.client}</div>
          <div className="text-[10px] font-bold uppercase">Platform: {reportData.general.platform}</div>
        </div>
        <div className="text-center">
          <h2 className="font-bold text-xl underline uppercase tracking-tighter">Corrosion Mapping Web Report</h2>
          <p className="text-[9px] font-bold mt-1">API 510 IN-SERVICE INSPECTION</p>
        </div>
        <div className="text-right text-[10px] font-bold">
          <div>Report No: {reportData.general.reportNum}</div>
          <div>Date: {reportData.general.date}</div>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="bg-slate-100 p-2 font-bold text-sm border-y border-slate-900 mb-4 uppercase">2. Vessel General Data [cite: 46]</h3>
        <div className="grid grid-cols-2 text-xs border border-slate-900">
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Tag Number</div><div className="p-2 border border-slate-900">{reportData.general.tag}</div>
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Serial Number</div><div className="p-2 border border-slate-900">{reportData.vesselData.serialNo}</div>
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Design Pressure</div><div className="p-2 border border-slate-900">{reportData.vesselData.designPressure}</div>
        </div>
      </section>
      <section className="mb-8">
        <h3 className="bg-slate-100 p-2 font-bold text-sm border-y border-slate-900 mb-4 uppercase">2. Vessel General Data [cite: 46]</h3>
        <div className="grid grid-cols-2 text-xs border border-slate-900">
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Tag Number</div><div className="p-2 border border-slate-900">{reportData.general.tag}</div>
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Serial Number</div><div className="p-2 border border-slate-900">{reportData.vesselData.serialNo}</div>
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Design Pressure</div><div className="p-2 border border-slate-900">{reportData.vesselData.designPressure}</div>
        </div>
      </section>
      <section className="mb-8">
        <h3 className="bg-slate-100 p-2 font-bold text-sm border-y border-slate-900 mb-4 uppercase">2. Vessel General Data [cite: 46]</h3>
        <div className="grid grid-cols-2 text-xs border border-slate-900">
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Tag Number</div><div className="p-2 border border-slate-900">{reportData.general.tag}</div>
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Serial Number</div><div className="p-2 border border-slate-900">{reportData.vesselData.serialNo}</div>
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Design Pressure</div><div className="p-2 border border-slate-900">{reportData.vesselData.designPressure}</div>
        </div>
      </section>
      <section className="mb-8">
        <h3 className="bg-slate-100 p-2 font-bold text-sm border-y border-slate-900 mb-4 uppercase">2. Vessel General Data [cite: 46]</h3>
        <div className="grid grid-cols-2 text-xs border border-slate-900">
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Tag Number</div><div className="p-2 border border-slate-900">{reportData.general.tag}</div>
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Serial Number</div><div className="p-2 border border-slate-900">{reportData.vesselData.serialNo}</div>
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Design Pressure</div><div className="p-2 border border-slate-900">{reportData.vesselData.designPressure}</div>
        </div>
      </section>
      <section className="mb-8">
        <h3 className="bg-slate-100 p-2 font-bold text-sm border-y border-slate-900 mb-4 uppercase">2. Vessel General Data [cite: 46]</h3>
        <div className="grid grid-cols-2 text-xs border border-slate-900">
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Tag Number</div><div className="p-2 border border-slate-900">{reportData.general.tag}</div>
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Serial Number</div><div className="p-2 border border-slate-900">{reportData.vesselData.serialNo}</div>
          <div className="p-2 border border-slate-900 bg-slate-50 font-bold">Design Pressure</div><div className="p-2 border border-slate-900">{reportData.vesselData.designPressure}</div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="bg-slate-100 p-2 font-bold text-sm border-y border-slate-900 mb-4 uppercase">5.4 AUT Data Acquisition [cite: 106]</h3>
        <table className="w-full text-[10px] border-collapse border border-slate-900">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-900 p-2">S/N</th>
              <th className="border border-slate-900 p-2">X/Y Axial (mm)</th>
              <th className="border border-slate-900 p-2">Nominal (mm)</th>
              <th className="border border-slate-900 p-2">Minimum (mm)</th>
              <th className="border border-slate-900 p-2">Wall Loss %</th>
              <th className="border border-slate-900 p-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {reportData.autMetrics.map((r, i) => {
              const status = getStatus(r.nominal, r.min);
              return (
                <tr key={i} className="text-center">
                  <td className="border border-slate-900 p-2">{i+1}</td>
                  <td className="border border-slate-900 p-2">{r.axialX} / {r.axialY}</td>
                  <td className="border border-slate-900 p-2">{r.nominal}</td>
                  <td className="border border-slate-900 p-2">{r.min}</td>
                  <td className="border border-slate-900 p-2 font-bold">{r.nominal ? (((r.nominal - r.min)/r.nominal)*100).toFixed(1) : 0}%</td>
                  <td className={`border border-slate-900 p-2 font-bold ${status === 'REJECT' ? 'text-red-600' : 'text-emerald-700'}`}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div className="mt-16 grid grid-cols-2 gap-12 text-[10px] border-t-2 border-slate-900 pt-8">
        <div>
          <p className="font-bold underline mb-4 uppercase">Inspector Verification [cite: 213]</p>
          <p>Name: {user?.displayName || "Technical Lead"}</p>
          <p className="mt-4 italic text-slate-400">Electronically Signed via InspectPro Hub</p>
        </div>
        <div className="text-right">
          <p className="font-bold underline mb-4 uppercase">NDE Advisor Review [cite: 218]</p>
          <div className="h-12 border-b border-slate-400 mb-2"></div>
          <p>Verified By / Date</p>
        </div>
      </div>

      <div className="mt-12 flex gap-4 no-print border-t border-slate-200 pt-6">
        <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded text-xs font-bold flex items-center gap-2 shadow-lg"><Printer size={14}/> Print Final Report</button>
        <button onClick={() => setReportMode(false)} className="bg-slate-800 text-white px-6 py-2 rounded text-xs font-bold">Back to Editor</button>
      </div>
    </div>
  </div>
);

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm text-white focus:border-orange-500 outline-none transition-all" 
    />
  </div>
);

export default Aut;