import React, { useState } from 'react';
import { User, Bell, Lock, Palette, Globe, CreditCard, ChevronRight, Check } from 'lucide-react';

const SECTIONS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security', icon: Lock, label: 'Security' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'language', icon: Globe, label: 'Language & Region' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
];

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${on ? 'bg-brand-blue' : 'bg-[#E0DBD4]'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${on ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true, achievements: true });
  const [appearance, setAppearance] = useState({ theme: 'light', fontSize: 'medium' });
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-6 md:px-10 py-8 max-w-5xl mx-auto w-full">
      <h1 className="text-4xl font-display font-extrabold tracking-tight text-brand-text mb-1">Settings</h1>
      <p className="text-brand-muted font-medium mb-8">Manage your account and preferences</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-60 flex-shrink-0">
          <div className="bg-white rounded-4xl p-3 shadow-sm border border-border space-y-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-3xl text-sm font-bold transition-all text-left ${activeSection === section.id ? 'bg-brand-blue text-white shadow-sm' : 'text-brand-muted hover:text-brand-text hover:bg-[#F7F4EE]'}`}
              >
                <section.icon size={17} />
                {section.label}
                {activeSection !== section.id && <ChevronRight size={15} className="ml-auto opacity-40" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Content Panel */}
        <div className="flex-1 bg-white rounded-4xl p-8 shadow-sm border border-border">
          
          {activeSection === 'profile' && (
            <div>
              <h2 className="text-2xl font-display font-bold mb-6 tracking-tight">Profile Information</h2>
              <div className="flex items-center gap-6 mb-8 p-5 bg-[#F7F4EE] rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-brand-darkBlue flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-3xl font-black text-white">P</span>
                </div>
                <div>
                  <p className="font-bold text-brand-text mb-1">Profile Picture</p>
                  <p className="text-brand-muted text-sm mb-3">JPG, PNG or GIF — max 2MB</p>
                  <button className="text-sm bg-white text-brand-blue border border-brand-blue/20 font-bold py-2 px-5 rounded-full hover:bg-brand-blue/5 transition-colors">Upload Photo</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[['First Name', 'Playroom'], ['Last Name', 'Builder'], ['Email', 'builder@playroom.io'], ['Username', '@playroom']].map(([label, val]) => (
                  <div key={label}>
                    <label className="block text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-2">{label}</label>
                    <input defaultValue={val} className="w-full bg-[#F7F4EE] border-none outline-none rounded-2xl px-5 py-3.5 font-semibold text-brand-text focus:ring-2 focus:ring-brand-blue/30 transition-all" />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-2">Bio</label>
                  <textarea defaultValue="Building knowledge blocks for the future." rows={3} className="w-full bg-[#F7F4EE] border-none outline-none rounded-2xl px-5 py-3.5 font-semibold text-brand-text focus:ring-2 focus:ring-brand-blue/30 transition-all resize-none" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div>
              <h2 className="text-2xl font-display font-bold mb-6 tracking-tight">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive course updates and reminders via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Browser push alerts for new lessons' },
                  { key: 'weekly', label: 'Weekly Report', desc: 'A summary of your learning stats every Sunday' },
                  { key: 'achievements', label: 'Achievement Alerts', desc: 'Get notified when you earn badges or complete a course' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-5 bg-[#F7F4EE] rounded-3xl">
                    <div>
                      <p className="font-bold text-brand-text">{label}</p>
                      <p className="text-brand-muted text-sm">{desc}</p>
                    </div>
                    <Toggle on={notifs[key]} onToggle={() => setNotifs(n => ({ ...n, [key]: !n[key] }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div>
              <h2 className="text-2xl font-display font-bold mb-6 tracking-tight">Security</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-2">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#F7F4EE] border-none outline-none rounded-2xl px-5 py-3.5 font-semibold text-brand-text focus:ring-2 focus:ring-brand-blue/30 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-2">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#F7F4EE] border-none outline-none rounded-2xl px-5 py-3.5 font-semibold text-brand-text focus:ring-2 focus:ring-brand-blue/30 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-2">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#F7F4EE] border-none outline-none rounded-2xl px-5 py-3.5 font-semibold text-brand-text focus:ring-2 focus:ring-brand-blue/30 transition-all" />
                </div>
                <div className="flex items-center justify-between p-5 bg-[#F7F4EE] rounded-3xl">
                  <div>
                    <p className="font-bold text-brand-text">Two-Factor Authentication</p>
                    <p className="text-brand-muted text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <Toggle on={false} onToggle={() => {}} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div>
              <h2 className="text-2xl font-display font-bold mb-6 tracking-tight">Appearance</h2>
              <div className="mb-6">
                <p className="text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-4">Theme</p>
                <div className="grid grid-cols-3 gap-4">
                  {[{ id: 'light', label: 'Light', bg: '#FCF9F2', border: '#E8E4DB' },
                    { id: 'dark', label: 'Dark', bg: '#1B1F2A', border: '#2C3140' },
                    { id: 'system', label: 'System', bg: 'linear-gradient(135deg,#FCF9F2 50%,#1B1F2A 50%)', border: '#E8E4DB' }
                  ].map(t => (
                    <button key={t.id} onClick={() => setAppearance(a => ({ ...a, theme: t.id }))}
                      className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${appearance.theme === t.id ? 'border-brand-blue shadow-[0_0_0_3px_rgba(22,129,208,0.15)]' : 'border-border'}`}
                    >
                      <div className="w-full h-14 rounded-2xl shadow-sm" style={{ background: t.bg, border: `1px solid ${t.border}` }} />
                      <span className="text-sm font-bold text-brand-text">{t.label}</span>
                      {appearance.theme === t.id && <div className="absolute top-2 right-2 w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-4">Font Size</p>
                <div className="flex gap-3">
                  {['small', 'medium', 'large'].map(size => (
                    <button key={size} onClick={() => setAppearance(a => ({ ...a, fontSize: size }))}
                      className={`px-5 py-2.5 rounded-full font-bold text-sm capitalize border transition-all ${appearance.fontSize === size ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-brand-muted border-border hover:border-brand-blue/30'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'language' && (
            <div>
              <h2 className="text-2xl font-display font-bold mb-6 tracking-tight">Language & Region</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-2">Display Language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-[#F7F4EE] border-none outline-none rounded-2xl px-5 py-3.5 font-semibold text-brand-text focus:ring-2 focus:ring-brand-blue/30 appearance-none cursor-pointer">
                    {['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-2">Time Zone</label>
                  <select className="w-full bg-[#F7F4EE] border-none outline-none rounded-2xl px-5 py-3.5 font-semibold text-brand-text focus:ring-2 focus:ring-brand-blue/30 appearance-none cursor-pointer">
                    {['Asia/Kolkata (IST)', 'America/New_York (EST)', 'Europe/London (GMT)', 'Europe/Paris (CET)', 'Pacific/Auckland (NZST)'].map(tz => <option key={tz}>{tz}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div>
              <h2 className="text-2xl font-display font-bold mb-6 tracking-tight">Billing & Subscription</h2>
              <div className="bg-gradient-to-r from-brand-darkBlue to-[#0069A8] p-7 rounded-4xl text-white mb-6 shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
                <p className="text-xs font-extrabold tracking-widest uppercase mb-1 opacity-70">Current Plan</p>
                <h3 className="text-3xl font-display font-black mb-2">Free Tier</h3>
                <p className="opacity-70 text-sm mb-5">3/5 courses used • Basic features</p>
                <button className="bg-white text-brand-darkBlue font-bold py-3 px-7 rounded-full text-sm hover:bg-white/90 transition-colors">Upgrade to Pro</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-5 bg-[#F7F4EE] rounded-3xl">
                  <div>
                    <p className="font-bold text-brand-text">Payment Method</p>
                    <p className="text-brand-muted text-sm">No card on file</p>
                  </div>
                  <button className="text-sm text-brand-blue font-bold hover:underline">Add</button>
                </div>
                <div className="flex items-center justify-between p-5 bg-[#F7F4EE] rounded-3xl">
                  <div>
                    <p className="font-bold text-brand-text">Invoices</p>
                    <p className="text-brand-muted text-sm">Download past receipts</p>
                  </div>
                  <button className="text-sm text-brand-blue font-bold hover:underline">View</button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button onClick={handleSave} className={`flex items-center gap-2 font-bold py-3.5 px-8 rounded-full transition-all ${saved ? 'bg-green-500 text-white' : 'bg-brand-blue hover:bg-brand-darkBlue text-white shadow-[0_4px_14px_rgba(22,129,208,0.35)] hover:-translate-y-0.5'}`}>
              {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
