import { motion } from 'framer-motion';
import { Volume2, Moon, Sun, Bell, MessageSquare, Globe, Shield, ChevronRight, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../hooks/useTranslation';
import { LANGUAGES } from '../data/translations';

function Toggle({ on, onToggle, id }) {
  return (
    <motion.button
      id={id}
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      aria-checked={on}
      role="switch"
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: on ? 'linear-gradient(135deg, #7C5CFF, #4DA3FF)' : 'rgba(255,255,255,0.1)',
        border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.25s',
      }}
    >
      <motion.div
        animate={{ left: on ? 22 : 3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
      />
    </motion.button>
  );
}

function SettingRow({ icon: Icon, iconColor = '#94A3B8', label, desc, control, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: accent || 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color={iconColor} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>}
      </div>
      {control}
    </div>
  );
}

export default function SettingsView() {
  const {
    voiceEnabled, toggleVoice,
    theme, toggleTheme,
    notificationsEnabled, toggleNotifications,
    assistantOpen, toggleAssistant,
    language, setLangModalOpen,
  } = useStore();
  const { t } = useTranslation();
  const s = t.settings;

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const sections = [
    {
      title: s.preferences,
      rows: [
        {
          icon: Volume2,
          iconColor: '#a78bfa',
          accent: 'rgba(124,92,255,0.12)',
          label: s.voiceNarration,
          desc: s.voiceDesc,
          control: <Toggle on={voiceEnabled} onToggle={toggleVoice} id="toggle-voice" />,
        },
        {
          icon: theme === 'dark' ? Moon : Sun,
          iconColor: theme === 'dark' ? '#60a5fa' : '#fbbf24',
          accent: theme === 'dark' ? 'rgba(59,130,246,0.12)' : 'rgba(245,158,11,0.12)',
          label: s.darkMode,
          desc: s.darkModeDesc,
          control: <Toggle on={theme === 'dark'} onToggle={toggleTheme} id="toggle-theme" />,
        },
        {
          icon: Bell,
          iconColor: '#f87171',
          accent: 'rgba(239,68,68,0.1)',
          label: s.notifications,
          desc: s.notifDesc,
          control: <Toggle on={notificationsEnabled} onToggle={toggleNotifications} id="toggle-notif" />,
        },
      ],
    },
    {
      title: s.assistantSection,
      rows: [
        {
          icon: MessageSquare,
          iconColor: '#4DA3FF',
          accent: 'rgba(77,163,255,0.12)',
          label: s.aiPanel,
          desc: s.aiPanelDesc,
          control: <Toggle on={assistantOpen} onToggle={toggleAssistant} id="toggle-assistant" />,
        },
        {
          icon: Globe,
          iconColor: '#4ade80',
          accent: 'rgba(34,197,94,0.1)',
          label: s.language,
          desc: s.langDesc,
          control: (
            <motion.button
              onClick={() => setLangModalOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="language-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(124,92,255,0.1)',
                border: '1px solid rgba(124,92,255,0.25)',
                borderRadius: 10, padding: '7px 12px',
                color: '#a78bfa', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.nativeLabel}</span>
              <ChevronRight size={13} />
            </motion.button>
          ),
        },
      ],
    },
    {
      title: s.about,
      rows: [
        {
          icon: Shield,
          iconColor: '#94A3B8',
          accent: 'rgba(255,255,255,0.05)',
          label: s.aboutApp,
          desc: s.aboutDesc,
          control: <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>v2.0.0</span>,
        },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 40 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
          {s.title}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{s.subtitle}</p>
      </motion.div>

      {/* Active settings summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
      >
        {[
          { label: theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode', active: true },
          { label: notificationsEnabled ? '🔔 Notifications On' : '🔕 Notifications Off', active: notificationsEnabled },
          { label: `🌐 ${currentLang.nativeLabel}`, active: true },
        ].map((pill) => (
          <div key={pill.label} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: pill.active ? 'rgba(124,92,255,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${pill.active ? 'rgba(124,92,255,0.25)' : 'rgba(255,255,255,0.07)'}`, color: pill.active ? '#a78bfa' : 'var(--text-muted)' }}>
            {pill.label}
          </div>
        ))}
      </motion.div>

      {sections.map((section, si) => (
        <motion.div
          key={section.title}
          className="glass"
          style={{ borderRadius: 16, padding: '18px 22px' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.07 }}
        >
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
            {section.title}
          </div>
          {section.rows.map((row) => <SettingRow key={row.label} {...row} />)}
        </motion.div>
      ))}
    </div>
  );
}
