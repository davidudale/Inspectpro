import React, { useEffect, useState } from "react";
// ... other imports

const InspectionLogs = () => {
  // ... existing state (inspections, loading, navigate)
  const [searchTerm, setSearchTerm] = useState("");
  const [phase, setPhase] = useState(1);
  const [selectedEquip, setSelectedEquip] = useState(null);

  // --- 1. SEARCH FILTER LOGIC ---
  // Filters the equipment list based on the search input
  const filteredEquipment = equipmentList.filter(
    (asset) =>
      asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- 2. DELETE FUNCTIONALITY ---
  const handleDeleteAsset = async (e, assetTag) => {
    e.stopPropagation(); // Prevents navigating to Phase 2 when clicking delete
    if (
      window.confirm(
        `CRITICAL: Purge all manifests associated with Asset ${assetTag}?`,
      )
    ) {
      try {
        // We find all batches containing this equipment reference
        const targets = inspections.filter((ins) =>
          ins.items?.some((item) => item.reference === assetTag),
        );

        await Promise.all(
          targets.map((t) => deleteDoc(doc(db, "inspections", t.id))),
        );
        toast.error(`Asset ${assetTag} manifests removed`);
      } catch (error) {
        toast.error("Deletion failed");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 ml-16 lg:ml-64 p-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
          <div className="max-w-7xl mx-auto">
            {/* SEARCH HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">
                  {phase === 1
                    ? "Technical Asset Hub"
                    : `Archives: ${selectedEquip}`}
                </h1>
              </div>

              {phase === 1 && (
                <div className="relative group w-full md:w-80">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search Tag or Equipment Name..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-xs focus:border-orange-500 outline-none transition-all shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* PHASE 1: EQUIPMENT GRID WITH ADMIN CONTROLS */}
            {phase === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
                {filteredEquipment.map((asset) => (
                  <div
                    key={asset.tag}
                    onClick={() => {
                      setSelectedEquip(asset.tag);
                      setPhase(2);
                    }}
                    className="group bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] hover:border-orange-500/50 transition-all cursor-pointer text-center relative overflow-hidden backdrop-blur-sm"
                  >
                    {/* HOVER ACTIONS */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/admin/equipment-management"); // Redirect to main manager for edits
                        }}
                        className="p-2 bg-slate-950 border border-slate-800 text-blue-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteAsset(e, asset.tag)}
                        className="p-2 bg-slate-950 border border-slate-800 text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <Cog
                      className="mx-auto mb-4 text-slate-700 group-hover:text-orange-500 group-hover:rotate-90 transition-all"
                      size={40}
                    />

                    <h3 className="text-white font-bold uppercase tracking-tight">
                      {asset.tag}
                    </h3>
                    <p className="text-[11px] text-orange-500/80 font-bold uppercase mt-1 truncate">
                      {asset.name || "Unnamed Asset"}
                    </p>

                    <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-center gap-2">
                      <Database size={10} className="text-slate-600" />
                      <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase">
                        Protocol Access
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State for Search */}
            {phase === 1 && filteredEquipment.length === 0 && (
              <div className="py-20 text-center opacity-50">
                <FileSearch className="mx-auto mb-4 text-slate-800" size={48} />
                <p className="text-xs uppercase font-bold tracking-widest">
                  No matching assets found
                </p>
              </div>
            )}

            {/* Existing Phase 2 and Phase 3 Logic remains below... */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InspectionLogs;
