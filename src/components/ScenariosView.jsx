import { motion } from 'framer-motion';
import { Layers, ChevronRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const SCENARIOS = [
  { id: 'first-time',    emoji: '🎯', title: 'First-Time Voter',        desc: "You just turned 18 and want to vote for the first time. Navigate registration, verification, and polling day.", difficulty: 'Beginner',     steps: 6, color: '#7C5CFF', bg: 'rgba(124,92,255,0.08)', border: 'rgba(124,92,255,0.18)', tag: 'Popular',   tagColor: '#a78bfa' },
  { id: 'address-change',emoji: '📍', title: 'Moved to a New City',     desc: "You've relocated and need to transfer your voter registration to your new constituency.",                    difficulty: 'Intermediate', steps: 4, color: '#4DA3FF', bg: 'rgba(77,163,255,0.08)',  border: 'rgba(77,163,255,0.18)',  tag: 'Common',    tagColor: '#60a5fa' },
  { id: 'missed',        emoji: '⏰', title: 'Missed Registration',      desc: 'The registration deadline has passed. What are your options? Explore same-day registration laws.',           difficulty: 'Advanced',     steps: 3, color: '#f87171', bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.16)',   tag: 'Critical',  tagColor: '#f87171' },
  { id: 'candidate',     emoji: '📄', title: 'Filing as a Candidate',   desc: 'You want to contest local elections. Navigate nomination, affidavit filing, and campaign compliance.',     difficulty: 'Advanced',     steps: 6, color: '#fbbf24', bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.16)',  tag: 'Candidate', tagColor: '#fbbf24' },
  { id: 'evm-doubt',     emoji: '🤔', title: 'EVM Integrity Doubt',     desc: 'A voter questions EVM security. Explore the technical safeguards, VVPAT verification, and audit process.', difficulty: 'Informational',steps: 4, color: '#4ade80', bg: 'rgba(34,197,94,0.07)',   border: 'rgba(34,197,94,0.16)',   tag: 'Education', tagColor: '#4ade80' },
  { id: 'booth-officer', emoji: '📋', title: 'Running a Polling Booth', desc: "You're a presiding officer for the first time. Manage opening procedures, voter flow, and EVM sealing.", difficulty: 'Expert',       steps: 6, color: '#c084fc', bg: 'rgba(192,132,252,0.07)', border: 'rgba(192,132,252,0.16)', tag: 'Officer',   tagColor: '#c084fc' },
];

const difficultyColor = { Beginner: '#4ade80', Intermediate: '#fbbf24', Advanced: '#f87171', Expert: '#f87171', Informational: '#60a5fa' };

export default function ScenariosView() {
  const { t } = useTranslation();
  const sc = t.scenarios;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(124,92,255,0.1)', border: '1px solid rgba(124,92,255,0.2)', marginBottom: 12 }}>
          <Layers size={11} color="#a78bfa" />
          <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, letterSpacing: '0.04em' }}>{sc.badge}</span>
        </div>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 8 }}>
          {sc.title} <span className="gradient-text">{sc.titleHighlight}</span>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{sc.subtitle}</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {SCENARIOS.map((s, i) => (
          <motion.div key={s.id} className="smart-card" style={{ background: s.bg, borderColor: s.border }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.985 }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${s.color}20`, border: `1px solid ${s.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {s.emoji}
              </div>
              <span style={{ padding: '3px 9px', borderRadius: 10, background: `${s.tagColor}18`, border: `1px solid ${s.tagColor}28`, fontSize: 10, color: s.tagColor, fontWeight: 600 }}>
                {s.tag}
              </span>
            </div>
            <div className="font-display" style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 7, lineHeight: 1.3 }}>{s.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: difficultyColor[s.difficulty], fontWeight: 600 }}>● {s.difficulty}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.steps} {sc.steps}</span>
            </div>
            <motion.button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              {sc.startScenario}<ChevronRight size={14} />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
