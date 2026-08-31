import React, { useState } from 'react';
import { 
  Megaphone, 
  X, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Sparkles, 
  Globe, 
  Radio,
  FileCheck
} from 'lucide-react';
import { useDrishti } from '../context/DrishtiContext';

export const AlertGeneratorModal: React.FC = () => {
  const { isAlertModalOpen, closeAlertModal, alertModalPreset, addAuditRecord } = useDrishti();

  const [situation, setSituation] = useState(alertModalPreset?.situation || "High pedestrian compression in Central Concourse Zone C");
  const [targetZones, setTargetZones] = useState(alertModalPreset?.targetZones || "Zone C and Zone D");
  const [actionRequired, setActionRequired] = useState(alertModalPreset?.actionRequired || "Please proceed calmly towards Gate 5 (South Avenue) for smooth exit");
  const [generating, setGenerating] = useState(false);
  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const [speakingLang, setSpeakingLang] = useState<string | null>(null);

  const [alerts, setAlerts] = useState({
    english: "ATTENTION ALL ATTENDEES: Due to high crowd density in Zone C, please move calmly towards Gate 5 on the South Avenue. Do not stop in transit aisles. Keep moving forward.",
    hindi: "कृपया ध्यान दें: जोन सी में अत्यधिक भीड़ के कारण, कृपया दक्षिण एवेन्यू पर स्थित गेट 5 की ओर शांतिपूर्वक आगे बढ़ें। रास्तों में न रुकें और निरंतर आगे बढ़ते रहें।",
    kannada: "ದಯವಿಟ್ಟು ಗಮನಿಸಿ: ಝೋನ್ ಸಿ ಯಲ್ಲಿ ಜನದಟ್ಟಣೆ ಹೆಚ್ಚಾಗಿರುವುದರಿಂದ, ಸಾರ್ವಜನಿಕರು ಶಾಂತಿಯುತವಾಗಿ ದಕ್ಷಿಣ ಅವೆನ್ಯೂದಲ್ಲಿರುವ ಗೇಟ್ 5 ಕಡೆಗೆ ತೆರಳಲು ಕೋರಲಾಗಿದೆ. ಮಾರ್ಗಮಧ್ಯೆ ನಿಲ್ಲದೆ ಮುನ್ನಡೆಯಿರಿ.",
  });

  if (!isAlertModalOpen) return null;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation, targetZones, actionRequired }),
      });

      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (e) {
      console.warn("Using localized template defaults:", e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text: string, lang: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  const handleSpeak = (text: string, langCode: string, langName: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speakingLang === langName) {
        setSpeakingLang(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.9; // Calm, intelligible cadence
      utterance.onend = () => setSpeakingLang(null);
      utterance.onerror = () => setSpeakingLang(null);

      setSpeakingLang(langName);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBroadcast = (lang: string, text: string) => {
    addAuditRecord(
      'ALERT_BROADCAST',
      `Broadcasted multilingual PA announcement (${lang}) to ${targetZones}.`,
      'Venue PA System',
      text
    );
    alert(`Public Announcement dispatched to venue PA and digital signage in ${lang}.`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 font-mono-code">
      <div className="bg-[#0F172A] border border-slate-800 rounded max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-scale-in">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0A0F1D]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white uppercase font-mono-code">
                MULTILINGUAL PUBLIC ALERT GENERATOR
              </h3>
              <p className="text-[10px] text-[#94A3B8] font-mono-code">
                CALM, INFORMATIVE, NON-PANIC ANNOUNCEMENTS (EN / HI / KN)
              </p>
            </div>
          </div>
          <button onClick={closeAlertModal} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs bg-[#0A0F1D]">
          
          {/* Situation Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#151C2C] p-3 rounded border border-slate-800">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 text-[11px]">Situation:</label>
              <input
                type="text"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className="w-full bg-[#0A0F1D] border border-slate-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 font-mono-code"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1 text-[11px]">Target Zones:</label>
              <input
                type="text"
                value={targetZones}
                onChange={(e) => setTargetZones(e.target.value)}
                className="w-full bg-[#0A0F1D] border border-slate-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 font-mono-code"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1 text-[11px]">Action Required:</label>
              <input
                type="text"
                value={actionRequired}
                onChange={(e) => setActionRequired(e.target.value)}
                className="w-full bg-[#0A0F1D] border border-slate-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 font-mono-code"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs shadow transition-colors flex items-center space-x-1.5 font-mono-code"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>{generating ? 'Regenerating...' : 'Regenerate Multilingual Broadcasts'}</span>
            </button>
          </div>

          {/* Multilingual Display Cards */}
          <div className="space-y-3">
            
            {/* ENGLISH */}
            <div className="bg-[#151C2C] p-3 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs flex items-center space-x-1.5 font-mono-code">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>ENGLISH BROADCAST</span>
                </span>

                <div className="flex items-center space-x-1.5 font-mono-code">
                  <button
                    onClick={() => handleSpeak(alerts.english, 'en-US', 'English')}
                    className="p-1.5 rounded bg-[#0A0F1D] hover:bg-slate-800 text-blue-300 border border-slate-700 text-xs flex items-center space-x-1 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{speakingLang === 'English' ? 'Stop Audio' : 'Audio Preview'}</span>
                  </button>
                  <button
                    onClick={() => handleCopy(alerts.english, 'English')}
                    className="p-1.5 rounded bg-[#0A0F1D] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-colors"
                  >
                    {copiedLang === 'English' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleBroadcast('English', alerts.english)}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition-colors"
                  >
                    Broadcast PA
                  </button>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed font-mono-code text-xs bg-[#0A0F1D] p-2.5 rounded border border-slate-800">
                "{alerts.english}"
              </p>
            </div>

            {/* HINDI */}
            <div className="bg-[#151C2C] p-3 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs flex items-center space-x-1.5 font-mono-code">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>HINDI (हिंदी) BROADCAST</span>
                </span>

                <div className="flex items-center space-x-1.5 font-mono-code">
                  <button
                    onClick={() => handleSpeak(alerts.hindi, 'hi-IN', 'Hindi')}
                    className="p-1.5 rounded bg-[#0A0F1D] hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs flex items-center space-x-1 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{speakingLang === 'Hindi' ? 'Stop Audio' : 'Audio Preview'}</span>
                  </button>
                  <button
                    onClick={() => handleCopy(alerts.hindi, 'Hindi')}
                    className="p-1.5 rounded bg-[#0A0F1D] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-colors"
                  >
                    {copiedLang === 'Hindi' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleBroadcast('Hindi', alerts.hindi)}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition-colors"
                  >
                    Broadcast PA
                  </button>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs bg-[#0A0F1D] p-2.5 rounded border border-slate-800">
                "{alerts.hindi}"
              </p>
            </div>

            {/* KANNADA */}
            <div className="bg-[#151C2C] p-3 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs flex items-center space-x-1.5 font-mono-code">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span>KANNADA (ಕನ್ನಡ) BROADCAST</span>
                </span>

                <div className="flex items-center space-x-1.5 font-mono-code">
                  <button
                    onClick={() => handleSpeak(alerts.kannada, 'kn-IN', 'Kannada')}
                    className="p-1.5 rounded bg-[#0A0F1D] hover:bg-slate-800 text-green-300 border border-slate-700 text-xs flex items-center space-x-1 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{speakingLang === 'Kannada' ? 'Stop Audio' : 'Audio Preview'}</span>
                  </button>
                  <button
                    onClick={() => handleCopy(alerts.kannada, 'Kannada')}
                    className="p-1.5 rounded bg-[#0A0F1D] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-colors"
                  >
                    {copiedLang === 'Kannada' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleBroadcast('Kannada', alerts.kannada)}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition-colors"
                  >
                    Broadcast PA
                  </button>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs bg-[#0A0F1D] p-2.5 rounded border border-slate-800">
                "{alerts.kannada}"
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#0F172A] text-[10px] text-slate-500 text-center font-mono-code">
          All broadcasts maintain a calm, directional tone to prevent crowd panic.
        </div>

      </div>
    </div>
  );
};
