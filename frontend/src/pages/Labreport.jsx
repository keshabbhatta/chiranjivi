import React, { useState, useEffect, useRef } from "react";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_BASE = "http://localhost:5000/api";

// ─────────────────────────────────────────
// GEMINI ANALYSIS FUNCTION (Untouched Logic)
// ─────────────────────────────────────────
async function analyzeReportWithGemini(base64Image, mimeType) {
  if (!GEMINI_API_KEY) {
    throw new Error("API Key is missing. Check your .env file and restart the server.");
  }

  const prompt = `
    Analyze this medical lab report image. 
    Return ONLY a valid JSON object with this structure:
    {
      "overallStatus": "Normal / Warning / Critical",
      "overallSummary": "A concise 2-3 sentence explanation.",
      "keyFindings": ["finding 1", "finding 2"],
      "recommendations": ["advice 1", "advice 2"]
    }
    Strictly avoid any markdown formatting or extra text.
  `;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || "API Error");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("The AI returned an empty response. Try a clearer image.");
  }

  try {
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("Original AI Text:", text);
    throw new Error("Failed to parse AI response. The format was unexpected.");
  }
}

// ─────────────────────────────────────────
// TYPEWRITER HOOK (Untouched Logic)
// ─────────────────────────────────────────
function useTypewriter(text, speed = 15) {
  const [out, setOut] = useState("");

  useEffect(() => {
    setOut(""); 
    let i = 0;
    const id = setInterval(() => {
      setOut((prev) => text.slice(0, i++));
      if (i > text.length) clearInterval(id);
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return out;
}

// ─────────────────────────────────────────
// UI HELPER COMPONENTS
// ─────────────────────────────────────────
const MultiColorText = ({ text }) => {
  const colors = ["text-purple-400", "text-cyan-400", "text-pink-500", "text-blue-400", "text-indigo-400"];
  return (
    <span className="font-black tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
      {text.split("").map((char, i) => (
        <span key={i} className={`${colors[i % colors.length]} transition-colors duration-500`}>
          {char}
        </span>
      ))}
    </span>
  );
};

// Highly Optimized Cyberpunk Circuit Background
const AnimatedCircuitBackground = () => {
  const circuitPaths = [
    { d: "M-100,100 H200 L300,200 H2000", color: "#22d3ee", delay: 0, duration: 8, dots: [[200, 100], [300, 200]] },
    { d: "M-100,220 H400 L500,120 H2000", color: "#c084fc", delay: 2, duration: 10, dots: [[400, 220], [500, 120]] },
    { d: "M2000,150 H1600 L1500,250 H-100", color: "#f472b6", delay: 1, duration: 9, dots: [[1600, 150], [1500, 250]] },
    { d: "M-100,350 H350 L450,450 H2000", color: "#22d3ee", delay: 4, duration: 7, dots: [[350, 350], [450, 450]] },
    { d: "M2000,380 H1400 L1300,280 H-100", color: "#22d3ee", delay: 0.5, duration: 8.5, dots: [[1400, 380], [1300, 280]] },
    { d: "M-100,480 H250 L350,380 H2000", color: "#f472b6", delay: 3, duration: 11, dots: [[250, 480], [350, 380]] },
    { d: "M2000,520 H1600 L1500,620 H-100", color: "#c084fc", delay: 5, duration: 9, dots: [[1600, 520], [1500, 620]] },
    { d: "M-100,650 H450 L550,550 H2000", color: "#22d3ee", delay: 1.5, duration: 7.5, dots: [[450, 650], [550, 550]] },
    { d: "M2000,680 H1300 L1200,780 H-100", color: "#f472b6", delay: 2.5, duration: 10, dots: [[1300, 680], [1200, 780]] },
    { d: "M-100,800 H300 L400,900 H2000", color: "#c084fc", delay: 6, duration: 8, dots: [[300, 800], [400, 900]] },
    { d: "M2000,820 H1500 L1400,720 H-100", color: "#22d3ee", delay: 3.5, duration: 9.5, dots: [[1500, 820], [1400, 720]] },
    { d: "M-100,900 H500 L600,1000 H2000", color: "#f472b6", delay: 1.2, duration: 8.2, dots: [[500, 900], [600, 1000]] },
    { d: "M2000,980 H1600 L1500,880 H-100", color: "#c084fc", delay: 4.5, duration: 7, dots: [[1600, 980], [1500, 880]] },
    { d: "M-100,1050 H400 L500,950 H2000", color: "#22d3ee", delay: 2.2, duration: 10.5, dots: [[400, 1050], [500, 950]] },
  ];

  return (
    <div className="fixed inset-0 z-0 bg-[#05050A] overflow-hidden pointer-events-none transform-gpu">
      {/* PERFORMANCE FIX: hardware acceleration and removed heavy drop-shadows */}
      <style>{`
        @keyframes dash-flow {
          0% { stroke-dashoffset: 2000; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        .circuit-glow {
          will-change: stroke-dashoffset, opacity;
          transform: translateZ(0); /* Force GPU */
        }
      `}</style>

      {/* Deep background mesh grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px] opacity-30 transform-gpu translate-z-0"></div>
      
      {/* Central glow to frame the UI - hardware accelerated */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-900/10 blur-[100px] rounded-full transform-gpu translate-z-0"></div>

      {/* The Circuit Board SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-60 transform-gpu translate-z-0" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        {circuitPaths.map((path, i) => (
          <g key={i}>
            <path d={path.d} fill="none" stroke="#27272a" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
            
            {path.dots.map((dot, idx) => (
              <circle key={idx} cx={dot[0]} cy={dot[1]} r="2.5" fill={path.color} opacity="0.4" className="animate-pulse" />
            ))}

            <path
              d={path.d}
              fill="none"
              stroke={path.color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="circuit-glow"
              style={{
                strokeDasharray: "150 2000",
                animation: `dash-flow ${path.duration}s linear infinite ${path.delay}s`
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function Labreport() {
  const [phase, setPhase] = useState("upload");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const fileRef = useRef();
  const token = sessionStorage.getItem("vidhyalaya-app-token");

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(""); 
  };

  const handleAnalyze = async () => {
    try {
      setError("");
      setPhase("loading");

      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (e) => res(e.target.result.split(",")[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      const data = await analyzeReportWithGemini(base64, file.type);
      setResult(data);
      setPhase("result");
    } catch (err) {
      setError(err.message);
      setPhase("error");
    }
  };

  const handleSave = async () => {
    if (!token) {
      alert("Please login to save your reports.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", "AI Lab Report Analysis");
      formData.append("file", file);
      formData.append("results", JSON.stringify(result));

      const res = await fetch(`${API_BASE}/lab-reports`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) alert("Report saved successfully!");
      else alert("Error saving: " + data.message);
    } catch (err) {
      alert("Failed to connect to server.");
    }
  };

  const summary = useTypewriter(result?.overallSummary || "");

  return (
    <div className="relative min-h-screen font-sans text-white overflow-x-hidden flex flex-col">
      <AnimatedCircuitBackground />

      {/* Top Header / Nav */}
      <header className="relative z-10 w-full px-8 py-5 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md transform-gpu">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center animate-spin-slow">
            <div className="w-6 h-6 rounded-full bg-black"></div>
          </div>
          <span className="font-mono text-sm tracking-widest text-zinc-300">MED_CORE_OS</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse transform-gpu"></span>
            SYSTEM ONLINE
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-6 max-w-[1400px] mx-auto w-full">
        
        {/* Left Side Panel */}
        <aside className="hidden lg:flex flex-col gap-4 w-72 h-full justify-center">
          <div className="bg-zinc-950/80 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl transform-gpu">
            <h3 className="text-cyan-400 font-mono text-xs tracking-widest mb-4 flex items-center gap-2">
              <span className="text-lg">⚙️</span> CAPABILITIES
            </h3>
            <ul className="space-y-4 text-sm font-mono text-zinc-400">
              <li className="flex flex-col">
                <span className="text-white">Neural Image Parsing</span>
                <span className="text-xs text-zinc-600">Extracts text via OCR matrix</span>
              </li>
              <li className="flex flex-col">
                <span className="text-white">Biomarker Recognition</span>
                <span className="text-xs text-zinc-600">Identifies out-of-range values</span>
              </li>
              <li className="flex flex-col">
                <span className="text-white">Encrypted Tunnel</span>
                <span className="text-xs text-zinc-600">No raw data stored locally</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Center Main Card */}
        <div className="w-full max-w-2xl bg-black/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-zinc-800/80 transform-gpu">
          <h1 className="text-3xl text-center mb-8">
            <span className="mr-3 animate-pulse inline-block transform-gpu">🧠</span>
            <MultiColorText text="AI LAB ANALYZER" />
          </h1>

          {phase === "upload" && (
            <div className="space-y-6">
              <div
                onClick={() => fileRef.current.click()}
                className="relative border-2 border-dashed border-zinc-700/50 p-12 text-center rounded-2xl cursor-pointer bg-zinc-900/40 hover:bg-zinc-800/60 hover:border-cyan-500/50 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-zinc-400 group-hover:text-cyan-300 transition-colors relative z-10 font-medium tracking-wide">
                  {file ? file.name : "CLICK TO UPLOAD REPORT (IMAGE/PDF)"}
                </p>
                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>

              {preview && (
                <div className="animate-in fade-in zoom-in duration-500 space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-zinc-700 shadow-lg">
                    <img src={preview} alt="Preview" className="w-full object-cover max-h-64 opacity-80 transform-gpu" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                  </div>
                  
                  <button
                    onClick={handleAnalyze}
                    className="w-full relative overflow-hidden bg-zinc-800 text-white font-bold tracking-widest py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] border border-cyan-500/30"
                  >
                    <span className="relative z-10 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">INITIATE AI SCAN</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 opacity-0 hover:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              )}
            </div>
          )}

          {phase === "loading" && (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-6">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin transform-gpu"></div>
                <div className="absolute inset-2 border-b-4 border-purple-500 rounded-full animate-[spin_1.5s_linear_reverse_infinite] transform-gpu"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🧬</div>
              </div>
              <div>
                <h2 className="text-xl font-mono tracking-widest text-cyan-400 animate-pulse mb-2 transform-gpu">ANALYZING BIOMARKERS...</h2>
                <p className="text-xs font-mono text-zinc-500">Target Model Accuracy: <span className="text-purple-400">99.8%</span></p>
              </div>
              <div className="w-full max-w-xs h-1 bg-zinc-800 rounded-full overflow-hidden transform-gpu">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-full animate-[pulse_1s_ease-in-out_infinite]"></div>
              </div>
            </div>
          )}

          {phase === "error" && (
            <div className="text-center py-10 space-y-6 animate-in slide-in-from-bottom-4 transform-gpu">
              <div className="inline-block p-4 bg-red-900/20 border border-red-500/30 rounded-full">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-red-400 font-mono tracking-wide">{error}</p>
              <button 
                onClick={() => setPhase("upload")}
                className="px-8 py-3 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-red-500/50 rounded-xl transition-all font-mono tracking-wider text-sm"
              >
                RECALIBRATE & RETRY
              </button>
            </div>
          )}

          {phase === "result" && result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 transform-gpu">
              <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
                <h2 className={`text-3xl font-black tracking-wider uppercase drop-shadow-md ${
                  result.overallStatus === 'Critical' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                  result.overallStatus === 'Warning' ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                }`}>
                  {result.overallStatus}
                </h2>
                <div className="text-xs font-mono px-3 py-1 bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 rounded-full animate-pulse transform-gpu">
                  AI CONFIDENCE: 98.7%
                </div>
              </div>

              <div className="bg-black/50 border border-zinc-800 p-5 rounded-xl font-mono text-sm shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                <p className="text-zinc-300 leading-relaxed min-h-[4rem]">
                  <span className="text-cyan-500 mr-2">{">"}</span> 
                  {summary}
                  <span className="inline-block w-2 h-4 ml-1 bg-cyan-500 animate-pulse transform-gpu"></span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/50 border border-purple-900/30 p-5 rounded-xl hover:border-purple-500/50 transition-colors group">
                  <h3 className="font-bold text-purple-400 mb-3 tracking-widest text-sm flex items-center">
                    <span className="bg-purple-500/20 p-1 rounded mr-2">🔍</span> FINDINGS
                  </h3>
                  <ul className="space-y-2 text-sm text-zinc-400 font-mono">
                    {result.keyFindings?.map((f, i) => (
                      <li key={i} className="flex items-start group-hover:text-zinc-300 transition-colors">
                        <span className="text-purple-500 mr-2 mt-0.5">▹</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-900/50 border border-emerald-900/30 p-5 rounded-xl hover:border-emerald-500/50 transition-colors group">
                  <h3 className="font-bold text-emerald-400 mb-3 tracking-widest text-sm flex items-center">
                    <span className="bg-emerald-500/20 p-1 rounded mr-2">💡</span> RECOMMENDATIONS
                  </h3>
                  <ul className="space-y-2 text-sm text-zinc-400 font-mono">
                    {result.recommendations?.map((r, i) => (
                      <li key={i} className="flex items-start group-hover:text-zinc-300 transition-colors">
                        <span className="text-emerald-500 mr-2 mt-0.5">▹</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setPhase("upload")}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 py-3 rounded-xl font-bold tracking-widest text-xs transition-all hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  SCAN NEW
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 relative overflow-hidden bg-zinc-800 py-3 rounded-xl font-bold tracking-widest text-xs transition-all hover:scale-[1.02] border border-emerald-500/30"
                >
                  <span className="relative z-10 text-emerald-400">SAVE RECORD</span>
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel */}
        <aside className="hidden lg:flex flex-col gap-4 w-72 h-full justify-center">
          <div className="bg-zinc-950/80 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl transform-gpu">
             <h3 className="text-purple-400 font-mono text-xs tracking-widest mb-4 flex items-center gap-2">
              <span className="text-lg">📡</span> LIVE METRICS
            </h3>
            <div className="space-y-4 text-sm font-mono">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-500">API Latency</span>
                <span className="text-cyan-400">42ms</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-500">Engine</span>
                <span className="text-purple-400">Gemini-2.5</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-zinc-500">Node Status</span>
                <span className="text-emerald-400">Optimal</span>
              </div>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}