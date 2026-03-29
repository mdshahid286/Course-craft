import React, { useState } from 'react';
import {
  User, Bell, Lock, Palette, Globe, CreditCard,
  ChevronRight, Check, Shield, Activity, Camera, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const SECTIONS = [
  { id: 'profile',       icon: User,       label: 'Profile' },
  { id: 'notifications', icon: Bell,       label: 'Notifications' },
  { id: 'security',      icon: Lock,       label: 'Security' },
  { id: 'appearance',    icon: Palette,    label: 'Appearance' },
  { id: 'language',      icon: Globe,      label: 'Language & Region' },
  { id: 'billing',       icon: CreditCard, label: 'Billing' },
];

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green/30',
        on ? 'bg-brand-green' : 'bg-gray-200'
      )}
    >
      <div className={cn(
        'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
        on ? 'translate-x-6' : 'translate-x-1'
      )} />
    </button>
  );
}

export default function SettingsPage() {
  const [section, setSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true, achievements: true });
  const [theme, setTheme] = useState('light');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-app-fg">Settings</h1>
        <p className="text-sm text-app-muted mt-0.5">Manage your account preferences and configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar nav */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="card overflow-hidden">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left border-b border-app-border last:border-0',
                  section === s.id
                    ? 'bg-brand-green-lighter text-brand-green font-semibold'
                    : 'text-app-muted hover:bg-app-surface2 hover:text-app-fg'
                )}
              >
                <s.icon size={16} className={section === s.id ? 'text-brand-green' : 'text-app-muted'} />
                {s.label}
                {section === s.id && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 card overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="p-6 md:p-8"
            >

              {/* PROFILE */}
              {section === 'profile' && (
                <div>
                  <h2 className="text-lg font-semibold text-app-fg mb-1">Profile Information</h2>
                  <p className="text-sm text-app-muted mb-6">Update your personal details and public profile.</p>

                  {/* Avatar */}
                  <div className="flex items-center gap-5 p-5 bg-app-surface2 rounded-2xl border border-app-border mb-7">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-brand-green-lighter border-2 border-brand-green/20 flex items-center justify-center">
                        <Cpu size={28} className="text-brand-green" />
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-green rounded-full flex items-center justify-center shadow-brand">
                        <Camera size={11} className="text-white" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-app-fg">Profile Photo</p>
                      <p className="text-xs text-app-muted mb-2">PNG, JPG up to 2MB</p>
                      <button className="btn-ghost text-xs px-2 py-1 h-auto text-brand-green hover:bg-brand-green-lighter">
                        Upload New Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      ['Full Name', 'Jane Doe', 'text'],
                      ['Username', '@janedoe', 'text'],
                      ['Email Address', 'jane@example.com', 'email'],
                      ['Role', 'Course Builder', 'text'],
                    ].map(([label, val, type]) => (
                      <div key={label}>
                        <label className="block text-sm font-medium text-app-fg mb-1.5">{label}</label>
                        <input defaultValue={val} type={type} className="input text-sm" />
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-app-fg mb-1.5">Bio</label>
                      <textarea
                        defaultValue="Building AI-powered courses for the future of education."
                        rows={3}
                        className="input text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {section === 'notifications' && (
                <div>
                  <h2 className="text-lg font-semibold text-app-fg mb-1">Notification Preferences</h2>
                  <p className="text-sm text-app-muted mb-6">Choose what updates you want to receive.</p>
                  <div className="space-y-3">
                    {[
                      { key: 'email', label: 'Email Notifications', desc: 'Course updates and learning reminders' },
                      { key: 'push', label: 'Push Notifications', desc: 'Real-time browser alerts' },
                      { key: 'weekly', label: 'Weekly Report', desc: 'Sunday performance summary' },
                      { key: 'achievements', label: 'Achievement Alerts', desc: 'Get notified on milestones' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-app-border hover:bg-app-surface2 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-app-fg">{label}</p>
                          <p className="text-xs text-app-muted mt-0.5">{desc}</p>
                        </div>
                        <Toggle on={notifs[key]} onToggle={() => setNotifs(n => ({ ...n, [key]: !n[key] }))} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECURITY */}
              {section === 'security' && (
                <div>
                  <h2 className="text-lg font-semibold text-app-fg mb-1">Security Settings</h2>
                  <p className="text-sm text-app-muted mb-6">Manage your password and account security.</p>
                  <div className="space-y-5">
                    {[
                      ['Current Password', 'password'],
                      ['New Password', 'password'],
                      ['Confirm New Password', 'password'],
                    ].map(([label, type]) => (
                      <div key={label}>
                        <label className="block text-sm font-medium text-app-fg mb-1.5">{label}</label>
                        <input type={type} placeholder="••••••••" className="input text-sm max-w-sm" />
                      </div>
                    ))}
                    <div className="p-4 bg-brand-green-lighter border border-brand-green/20 rounded-xl flex items-center gap-3 max-w-sm">
                      <Shield size={16} className="text-brand-green flex-shrink-0" />
                      <p className="text-xs text-brand-green font-medium">Two-factor authentication is recommended for enhanced security.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* APPEARANCE */}
              {section === 'appearance' && (
                <div>
                  <h2 className="text-lg font-semibold text-app-fg mb-1">Appearance</h2>
                  <p className="text-sm text-app-muted mb-6">Customize the look and feel of your workspace.</p>
                  <div>
                    <p className="text-sm font-medium text-app-fg mb-3">Theme</p>
                    <div className="grid grid-cols-3 gap-4 max-w-sm">
                      {[
                        { id: 'light', label: 'Light', bg: 'bg-white border-gray-200' },
                        { id: 'dark', label: 'Dark', bg: 'bg-gray-900 border-gray-700' },
                        { id: 'system', label: 'System', bg: 'bg-gradient-to-br from-white to-gray-900 border-gray-300' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                            theme === t.id ? 'border-brand-green bg-brand-green-lighter' : 'border-app-border hover:border-app-border2'
                          )}
                        >
                          <div className={cn('w-full h-10 rounded-lg border', t.bg)} />
                          <span className="text-xs font-medium text-app-fg">{t.label}</span>
                          {theme === t.id && <Check size={13} className="text-brand-green" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Other sections placeholder */}
              {!['profile', 'notifications', 'security', 'appearance'].includes(section) && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-app-surface2 border border-app-border flex items-center justify-center mb-4">
                    {(() => { const S = SECTIONS.find(s => s.id === section); return <S.icon size={24} className="text-app-muted" />; })()}
                  </div>
                  <p className="text-base font-semibold text-app-fg mb-1">
                    {SECTIONS.find(s => s.id === section)?.label} Settings
                  </p>
                  <p className="text-sm text-app-muted">This section is coming soon.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer actions */}
          <div className="px-6 md:px-8 py-4 border-t border-app-border bg-app-surface2 flex justify-end gap-3">
            <button className="btn-outline text-sm">Cancel</button>
            <button onClick={handleSave} className={cn('btn-brand text-sm', saved && 'bg-emerald-600 hover:bg-emerald-700')}>
              {saved ? <><Check size={15} /> Saved!</> : <><Activity size={15} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
