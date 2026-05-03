import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { isValidEmail, isNotEmpty } from '../utils/validation';

export default function LoginView() {
  const { login, register } = useStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!isNotEmpty(password)) {
      setErrorMsg('Password cannot be empty');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        const res = await register(email, password);
        if (!res.success) setErrorMsg(res.error);
      } else {
        const res = await login(email, password);
        if (!res.success) setErrorMsg(res.error);
      }
    } catch (e) {
      setErrorMsg('An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(124,92,255,0.15) 0%, transparent 60%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(77,163,255,0.1) 0%, transparent 60%)', filter: 'blur(60px)', zIndex: 0 }} />

      <motion.div
        className="glass"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 24,
          padding: 40,
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #7C5CFF, #4DA3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 25px rgba(124,92,255,0.4)', position: 'relative' }}
          >
            {isRegistering ? <UserPlus size={32} color="white" /> : <ShieldCheck size={32} color="white" />}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', top: -4, right: -4 }}
            >
              <Sparkles size={16} color="#fbbf24" />
            </motion.div>
          </motion.div>
          
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {isRegistering ? 'Join Election Coach to start your journey.' : 'Sign in to continue your election journey.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AnimatePresence>
            {errorMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: 13, fontWeight: 600, textAlign: 'center' }}
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label htmlFor="email-input" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email Address
            </label>
            <div className="chat-input-wrap" style={{ borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Mail size={18} color="var(--text-muted)" />
              <input
                id="email-input"
                type="email"
                placeholder="voter@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email Address"
                aria-invalid={errorMsg && !isValidEmail(email) ? "true" : "false"}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 15 }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password-input" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <div className="chat-input-wrap" style={{ borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Lock size={18} color="var(--text-muted)" />
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
                aria-invalid={errorMsg && !isNotEmpty(password) ? "true" : "false"}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 15 }}
              />
            </div>
          </div>

          {!isRegistering && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" style={{ background: 'none', border: 'none', color: '#7C5CFF', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Forgot password?
              </button>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading || !email || !password}
            aria-busy={isLoading ? "true" : "false"}
            aria-label={isRegistering ? 'Create Account' : 'Sign In'}
            whileHover={{ scale: isLoading || !email || !password ? 1 : 1.02 }}
            whileTap={{ scale: isLoading || !email || !password ? 1 : 0.98 }}
            style={{
              marginTop: 8,
              padding: '14px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7C5CFF, #4DA3FF)',
              color: 'white',
              border: 'none',
              fontSize: 16,
              fontWeight: 700,
              cursor: isLoading || !email || !password ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: isLoading || !email || !password ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
              />
            ) : (
              <>{isRegistering ? 'Create Account' : 'Sign In'} <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <button
              onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(''); }}
              style={{ background: 'none', border: 'none', color: '#4DA3FF', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              {isRegistering ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
