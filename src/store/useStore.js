import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';

const NOTIF_ITEMS = [
  { id: 1, type: 'warning', title: 'Registration Deadline', desc: 'Voter registration closes in 7 days. Act now!', time: '2h ago', read: false },
  { id: 2, type: 'info', title: 'New Step Unlocked', desc: 'Complete eligibility check to unlock Registration step.', time: '5h ago', read: false },
  { id: 3, type: 'success', title: 'e-EPIC Card Ready', desc: 'Your Electronic Voter ID is available for download.', time: '1d ago', read: false },
  { id: 4, type: 'danger', title: 'Voting Day Approaching', desc: 'Election Day in 3 days — find your polling booth!', time: '2d ago', read: true },
];

export const useStore = create(
  persist(
    (set, get) => ({
      // ─── Auth (Firebase) ───
      isAuthenticated: false,
      currentUser: null, // will hold { id, email }
      register: async (email, password) => {
        try {
          const res = await api.auth.register(email, password);
          const user = res.user;
          
          set({ 
            isAuthenticated: true, 
            currentUser: { id: user.id, email: user.email },
            activeRole: user.activeRole || 'voter',
            language: user.language || 'en',
            location: user.location || '',
            onboardingComplete: Boolean(user.onboardingComplete),
            completedSteps: user.completedSteps || []
          });
          return { success: true };
        } catch (err) {
          return { success: false, error: err.message };
        }
      },
      login: async (email, password) => {
        try {
          const res = await api.auth.login(email, password);
          const user = res.user;
          
          set({ 
            isAuthenticated: true, 
            currentUser: { id: user.id, email: user.email },
            activeRole: user.activeRole || 'voter',
            language: user.language || 'en',
            location: user.location || '',
            onboardingComplete: Boolean(user.onboardingComplete),
            completedSteps: user.completedSteps || []
          });
          return { success: true };
        } catch (err) {
          return { success: false, error: err.message };
        }
      },
      logout: async () => {
        try {
          set({ isAuthenticated: false, currentUser: null, onboardingComplete: false });
        } catch (err) {
          console.error('Failed to log out', err);
        }
      },

      // ─── Onboarding & Personalization ───
      onboardingComplete: false,
      location: '',
      setLocation: (loc) => set({ location: loc }),
      completeOnboarding: async () => {
        const state = get();
        if (state.currentUser) {
          try {
            await api.user.updateOnboarding(state.currentUser.id, state.activeRole, state.language, state.location);
          } catch (e) {
            console.error('Failed to sync onboarding', e);
          }
        }
        set({ onboardingComplete: true });
      },

      // ─── Role ───
      activeRole: 'voter',
      setActiveRole: (role) => {
        set({ activeRole: role, currentStep: 0, completedSteps: [], expandedStep: null });
        if (get().activeView === 'dashboard') {
          window.history.replaceState(null, '', `/dashboard/${role}`);
        }
      },

      // ─── Journey ───
      currentStep: 0,
      completedSteps: [],
      expandedStep: null,
      setCurrentStep: (idx) => set({ currentStep: idx }),
      setExpandedStep: (idx) =>
        set((s) => ({ expandedStep: s.expandedStep === idx ? null : idx })),
      completeStep: async (idx) => {
        const state = get();
        if (state.currentUser && !state.completedSteps.includes(idx)) {
          try {
            await api.journey.markStepComplete(state.currentUser.id, idx);
          } catch (e) {
            console.error('Failed to sync step', e);
          }
        }
        set((s) => ({
          completedSteps: s.completedSteps.includes(idx) ? s.completedSteps : [...s.completedSteps, idx],
          currentStep: Math.max(s.currentStep, idx + 1),
        }));
      },
      goToNextStep: () =>
        set((s) => { const next = s.currentStep + 1; return { currentStep: next, expandedStep: next }; }),

      // ─── Navigation ───
      activeView: 'dashboard',
      setActiveView: (view) => {
        // Pseudo-routing using History API
        if (view === 'dashboard') {
          const role = get().activeRole;
          window.history.replaceState(null, '', `/dashboard/${role}`);
        } else {
          window.history.replaceState(null, '', `/${view}`);
        }
        set({ activeView: view });
      },

      // ─── Sidebar ───
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // ─── Theme ───
      theme: 'dark',
      toggleTheme: () => set((s) => {
        const next = s.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        return { theme: next };
      }),

      // ─── Language ───
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      langModalOpen: false,
      setLangModalOpen: (v) => set({ langModalOpen: v }),

      // ─── Notifications ───
      notificationsEnabled: true,
      toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
      notifPanelOpen: false,
      toggleNotifPanel: () => set((s) => ({ notifPanelOpen: !s.notifPanelOpen })),
      closeNotifPanel: () => set({ notifPanelOpen: false }),
      notificationItems: NOTIF_ITEMS,
      markAllRead: () => set((s) => ({ notificationItems: s.notificationItems.map((n) => ({ ...n, read: true })) })),
      markOneRead: (id) => set((s) => ({ notificationItems: s.notificationItems.map((n) => n.id === id ? { ...n, read: true } : n) })),

      // ─── Assistant Panel ───
      assistantOpen: true,
      toggleAssistant: () => set((s) => ({ assistantOpen: !s.assistantOpen })),

      // ─── Voice ───
      voiceEnabled: false,
      toggleVoice: () => set((s) => ({ voiceEnabled: !s.voiceEnabled })),

      // ─── Chat ───
      messages: [{ id: 1, from: 'bot', text: "👋 Hi! I'm your Election Coach. Ask me anything about voting, documents, deadlines, or what to do next!" }],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, { id: Date.now(), ...msg }] })),
      setMessages: (msgs) => set({ messages: msgs }),
    }),
    {
      name: 'election-coach-storage',
      // Optionally we could partialize to avoid saving ephemeral state like notifPanelOpen
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        onboardingComplete: state.onboardingComplete,
        location: state.location,
        activeRole: state.activeRole,
        language: state.language,
        theme: state.theme,
        completedSteps: state.completedSteps,
        currentStep: state.currentStep,
      }),
    }
  )
);
