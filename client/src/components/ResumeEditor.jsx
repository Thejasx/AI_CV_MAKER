import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code2, FolderGit2, Award, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ResumeEditor({ data, onChange }) {
  const [activeAccordion, setActiveAccordion] = useState('personal');

  if (!data) return null;

  const {
    personalInfo = {},
    summary = '',
    workExperience = [],
    education = [],
    skills = { hardSkills: [], softSkills: [], tools: [] },
    projects = [],
    certifications = [],
  } = data;

  // Generic Field Updater
  const updatePersonalInfo = (field, val) => {
    onChange({
      ...data,
      personalInfo: { ...personalInfo, [field]: val },
    });
  };

  const updateSummary = (val) => {
    onChange({ ...data, summary: val });
  };

  // Skills Updater
  const updateSkillsArray = (category, csvString) => {
    const arr = csvString.split(',').map((s) => s.trim()).filter(Boolean);
    onChange({
      ...data,
      skills: { ...skills, [category]: arr },
    });
  };

  // Work Experience Handlers
  const handleWorkChange = (index, field, value) => {
    const updated = [...workExperience];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, workExperience: updated });
  };

  const handleBulletChange = (workIdx, bulletIdx, value) => {
    const updated = [...workExperience];
    const bullets = [...(updated[workIdx].bulletPoints || [])];
    bullets[bulletIdx] = value;
    updated[workIdx].bulletPoints = bullets;
    onChange({ ...data, workExperience: updated });
  };

  const addWorkBullet = (workIdx) => {
    const updated = [...workExperience];
    updated[workIdx].bulletPoints = [...(updated[workIdx].bulletPoints || []), 'New high-impact achievement bullet point with quantifiable metrics.'];
    onChange({ ...data, workExperience: updated });
  };

  const removeWorkBullet = (workIdx, bulletIdx) => {
    const updated = [...workExperience];
    updated[workIdx].bulletPoints = updated[workIdx].bulletPoints.filter((_, i) => i !== bulletIdx);
    onChange({ ...data, workExperience: updated });
  };

  const addWorkEntry = () => {
    const newWork = {
      jobTitle: 'Software Engineer',
      company: 'Company Name',
      location: 'City, State',
      startDate: '2023',
      endDate: 'Present',
      bulletPoints: ['Engineered scalable web applications resulting in 30% performance boost.'],
    };
    onChange({ ...data, workExperience: [newWork, ...workExperience] });
  };

  const removeWorkEntry = (idx) => {
    onChange({ ...data, workExperience: workExperience.filter((_, i) => i !== idx) });
  };

  const toggleAccordion = (sec) => {
    setActiveAccordion(activeAccordion === sec ? '' : sec);
  };

  return (
    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
      
      {/* 1. Personal Info */}
      <div className="glass-panel rounded-2xl overflow-hidden border-slate-200">
        <button
          type="button"
          onClick={() => toggleAccordion('personal')}
          className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" /> 1. Personal Information & Contacts
          </span>
          {activeAccordion === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {activeAccordion === 'personal' && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-200">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name</label>
              <input
                type="text"
                value={personalInfo.fullName || ''}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Email</label>
              <input
                type="email"
                value={personalInfo.email || ''}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone</label>
              <input
                type="text"
                value={personalInfo.phone || ''}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Location</label>
              <input
                type="text"
                value={personalInfo.location || ''}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={personalInfo.linkedin || ''}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">GitHub / Portfolio</label>
              <input
                type="text"
                value={personalInfo.github || ''}
                onChange={(e) => updatePersonalInfo('github', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Professional Summary */}
      <div className="glass-panel rounded-2xl overflow-hidden border-slate-200">
        <button
          type="button"
          onClick={() => toggleAccordion('summary')}
          className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600" /> 2. ATS Professional Summary
          </span>
          {activeAccordion === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {activeAccordion === 'summary' && (
          <div className="p-4 border-t border-slate-200">
            <textarea
              value={summary}
              onChange={(e) => updateSummary(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        )}
      </div>

      {/* 3. Technical Skills */}
      <div className="glass-panel rounded-2xl overflow-hidden border-slate-200">
        <button
          type="button"
          onClick={() => toggleAccordion('skills')}
          className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-600" /> 3. Skills & Tools
          </span>
          {activeAccordion === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {activeAccordion === 'skills' && (
          <div className="p-4 space-y-3 border-t border-slate-200">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Hard / Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                value={(skills.hardSkills || []).join(', ')}
                onChange={(e) => updateSkillsArray('hardSkills', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Developer Tools & Frameworks (Comma-separated)
              </label>
              <input
                type="text"
                value={(skills.tools || []).join(', ')}
                onChange={(e) => updateSkillsArray('tools', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Work Experience */}
      <div className="glass-panel rounded-2xl overflow-hidden border-slate-200">
        <button
          type="button"
          onClick={() => toggleAccordion('experience')}
          className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-600" /> 4. Work Experience ({workExperience.length})
          </span>
          {activeAccordion === 'experience' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {activeAccordion === 'experience' && (
          <div className="p-4 space-y-4 border-t border-slate-200">
            {workExperience.map((job, wIdx) => (
              <div key={wIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-indigo-700">Position #{wIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeWorkEntry(wIdx)}
                    className="text-rose-600 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={job.jobTitle || ''}
                    onChange={(e) => handleWorkChange(wIdx, 'jobTitle', e.target.value)}
                    className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={job.company || ''}
                    onChange={(e) => handleWorkChange(wIdx, 'company', e.target.value)}
                    className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={job.location || ''}
                    onChange={(e) => handleWorkChange(wIdx, 'location', e.target.value)}
                    className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Start Date"
                      value={job.startDate || ''}
                      onChange={(e) => handleWorkChange(wIdx, 'startDate', e.target.value)}
                      className="w-1/2 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      value={job.endDate || ''}
                      onChange={(e) => handleWorkChange(wIdx, 'endDate', e.target.value)}
                      className="w-1/2 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Bullet points */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-bold text-slate-600">Action Bullet Points:</label>
                  {(job.bulletPoints || []).map((bp, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-slate-400 mt-1.5 text-xs">•</span>
                      <textarea
                        value={bp}
                        onChange={(e) => handleBulletChange(wIdx, bIdx, e.target.value)}
                        rows={2}
                        className="flex-1 bg-white border border-slate-200 rounded p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeWorkBullet(wIdx, bIdx)}
                        className="text-slate-400 hover:text-rose-600 mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addWorkBullet(wIdx)}
                    className="text-[11px] text-indigo-700 hover:text-indigo-800 font-bold flex items-center gap-1 mt-1"
                  >
                    <Plus className="w-3 h-3" /> Add Bullet Point
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addWorkEntry}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors bg-white"
            >
              <Plus className="w-4 h-4" /> Add Work Experience Entry
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
