import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from './HeroSection';
import JourneyMap from './JourneyMap';
import SmartCards from './SmartCards';
import QuickLearning from './QuickLearning';
import SkeletonLoader from './SkeletonLoader';
import { useTranslation } from '../hooks/useTranslation';
import { useStore } from '../store/useStore';

function SectionHeader({ label, dotColor = '#7C5CFF' }) {
  return (
    <div className="section-label">
      <span className="section-dot" style={{ background: dotColor }} />
      {label}
    </div>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45, ease: 'easeOut' } }),
};

const VoterDashboard = React.memo(function VoterDashboard({ t }) {
  return (
    <>
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
        <HeroSection />
      </motion.div>
      <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeader label={t.sections.electionJourneyMap || 'ELECTION JOURNEY MAP'} dotColor="#7C5CFF" />
        <div className="glass" style={{ borderRadius: 18 }}>
          <JourneyMap />
        </div>
      </motion.div>
      <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeader label={t.sections.quickOverview || 'QUICK OVERVIEW'} dotColor="#4DA3FF" />
        <SmartCards />
      </motion.div>
      <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeader label={t.sections.quickLearning || 'QUICK LEARNING'} dotColor="#4ade80" />
        <QuickLearning />
      </motion.div>
    </>
  );
});

const CandidateDashboard = React.memo(function CandidateDashboard({ t }) {
  return (
    <>
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
        <HeroSection />
      </motion.div>
      <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeader label="CANDIDATE JOURNEY" dotColor="#f59e0b" />
        <div className="glass" style={{ borderRadius: 18 }}>
          <JourneyMap />
        </div>
      </motion.div>
      <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeader label="CAMPAIGN MANAGEMENT" dotColor="#fbbf24" />
        <SmartCards />
      </motion.div>
    </>
  );
});

const OfficerDashboard = React.memo(function OfficerDashboard({ t }) {
  return (
    <>
      <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
        <HeroSection />
      </motion.div>
      <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeader label="OFFICER PROTOCOLS" dotColor="#22c55e" />
        <div className="glass" style={{ borderRadius: 18 }}>
          <JourneyMap />
        </div>
      </motion.div>
      <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
        <SectionHeader label="DUTY ASSIGNMENTS" dotColor="#4ade80" />
        <SmartCards />
      </motion.div>
    </>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { activeRole } = useStore();

  useEffect(() => { const timer = setTimeout(() => setLoading(false), 600); return () => clearTimeout(timer); }, [activeRole]);

  return (
    <div role="main" aria-label="Dashboard Content" style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 40 }}>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SkeletonLoader />
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
          >
            {activeRole === 'voter' && <VoterDashboard t={t} />}
            {activeRole === 'candidate' && <CandidateDashboard t={t} />}
            {activeRole === 'officer' && <OfficerDashboard t={t} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
