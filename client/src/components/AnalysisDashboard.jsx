import React from 'react';
import { Award, CheckCircle, AlertTriangle, Lightbulb, ChevronRight, BarChart3 } from 'lucide-react';

export default function AnalysisDashboard({ aiResult, onProceedToEdit }) {
  if (!aiResult) return null;

  const { atsScore = 0, scoreBreakdown = {}, matchedKeywords = [], missingKeywords = [], atsRecommendations = [] } = aiResult;

  // Determine badge color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 stroke-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 stroke-amber-500 bg-amber-50 border-amber-200';
    return 'text-rose-700 stroke-rose-500 bg-rose-50 border-rose-200';
  };

  const scoreColorClass = getScoreColor(atsScore);

  // SVG Gauge Calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="glass-panel p-6 rounded-2xl border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        
        {/* Left Score Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-200"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className={`animate-ring ${scoreColorClass.split(' ')[1]}`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${scoreColorClass.split(' ')[0]}`}>{atsScore}%</span>
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-500">ATS Score</span>
            </div>
          </div>

          <div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold tracking-wider border ${scoreColorClass}`}>
              {atsScore >= 80 ? 'Exceptional ATS Match' : atsScore >= 60 ? 'Moderate Alignment' : 'Needs Optimization'}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1.5">
              Gemini AI ATS Analysis
            </h3>
            <p className="text-slate-600 text-xs mt-1 max-w-md">
              Your resume has been analyzed and restructured against target job keywords, experience criteria, and single-column ATS parser layout standards.
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <button
          onClick={onProceedToEdit}
          className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 shrink-0"
        >
          View & Edit Optimized Resume <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Breakdown & Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Category Breakdown */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-indigo-600" /> Score Breakdown
          </h4>

          <div className="space-y-3">
            {[
              { label: 'Keywords Match', value: scoreBreakdown.keywords || 80, color: 'bg-indigo-600' },
              { label: 'Experience Match', value: scoreBreakdown.experience || 85, color: 'bg-purple-600' },
              { label: 'Skills Alignment', value: scoreBreakdown.skills || 90, color: 'bg-emerald-600' },
              { label: 'Format Compliance', value: scoreBreakdown.format || 95, color: 'bg-amber-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matched Keywords */}
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Matched Keywords ({matchedKeywords.length})
          </h4>
          <p className="text-[11px] font-semibold text-slate-500">High-value terms present in both your CV and target role:</p>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {matchedKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                ✓ {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Gap Analysis ({missingKeywords.length})
          </h4>
          <p className="text-[11px] font-semibold text-slate-500">Missing job skills auto-integrated into bullet points:</p>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200"
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Actionable Recommendations */}
      {atsRecommendations.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600" /> AI ATS Improvement Tips
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {atsRecommendations.map((rec, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2 font-medium">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-amber-300">
                  {idx + 1}
                </span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
