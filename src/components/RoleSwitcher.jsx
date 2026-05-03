import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { roles } from '../data/electionData';

const RoleConfig = {
  voter: {
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.3)',
    glow: 'rgba(99,102,241,0.4)',
  },
  candidate: {
    color: '#f59e0b',
    bg: 'rgba(251,191,36,0.15)',
    border: 'rgba(251,191,36,0.3)',
    glow: 'rgba(251,191,36,0.4)',
  },
  officer: {
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.15)',
    border: 'rgba(34,197,94,0.3)',
    glow: 'rgba(34,197,94,0.4)',
  },
};

export default function RoleSwitcher() {
  const { activeRole, setActiveRole } = useStore();

  return (
    <div
      style={{
        display: 'flex',
        gap: '6px',
        background: 'rgba(255,255,255,0.03)',
        padding: '5px',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {Object.values(roles).map((role) => {
        const cfg = RoleConfig[role.id];
        const isActive = activeRole === role.id;
        return (
          <motion.button
            key={role.id}
            onClick={() => setActiveRole(role.id)}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '7px 14px',
              borderRadius: '10px',
              border: `1px solid ${isActive ? cfg.border : 'transparent'}`,
              background: isActive ? cfg.bg : 'transparent',
              color: isActive ? cfg.color : '#64748b',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? `0 0 12px ${cfg.glow}` : 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span style={{ fontSize: '15px' }}>{role.emoji}</span>
            <span>{role.label}</span>
            {isActive && (
              <motion.div
                layoutId="role-indicator"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '10px',
                  background: cfg.bg,
                  zIndex: -1,
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
