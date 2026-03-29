import React, { useState } from 'react';
import { 
  User, Bell, Lock, Palette, Globe, CreditCard, 
  ChevronRight, Check, Shield, Activity, Terminal, Cpu 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const SECTIONS = [
  { id: 'profile', icon: User, label: 'Profile_Registry' },
  { id: 'notifications', icon: Bell, label: 'Comms_Uplink' },
  { id: 'security', icon: Lock, label: 'Access_Protocol' },
  { id: 'appearance', icon: Palette, label: 'Visual_Output' },
  { id: 'language', icon: Globe, label: 'Regional_Sync' },
  { id: 'billing', icon: CreditCard, label: 'Resource_Credits' },
];

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-12 h-6 rounded-full transition-all duration-300 border border-white/5",
        on ? 'bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-zinc-800'
      )}
    >
      <div className={cn(
        "absolute top-1 w-4 h-4 rounded-full shadow-lg transition-transform duration-300",
        on ? 'translate-x-7 bg-white' : 'translate-x-1 bg-zinc-600'
      )} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true, achievements: true });
  const [appearance, setAppearance] = useState({ theme: 'dark', fontSize: 'medium' });
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-6 md:px-14 py-12 max-w-6xl mx-auto w-full min-h-screen font-sans bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
      
      <div className="mb-12 relative z-10">
        <div className="flex items-center gap-3 text-brand-blue font-mono text-[9px] font-black uppercase tracking-[0.4em] mb-4 italic bg-brand-blue/5 border border-brand-blue/20 w-fit px-4 py-1 rounded-lg">
           <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" /> SYSTEM_CONFIG
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white mb-2 uppercase italic leading-none underline decoration-brand-blue/30 underline-offset-8">Core_Settings</h1>
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest italic opacity-60">Architectural preference management console.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 relative z-10">
        {/* Sidebar Navigation */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-3xl p-3 border border-white/5 space-y-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black font-mono uppercase tracking-widest transition-all text-left italic relative overflow-hidden group",
                  activeSection === section.id 
                    ? 'bg-brand-blue text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)]' 
                    : 'text-zinc-600 hover:text-white hover:bg-white/5'
                )}
              >
                <section.icon size={16} className={cn(activeSection === section.id ? 'text-white' : 'text-zinc-700 group-hover:text-brand-blue')} />
                {section.label}
                {activeSection !== section.id && <ChevronRight size={14} className="ml-auto opacity-20" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Console */}
        <div className="flex-1 tech-card p-10 md:p-14 bg-zinc-900/20 backdrop-blur-3xl border-white/5 relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none"><Terminal size={200} /></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'profile' && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase mb-2">Unit_Identity</h2>
                    <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest italic leading-relaxed">Modify your system-level identification records.</p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-10 p-8 bg-black/40 border border-white/5 rounded-[2rem] group">
                    <div className="w-24 h-24 rounded-3xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 relative">
                       <Cpu size={32} className="relative z-10" />
                       <div className="absolute inset-0 bg-brand-blue blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <p className="font-mono font-black text-[10px] text-white uppercase italic tracking-widest mb-1">Visual_Avatar</p>
                      <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest mb-4">Supported: .RAW, .LOG, .HEX — MAX_RES: 2MB</p>
                      <button className="text-[10px] font-mono font-black bg-zinc-900 border border-white/5 text-brand-blue hover:text-white hover:bg-brand-blue transition-all px-6 py-3 rounded-xl uppercase italic tracking-widest">Transmit_New_File</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[['Node_Name', 'Playroom_Alpha'], ['Subscript', 'Builder'], ['Access_Email', 'admin@orbit.os'], ['Registry_ID', 'Unit_0x42']].map(([label, val]) => (
                      <div key={label}>
                        <label className="block text-[9px] font-mono font-black text-zinc-600 tracking-widest uppercase mb-3 italic">{label}</label>
                        <input defaultValue={val} className="w-full bg-black/40 border border-white/5 outline-none rounded-2xl px-6 py-4 font-mono font-black text-white text-xs placeholder:text-zinc-800 focus:border-brand-blue/30 transition-all uppercase italic tracking-tighter" />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-[9px] font-mono font-black text-zinc-600 tracking-widest uppercase mb-3 italic">System_Bio</label>
                      <textarea defaultValue="Building knowledge blocks for the future." rows={3} className="w-full bg-black/40 border border-white/5 outline-none rounded-3xl px-6 py-4 font-mono font-black text-white text-xs focus:border-brand-blue/30 transition-all resize-none italic tracking-tighter" />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase mb-2">Uplink_Protocols</h2>
                    <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest italic leading-relaxed">Configure asynchronous communication streams.</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email_Relay', desc: 'Syllabus updates and system-level reminders' },
                      { key: 'push', label: 'UI_Overlays', desc: 'Real-time browser telemetry alerts' },
                      { key: 'weekly', label: 'Status_Report', desc: 'Comprehensive Sunday performance audit' },
                      { key: 'achievements', label: 'Badge_Pings', desc: 'Notify upon logic synchronization success' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-8 bg-black/40 border border-white/5 rounded-[2rem] hover:bg-black/60 transition-colors">
                        <div>
                          <p className="font-mono font-black text-xs text-white uppercase italic tracking-tighter mb-1">{label}</p>
                          <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest italic">{desc}</p>
                        </div>
                        <Toggle on={notifs[key]} onToggle={() => setNotifs(n => ({ ...n, [key]: !n[key] }))} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'appearance' && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase mb-2">Visual_Heuristics</h2>
                    <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest italic leading-relaxed">Adjust the UI layer rendering parameters.</p>
                  </div>
                  <div className="mb-10">
                    <p className="text-[9px] font-mono font-black text-zinc-600 tracking-widest uppercase mb-6 italic">Color_Palette</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[{ id: 'light', label: 'White_Out', bg: 'bg-zinc-100', dot: 'bg-brand-blue' },
                        { id: 'dark', label: 'Space_Grade', bg: 'bg-[#09090B]', dot: 'bg-brand-blue' },
                        { id: 'system', label: 'Logic_Auto', bg: 'bg-gradient-to-tr from-zinc-100 to-[#09090B]', dot: 'bg-brand-blue' }
                      ].map(t => (
                        <button key={t.id} onClick={() => setAppearance(a => ({ ...a, theme: t.id }))}
                          className={cn(
                            "group p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 relative overflow-hidden",
                            appearance.theme === t.id ? 'border-brand-blue bg-brand-blue/5' : 'border-white/5 bg-black/40 hover:border-white/10'
                          )}
                        >
                          <div className={cn("w-full h-16 rounded-2xl shadow-2xl border border-white/10", t.bg)} />
                          <span className="text-[10px] font-mono font-black text-white uppercase italic tracking-tighter">{t.label}</span>
                          {appearance.theme === t.id && (
                             <div className="absolute top-3 right-3 w-5 h-5 bg-brand-blue rounded-full shadow-[0_0_10px_brand-blue] flex items-center justify-center"><Check size={12} className="text-white" /></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add more sections as needed matching the style above */}
            </motion.div>
          </AnimatePresence>

          {/* Unified Command Control */}
          <div className="mt-16 flex justify-end relative z-10 border-t border-white/5 pt-10">
            <button 
              onClick={handleSave} 
              className={cn(
                "flex items-center gap-3 font-mono font-black text-[11px] py-4 px-10 rounded-2xl transition-all uppercase italic tracking-widest",
                saved 
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                  : 'bg-white hover:bg-zinc-200 text-black shadow-xl hover:-translate-y-1'
              )}
            >
              {saved ? <><Check size={18} /> SYNC_COMPLETE_</> : <>PUSH_CHANGES <Activity size={18} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
