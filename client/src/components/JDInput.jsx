import React from 'react';
import { Target, Briefcase, Sparkles, ArrowLeft, Zap } from 'lucide-react';

const PRESET_JDS = [
  {
    title: 'Senior Full Stack Engineer',
    company: 'TechCorp',
    text: `Job Title: Senior Full Stack Engineer
Company: TechCorp Innovations
Location: San Francisco, CA (Hybrid)

About the Role:
We are looking for a Senior Full Stack Engineer to lead the design and development of scalable web services and cloud application systems. You will collaborate with product teams to architect high-performance front-end interfaces and backend RESTful microservices.

Key Responsibilities:
- Build and maintain responsive web applications using React.js, TypeScript, and Tailwind CSS.
- Design, deploy, and optimize scalable backend microservices using Node.js, Express, and MongoDB.
- Integrate third-party APIs, authentication systems (JWT/OAuth), and real-time database syncing.
- Write clean, maintainable, and unit-tested code while following CI/CD pipelines (Git, Docker, AWS).
- Perform code reviews, mentor junior developers, and drive technical architecture decisions.

Requirements & Qualifications:
- 4+ years of professional full-stack software development experience.
- Deep expertise in JavaScript (ES6+), TypeScript, React, and Node.js.
- Strong knowledge of MongoDB, PostgreSQL, REST APIs, and GraphQL.
- Hands-on experience with Docker, AWS Lambda, microservices, and Agile methodologies.
- Excellent communication and problem-solving skills.`
  },
  {
    title: 'Product Manager',
    company: 'Apex Growth',
    text: `Job Title: Product Manager
Company: Apex Growth Labs
Location: Remote

About the Role:
We are seeking an data-driven Product Manager to lead product strategy, roadmap execution, and feature development for our enterprise SaaS platform.

Key Responsibilities:
- Define product vision, roadmap, and user stories based on customer feedback and market analytics.
- Collaborate with engineering and UI/UX design teams in an Agile/Scrum environment.
- Track key metrics (NPS, churn, retention, CAC) and run A/B experiments to optimize product adoption.
- Conduct competitor benchmark research and communicate product status to executive stakeholders.

Requirements:
- 3+ years in B2B SaaS product management.
- Strong analytical skillset (SQL, Amplitude, Mixpanel, Jira).
- Proven track record of launching successful SaaS products from zero to one.`
  },
  {
    title: 'DevOps & Cloud Engineer',
    company: 'CloudMatrix',
    text: `Job Title: DevOps & Cloud Infrastructure Engineer
Company: CloudMatrix Solutions

Responsibilities:
- Build, scale, and automate AWS cloud infrastructure using Terraform and Ansible.
- Manage Kubernetes clusters (EKS), Docker containers, and CI/CD pipelines (GitHub Actions, Jenkins).
- Monitor system reliability, implement Prometheus/Grafana alerts, and ensure 99.99% uptime.
- Enforce infrastructure security protocols and IAM role policies.

Qualifications:
- 3+ years experience in AWS Cloud Infrastructure and Kubernetes.
- Expert knowledge of Docker, CI/CD pipelines, Bash scripting, Python, and Linux security.`
  }
];

export default function JDInput({ jobDescription, setJobDescription, targetRole, setTargetRole, onBack, onOptimize, isOptimizing }) {
  
  const wordCount = jobDescription ? jobDescription.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1.5 shadow-sm">
          <Target className="w-3.5 h-3.5" /> Step 2: Target Job Description
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Paste the Target Job Description
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Paste the job posting requirements from LinkedIn, Indeed, or Glassdoor so Gemini AI can extract required keywords and tailor your resume.
        </p>
      </div>

      {/* Preset JD Quick Pickers */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Presets (Click to Auto-fill)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_JDS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setJobDescription(preset.text);
                setTargetRole(preset.title);
              }}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-left transition-all hover:shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {preset.title}
                </span>
                <Briefcase className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{preset.company}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        
        {/* Optional Custom Target Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Target Job Title (Optional)
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full-Stack Software Engineer"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          <div className="flex items-end justify-between sm:justify-end">
            <span className="text-xs font-semibold text-slate-500">
              {wordCount} words provided
            </span>
          </div>
        </div>

        {/* Text Area */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Raw Job Description Text
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste full job description including requirements, responsibilities, and required technical skills..."
            rows={10}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Bottom Bar Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to CV Upload
        </button>

        <button
          onClick={onOptimize}
          disabled={!jobDescription || jobDescription.trim().length < 20 || isOptimizing}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold text-xs transition-all shadow-xl shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          Run Gemini AI Optimization →
        </button>
      </div>

    </div>
  );
}
