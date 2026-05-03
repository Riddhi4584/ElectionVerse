import { motion } from 'framer-motion';
import { LayoutDashboard, Map, Layers, MessageSquare, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { roles } from '../data/electionData';
import { useTranslation } from '../hooks/useTranslation';

export default function Sidebar() {
  const { activeView, setActiveView, sidebarCollapsed, toggleSidebar, activeRole, setActiveRole, currentStep, completedSteps } = useStore();
  const { t } = useTranslation();
  const role = roles[activeRole];
  const total = roles[activeRole].steps.length;
  const pct = Math.round((completedSteps.length / total) * 100);
  const collapsed = sidebarCollapsed;

  const NAV = [
    { id: 'dashboard',  label: t.nav.dashboard,  icon: LayoutDashboard },
    { id: 'journey',    label: t.nav.journeyMap,  icon: Map },
    { id: 'scenarios',  label: t.nav.scenarios,   icon: Layers },
    { id: 'assistant',  label: t.nav.assistant,   icon: MessageSquare },
    { id: 'settings',   label: t.nav.settings,    icon: Settings },
  ];

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <motion.div
          style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #7C5CFF, #4DA3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0, boxShadow: '0 4px 14px rgba(124,92,255,0.4)' }}
          whileHover={{ rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}
        >
          🗺️
        </motion.div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14.5, color: 'var(--text-primary)', lineHeight: 1 }}>Election</div>
            <div className="gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14.5, lineHeight: 1.3 }}>Coach</div>
          </motion.div>
        )}
      </div>

      {/* Role pill */}
      {!collapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ margin: '0 2px 8px', padding: '10px 12px', borderRadius: 10, background: `rgba(${role.id === 'voter' ? '124,92,255' : role.id === 'candidate' ? '245,158,11' : '34,197,94'}, 0.1)`, border: `1px solid rgba(${role.id === 'voter' ? '124,92,255' : role.id === 'candidate' ? '245,158,11' : '34,197,94'}, 0.2)` }}
        >
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {t.sidebar.currentRole}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>{role.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: role.color }}>{t.roles[role.id] || role.label}</span>
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg, ${role.color}, #4DA3FF)` }} />
            </div>
            <span style={{ fontSize: 10, color: role.color, fontWeight: 700 }}>{pct}%</span>
          </div>
        </motion.div>
      )}

      {/* Nav label */}
      {!collapsed && (
        <div className="sidebar-section-label">{t.sidebar.menu}</div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map((item, i) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <motion.button key={item.id} onClick={() => setActiveView(item.id)}
              className={`sidebar-item${isActive ? ' active' : ''}`}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? 0 : 10 }}
              whileHover={{ x: collapsed ? 0 : 2 }} whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: 13.5 }}>{item.label}</span>}
              {!collapsed && isActive && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
            </motion.button>
          );
        })}
      </nav>

      {/* Role switcher */}
      {!collapsed && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginBottom: 4 }}>
          <div className="sidebar-section-label" style={{ marginBottom: 6 }}>{t.sidebar.switchRole}</div>
          <div style={{ display: 'flex', gap: 5 }}>
            {Object.values(roles).map((r) => (
              <motion.button key={r.id} onClick={() => setActiveRole(r.id)} whileTap={{ scale: 0.93 }}
                style={{ flex: 1, padding: '6px 4px', borderRadius: 8, border: `1px solid ${activeRole === r.id ? r.color + '44' : 'rgba(255,255,255,0.07)'}`, background: activeRole === r.id ? r.color + '18' : 'transparent', cursor: 'pointer', fontSize: 16, transition: 'all 0.18s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                title={r.label}
              >
                <span>{r.emoji}</span>
                <span style={{ fontSize: 9, color: activeRole === r.id ? r.color : 'var(--text-muted)', fontWeight: 600 }}>
                  {(t.roles[r.id] || r.label).slice(0, 4)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Logout button */}
      <motion.button onClick={() => useStore.getState().logout()} whileTap={{ scale: 0.93 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', cursor: 'pointer', fontSize: 12, marginBottom: 8, transition: 'all 0.18s', fontWeight: 600 }}
      >
        {!collapsed && <span>Logout</span>}
      </motion.button>

      {/* Collapse toggle */}
      <motion.button onClick={toggleSidebar} whileTap={{ scale: 0.93 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, marginBottom: 12, transition: 'all 0.18s' }}
      >
        {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={14} /><span>{t.sidebar.collapse}</span></>}
      </motion.button>
    </aside>
  );
}
