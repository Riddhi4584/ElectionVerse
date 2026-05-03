import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import JourneyView from './components/JourneyView';
import ScenariosView from './components/ScenariosView';
import AssistantPanel from './components/AssistantPanel';
import SettingsView from './components/SettingsView';
import LanguageModal from './components/LanguageModal';
import LoginView from './components/LoginView';

import OnboardingView from './components/OnboardingView';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

function AssistantFullView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40 }}>
      <div>
        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
          AI Assistant
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          The assistant panel is open on the right side. Ask me anything about elections!
        </p>
      </div>
      <div className="glass" style={{ borderRadius: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
        <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          Your Election Coach is Ready
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Use the chat panel on the right to ask questions about voter registration,
          polling day procedures, documents required, and much more.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const { activeView, theme, langModalOpen, isAuthenticated, onboardingComplete } = useStore();

  // Apply theme on mount and changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const views = {
    dashboard:  Dashboard,
    journey:    JourneyView,
    scenarios:  ScenariosView,
    assistant:  AssistantFullView,
    settings:   SettingsView,
  };

  if (!isAuthenticated) {
    return <LoginView />;
  }

  if (!onboardingComplete) {
    return <OnboardingView />;
  }

  const ActiveView = views[activeView] || Dashboard;

  return (
    <div className="bg-app" style={{ display: 'flex', minHeight: '100vh', width: '100%', transition: 'background 0.3s ease' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 0', maxWidth: 960, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeView} variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ActiveView />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AssistantPanel />

      {/* Language Modal */}
      <AnimatePresence>
        {langModalOpen && <LanguageModal />}
      </AnimatePresence>
    </div>
  );
}
