import React, { useState } from 'react';
import { 
  Award, 
  X, 
  Play, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight, 
  GitFork, 
  Radio, 
  Lock,
  Sparkles
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';

export const JudgeModeModal: React.FC = () => {
  const { isJudgeModeOpen, setIsJudgeModeOpen, startLiveDemo } = useDrishti();
  const [activeJudgeTab, setActiveJudgeTab] = useState<'flow' | 'faq' | 'project'>('flow');

  if (!isJudgeModeOpen) return null;

  const pitchSteps = [
    {
      time: "0:00 - 0:15",
      title: "The Problem (Conventional Systems Fail)",
      desc: "Standard CCTV and ticket counters only detect stampedes after crushes occur. They never answer what will happen if you close or open a gate."
    },
    {
      time: "0:15 - 0:35",
      title: "Macroscopic Risk Detection",
      desc: "DRISHTI-X computes an explainable 6-factor hydrodynamic risk score 8-12 minutes in advance without facial recognition or privacy violation."
    },
    {
      time: "0:35 - 0:65",
      title: "Core Innovation: Counterfactual What-If Simulator",
      desc: "Before making physical orders, commanders simulate Strategy A (Close Gate 3 -> spills into Zone D) vs Strategy C (Throttle Gate 3 + Open Gate 5 -> safe dispersal)."
    },
    {
      time: "0:65 - 0:80",
      title: "Human-in-the-Loop & Cryptographic Audit",
      desc: "No automated panic actions. Every decision requires human commander approval and is cryptographically hashed for after-action accountability."
    },
    {
      time: "0:80 - 0:90",
      title: "Edge Resilience & NCC Ground Integration",
      desc: "Operates 100% locally during internet blackout. Deploys trained NCC cadet squads for directional barrier management and calm crowd guidance."
    }
  ];

  const judgeFaqs = [
    {
      q: "What makes DRISHTI-X fundamentally different from existing smart city CCTV systems?",
      a: "Existing systems are reactive recording tools with basic object counting. DRISHTI-X introduces counterfactual simulation: predicting how human density distributes across adjacent sectors before a gate is closed or opened."
    },
    {
      q: "How does the system prevent operator over-reliance or false panics?",
      a: "All models output an explicit Uncertainty / Confidence rating (e.g. 86%). The system presents trade-offs rather than definitive commands, mandating human officer verification before any alert or dispatch."
    },
    {
      q: "Can this system function during massive network congestion or internet outage?",
      a: "Yes. DRISHTI-X features an offline local edge safety engine. Even when cloud links fail, the hydrodynamic model, tactical map, and decision ledger continue uninterrupted on local hardware."
    },
    {
      q: "How are NCC cadets integrated into this operational workflow?",
      a: "Cadets serve as trained ground response squads (Teams Alpha, Bravo, Charlie, Delta) stationed at key bottleneck junctions. They receive directional guidance to calmly adjust physical barricades and assist public flow."
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 font-mono-code">
      <div className="bg-[#0F172A] border border-amber-600/80 rounded max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-scale-in">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0A0F1D]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-amber-600 text-white shadow-md shadow-amber-900/50">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono-code text-base font-bold text-white uppercase tracking-wider">
                JUDGE SHOWCASE & EVALUATION BRIEFING
              </h3>
              <p className="text-xs text-amber-300 font-mono-code">
                NCC IDEA & INNOVATION COMPETITION PROTOTYPE
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsJudgeModeOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-2 px-4 pt-3 border-b border-slate-800 text-xs bg-[#151C2C]">
          <button
            onClick={() => setActiveJudgeTab('flow')}
            className={`pb-2 px-2 font-bold transition-colors border-b-2 font-mono-code ${
              activeJudgeTab === 'flow'
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            90-Second Pitch Walkthrough
          </button>
          <button
            onClick={() => setActiveJudgeTab('faq')}
            className={`pb-2 px-2 font-bold transition-colors border-b-2 font-mono-code ${
              activeJudgeTab === 'faq'
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Technical & Practical FAQ (4 Key Questions)
          </button>
          <button
            onClick={() => setActiveJudgeTab('project')}
            className={`pb-2 px-2 font-bold transition-colors border-b-2 font-mono-code ${
              activeJudgeTab === 'project'
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Candidate & Project Credentials
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs bg-[#0A0F1D]">
          
          {/* TAB 1: 90-SECOND WALKTHROUGH */}
          {activeJudgeTab === 'flow' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#151C2C] p-3 rounded border border-slate-800">
                <div>
                  <span className="font-bold text-white text-xs block font-mono-code">
                    Fast Live Demonstration Sequence
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Runs an automated 8-phase escalation from normal crowd to AI simulation & approval.
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsJudgeModeOpen(false);
                    startLiveDemo();
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded text-xs shadow transition-colors font-mono-code"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start 8-Phase Demo</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {pitchSteps.map((step, idx) => (
                  <div key={idx} className="bg-[#151C2C] p-3 rounded border border-slate-800 flex items-start space-x-3">
                    <span className="px-2 py-1 bg-amber-950 text-amber-300 font-mono-code font-bold rounded border border-amber-800 text-[10px] flex-shrink-0">
                      {step.time}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-xs mb-0.5 font-mono-code">
                        {step.title}
                      </h4>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: JUDGE FAQS */}
          {activeJudgeTab === 'faq' && (
            <div className="space-y-3">
              {judgeFaqs.map((faq, idx) => (
                <div key={idx} className="bg-[#151C2C] p-3.5 rounded border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-amber-300 text-xs flex items-center space-x-1.5 font-mono-code">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-slate-200 text-[11px] leading-relaxed pl-5 font-mono-code">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PROJECT & CANDIDATE CREDENTIALS */}
          {activeJudgeTab === 'project' && (
            <div className="bg-[#151C2C] p-4 rounded border border-slate-800 space-y-3 font-mono-code">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">PROJECT TITLE</span>
                  <span className="text-white font-bold">DRISHTI-X</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">TAGLINE</span>
                  <span className="text-blue-400 font-medium">"Detect the risk. Simulate the response. Let trained people decide."</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">PROJECT OWNER / LEAD</span>
                  <span className="text-white font-bold">Pavan C N</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">REGISTRATION NUMBER</span>
                  <span className="text-amber-300 font-bold">KA2025SDIA2540816</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">COMPETITION</span>
                  <span className="text-white">NCC Idea & Innovation Competition</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase">PROTOTYPE CLASSIFICATION</span>
                  <span className="text-green-400">TRL-4 Functional Proof-of-Concept</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>• Built with strict privacy by design (Zero biometric / face recognition dependencies).</p>
                <p>• Verified across realistic synthetic simulations of high-density events.</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between text-xs font-mono-code">
          <span className="text-slate-400">
            NCC Idea & Innovation Prototype • Reg: KA2025SDIA2540816
          </span>
          <button
            onClick={() => setIsJudgeModeOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded transition-colors"
          >
            Close Briefing
          </button>
        </div>

      </div>
    </div>
  );
};
