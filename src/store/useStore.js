import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

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
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          // Create user document in Firestore
          const defaultData = {
            email: user.email,
            activeRole: 'voter',
            language: 'en',
            location: '',
            onboardingComplete: false,
            completedSteps: []
          };
          await setDoc(doc(db, 'users', user.uid), defaultData);
          
          set({ 
            isAuthenticated: true, 
            currentUser: { id: user.uid, email: user.email },
            ...defaultData
          });
          return { success: true };
        } catch (err) {
          return { success: false, error: err.message };
        }
      },
      login: async (email, password) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          // Fetch user data from Firestore
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            set({ 
              isAuthenticated: true, 
              currentUser: { id: user.uid, email: user.email },
              activeRole: data.activeRole || 'voter',
              language: data.language || 'en',
              location: data.location || '',
              onboardingComplete: Boolean(data.onboardingComplete),
              completedSteps: data.completedSteps || []
            });
            return { success: true };
          } else {
            return { success: false, error: 'User data not found in database.' };
          }
        } catch (err) {
          return { success: false, error: err.message };
        }
      },
      logout: async () => {
        try {
          await signOut(auth);
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
            await updateDoc(doc(db, 'users', state.currentUser.id), {
              activeRole: state.activeRole,
              language: state.language,
              location: state.location,
              onboardingComplete: true
            });
          } catch (e) {
            console.error('Failed to sync onboarding to Firestore', e);
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
            await updateDoc(doc(db, 'users', state.currentUser.id), {
              completedSteps: arrayUnion(idx)
            });
          } catch (e) {
            console.error('Failed to sync step to Firestore', e);
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
