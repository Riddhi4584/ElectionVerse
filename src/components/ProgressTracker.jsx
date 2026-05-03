import { motion } from 'framer-motion';
import { Trophy, Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { roles } from '../data/electionData';

export default function ProgressTracker() {
  const { activeRole, currentStep, completedSteps } = useStore();
  const steps = roles[activeRole].steps;
  const total = steps.length;
  const done = completedSteps.length;
  const pct = Math.round((done / total) * 100);

  const stats = [
    { label: 'Completed', value: done, icon: CheckCircle2, color: '#4ade80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
    { label: 'Remaining', value: total - done, icon: Clock, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
    { label: 'Current Step', value: currentStep + 1, icon: Target, color: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
  ];

  const getMilestone = () => {
    if (pct === 0) return { text: "Let's get started!", emoji: '🚀', color: '#64748b' };
    if (pct <= 25) return { text: 'Great start!', emoji: '⚡', color: '#818cf8' };
    if (pct <= 50) return { text: 'Halfway there!', emoji: '💪', color: '#f59e0b' };
    if (pct <= 75) return { text: 'Almost done!', emoji: '🔥', color: '#f87171' };
    if (pct < 100) return { text: 'Final stretch!', emoji: '🏆', color: '#4ade80' };
    return { text: 'Journey Complete!', emoji: '🎉', color: '#4ade80' };
  };

  const milestone = getMilestone();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Main progress card */}
      <div className="glass" style={{ borderRadius: '20px', padding: '28px', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
        <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity }} style={{ fontSize: '42px', marginBottom: '12px' }}>{milestone.emoji}</motion.div>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: milestone.color, marginBottom: '4px' }}>{milestone.text}</h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>{done} of {total} steps completed for <span style={{ color: roles[activeRole].color, fontWeight: 600 }}>{roles[activeRole].emoji} {roles[activeRole].label}</span></p>
        <div style={{ height: '12px', borderRadius: '6px', background: 'rgba(30,41,59,0.8)', position: 'relative', overflow: 'hidden', marginBottom: '10px' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} style={{ height: '100%', borderRadius: '6px', background: 'linear-gradient(90deg, #6366f1, #a78bfa, #c084fc)', position: 'relative', overflow: 'hidden' }}>
            <div className="animate-shimmer" style={{ position: 'absolute', inset: 0, borderRadius: '6px' }} />
          </motion.div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#475569' }}>Progress</span>
          <motion.span key={pct} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{pct}%</motion.span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
              <Icon size={20} color={s.color} style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Step breakdown */}
      <div className="glass" style={{ borderRadius: '16px', padding: '20px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingUp size={14} color="#6366f1" /> Step Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {steps.map((step, i) => {
            const isStepDone = completedSteps.includes(i);
            const isStepCurrent = currentStep === i;
            return (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', background: isStepDone ? 'rgba(34,197,94,0.07)' : isStepCurrent ? 'rgba(99,102,241,0.07)' : 'transparent' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: isStepDone ? '#22c55e' : isStepCurrent ? '#6366f1' : 'rgba(30,41,59,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 700, flexShrink: 0 }}>
                  {isStepDone ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '12px', color: isStepDone ? '#4ade80' : isStepCurrent ? '#818cf8' : '#64748b', fontWeight: isStepCurrent ? 600 : 400, flex: 1 }}>{step.title}</span>
                {isStepCurrent && <span style={{ fontSize: '10px', color: '#6366f1', fontWeight: 700 }}>← Now</span>}
                {isStepDone && <span style={{ fontSize: '10px', color: '#4ade80' }}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {pct === 100 && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ borderRadius: '16px', padding: '20px', background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.1))', border: '1px solid rgba(34,197,94,0.3)', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏆</div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', fontWeight: 700, color: '#4ade80', marginBottom: '4px' }}>Journey Complete!</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>You've mastered all steps for the {roles[activeRole].label} role</div>
        </motion.div>
      )}
    </div>
  );
}
