import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, ChevronDown, ChevronUp, FileText, Clock, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { roles } from '../data/electionData';

function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="tooltip-wrap"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ position: 'relative' }}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            className="tooltip-box"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JourneyMap() {
  const { activeRole, currentStep, completedSteps, setCurrentStep, setActiveView } = useStore();
  const steps = roles[activeRole].steps;
  const [expanded, setExpanded] = useState(null);

  const getState = (idx) => {
    if (completedSteps.includes(idx)) return 'completed';
    if (idx === currentStep) return 'current';
    return 'locked';
  };

  const connectorState = (idx) => {
    if (completedSteps.includes(idx)) return 'done';
    if (idx === currentStep) return 'active';
    return 'locked';
  };

  return (
    <div>
      {/* Horizontal path */}
      <div className="journey-path">
        {steps.map((step, idx) => {
          const state = getState(idx);
          const isLast = idx === steps.length - 1;
          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
              {/* Node */}
              <div className="step-node">
                <Tooltip text={`${state === 'locked' ? '🔒 ' : ''}${step.title} — ${step.duration}`}>
                  <motion.div
                    className={`step-circle ${state}`}
                    onClick={() => {
                      if (state !== 'locked') setExpanded(expanded === idx ? null : idx);
                    }}
                    whileHover={state !== 'locked' ? { scale: 1.12 } : {}}
                    whileTap={state !== 'locked' ? { scale: 0.95 } : {}}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {state === 'completed'
                      ? <Check size={22} color="white" strokeWidth={2.5} />
                      : state === 'locked'
                      ? <Lock size={16} color="#475569" />
                      : <span style={{ fontSize: 22 }}>{step.emoji}</span>
                    }
                  </motion.div>
                </Tooltip>
                <div className={`step-label ${state}`}>
                  {step.title}
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className={`step-connector ${connectorState(idx)}`} style={{ minWidth: 48, maxWidth: 80 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded step detail */}
      <AnimatePresence>
        {expanded !== null && (
          <motion.div
            key={expanded}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              margin: '0 8px 8px',
              padding: '20px',
              borderRadius: 14,
              background: 'rgba(124,92,255,0.06)',
              border: '1px solid rgba(124,92,255,0.15)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{steps[expanded].emoji}</span>
                  <div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: 16, color: '#F1F5F9' }}>
                      {steps[expanded].title}
                    </div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{steps[expanded].shortDesc}</div>
                  </div>
                </div>
                <button onClick={() => setExpanded(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4 }}>
                  <ChevronUp size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {/* Deadline */}
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Clock size={12} color="#fbbf24" />
                    <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deadline</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#F1F5F9', fontWeight: 600 }}>{steps[expanded].deadline}</div>
                </div>

                {/* Documents */}
                {steps[expanded].documents?.length > 0 && (
                  <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(77,163,255,0.08)', border: '1px solid rgba(77,163,255,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <FileText size={12} color="#60a5fa" />
                      <span style={{ fontSize: 10, color: '#60a5fa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Documents</span>
                    </div>
                    {steps[expanded].documents.slice(0, 2).map((d, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.8 }}>• {d}</div>
                    ))}
                    {steps[expanded].documents.length > 2 && (
                      <div style={{ fontSize: 11, color: '#475569' }}>+{steps[expanded].documents.length - 2} more</div>
                    )}
                  </div>
                )}

                {/* Tip */}
                {steps[expanded].mistake && (
                  <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <AlertCircle size={12} color="#f87171" />
                      <span style={{ fontSize: 10, color: '#f87171', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Common Mistake</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>
                      {steps[expanded].mistake.a.slice(0, 80)}…
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
