import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Globe } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LANGUAGES } from '../data/translations';

export default function LanguageModal() {
  const { language, setLanguage, setLangModalOpen, addMessage } = useStore();

  const handleSelect = (code) => {
    setLanguage(code);
    setLangModalOpen(false);
    // Update greeting in new language
    const greetings = {
      en: "👋 Hi! I'm your Election Coach. Ask me anything about voting, documents, deadlines, or what to do next!",
      hi: '👋 नमस्ते! मैं आपका चुनाव कोच हूं। मतदान, दस्तावेज़, समय सीमा के बारे में पूछें!',
      gu: '👋 નમસ્તે! હું તમારો ચૂંટણી કોચ છું. મતદાન, દસ્તાવેજો, સમય મર્યાદા વિશે પૂછો!',
    };
    // show toast-like feedback via store
  };

  return (
    <motion.div
      className="lang-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setLangModalOpen(false)}
    >
      <motion.div
        className="lang-modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7C5CFF, #4DA3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={18} color="white" />
            </div>
            <div>
              <div className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Choose Language</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>भाषा चुनें / ભાષા પસંદ કરો</div>
            </div>
          </div>
          <button onClick={() => setLangModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Language Options */}
        {LANGUAGES.map((lang) => (
          <motion.button
            key={lang.code}
            className={`lang-option${language === lang.code ? ' selected' : ''}`}
            onClick={() => handleSelect(lang.code)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <span style={{ fontSize: 28 }}>{lang.flag}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{lang.nativeLabel}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{lang.label}</div>
            </div>
            {language === lang.code && (
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #7C5CFF, #4DA3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={13} color="white" />
              </div>
            )}
          </motion.button>
        ))}

        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
          The interface will update immediately • इंटरफ़ेस तुरंत अपडेट होगा
        </div>
      </motion.div>
    </motion.div>
  );
}
