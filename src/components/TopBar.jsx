import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bell, X, Check, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { roles } from '../data/electionData';
import { useTranslation } from '../hooks/useTranslation';

const NOTIF_ICONS = {
  warning: { icon: AlertTriangle, color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
  info:    { icon: Info,          color: '#60a5fa', bg: 'rgba(59,130,246,0.15)' },
  success: { icon: CheckCircle,   color: '#4ade80', bg: 'rgba(34,197,94,0.15)' },
  danger:  { icon: AlertCircle,   color: '#f87171', bg: 'rgba(239,68,68,0.15)' },
};

function NotifPanel({ onClose }) {
  const { notificationItems, notificationsEnabled, markAllRead, markOneRead } = useStore();
  const { t } = useTranslation();
  const unreadCount = notificationItems.filter((n) => !n.read).length;

  return (
    <motion.div
      className="notif-panel"
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {t.notifications.title}
          </span>
          {unreadCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, background: 'linear-gradient(135deg, #7C5CFF, #4DA3FF)', color: 'white' }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{ fontSize: 11, color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              {t.notifications.markAllRead}
            </button>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Notification items */}
      {!notificationsEnabled ? (
        <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          🔕 Notifications are disabled. Enable them in Settings.
        </div>
      ) : notificationItems.length === 0 ? (
        <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          {t.notifications.empty}
        </div>
      ) : (
        notificationItems.map((notif) => {
          const cfg = NOTIF_ICONS[notif.type] || NOTIF_ICONS.info;
          const Icon = cfg.icon;
          return (
            <div
              key={notif.id}
              className={`notif-item${!notif.read ? ' unread' : ''}`}
              onClick={() => markOneRead(notif.id)}
            >
              <div style={{ width: 34, height: 34, borderRadius: 9, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color={cfg.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: !notif.read ? 600 : 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {notif.title}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>{notif.time}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{notif.desc}</div>
              </div>
              {!notif.read && (
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C5CFF', flexShrink: 0, marginTop: 4 }} />
              )}
            </div>
          );
        })
      )}

      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
        Click any notification to mark as read
      </div>
    </motion.div>
  );
}

export default function TopBar() {
  const { activeRole, completedSteps, notifPanelOpen, toggleNotifPanel, closeNotifPanel, notificationItems, location } = useStore();
  const { t } = useTranslation();
  const role = roles[activeRole];
  const steps = role.steps;
  const pct = Math.round((completedSteps.length / steps.length) * 100);
  const notifRef = useRef(null);
  const unreadCount = notificationItems.filter((n) => !n.read).length;

  // Close notif panel on outside click
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) closeNotifPanel(); };
    if (notifPanelOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifPanelOpen]);

  return (
    <header className="topbar">
      {/* Location — centered */}
      <div style={{ flex: 1 }} />
      {location && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 14px', margin: '0 auto' }}>
          <MapPin size={14} color="var(--grad-start)" />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{location}</span>
        </div>
      )}
      <div style={{ flex: 1 }} />

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Notification bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <motion.button
            className="icon-btn"
            onClick={toggleNotifPanel}
            whileTap={{ scale: 0.92 }}
            title={t.topbar.notifications || 'Notifications'}
            id="notif-btn"
            style={{ background: notifPanelOpen ? 'rgba(124,92,255,0.15)' : undefined, borderColor: notifPanelOpen ? 'rgba(124,92,255,0.3)' : undefined }}
          >
            <Bell size={15} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </motion.button>
          <AnimatePresence>
            {notifPanelOpen && <NotifPanel onClose={closeNotifPanel} />}
          </AnimatePresence>
        </div>

        {/* Progress pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 20, background: 'rgba(124,92,255,0.1)', border: '1px solid rgba(124,92,255,0.2)' }}
        >
          <div style={{ width: 54, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #7C5CFF, #4DA3FF)' }}
            />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa' }}>{pct}%</span>
        </motion.div>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #7C5CFF, #4DA3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', border: '2px solid rgba(124,92,255,0.4)', flexShrink: 0 }}
          title="Profile" id="avatar-btn"
        >
          {role.emoji}
        </motion.div>
      </div>
    </header>
  );
}
