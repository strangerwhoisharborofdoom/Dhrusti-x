import React, { useState } from 'react';
import { 
  Eye, 
  Upload, 
  Camera, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Activity, 
  HelpCircle,
  FileImage
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';

export const VisionInputView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('CAM_03');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>({
    estimatedDensity: 4.8,
    crowdCountRange: "1,200 - 1,450 attendees",
    flowDirection: "COUNTER_FLOW (East vs West convergence)",
    flowVelocity: "0.28 m/s (Near-Stagnation)",
    riskScore: 84,
    riskLevel: "CRITICAL",
    bottlenecks: ["Gate 3 turnstile pinch", "Exit E2 restricted clearance"],
    recommendations: ["Throttle Gate 3 ingress by 40%", "Open Gate 5 auxiliary route"],
  });

  const presets = [
    {
      id: 'CAM_01',
      name: 'Cam 01: North Ingress Gate 1',
      zone: 'Zone A',
      density: 1.8,
      status: 'NORMAL',
      previewGradient: 'from-emerald-950/60 to-slate-900',
    },
    {
      id: 'CAM_03',
      name: 'Cam 03: Central Junction Zone C (Bottleneck)',
      zone: 'Zone C',
      density: 4.9,
      status: 'CRITICAL',
      previewGradient: 'from-rose-950/80 to-slate-900',
    },
    {
      id: 'CAM_05',
      name: 'Cam 05: South Avenue Gate 5 (Dispersal)',
      zone: 'Zone E',
      density: 1.4,
      status: 'OPTIMAL',
      previewGradient: 'from-blue-950/60 to-slate-900',
    }
  ];

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    setAnalyzing(true);

    setTimeout(() => {
      if (presetId === 'CAM_03') {
        setAnalysisResult({
          estimatedDensity: 4.9,
          crowdCountRange: "1,200 - 1,450 attendees",
          flowDirection: "COUNTER_FLOW (Opposing vector collision)",
          flowVelocity: "0.28 m/s (Near-Stagnation)",
          riskScore: 84,
          riskLevel: "CRITICAL",
          bottlenecks: ["Gate 3 narrow ingress", "Exit E2 partition restriction"],
          recommendations: ["Throttle Gate 3 inflow", "Open Gate 5 wide avenue"],
        });
      } else if (presetId === 'CAM_01') {
        setAnalysisResult({
          estimatedDensity: 1.8,
          crowdCountRange: "400 - 550 attendees",
          flowDirection: "UNIDIRECTIONAL_SOUTH",
          flowVelocity: "1.12 m/s (Smooth)",
          riskScore: 22,
          riskLevel: "LOW",
          bottlenecks: ["None detected"],
          recommendations: ["Maintain baseline gate flow"],
        });
      } else {
        setAnalysisResult({
          estimatedDensity: 1.4,
          crowdCountRange: "300 - 420 attendees",
          flowDirection: "UNIDIRECTIONAL_SOUTH",
          flowVelocity: "1.25 m/s (High Throughput)",
          riskScore: 18,
          riskLevel: "LOW",
          bottlenecks: ["None detected"],
          recommendations: ["Ready to receive diverted pedestrian flow from Zone C"],
        });
      }
      setAnalyzing(false);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/gemini/analyze-crowd-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg',
            zoneContext: 'Zone C (Central Concourse)'
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setAnalysisResult(data);
        } else {
          // Fallback
          setAnalysisResult({
            estimatedDensity: 3.8,
            crowdCountRange: "800 - 1,000 attendees",
            flowDirection: "MODERATE_CONVERGENCE",
            flowVelocity: "0.65 m/s",
            riskScore: 64,
            riskLevel: "HIGH",
            bottlenecks: ["Pedestrian density accumulation"],
            recommendations: ["Activate perimeter barrier guide"],
          });
        }
      } catch (err) {
        console.warn("Analysis fallback:", err);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#0F172A] border border-slate-800 p-4 space-y-2 rounded shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800">
              <Eye className="w-5 h-5" />
            </span>
            <h2 className="font-mono-code text-base font-bold tracking-wider text-white uppercase">
              COMPUTER VISION & OPTICAL CROWD DENSITY ANALYSIS
            </h2>
          </div>
          <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#0A0F1D] text-blue-300 border border-blue-800">
            GEMINI-POWERED MACROSCOPIC VISION
          </span>
        </div>
        <p className="text-xs text-[#94A3B8]">
          Evaluates macroscopic crowd density, turbulence, and directional vectors from simulated CCTV optical inputs or image uploads.
        </p>
      </div>

      {/* PRIVACY MANDATE BANNER */}
      <div className="bg-[#0A0F1D] border border-blue-800/80 rounded p-3.5 flex items-start space-x-3 text-xs">
        <div className="p-2 rounded bg-blue-950/80 text-blue-400 border border-blue-800 flex-shrink-0 mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <span className="font-mono-code font-bold text-blue-300 text-xs block uppercase">
            STRICT ETHICAL & PRIVACY MANDATE (NCC CODE OF CONDUCT)
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5 font-mono-code">
            DRISHTI-X operates solely on <strong>macroscopic pixel density, flow vectors, and spatial heatmaps</strong>. 
            <span className="text-amber-300 font-semibold"> NO FACIAL RECOGNITION, NO IDENTITY TRACKING, NO INDIVIDUAL PROFILING, AND NO BIOMETRIC DATA COLLECTION IS EVER PERFORMED.</span>
          </p>
        </div>
      </div>

      {/* CAMERA FEEDS & UPLOAD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Feed Selectors & Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold font-mono-code uppercase text-slate-400 block px-1">
            SELECT SIMULATED CAMERA FEED:
          </span>

          <div className="space-y-2">
            {presets.map(p => {
              const isSelected = selectedPreset === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className={`p-3 rounded border transition-all cursor-pointer bg-gradient-to-r ${p.previewGradient} ${
                    isSelected ? 'border-blue-500 shadow-md ring-1 ring-blue-500/40' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white">{p.name}</span>
                    <span className={`text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded border ${
                      p.status === 'CRITICAL' ? 'bg-red-950/80 text-red-300 border-red-700' : 'bg-green-950/80 text-green-300 border-green-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-code">
                    <span>{p.zone}</span>
                    <span className="text-blue-400 font-bold">{p.density} ppl/m²</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Upload Dropzone */}
          <div className="bg-[#151C2C] p-4 rounded border border-slate-800 text-center space-y-2 shadow-sm">
            <Upload className="w-6 h-6 text-blue-400 mx-auto" />
            <div className="text-xs font-bold text-slate-200 font-mono-code">
              Upload Aerial / CCTV Frame
            </div>
            <p className="text-[10px] text-slate-400">
              Supports JPEG, PNG frames for macroscopic AI density estimation.
            </p>
            <label className="inline-block mt-2 px-3 py-1.5 bg-[#0A0F1D] hover:bg-slate-800 text-blue-300 text-xs font-semibold rounded border border-blue-800/80 cursor-pointer transition-colors font-mono-code">
              <span>Choose Image File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right: Vision Model Diagnostics Deck (7 cols) */}
        <div className="lg:col-span-7 bg-[#151C2C] rounded border border-slate-800 p-4 space-y-4 shadow-sm">
          
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm text-white uppercase font-mono-code">
                OPTICAL ANALYSIS REPORT ({selectedPreset})
              </h3>
            </div>
            <span className="text-xs font-mono-code text-slate-400">
              {analyzing ? '⚡ COMPUTING DENSITY...' : 'READY'}
            </span>
          </div>

          {/* Results Display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#0A0F1D] p-3 rounded border border-slate-800 text-xs font-mono-code">
            <div>
              <span className="text-slate-400 text-[10px] block">ESTIMATED DENSITY</span>
              <span className={`text-base font-bold ${analysisResult.estimatedDensity >= 4.0 ? 'text-red-400' : 'text-green-400'}`}>
                {analysisResult.estimatedDensity} ppl/m²
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">ESTIMATED COUNT</span>
              <span className="text-white font-bold">{analysisResult.crowdCountRange}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">FLOW VELOCITY</span>
              <span className="text-amber-400 font-bold">{analysisResult.flowVelocity}</span>
            </div>
          </div>

          {/* Movement Vector */}
          <div className="bg-[#0A0F1D] p-3 rounded border border-slate-800 text-xs space-y-1 font-mono-code">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              DETECTED FLOW DYNAMICS & TURBULENCE:
            </span>
            <div className="text-slate-200 font-semibold flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>{analysisResult.flowDirection}</span>
            </div>
          </div>

          {/* Detected Bottlenecks */}
          <div className="bg-[#0A0F1D] p-3 rounded border border-slate-800 text-xs space-y-1.5 font-mono-code">
            <span className="text-[10px] uppercase font-bold text-red-400 block">
              IDENTIFIED BOTTLENECKS:
            </span>
            <ul className="space-y-1 text-slate-300">
              {analysisResult.bottlenecks?.map((b: string, i: number) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-[#0A0F1D] p-3 rounded border border-blue-800/80 text-xs space-y-1.5 font-mono-code">
            <span className="text-[10px] uppercase font-bold text-blue-400 block flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>AI TACTICAL SUGGESTIONS:</span>
            </span>
            <ul className="space-y-1 text-slate-200">
              {analysisResult.recommendations?.map((r: string, i: number) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
