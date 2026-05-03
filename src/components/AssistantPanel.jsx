import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, Bot, User, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { roles } from '../data/electionData';
import { useTranslation } from '../hooks/useTranslation';

const SUGGESTIONS_EN = ['What documents do I need?', 'When is the registration deadline?', 'How do I find my polling booth?', 'What is NOTA?', 'Can I vote without Voter ID?', 'How does EVM work?'];
const SUGGESTIONS_HI = ['कौन से दस्तावेज़ चाहिए?', 'पंजीकरण की अंतिम तिथि कब है?', 'अपना मतदान केंद्र कैसे खोजें?', 'NOTA क्या है?', 'बिना Voter ID के मतदान?', 'EVM कैसे काम करता है?'];
const SUGGESTIONS_GU = ['કઇ દસ્તાવેજો જોઈએ?', 'નોંધણીની અંતિમ તારીખ ક્યારે?', 'મારો મતદાન કેન્દ્ર કેવી રીતે શોધવો?', 'NOTA શું છે?', 'Voter ID વગર મત?', 'EVM કેવી રીતે કામ કરે?'];

const SUGGESTIONS_MAP = { en: SUGGESTIONS_EN, hi: SUGGESTIONS_HI, gu: SUGGESTIONS_GU };

const BOT_RESPONSES = {
  'documents': (role) => `For the **${role.label}** journey, current step requires: ${role.steps[0].documents.slice(0, 3).join(', ')}. Each step has specific document needs — check the step detail cards!`,
  'registration': () => '📅 Registration must be completed **30 days before Election Day**. Deadlines vary by state — always verify on the official Election Commission portal.',
  'polling booth': () => '🗺️ Find your polling booth via:\n• **SMS**: Send EPIC number to 1950\n• **Voter Helpline App**\n• **voters.eci.gov.in** portal',
  'nota': () => '🚫 **NOTA (None of the Above)** was introduced in 2013. It lets you reject all candidates. However, the candidate with the highest votes still wins.',
  'voter id': () => '✅ Yes! **12 alternative documents** are accepted:\nAadhaar, Passport, PAN Card, Driving License, MNREGA Card, Bank Passbook with photo, and more.',
  'evm': () => '🖥️ **EVM (Electronic Voting Machine)** is a standalone device with no internet connection.\n\nPress the button → VVPAT shows candidate for 7 seconds → Vote recorded!',
};

function getBotReply(text, role) {
  const key = text.toLowerCase();
  for (const [q, fn] of Object.entries(BOT_RESPONSES)) {
    if (key.includes(q)) return fn(role);
  }
  return `Thanks for asking! For accurate information, visit **voters.eci.gov.in** or call **1950**. I'm here to guide you through your ${role.label} journey! 🗳️`;
}

export default function AssistantPanel() {
  const { messages, addMessage, assistantOpen, toggleAssistant, activeRole, language } = useStore();
  const { t } = useTranslation();
  const a = t.assistant;
  const role = roles[activeRole];
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const suggestions = SUGGESTIONS_MAP[language] || SUGGESTIONS_EN;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const t2 = text || input.trim();
    if (!t2) return;
    setInput('');
    addMessage({ from: 'user', text: t2 });
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
    setIsTyping(false);
    addMessage({ from: 'bot', text: getBotReply(t2, role) });
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <AnimatePresence>
      {assistantOpen && (
        <motion.aside className="assistant-panel"
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <motion.div className="animate-glow-pulse"
              style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #7C5CFF, #4DA3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <Sparkles size={16} color="white" />
            </motion.div>
            <div style={{ flex: 1 }}>
              <div className="font-display" style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{a.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{a.status}</span>
              </div>
            </div>
            <button onClick={toggleAssistant} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                  style={{ display: 'flex', flexDirection: msg.from === 'bot' ? 'row' : 'row-reverse', gap: 8, alignItems: 'flex-start' }}
                >
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: msg.from === 'bot' ? 'linear-gradient(135deg, #7C5CFF, #4DA3FF)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12 }}>
                    {msg.from === 'bot' ? <Bot size={13} color="white" /> : <User size={13} color="#94A3B8" />}
                  </div>
                  <div className={msg.from === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}>
                    {msg.text.split('\n').map((line, i) => {
                      const parts = line.split(/\*\*(.*?)\*\*/g);
                      return (
                        <p key={i} style={{ margin: i > 0 ? '4px 0 0' : 0 }}>
                          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: '#c4b5fd' }}>{p}</strong> : p)}
                        </p>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #7C5CFF, #4DA3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={13} color="white" />
                  </div>
                  <div className="chat-bubble-bot" style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }}
                          animate={{ y: [0, -5, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div style={{ padding: '8px 14px 6px', flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{a.suggested}</div>
            <div className="chips-row">
              {suggestions.map((s) => (
                <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>
                  <ChevronRight size={10} />{s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: '8px 14px 16px', flexShrink: 0 }}>
            <div className="chat-input-wrap">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder={a.placeholder} id="chat-input" />
              <motion.button onClick={() => sendMessage()} whileTap={{ scale: 0.9 }}
                style={{ background: input.trim() ? 'linear-gradient(135deg, #7C5CFF, #4DA3FF)' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0, transition: 'background 0.2s' }}
                id="chat-send-btn"
              >
                <Send size={13} color={input.trim() ? 'white' : '#475569'} />
              </motion.button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
