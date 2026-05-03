import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { roles } from '../data/electionData';
import { useTranslation } from '../hooks/useTranslation';

function CircularProgress({ pct, size = 120, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="progress-ring-svg">
      <circle className="progress-ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
      <motion.circle
        className="progress-ring-fill" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke}
        stroke="url(#heroGrad)" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
      />
      <defs>
        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#4DA3FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HeroSection() {
  const { activeRole, currentStep, completedSteps, setActiveView } = useStore();
  const { t } = useTranslation();
  const h = t.hero;
  const role = roles[activeRole];
  const steps = role.steps;
  const total = steps.length;
  const done = completedSteps.length;
  const pct = Math.round((done / total) * 100);
  const isComplete = done >= total;

  return (
    <motion.div className="hero-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(124,92,255,0.12)', border: '1px solid rgba(124,92,255,0.2)', marginBottom: 14 }}
          >
            <Zap size={11} color="#a78bfa" />
            <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, letterSpacing: '0.04em' }}>
              {role.emoji} {t.roles[role.id] || role.label}
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="font-display" style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 8 }}
          >
            {h.title} <span className="gradient-text">{h.journey}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 400, marginBottom: 22 }}
          >
            {isComplete ? h.congratulations : `Step ${currentStep + 1} of ${total} — ${steps[currentStep]?.shortDesc}`}
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            style={{ display: 'flex', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}
          >
            {[
              { label: h.stepsDone, val: done, color: '#4ade80' },
              { label: h.remaining, val: total - done, color: '#fbbf24' },
              { label: h.totalSteps, val: total, color: '#60a5fa' },
            ].map((stat) => (
              <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: stat.color, fontFamily: 'Space Grotesk, sans-serif' }}>{stat.val}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
          >
            <motion.button className="btn-primary animate-glow-pulse" onClick={() => setActiveView('journey')}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} id="hero-continue-btn"
            >
              <ArrowRight size={15} />{h.continueJourney}
            </motion.button>
            {done > 0 && (
              <motion.button className="btn-ghost" whileTap={{ scale: 0.97 }} style={{ fontSize: 13 }}>
                <CheckCircle size={14} />{done} {h.completed}
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Circular progress */}
        <motion.div className="animate-float" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{ position: 'relative', flexShrink: 0 }}
        >
          <CircularProgress pct={pct} size={130} stroke={9} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{pct}%</span>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>{h.complete}</span>
          </div>
        </motion.div>
      </div>

      <div style={{ marginTop: 24, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
          style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #7C5CFF, #4DA3FF)' }} />
      </div>
    </motion.div>
  );
}
