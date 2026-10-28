// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header';
import UnderwaterBackground from './components/UnderwaterBackground';
import WelcomeView from './components/WelcomeView';
import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import SectionSelectionView from './components/SectionSelectionView';
import DashboardView from './components/DashboardView';
import SharkAttackOverlay from './components/SharkAttackOverlay';
import CompletionView from './components/CompletionView';
import OrganizerView from './components/OrganizerView';
import LeaderboardView from './components/LeaderboardView';
import { sound } from './utils/sound';

export default function App() {
  const [currentView, setView] = useState('welcome'); // welcome, select_section, dashboard, completion, leaderboard, organizer
  const [currentTeam, setCurrentTeam] = useState(null);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [sharkAttackEvent, setSharkAttackEvent] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.io
  useEffect(() => {
    const s = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });

    s.on('connect', () => {
      // Connected
    });

    s.on('shark-attack-start', (eventData) => {
      setSharkAttackEvent(eventData);
    });

    s.on('shark-attack-end', () => {
      setSharkAttackEvent(null);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Restore stored session from localStorage
  const refreshTeam = async (teamId) => {
    try {
      const res = await fetch(`/api/team/${teamId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCurrentTeam(data.team);

      // Route according to status
      if (data.team.status === 'completed') {
        setView('completion');
      } else if (data.team.section) {
        setView('dashboard');
      } else {
        setView('select_section');
      }
    } catch (e) {
      localStorage.removeItem('nemo_team_id');
      setCurrentTeam(null);
    }
  };

  useEffect(() => {
    const storedTeamId = localStorage.getItem('nemo_team_id');
    if (storedTeamId) {
      refreshTeam(storedTeamId);
    }
  }, []);

  const handleRegisterSuccess = (team) => {
    setCurrentTeam(team);
    localStorage.setItem('nemo_team_id', team.teamId);
    setRegisterOpen(false);
    setView('select_section');
  };

  const handleLoginSuccess = (team) => {
    setCurrentTeam(team);
    localStorage.setItem('nemo_team_id', team.teamId);
    setLoginOpen(false);
    if (team.status === 'completed') {
      setView('completion');
    } else if (team.section) {
      setView('dashboard');
    } else {
      setView('select_section');
    }
  };

  const handleSectionSelected = (updatedTeam) => {
    setCurrentTeam(updatedTeam);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('nemo_team_id');
    setCurrentTeam(null);
    setView('welcome');
  };

  const handleSharkAttackSubmit = async (selectedOption) => {
    if (!currentTeam) throw new Error('Not logged in');
    const res = await fetch(`/api/team/${currentTeam.teamId}/shark-attack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedOption })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed');

    // Update team score
    refreshTeam(currentTeam.teamId);
    return data;
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Underwater Ocean Animated Background */}
      <UnderwaterBackground />

      {/* Main Header */}
      <Header
        currentTeam={currentTeam}
        currentView={currentView}
        setView={setView}
        onLogout={handleLogout}
        onOpenLogin={() => setLoginOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1 flex flex-col justify-center">
        {currentView === 'welcome' && (
          <WelcomeView
            onStartAdventure={() => setRegisterOpen(true)}
            onResumeMission={() => setLoginOpen(true)}
            onViewLeaderboard={() => setView('leaderboard')}
          />
        )}

        {currentView === 'select_section' && currentTeam && (
          <SectionSelectionView
            currentTeam={currentTeam}
            onSectionSelected={handleSectionSelected}
          />
        )}

        {currentView === 'dashboard' && currentTeam && (
          <DashboardView
            currentTeam={currentTeam}
            onTeamUpdate={(updated) => setCurrentTeam(updated)}
            onFinished={() => setView('completion')}
          />
        )}

        {currentView === 'completion' && currentTeam && (
          <CompletionView
            currentTeam={currentTeam}
            onViewLeaderboard={() => setView('leaderboard')}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView
            onBackToGame={currentTeam ? () => {
              if (currentTeam.status === 'completed') setView('completion');
              else if (currentTeam.section) setView('dashboard');
              else setView('select_section');
            } : null}
          />
        )}

        {currentView === 'organizer' && (
          <OrganizerView
            onBackToWelcome={() => setView('welcome')}
          />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full py-4 px-6 border-t border-cyan-500/10 bg-slate-950/80 backdrop-blur-sm text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Finding Nemo — Find the Data &bull; College Technical Competition Platform
          </div>
          <div className="text-cyan-300/80 font-medium italic">
            “Just keep swimming.”
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      {/* Bruce's Shark Attack Bonus Overlay */}
      {sharkAttackEvent && currentTeam && (
        <SharkAttackOverlay
          eventData={sharkAttackEvent}
          currentTeam={currentTeam}
          onSubmitAnswer={handleSharkAttackSubmit}
          onClose={() => setSharkAttackEvent(null)}
        />
      )}

    </div>
  );
}
