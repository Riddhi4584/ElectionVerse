import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const CARDS = [
  { id: 'voter-id', emoji: '🪪', color: '#7C5CFF', bg: 'rgba(124,92,255,0.08)', border: 'rgba(124,92,255,0.18)', tag: 'Voter Basics', titleKey: 'What is Voter ID?', desc: 'Your Voter ID (EPIC) is the official identity card issued by the Election Commission of India to every registered voter.', longDesc: 'The Electoral Photo Identity Card (EPIC), commonly known as the Voter ID, is issued by the Election Commission of India. It serves as an identity proof for citizens to cast their votes. It contains your name, photo, address, and your unique EPIC number.' },
  { id: 'evm',      emoji: '🖥️', color: '#4DA3FF', bg: 'rgba(77,163,255,0.08)',  border: 'rgba(77,163,255,0.18)',  tag: 'Technology',   titleKey: 'How EVM Works?',   desc: 'Electronic Voting Machines store votes offline with no internet connectivity, making them tamper-proof and secure.', longDesc: 'Electronic Voting Machines (EVMs) consist of a Control Unit and a Balloting Unit, connected by a cable. They operate on a simple 6-volt alkaline battery. Since they are not connected to any network (wired or wireless), they cannot be hacked remotely.' },
  { id: 'nota',     emoji: '🚫', color: '#f87171', bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.16)',   tag: 'Voting Rights', titleKey: 'What is NOTA?',    desc: 'None of the Above — a ballot option since 2013 allowing voters to reject all candidates. Highest vote-getter still wins.', longDesc: 'NOTA stands for "None of the Above". It allows voters to register a vote of rejection for all contesting candidates. While it empowers voters to express dissatisfaction, it does not change the election outcome; the candidate with the most valid votes still wins.' },
  { id: 'mcc',      emoji: '📜', color: '#fbbf24', bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.16)',  tag: 'Rules',         titleKey: 'Model Code of Conduct', desc: 'ECI guidelines that kick in from election announcement until results — ensuring a level playing field for all parties.', longDesc: 'The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission of India to regulate political parties and candidates prior to elections. It ensures free and fair elections by preventing ruling parties from misusing their power for campaigning.' },
  { id: 'eci',      emoji: '🏛️', color: '#4ade80', bg: 'rgba(34,197,94,0.07)',   border: 'rgba(34,197,94,0.16)',   tag: 'Institutions',  titleKey: 'Role of ECI',      desc: 'The Election Commission of India is a constitutional body responsible for conducting free and fair elections at all levels.', longDesc: 'The Election Commission of India (ECI) was established in 1950. It administers elections to the Lok Sabha, Rajya Sabha, State Legislative Assemblies, and the offices of the President and Vice President in the country.' },
  { id: 'vvpat',    emoji: '🖨️', color: '#c084fc', bg: 'rgba(192,132,252,0.07)', border: 'rgba(192,132,252,0.16)', tag: 'Technology',   titleKey: 'What is VVPAT?',   desc: 'Voter Verifiable Paper Audit Trail — shows a 7-second paper slip so you can verify your vote was recorded correctly.', longDesc: 'Voter Verifiable Paper Audit Trail (VVPAT) is an independent verification system attached to the EVM. It prints a paper slip containing the serial number, name, and symbol of the chosen candidate, allowing the voter to verify their vote before it falls into a sealed drop box.' },
];

export default function QuickLearning() {
  const { t } = useTranslation();
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <>
      <div className="learn-scroll">
        {CARDS.map((card, i) => (
          <motion.div key={card.id} className="learn-card" style={{ background: card.bg, borderColor: card.border, cursor: 'pointer' }}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }} id={`learn-card-${card.id}`}
            onClick={() => setSelectedCard(card)}
          >
            <div style={{ width: 40, height: 40, borderRadius: 11, background: `${card.color}20`, border: `1px solid ${card.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>
              {card.emoji}
            </div>
            <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 10, background: `${card.color}18`, border: `1px solid ${card.color}28`, fontSize: 10, color: card.color, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 8 }}>
              {card.tag}
            </div>
            <div className="font-display" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 7, lineHeight: 1.3 }}>{card.titleKey}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 14 }}>{card.desc}</div>
            <button style={{ background: 'none', border: 'none', color: card.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
              {t.learning.learnMore} <ArrowRight size={12} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="lang-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
            style={{ zIndex: 2000 }}
          >
            <motion.div
              className="lang-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ padding: 32, maxWidth: 450, background: 'var(--bg)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: `${selectedCard.color}20`, border: `2px solid ${selectedCard.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                  {selectedCard.emoji}
                </div>
                <button onClick={() => setSelectedCard(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 8, borderRadius: '50%' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 12, background: `${selectedCard.color}18`, border: `1px solid ${selectedCard.color}28`, fontSize: 12, color: selectedCard.color, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 12, textTransform: 'uppercase' }}>
                {selectedCard.tag}
              </div>

              <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.2 }}>
                {selectedCard.titleKey}
              </h2>
              
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                {selectedCard.longDesc}
              </p>

              <button 
                onClick={() => setSelectedCard(null)}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: selectedCard.color, color: 'white', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
              >
                Got It <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
