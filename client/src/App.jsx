import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CVUpload from './components/CVUpload';
import JDInput from './components/JDInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';
import SavedResumes from './components/SavedResumes';
import AuthModal from './components/AuthModal';
import { optimizeCVApi, saveResumeApi } from './services/api';
import { Sparkles, Loader2, RefreshCw, AlertCircle, Edit3, Eye, FileText } from 'lucide-react';

export default function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [rawCVText, setRawCVText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  
  // Gemini AI Optimization State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [optimizeError, setOptimizeError] = useState('');

  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Modals
  const [savedOpen, setSavedOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Workspace View Mode (For Step 4: 'split' | 'editor' | 'preview')
  const [workspaceMode, setWorkspaceMode] = useState('split');

  // Trigger Gemini AI Optimization Pipeline
  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizeError('');
    setActiveStep(3);

    try {
      const res = await optimizeCVApi(rawCVText, jobDescription);
      if (res.success && res.data) {
        setAiResult(res.data);
        setEditableData(res.data.optimizedData);
      } else {
        setOptimizeError(res.message || 'Gemini AI optimization failed.');
      }
    } catch (err) {
      setOptimizeError(err.response?.data?.message || err.message || 'Error connecting to Gemini API.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Save Resume to Account/Session
  const handleSaveResume = async () => {
    if (!editableData || !aiResult) return;
    setIsSaving(true);
    setSaveSuccessMsg('');
    try {
      const payload = {
        title: `${editableData.personalInfo?.fullName || 'Candidate'} - ${targetRole || aiResult.targetJobTitle || 'Target Role'}`,
        targetJobTitle: targetRole || aiResult.targetJobTitle,
        rawCVText,
        jobDescription,
        atsScore: aiResult.atsScore,
        scoreBreakdown: aiResult.scoreBreakdown,
        matchedKeywords: aiResult.matchedKeywords,
        missingKeywords: aiResult.missingKeywords,
        atsRecommendations: aiResult.atsRecommendations,
        optimizedData: editableData,
      };

      const res = await saveResumeApi(payload);
      if (res.success) {
        setSaveSuccessMsg('Resume saved successfully!');
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save resume.');
    } finally {
      setIsSaving(false);
    }
  };

  // Load Saved Resume
  const handleLoadResume = (savedItem) => {
    setRawCVText(savedItem.rawCVText || '');
    setJobDescription(savedItem.jobDescription || '');
    setTargetRole(savedItem.targetJobTitle || '');
    setAiResult({
      atsScore: savedItem.atsScore,
      scoreBreakdown: savedItem.scoreBreakdown,
      matchedKeywords: savedItem.matchedKeywords,
      missingKeywords: savedItem.missingKeywords,
      atsRecommendations: savedItem.atsRecommendations,
      optimizedData: savedItem.optimizedData,
    });
    setEditableData(savedItem.optimizedData);
    setActiveStep(4);
  };

  // Reset Application
  const handleReset = () => {
    setActiveStep(1);
    setRawCVText('');
    setJobDescription('');
    setTargetRole('');
    setAiResult(null);
    setEditableData(null);
    setOptimizeError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        onOpenSaved={() => setSavedOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onReset={handleReset}
      />

      {/* Save Success Toast */}
      {saveSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-2xl animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Body Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Step 1: CV Upload */}
        {activeStep === 1 && (
          <CVUpload
            rawCVText={rawCVText}
            setRawCVText={setRawCVText}
            onNext={() => setActiveStep(2)}
          />
        )}

        {/* Step 2: Job Description Target */}
        {activeStep === 2 && (
          <JDInput
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            onBack={() => setActiveStep(1)}
            onOptimize={handleOptimize}
            isOptimizing={isOptimizing}
          />
        )}

        {/* Step 3: AI Processing & ATS Score Dashboard */}
        {activeStep === 3 && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {isOptimizing ? (
              <div className="glass-panel p-12 rounded-3xl text-center space-y-6 border-indigo-200">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                  <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">
                    Gemini AI is Optimizing Your Resume...
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
                    Comparing raw candidate text with target job requirements, extracting high-value keywords, generating quantifiable action bullet points, and enforcing ATS single-column formatting.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enforcing JSON mode output schema</span>
                </div>
              </div>
            ) : optimizeError ? (
              <div className="glass-panel p-8 rounded-2xl border-rose-200 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">AI Optimization Error</h3>
                <p className="text-xs text-rose-700 max-w-md mx-auto font-medium">{optimizeError}</p>
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Return to Job Description
                </button>
              </div>
            ) : aiResult ? (
              <AnalysisDashboard
                aiResult={aiResult}
                onProceedToEdit={() => setActiveStep(4)}
              />
            ) : null}

          </div>
        )}

        {/* Step 4: Interactive Live Resume Workspace (Split View) */}
        {activeStep === 4 && editableData && (
          <div className="space-y-4">
            
            {/* Top Workspace Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">
                    ATS Workspace & PDF Generator
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ATS Score: {aiResult?.atsScore || 85}%
                  </span>
                </div>
                <p className="text-slate-600 text-xs mt-0.5 font-medium">
                  Edit JSON content on the left pane and watch the 100% single-column ATS PDF update live on the right.
                </p>
              </div>

              {/* View Selector Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setWorkspaceMode('split')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    workspaceMode === 'split' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Split View
                </button>
                <button
                  onClick={() => setWorkspaceMode('editor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    workspaceMode === 'editor' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Editor Only
                </button>
                <button
                  onClick={() => setWorkspaceMode('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    workspaceMode === 'preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> PDF Preview Only
                </button>
              </div>
            </div>

            {/* Split Screen Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Interactive Form Editor */}
              {(workspaceMode === 'split' || workspaceMode === 'editor') && (
                <div className={workspaceMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'}>
                  <ResumeEditor
                    data={editableData}
                    onChange={setEditableData}
                  />
                </div>
              )}

              {/* Right Column: Live PDF Document Preview & Downloader */}
              {(workspaceMode === 'split' || workspaceMode === 'preview') && (
                <div className={workspaceMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'}>
                  <ResumePreview
                    data={editableData}
                    onSave={handleSaveResume}
                    isSaving={isSaving}
                  />
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* Modals */}
      <SavedResumes
        isOpen={savedOpen}
        onClose={() => setSavedOpen(false)}
        onLoadResume={handleLoadResume}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-medium">
        AI CV Maker • Powered by Google Gemini Pro API & React @react-pdf/renderer • 100% ATS Compliant Engine
      </footer>

    </div>
  );
}
