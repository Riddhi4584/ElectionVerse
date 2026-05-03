import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Vote, Briefcase, FileSignature, Globe, MapPin, ArrowRight, Check } from 'lucide-react';

const roles = [
  { id: 'voter', icon: Vote, title: 'Voter', desc: 'Register, find polling booths, and vote securely.' },
  { id: 'candidate', icon: Briefcase, title: 'Candidate', desc: 'Manage your campaign and track requirements.' },
  { id: 'officer', icon: FileSignature, title: 'Election Officer', desc: 'Oversee booths and verify voter documents.' }
];

const languages = [
  { id: 'en', label: 'English', region: 'Global' },
  { id: 'hi', label: 'Hindi', region: 'India' },
  { id: 'gu', label: 'Gujarati', region: 'Gujarat' }
];

export default function OnboardingView() {
  const { setActiveRole, setLanguage, setLocation, completeOnboarding, setActiveView } = useStore();
  const [step, setStep] = useState(1);

  // Local state for selections before finalizing
  const [selectedRole, setSelectedRole] = useState('voter');
  const [selectedLang, setSelectedLang] = useState('en');
  const [locationInput, setLocationInput] = useState('');

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    setActiveRole(selectedRole);
    setLanguage(selectedLang);
    setLocation(locationInput || 'India');
    completeOnboarding();
    setActiveView('dashboard');
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="bg-app" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'fixed', inset: 0, zIndex: 100 }}>
      {/* Abstract Background Elements */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: 400, height: 400, background: 'var(--grad-start)', opacity: 0.15, filter: 'blur(100px)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, background: 'var(--grad-end)', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%' }} />

      <motion.div 
        className="glass-strong" 
        style={{ width: '100%', maxWidth: 640, padding: 40, borderRadius: 24, position: 'relative', overflow: 'hidden' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? 'var(--grad-start)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s ease' }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit">
              <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Choose your path</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Select how you want to use Election Coach.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {roles.map(role => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <motion.div
                      key={role.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(role.id)}
                      style={{
                        padding: 20,
                        borderRadius: 16,
                        background: isSelected ? 'rgba(124, 92, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isSelected ? 'var(--grad-start)' : 'rgba(255,255,255,0.08)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: isSelected ? 'var(--grad-start)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                        <Icon size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{role.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{role.desc}</div>
                      </div>
                      {isSelected && <Check size={20} color="var(--grad-start)" />}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit">
              <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Select your language</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>You can always change this later in settings.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                {languages.map(lang => {
                  const isSelected = selectedLang === lang.id;
                  return (
                    <motion.div
                      key={lang.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedLang(lang.id)}
                      style={{
                        padding: 24,
                        borderRadius: 16,
                        background: isSelected ? 'rgba(124, 92, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isSelected ? 'var(--grad-start)' : 'rgba(255,255,255,0.08)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 12,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Globe size={28} color={isSelected ? 'var(--grad-start)' : 'var(--text-muted)'} />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{lang.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{lang.region}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit">
              <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Where are you voting?</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>We'll customize your dashboard with local deadlines and candidates.</p>
              
              <div style={{ position: 'relative' }}>
                <MapPin size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 16 }} />
                <input
                  type="text"
                  placeholder="Enter your City or State (e.g., Mumbai, Maharashtra)"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    padding: '16px 16px 16px 48px',
                    fontSize: 15,
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--grad-start)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextStep}
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: 15 }}
          >
            {step === 3 ? 'Get Started' : 'Continue'}
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
