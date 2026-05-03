import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { roles } from '../data/electionData';

const tagColors = {
  info: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'rgba(99,102,241,0.3)' },
  warning: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  danger: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  success: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
};

export default function StepCard({ stepIndex }) {
  const { activeRole, currentStep, completedSteps, expandedStep, setExpandedStep, completeStep, goToNextStep, voiceEnabled } =
    useStore();
  const steps = roles[activeRole].steps;
  const step = steps[stepIndex];
  const isCompleted = completedSteps.includes(stepIndex);
  const isCurrent = currentStep === stepIndex;
  const isExpanded = expandedStep === stepIndex;
  const isLocked = !isCompleted && !isCurrent && stepIndex > currentStep;
  const tagCfg = tagColors[step.tagType] || tagColors.info;

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.9;
    utt.pitch = 1;
    window.speechSynthesis.speak(utt);
  };

  const handleExpand = () => {
    if (isLocked) return;
    setExpandedStep(stepIndex);
    if (!isExpanded) {
      speak(`Step ${stepIndex + 1}: ${step.title}. ${step.shortDesc}`);
    }
  };

  const handleComplete = (e) => {
    e.stopPropagation();
    completeStep(stepIndex);
    speak(`Step ${stepIndex + 1} completed! Moving to ${steps[stepIndex + 1]?.title || 'the final step'}.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stepIndex * 0.06 }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${
          isCompleted
            ? 'rgba(34,197,94,0.25)'
            : isCurrent && isExpanded
            ? 'rgba(99,102,241,0.4)'
            : isCurrent
            ? 'rgba(99,102,241,0.2)'
            : 'rgba(255,255,255,0.06)'
        }`,
        background: isCompleted
          ? 'rgba(34,197,94,0.05)'
          : isCurrent
          ? 'rgba(99,102,241,0.05)'
          : 'rgba(15,22,41,0.8)',
        transition: 'all 0.3s ease',
        opacity: isLocked ? 0.5 : 1,
        boxShadow: isCurrent && isExpanded
          ? '0 8px 32px rgba(99,102,241,0.15)'
          : isCompleted
          ? '0 4px 16px rgba(34,197,94,0.08)'
          : 'none',
      }}
    >
      {/* Header */}
      <div
        onClick={handleExpand}
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: isLocked ? 'not-allowed' : 'pointer',
        }}
      >
        {/* Step icon */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: isCompleted
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : isCurrent
              ? 'linear-gradient(135deg, #6366f1, #a78bfa)'
              : 'rgba(30,41,59,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
            boxShadow: isCompleted
              ? '0 4px 12px rgba(34,197,94,0.3)'
              : isCurrent
              ? '0 4px 12px rgba(99,102,241,0.4)'
              : 'none',
          }}
        >
          {isCompleted ? <CheckCircle2 size={20} color="white" /> : <span>{step.emoji}</span>}
        </div>

        {/* Step info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: isCompleted ? '#4ade80' : isCurrent ? '#e2e8f0' : '#94a3b8',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              {stepIndex + 1}. {step.title}
            </span>
            <span
              className="tag"
              style={{
                background: tagCfg.bg,
                color: tagCfg.color,
                border: `1px solid ${tagCfg.border}`,
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '20px',
                fontWeight: 600,
                letterSpacing: '0.3px',
              }}
            >
              {step.tag}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} /> {step.duration}
            </span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ color: step.tagType === 'warning' || step.tagType === 'danger' ? '#f59e0b' : '#64748b' }}>
              ⏰ {step.deadline}
            </span>
          </div>
        </div>

        {/* Expand toggle */}
        <div style={{ flexShrink: 0, color: '#475569' }}>
          {!isLocked && (isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
          {isLocked && <span style={{ fontSize: '16px' }}>🔒</span>}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 20px 20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px',
              }}
            >
              {/* What to do */}
              <div className="micro-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <ArrowRight size={14} color="#818cf8" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    What To Do
                  </span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {step.whatToDo.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '13px',
                        color: '#94a3b8',
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '14px', marginTop: '1px', flexShrink: 0 }}>
                        {i + 1}.
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Documents */}
              {step.documents.length > 0 && (
                <div className="micro-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <FileText size={14} color="#f59e0b" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Documents Needed
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {step.documents.map((doc, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          background: 'rgba(245,158,11,0.07)',
                          border: '1px solid rgba(245,158,11,0.15)',
                          fontSize: '12px',
                          color: '#fbbf24',
                        }}
                      >
                        <span>📄</span> {doc}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mistake prevention */}
              <div
                className="micro-card"
                style={{ background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.15)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <AlertTriangle size={14} color="#f87171" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ⚠️ Mistake Prevention
                  </span>
                </div>
                <div
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(239,68,68,0.08)',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#fca5a5', fontStyle: 'italic', marginBottom: '6px' }}>
                    ❓ "{step.mistake.q}"
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                    ✅ {step.mistake.a}
                  </div>
                </div>
              </div>

              {/* Learning card */}
              <div
                className="micro-card"
                style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <BookOpen size={14} color="#a78bfa" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    📚 Quick Learn: {step.learningCard.title}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '8px' }}>
                  {step.learningCard.fact}
                </p>
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(99,102,241,0.1)',
                    fontSize: '11px',
                    color: '#818cf8',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>Example: </span>
                  {step.learningCard.example}
                </div>
              </div>

              {/* Tips */}
              <div className="micro-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Lightbulb size={14} color="#4ade80" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    💡 Pro Tips
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {step.tips.map((tip, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#64748b',
                        lineHeight: 1.5,
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ color: '#4ade80', flexShrink: 0 }}>→</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {!isCompleted && (
                <motion.button
                  className="btn-primary"
                  onClick={handleComplete}
                  whileTap={{ scale: 0.97 }}
                >
                  <CheckCircle2 size={16} />
                  Mark Step Complete
                </motion.button>
              )}
              {isCompleted && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#4ade80',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={16} />
                  Completed ✓
                </div>
              )}
              {isCurrent && !isCompleted && stepIndex < steps.length - 1 && (
                <motion.button
                  className="btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(`Moving to next step: ${steps[stepIndex + 1]?.title}`);
                    goToNextStep();
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Skip for Now
                  <ArrowRight size={14} />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
