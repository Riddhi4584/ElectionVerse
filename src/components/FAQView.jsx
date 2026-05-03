import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { faqs } from '../data/electionData';

const TAG_COLORS = {
  Voter: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'rgba(99,102,241,0.3)' },
  Candidate: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  Officer: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
};

export default function FAQView() {
  const [openIdx, setOpenIdx] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = faqs.filter((f) => {
    const matchSearch = f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || f.tag === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
          ⚠️ Mistake Prevention & Quick Answers
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Common election misconceptions — corrected clearly</p>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            style={{ width: '100%', padding: '10px 14px 10px 36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#e2e8f0', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Voter', 'Candidate', 'Officer'].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${filter === tag ? (TAG_COLORS[tag]?.border || 'rgba(99,102,241,0.3)') : 'rgba(255,255,255,0.06)'}`,
                background: filter === tag ? (TAG_COLORS[tag]?.bg || 'rgba(99,102,241,0.15)') : 'transparent',
                color: filter === tag ? (TAG_COLORS[tag]?.color || '#818cf8') : '#64748b',
                transition: 'all 0.2s ease',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '14px' }}>No matching questions found</p>
          </div>
        )}
        {filtered.map((faq, i) => {
          const isOpen = openIdx === i;
          const tagCfg = TAG_COLORS[faq.tag] || TAG_COLORS.Voter;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ borderRadius: '14px', overflow: 'hidden', border: `1px solid ${isOpen ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}`, background: isOpen ? 'rgba(239,68,68,0.04)' : 'rgba(15,22,41,0.8)', transition: 'all 0.3s ease' }}
            >
              <div onClick={() => setOpenIdx(isOpen ? null : i)} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>❓</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.4 }}>{faq.q}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: tagCfg.bg, color: tagCfg.color, border: `1px solid ${tagCfg.border}` }}>{faq.tag}</span>
                  {isOpen ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                </div>
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 20px 18px 20px', paddingLeft: '52px' }}>
                      <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                        <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>✅ Correct Information</div>
                        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>{faq.a}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
