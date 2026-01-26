import React, { useEffect, useState } from "react";
import AdminNavbar from "../../AdminNavbar";
import {
  PlusCircle, Edit2, Trash2, Clock, ChevronRight, FileSearch,
  Database, Tag, MapPin, Search, User, ExternalLink, ArrowLeft, Cog, AlertTriangle, Zap
} from "lucide-react";
import AdminSidebar from "../../AdminSidebar";
import { db } from "../../../Auth/firebase";
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InspectionLogs = () => {
  const [inspections, setInspections] = useState([]);
  const [masterInspectionTypes, setMasterInspectionTypes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Drill-down State
  const [phase, setPhase] = useState(1); 
  const [selectedEquip, setSelectedEquip] = useState(null); 
  const [selectedTechnique, setSelectedTechnique] = useState(null); // Now tracking specific technique

  useEffect(() => {
    const qLogs = query(collection(db, "inspections"), orderBy("timestamp", "desc"));
    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      setInspections(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const qTypes = query(collection(db, "inspection_types"), orderBy("title", "asc"));
    const unsubTypes = onSnapshot(qTypes, (snapshot) => {
      setMasterInspectionTypes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubLogs(); unsubTypes(); };
  }, []);

  // --- PHASE LOGIC ---

  // Phase 1: Unique Equipment List
  const equipmentList = Array.from(
    new Set(inspections.flatMap(batch => 
      batch.items?.map(item => JSON.stringify({ tag: item.reference, name: item.Equipment })) || []
    ))
  ).map(str => JSON.parse(str))
   .filter(item => item.tag && (
      item.tag.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
   ));

  // Phase 2: FETCH SPECIFIC TECHNIQUES from the Master Collection
  // We extract all unique 'requiredTechniques' strings from the master collection documents
  const availableTechniques = Array.from(
    new Set(masterInspectionTypes.flatMap(type => type.requiredTechniques || []))
  ).filter(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));

  // Phase 3: Final report table filtered by Asset + Specific Technique
  const finalFilteredData = inspections.filter((batch) => {
    const matchesEquip = batch.items?.some(item => item.reference === selectedEquip);
    const matchesTech = batch.items?.some(item => item.type === selectedTechnique); // Matches the NDE Method selected
    const matchesSearch = 
      batch.items?.[0]?.Client?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      batch.items?.[0]?.Report_No?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesEquip && matchesTech && matchesSearch;
  });

  const handleBack = () => {
    setSearchTerm(""); 
    if (phase === 3) {
        setPhase(2);
        setSelectedTechnique(null);
    }
    else if (phase === 2) {
      setPhase(1);
      setSelectedEquip(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
      <AdminNavbar />
      <div className="flex flex-1 relative">
        <AdminSidebar />
        <main className="flex-1 ml-16 lg:ml-64 p-4 lg:p-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-6">
              <div className="flex items-center gap-4">
                {phase > 1 && (
                  <button onClick={handleBack} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-orange-500 hover:bg-orange-600 hover:text-white transition-all shadow-lg">
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tighter uppercase">
                     {phase === 1 && "Technical Asset Hub"}
                     {phase === 2 && `Required Techniques: ${selectedEquip}`}
                     {phase === 3 && `${selectedTechnique} Archives: ${selectedEquip}`}
                  </h1>
                </div>
              </div>

              <div className="relative group min-w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={16} />
                <input 
                  type="text"
                  placeholder={phase === 1 ? "Search Assets..." : phase === 2 ? "Search Techniques..." : "Search Reports..."}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:border-orange-500 outline-none transition-all backdrop-blur-md shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="py-40 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div></div>
            ) : (
              <>
                {/* PHASE 1: EQUIPMENT HUB */}
                {phase === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {equipmentList.map((asset) => (
                      <div key={asset.tag} onClick={() => { setSelectedEquip(asset.tag); setPhase(2); setSearchTerm(""); }} className="group bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-orange-500/50 transition-all cursor-pointer text-center relative overflow-hidden backdrop-blur-md">
                        <Cog className="mx-auto mb-4 text-slate-700 group-hover:text-orange-500 group-hover:rotate-90 transition-all" size={40} />
                        <h3 className="text-white font-bold uppercase tracking-tight">{asset.tag}</h3>
                        <p className="text-[11px] text-orange-500/80 font-bold uppercase mt-1 truncate">{asset.name || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* PHASE 2: REQUIRED TECHNIQUES DRILL-DOWN */}
                {phase === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {availableTechniques.map((tech) => (
                      <div key={tech} onClick={() => { setSelectedTechnique(tech); setPhase(3); setSearchTerm(""); }} className="group bg-slate-950 border border-slate-800 p-8 rounded-3xl hover:bg-orange-600 transition-all cursor-pointer flex flex-col items-start gap-4 shadow-xl">
                        <div className="p-4 bg-slate-900 rounded-2xl text-orange-500 group-hover:bg-white/20 group-hover:text-white transition-colors shadow-inner">
                            <Zap size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white uppercase tracking-tighter">{tech}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold group-hover:text-white/70 tracking-widest">Master Technique</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PHASE 3: FINAL TABLE */}
                {phase === 3 && (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-950/50">
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Manifest</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Facility</th>
                            <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {finalFilteredData.map((batch) => {
                            const main = batch.items?.find(i => i.reference === selectedEquip && i.type === selectedTechnique) || batch.items[0];
                            return (
                              <tr key={batch.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-6">
                                  <p className="text-sm font-bold text-white uppercase">{main.Client}</p>
                                  <p className="text-[9px] font-mono text-slate-500 mt-0.5">{main.Report_No}</p>
                                </td>
                                <td className="p-6 text-xs text-slate-400 uppercase tracking-widest">{main.Location}</td>
                                <td className="p-6 text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => navigate(`/admin/edit-inspection/${batch.id}`)} className="p-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-blue-500 rounded-xl transition-all shadow-inner"><Edit2 size={14} /></button>
                                    <button onClick={() => navigate(`/admin/inspection-details/${batch.id}`)} className="p-2 bg-orange-600/10 text-orange-500 rounded-xl transition-all shadow-inner"><ExternalLink size={14} /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InspectionLogs;