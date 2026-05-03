import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FileText, Clock, Zap, X, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { roles } from '../data/electionData';
import { useTranslation } from '../hooks/useTranslation';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function SmartCards() {
  const { activeRole, currentStep, completedSteps, setActiveView } = useStore();
  const { t } = useTranslation();
  const sc = t.smartCards;
  const role = roles[activeRole];
  const steps = role.steps;
  const currentStepData = steps[currentStep] || steps[0];
  const done = completedSteps.length;
  const total = steps.length;
  const remaining = total - done;

  const [docsModalOpen, setDocsModalOpen] = useState(false);

  const tagClass = { info: 'tag-purple', warning: 'tag-amber', danger: 'tag-red', success: 'tag-green', blue: 'tag-blue', amber: 'tag-amber', green: 'tag-green' };

  const cards = [
    {
      id: 'next-step', icon: <Zap size={18} color="#a78bfa" />, iconBg: 'rgba(124,92,255,0.15)',
      label: sc.nextStep, title: currentStepData?.title || 'All Done!',
      desc: currentStepData?.shortDesc || 'You have completed all steps.',
      accent: 'rgba(124,92,255,0.07)', accentBorder: 'rgba(124,92,255,0.18)',
      action: { label: sc.viewStep, onClick: () => setActiveView('journey') },
      badge: { text: currentStepData?.tag || 'Complete', type: currentStepData?.tagType || 'info' },
      detail: `${sc.duration}: ${currentStepData?.duration || '—'}`,
    },
    {
      id: 'documents', icon: <FileText size={18} color="#60a5fa" />, iconBg: 'rgba(59,130,246,0.15)',
      label: sc.documentsRequired, title: `${currentStepData?.documents?.length || 0} Documents`,
      desc: currentStepData?.documents?.slice(0, 2).join(' • ') || 'No documents needed',
      accent: 'rgba(59,130,246,0.06)', accentBorder: 'rgba(59,130,246,0.14)',
      action: { label: sc.seeAll, onClick: () => setDocsModalOpen(true) },
      badge: { text: 'For this step', type: 'blue' },
      detail: currentStepData?.documents?.length > 2 ? `+${currentStepData.documents.length - 2} ${sc.moreNeeded}` : sc.completeList,
    },
    {
      id: 'deadline', icon: <Clock size={18} color="#fbbf24" />, iconBg: 'rgba(245,158,11,0.15)',
      label: sc.importantDeadline, title: currentStepData?.deadline || 'No deadline',
      desc: `Step ${currentStep + 1}: ${currentStepData?.title}`,
      accent: 'rgba(245,158,11,0.06)', accentBorder: 'rgba(245,158,11,0.14)',
      action: { label: sc.viewDetails, onClick: () => setActiveView('journey') },
      badge: { text: remaining > 0 ? `${remaining} left` : 'Done!', type: remaining > 0 ? 'amber' : 'green' },
      detail: sc.ofSteps.replace('{total}', total),
    },
  ];

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {cards.map((card, i) => (
          <motion.div key={card.id} className="smart-card" custom={i} variants={cardVariants} initial="hidden" animate="visible"
            style={{ background: card.accent, borderColor: card.accentBorder }} id={`smart-card-${card.id}`}
          >
            <div className="card-icon-wrap" style={{ background: card.iconBg }}>{card.icon}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</span>
              <span className={`tag ${tagClass[card.badge.type] || 'tag-purple'}`}>{card.badge.text}</span>
            </div>
            <div className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.3 }}>{card.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 14, minHeight: 38 }}>{card.desc}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>{card.detail}</div>
            <motion.button className="btn-ghost" onClick={card.action.onClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ width: '100%', justifyContent: 'center', fontSize: 12.5 }}
            >
              {card.action.label}<ArrowRight size={13} />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Documents Modal */}
      <AnimatePresence>
        {docsModalOpen && (
          <motion.div
            className="lang-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDocsModalOpen(false)}
            style={{ zIndex: 2000 }}
          >
            <motion.div
              className="lang-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ padding: 32, maxWidth: 500, background: 'var(--bg)', maxHeight: '80vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                  <FileText size={32} />
                </div>
                <button onClick={() => setDocsModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, borderRadius: '50%' }}>
                  <X size={20} />
                </button>
              </div>

              <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.2 }}>
                Required Documents
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                Here are the documents needed for your entire {role.label} journey.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                {steps.map((step, idx) => {
                  if (!step.documents || step.documents.length === 0) return null;
                  const isDone = completedSteps.includes(idx);
                  const isCurrent = currentStep === idx;
                  
                  return (
                    <div key={idx} style={{ padding: 16, borderRadius: 12, background: isDone ? 'rgba(34,197,94,0.05)' : isCurrent ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isDone ? 'rgba(34,197,94,0.2)' : isCurrent ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        {isDone ? <CheckCircle2 size={16} color="#4ade80" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: isCurrent ? '#60a5fa' : 'var(--text-muted)' }} />}
                        <span style={{ fontSize: 13, fontWeight: 700, color: isDone ? '#4ade80' : isCurrent ? '#60a5fa' : 'var(--text-primary)' }}>
                          Step {idx + 1}: {step.title}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {step.documents.map((doc, docIdx) => (
                          <div key={docIdx} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {doc}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => setDocsModalOpen(false)}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', color: 'white', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
