import { React, useEffect, useState } from "react";
import AdminNavbar from "../../AdminNavbar";
import { PlusCircle, Edit2, Trash2, User } from "lucide-react"; // Added User icon for empty state
import AdminSidebar from "../../AdminSidebar";
import { db } from "../../../Auth/firebase"; 
// FIXED: Removed incorrect imports from firebase/auth
import { collection, onSnapshot, query } from "firebase/firestore";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const usersCollection = collection(db, "users");
  
  const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
    // This creates a BRAND NEW array of all documents currently in the collection
    const allUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    console.log("Total users fetched:", allUsers.length); // Debugging line
    setUsers(allUsers);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200">
      <AdminNavbar />
      <div className="flex flex-1 relative">
        <AdminSidebar />
        
        {/* FIXED: Removed the extra nested flex div that was wrapping <main> */}
        <main className="flex-1 ml-16 lg:ml-64 p-4 lg:p-8 min-h-[calc(100vh-65px)] overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                User Management
              </h1>
              <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-orange-900/20 active:scale-95">
                <PlusCircle size={16} />
                Add New User
              </button>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
              {loading ? (
                <div className="p-20 flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                  <p className="text-slate-500 text-sm animate-pulse">Accessing Encrypted Records....</p>
                </div>
              ) : users.length === 0 ? (
                <div className="p-20 text-center text-slate-500">
                  <User className="mx-auto mb-4 opacity-20" size={48} />
                  <p>No users found in the "users" collection.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/60 border-b border-slate-800">
                        <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Role</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/20 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-500 font-bold text-xs">
                                {user.name?.charAt(0) || "U"}
                              </div>
                              <span className="text-sm font-medium text-white">{user.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-slate-400">{user.email}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold uppercase text-slate-300">
                              {user.role || 'Inspector'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="p-2 text-slate-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
                              <button className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserPage;