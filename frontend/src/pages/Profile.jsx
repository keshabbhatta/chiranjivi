import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const API_BASE = "http://localhost:5000/api";

const Profile = () => {
  const { currentUser, isLoading, error } = useSelector((state) => state.user);
  
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    const fetchSavedReports = async () => {
      const token = sessionStorage.getItem("vidhyalaya-app-token");
      if (!token) return;

      setLoadingReports(true);
      try {
        const res = await fetch(`${API_BASE}/lab-reports`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const data = await res.json();
        
        if (data.success) {
          setReports(data.reports || data.data || []);
        } else if (Array.isArray(data)) {
          setReports(data);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoadingReports(false);
      }
    };

    if (currentUser) {
      fetchSavedReports();
    }
  }, [currentUser]);

  // 🔥 NEW: Delete Report Logic
  const handleDelete = async (reportId) => {
    const confirmDelete = window.confirm("⚠️ Are you sure you want to permanently delete this report?");
    if (!confirmDelete) return;

    try {
      const token = sessionStorage.getItem("vidhyalaya-app-token");
      const res = await fetch(`${API_BASE}/lab-reports/${reportId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        // Remove the deleted report from the UI immediately
        setReports(reports.filter((report) => report._id !== reportId));
      } else {
        alert(data.message || "Failed to delete the report.");
      }
    } catch (err) {
      console.error("Error deleting report:", err);
      alert("An error occurred while deleting the report.");
    }
  };

  const parseResult = (resultData) => {
    if (!resultData) return null;
    try {
      return typeof resultData === 'string' ? JSON.parse(resultData) : resultData;
    } catch (e) {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05050A] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#05050A] flex justify-center items-center text-red-500 font-mono">
        Error: {error}
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#05050A] flex justify-center items-center text-zinc-400 font-mono">
        No user session found. Please login.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050A] text-white p-8 font-sans overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <h1 className="text-3xl font-black tracking-widest uppercase bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-md mb-8">
          User Profile
        </h1>

        {/* User Info Card */}
        <div className="bg-black/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-900/10 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="relative">
            <img
              src={currentUser.userImage || "https://via.placeholder.com/150"}
              alt={`${currentUser.fullname}'s profile`}
              className="w-32 h-32 rounded-full object-cover border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] z-10 relative"
            />
            {currentUser.isAdmin && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-600 text-xs font-bold px-3 py-1 rounded-full border border-purple-400">
                ADMIN
              </span>
            )}
          </div>

          <div className="flex flex-col text-center md:text-left z-10">
            <h2 className="text-3xl font-bold text-zinc-100">{currentUser.fullname}</h2>
            <p className="text-cyan-400 font-mono text-sm mt-1">{currentUser.email}</p>
            
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-zinc-900/80 border border-zinc-700 px-4 py-2 rounded-xl text-sm font-mono">
                <span className="text-zinc-500">Status:</span> <span className="text-emerald-400 ml-2">Active</span>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-700 px-4 py-2 rounded-xl text-sm font-mono">
                <span className="text-zinc-500">Total Scans:</span> <span className="text-purple-400 ml-2">{reports.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Lab Reports */}
        <div className="mt-12">
          <h2 className="text-xl font-bold tracking-widest text-zinc-300 mb-6 flex items-center gap-3">
            <span className="text-2xl">🧬</span> SAVED LAB REPORTS
          </h2>

          {loadingReports ? (
            <div className="text-center py-12 text-cyan-400 font-mono animate-pulse">
              Retrieving encrypted records...
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-zinc-950/50 border border-dashed border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 font-mono">
              No lab reports saved yet. Analyze a report to see it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {reports.map((report, index) => {
                const resultObj = parseResult(report.results);
                if (!resultObj) return null;

                return (
                  <div key={report._id || index} className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group">
                    <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-zinc-800/50 pb-4 mb-4 gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-zinc-200">
                          {report.title || "AI Lab Report Analysis"}
                        </h3>
                        <span className="text-xs font-mono text-zinc-500">
                          {new Date(report.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {/* Status Badge & Delete Button Container */}
                      <div className="flex items-center gap-3">
                        <div className={`px-4 py-1 rounded-full text-xs font-bold font-mono border backdrop-blur-sm shadow-inner ${
                          resultObj.overallStatus === 'Critical' ? 'bg-red-900/20 text-red-400 border-red-500/30' : 
                          resultObj.overallStatus === 'Warning' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30' : 
                          'bg-emerald-900/20 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {resultObj.overallStatus}
                        </div>
                        
                        {/* 🔥 DELETE BUTTON */}
                        <button
                          onClick={() => handleDelete(report._id)}
                          title="Delete Report"
                          className="p-2 bg-zinc-900 hover:bg-red-900/40 border border-zinc-700 hover:border-red-500/50 text-zinc-400 hover:text-red-400 rounded-lg transition-all duration-300"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                      <span className="text-cyan-500 font-mono mr-2">{">"} Summary:</span> 
                      {resultObj.overallSummary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-black/40 rounded-xl p-4 border border-purple-900/20">
                        <h4 className="text-xs font-bold tracking-widest text-purple-400 mb-2">KEY FINDINGS</h4>
                        <ul className="space-y-1">
                          {resultObj.keyFindings?.slice(0, 3).map((finding, i) => (
                            <li key={i} className="text-xs text-zinc-500 flex items-start">
                              <span className="text-purple-500 mr-2">▹</span> {finding}
                            </li>
                          ))}
                          {resultObj.keyFindings?.length > 3 && (
                            <li className="text-xs text-zinc-600 mt-2 italic">+{resultObj.keyFindings.length - 3} more...</li>
                          )}
                        </ul>
                      </div>

                      <div className="bg-black/40 rounded-xl p-4 border border-emerald-900/20">
                        <h4 className="text-xs font-bold tracking-widest text-emerald-400 mb-2">RECOMMENDATIONS</h4>
                        <ul className="space-y-1">
                          {resultObj.recommendations?.slice(0, 3).map((rec, i) => (
                            <li key={i} className="text-xs text-zinc-500 flex items-start">
                              <span className="text-emerald-500 mr-2">▹</span> {rec}
                            </li>
                          ))}
                           {resultObj.recommendations?.length > 3 && (
                            <li className="text-xs text-zinc-600 mt-2 italic">+{resultObj.recommendations.length - 3} more...</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;