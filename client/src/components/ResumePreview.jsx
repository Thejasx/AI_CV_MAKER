import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Copy, Check, Eye, FileText, Save, Loader2, Layout } from 'lucide-react';
import PDFDocument from './PDFDocument';

export default function ResumePreview({ data, onSave, isSaving }) {
  const [viewMode, setViewMode] = useState('pdf'); // 'pdf' | 'html'
  const [template, setTemplate] = useState('classic'); // 'classic' | 'modern' | 'minimalist'
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const { personalInfo = {}, summary = '', workExperience = [], education = [], skills = {}, projects = [] } = data;

  const getPlainCVText = () => {
    let txt = `${personalInfo.fullName || 'RESUME'}\n`;
    txt += `${[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github].filter(Boolean).join(' | ')}\n\n`;
    txt += `PROFESSIONAL SUMMARY\n${summary}\n\n`;
    
    if (skills.hardSkills?.length) {
      txt += `TECHNICAL SKILLS\n${skills.hardSkills.join(', ')}\n\n`;
    }

    if (workExperience.length) {
      txt += `PROFESSIONAL EXPERIENCE\n`;
      workExperience.forEach((job) => {
        txt += `${job.jobTitle} - ${job.company} (${job.startDate} - ${job.endDate})\n`;
        (job.bulletPoints || []).forEach((bp) => {
          txt += `• ${bp}\n`;
        });
        txt += `\n`;
      });
    }

    return txt;
  };

  const handleCopyText = () => {
    const text = getPlainCVText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileName = `${(personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_${template.toUpperCase()}_ATS.pdf`;

  return (
    <div className="space-y-4">
      
      {/* Top Template Selector & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
        
        {/* Template Chooser */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-extrabold text-slate-700 hidden sm:flex items-center gap-1 mr-1">
            <Layout className="w-3.5 h-3.5 text-indigo-600" /> Template:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: 'classic', label: 'Classic ATS' },
              { id: 'modern', label: 'Modern Tech ATS' },
              { id: 'minimalist', label: 'Minimalist ATS' },
            ].map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setTemplate(tmpl.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  template === tmpl.id
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('pdf')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'pdf'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> PDF Render
          </button>
          <button
            onClick={() => setViewMode('html')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'html'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Plain View
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 border border-slate-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1 border border-emerald-200 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-emerald-600" />}
            Save
          </button>

          <PDFDownloadLink
            document={<PDFDocument data={data} template={template} />}
            fileName={fileName}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            {({ loading }) => (
              <>
                <Download className="w-3.5 h-3.5" />
                {loading ? 'Preparing...' : 'Download PDF'}
              </>
            )}
          </PDFDownloadLink>
        </div>

      </div>

      {/* Main Render Pane */}
      {viewMode === 'pdf' ? (
        <div className="w-full h-[720px] rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
          <PDFViewer width="100%" height="100%" className="w-full h-full border-0">
            <PDFDocument data={data} template={template} />
          </PDFViewer>
        </div>
      ) : (
        /* Plain HTML View */
        <div className="w-full max-h-[720px] overflow-y-auto p-8 rounded-2xl bg-white text-slate-900 font-sans shadow-xl space-y-4 border border-slate-200">
          {/* Header */}
          <div className="border-b border-slate-900 pb-3">
            <h1 className="text-2xl font-extrabold uppercase tracking-wide text-slate-900">
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github].filter(Boolean).join('  |  ')}
            </p>
          </div>

          {/* Summary */}
          {summary && (
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 text-slate-900">
                Professional Summary
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Technical Skills */}
          {skills && (skills.hardSkills?.length > 0 || skills.tools?.length > 0) && (
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 text-slate-900">
                Technical Skills
              </h2>
              {skills.hardSkills?.length > 0 && (
                <p className="text-xs text-slate-800">
                  <strong>Core Skills: </strong>{skills.hardSkills.join(', ')}
                </p>
              )}
              {skills.tools?.length > 0 && (
                <p className="text-xs text-slate-800">
                  <strong>Tools & Platforms: </strong>{skills.tools.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Work Experience */}
          {workExperience && workExperience.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 text-slate-900">
                Professional Experience
              </h2>
              {workExperience.map((job, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-900">{job.jobTitle} — {job.company}</span>
                    <span className="text-slate-600">{job.startDate} - {job.endDate}</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-800 space-y-0.5">
                    {(job.bulletPoints || []).map((bp, bIdx) => (
                      <li key={bIdx}>{bp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
