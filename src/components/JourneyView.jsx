import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import { roles } from '../data/electionData';
import JourneyMap from './JourneyMap';
import StepCard from './StepCard';
import { useTranslation } from '../hooks/useTranslation';

export default function JourneyView() {
  const { activeRole, currentStep, completedSteps, goToNextStep, expandedStep, setExpandedStep } = useStore();
  const { t } = useTranslation();
  const steps = roles[activeRole].steps;
  const total = steps.length;
  const done = completedSteps.length;
  const pct = Math.round((done / total) * 100);
  const role = roles[activeRole];

  const handleNextStep = () => {
    const next = currentStep < total - 1 ? currentStep + 1 : currentStep;
    setExpandedStep(next);
    goToNextStep();
    setTimeout(() => document.getElementById(`step-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      {/* Hero header */}
      <motion.div
        style={{ position: 'relative', borderRadius: 20, padding: '28px 28px 22px', overflow: 'hidden', background: 'rgba(124,92,255,0.06)', border: '1px solid rgba(124,92,255,0.15)' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, width: 280, height: 200, background: 'radial-gradient(circle at 80% 20%, rgba(124,92,255,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 30 }}>{role.emoji}</span>
                <div>
                  <h1 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {t.roles[role.id] || role.label}
                  </h1>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{role.description}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: 'rgba(124,92,255,0.12)', border: '1px solid rgba(124,92,255,0.25)' }}>
                  <MapPin size={11} color="#a78bfa" />
                  <span style={{ fontSize: 11.5, color: '#a78bfa', fontWeight: 600 }}>
                    Step {currentStep + 1} of {total}: {steps[currentStep]?.title}
                  </span>
                </div>
                <div style={{ padding: '4px 11px', borderRadius: 20, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.22)', fontSize: 11.5, color: '#4ade80', fontWeight: 600 }}>
                  {pct}{t.journey.percentComplete}
                </div>
              </div>
            </div>
            {currentStep < total - 1 && (
              <motion.button onClick={handleNextStep} className="btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ flexShrink: 0, gap: 8, fontSize: 13 }}>
                <Zap size={15} />{t.journey.whatsNext}<ArrowRight size={15} />
              </motion.button>
            )}
          </div>
          <div style={{ marginTop: 18, height: 5, borderRadius: 3, background: 'rgba(30,41,59,0.8)', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #7C5CFF, #4DA3FF)' }} />
          </div>
        </div>
      </motion.div>

      {/* Journey Map */}
      <div className="glass" style={{ borderRadius: 18 }}>
        <div style={{ padding: '18px 18px 0', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7C5CFF', display: 'inline-block' }} />
          {t.sections.electionJourneyMap}
        </div>
        <JourneyMap />
      </div>

      {/* Step cards */}
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
          {t.journey.stepGuide}
        </div>
        <AnimatePresence mode="popLayout">
          {steps.map((step, idx) => (
            <div key={`${activeRole}-${step.id}`} id={`step-${idx}`} style={{ marginBottom: 10 }}>
              <StepCard stepIndex={idx} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
