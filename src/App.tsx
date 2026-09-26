import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mission, 
  StudentProfile, 
  Badge, 
  StoreItem, 
  AccessibilitySettings, 
  BloomEvaluation, 
  SpreadsheetGrid, 
  ChecklistItem 
} from './types';
import { INITIAL_MISSION, SECONDARY_MISSIONS, BADGES, STORE_ITEMS } from './data/initialMissions';
import { Navbar } from './components/Navbar';
import { AccessibilityToolbar, ClosedCaptionsBar } from './components/AccessibilityToolbar';
import { AccessibilityModal } from './components/AccessibilityModal';
import { MissionsHub } from './components/MissionsHub';
import { ProfessorPanel } from './components/ProfessorPanel';
import { PedagogicalStore } from './components/PedagogicalStore';
import { SpreadsheetModal } from './components/SpreadsheetModal';
import { EvaluationModal } from './components/EvaluationModal';

export default function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<'hub' | 'professor' | 'store'>('hub');

  // Missions State
  const [missions, setMissions] = useState<Mission[]>([INITIAL_MISSION, ...SECONDARY_MISSIONS]);
  const [activeMission, setActiveMission] = useState<Mission>(INITIAL_MISSION);
  const [spreadsheetOpen, setSpreadsheetOpen] = useState<boolean>(false);
  const [evaluationOpen, setEvaluationOpen] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<BloomEvaluation | null>(null);

  // Student Profile / Gamification State
  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('educatech_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      name: 'Estudante EducaTech',
      role: 'Assistente Comercial Júnior',
      xp: 150,
      level: 1,
      coins: 120,
      unlockedBadgeIds: ['badge-soma'],
      purchasedItemIds: [],
      completedMissionIds: [],
      safeFailRetries: 1
    };
  });

  // Save student profile
  useEffect(() => {
    localStorage.setItem('educatech_student_profile', JSON.stringify(student));
  }, [student]);

  // Accessibility Settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('educatech_accessibility');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      highContrast: false,
      largeText: false,
      speechEnabled: false,
      speechRate: 1.0,
      captionsEnabled: true,
      captionSize: 'normal',
      captionContrast: 'dark',
      librasVideoEnabled: false,
      keyboardGuideOpen: false
    };
  });

  useEffect(() => {
    localStorage.setItem('educatech_accessibility', JSON.stringify(accessibility));
    if (accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [accessibility]);

  // Screen Reader Live Announcements
  const [announcement, setAnnouncement] = useState<string>('');
  const announce = useCallback((msg: string) => {
    setAnnouncement(msg);
  }, []);

  // Closed Captions State
  const [caption, setCaption] = useState<string>(
    'Bem-vindo à Canindé Distribuidora. Abra a primeira missão de controle de vendas para começar.'
  );
  const [captionSpeaker, setCaptionSpeaker] = useState<string>('Zequinha Silva');

  // Text-To-Speech function
  const speakText = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = accessibility.speechRate || 1.0;

      // Select Portuguese voice if available
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find((v) => v.lang.startsWith('pt'));
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      window.speechSynthesis.speak(utterance);
    },
    [accessibility.speechRate]
  );

  // Auto-speak if speech is enabled when caption changes
  const updateCaptionAndMaybeSpeak = useCallback(
    (speaker: string, text: string) => {
      setCaption(text);
      setCaptionSpeaker(speaker);
      if (accessibility.speechEnabled) {
        speakText(`${speaker} diz: ${text}`);
      }
    },
    [accessibility.speechEnabled, speakText]
  );

  // Open Spreadsheet Modal
  const handleOpenSpreadsheet = (mission: Mission) => {
    setActiveMission(mission);
    setSpreadsheetOpen(true);
    updateCaptionAndMaybeSpeak(
      'Juvenildo Canindé',
      mission.dialogues.juvenildoIntro
    );
    announce(`Abrindo a planilha da missão: ${mission.title}`);
  };

  // Evaluate Artifact
  const handleEvaluateArtifact = async (
    grid: SpreadsheetGrid,
    formulasUsed: Record<string, string>,
    checklist: ChecklistItem[],
    justification: string
  ) => {
    setIsEvaluating(true);
    announce('Avaliando a planilha e as fórmulas enviadas...');

    try {
      const response = await fetch('/api/evaluate-artifact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetValues: grid,
          formulasUsed,
          checklistResults: checklist,
          justification,
          missionTitle: activeMission.title
        })
      });

      const data = await response.json();
      if (data.success && data.evaluation) {
        const evalRes: BloomEvaluation = data.evaluation;
        setEvaluationResult(evalRes);

        // Update student gamification rewards
        setStudent((prev) => {
          const newXp = prev.xp + evalRes.earnedXp;
          const newCoins = prev.coins + evalRes.earnedCoins;
          const newLevel = Math.floor(newXp / 500) + 1;
          
          const newBadges = [...prev.unlockedBadgeIds];
          if (evalRes.suggestedBadges) {
            evalRes.suggestedBadges.forEach((badgeName) => {
              const matchedBadge = BADGES.find((b) => b.name.toLowerCase().includes(badgeName.toLowerCase()));
              if (matchedBadge && !newBadges.includes(matchedBadge.id)) {
                newBadges.push(matchedBadge.id);
              }
            });
          }

          const completed = evalRes.passed && !prev.completedMissionIds.includes(activeMission.id)
            ? [...prev.completedMissionIds, activeMission.id]
            : prev.completedMissionIds;

          return {
            ...prev,
            xp: newXp,
            coins: newCoins,
            level: newLevel,
            unlockedBadgeIds: newBadges,
            completedMissionIds: completed
          };
        });

        // Close spreadsheet modal and open evaluation modal
        setSpreadsheetOpen(false);
        setEvaluationOpen(true);
        updateCaptionAndMaybeSpeak(
          'Juvenildo Canindé',
          evalRes.juvenildoComment
        );
      }
    } catch (err) {
      console.error(err);
      announce('Erro ao submeter avaliação. Tente novamente.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Safe-Fail Revision handler
  const handleReviseSafeFail = () => {
    setEvaluationOpen(false);
    setSpreadsheetOpen(true);
    setStudent((prev) => {
      const newRetries = prev.safeFailRetries + 1;
      const newBadges = prev.unlockedBadgeIds.includes('badge-safe-fail')
        ? prev.unlockedBadgeIds
        : [...prev.unlockedBadgeIds, 'badge-safe-fail'];
      return {
        ...prev,
        safeFailRetries: newRetries,
        unlockedBadgeIds: newBadges
      };
    });
    updateCaptionAndMaybeSpeak(
      'Zequinha Silva',
      'Boa! Use a segunda chance para ajustar as fórmulas sem perder ponto. Revise com calma!'
    );
    announce('Segunda chance ativada. Retornando à planilha com seus dados salvos.');
  };

  // Publish Mission from Professor Panel
  const handlePublishMission = (newMission: Mission) => {
    setMissions((prev) => [newMission, ...prev.filter((m) => m.id !== newMission.id)]);
    setActiveMission(newMission);
    setCurrentView('hub');
    updateCaptionAndMaybeSpeak(
      'Juvenildo Canindé',
      `Nova missão publicada: ${newMission.title}. Bom trabalho nos cálculos!`
    );
  };

  // Store Purchase
  const handlePurchaseItem = (item: StoreItem) => {
    setStudent((prev) => ({
      ...prev,
      coins: prev.coins - item.price,
      purchasedItemIds: [...prev.purchasedItemIds, item.id]
    }));
    updateCaptionAndMaybeSpeak(
      'Zequinha Silva',
      `Boa! Você desbloqueou ${item.name}. Já pode usar na sua planilha.`
    );
  };

  const hasAuditorPerk = student.purchasedItemIds.includes('item-auditor-lente');

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      accessibility.highContrast 
        ? 'bg-black text-yellow-300' 
        : 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100'
    }`}>
      {/* Screen Reader Live Region */}
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {announcement}
      </div>

      {/* WCAG Accessibility Bar */}
      <AccessibilityToolbar
        settings={accessibility}
        onUpdate={setAccessibility}
        onAnnounce={announce}
      />

      {/* Main Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          announce(`Navegando para: ${view === 'hub' ? 'Central de Missões' : view === 'professor' ? 'Painel do Professor' : 'Loja Pedagógica'}`);
        }}
        student={student}
        settings={accessibility}
        onOpenAccessibilityModal={() => setAccessibility((prev) => ({ ...prev, keyboardGuideOpen: true }))}
      />

      {/* Main Content View */}
      <main 
        id="main-content"
        role="main"
        className="flex-1 p-4 sm:p-6 lg:p-8 pb-24"
      >
        {currentView === 'hub' && (
          <MissionsHub
            missions={missions}
            student={student}
            badges={BADGES}
            onOpenSpreadsheet={handleOpenSpreadsheet}
            settings={accessibility}
            onSpeak={speakText}
          />
        )}

        {currentView === 'professor' && (
          <ProfessorPanel
            onPublishMission={handlePublishMission}
            activeMission={activeMission}
            settings={accessibility}
            onAnnounce={announce}
          />
        )}

        {currentView === 'store' && (
          <PedagogicalStore
            items={STORE_ITEMS}
            student={student}
            onPurchase={handlePurchaseItem}
            settings={accessibility}
            onAnnounce={announce}
          />
        )}
      </main>

      {/* Interactive Excel Spreadsheet Modal */}
      <SpreadsheetModal
        mission={activeMission}
        isOpen={spreadsheetOpen}
        onClose={() => setSpreadsheetOpen(false)}
        onEvaluate={handleEvaluateArtifact}
        settings={accessibility}
        onSpeak={speakText}
        onAnnounce={announce}
        isEvaluating={isEvaluating}
        evaluationResult={evaluationResult}
        hasAuditorPerk={hasAuditorPerk}
      />

      {/* Bloom's Taxonomy Evaluation Modal */}
      <EvaluationModal
        evaluation={evaluationResult}
        isOpen={evaluationOpen}
        onClose={() => setEvaluationOpen(false)}
        onReviseSafeFail={handleReviseSafeFail}
        settings={accessibility}
        onSpeak={speakText}
        onAnnounce={announce}
      />

      {/* Full Accessibility & Keyboard Guide Modal */}
      <AccessibilityModal
        settings={accessibility}
        isOpen={accessibility.keyboardGuideOpen}
        onClose={() => setAccessibility((prev) => ({ ...prev, keyboardGuideOpen: false }))}
        onUpdate={setAccessibility}
        onTestSpeech={speakText}
      />

      {/* Universal Closed Captions Bar */}
      <ClosedCaptionsBar
        caption={caption}
        speaker={captionSpeaker}
        settings={accessibility}
        onClose={() => setAccessibility((prev) => ({ ...prev, captionsEnabled: false }))}
        onSpeak={speakText}
      />
    </div>
  );
}
