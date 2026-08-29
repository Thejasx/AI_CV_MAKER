import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Trash2, FileText, Calendar, Loader2 } from 'lucide-react';
import { getSavedResumesApi, deleteResumeApi } from '../services/api';

export default function SavedResumes({ isOpen, onClose, onLoadResume }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchResumes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSavedResumesApi();
      if (data.success) {
        setResumes(data.resumes || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load saved resumes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchResumes();
    }
  }, [isOpen]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteResumeApi(id);
      setResumes(resumes.filter((r) => r._id !== id));
    } catch (err) {
      alert('Failed to delete resume.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Saved ATS Resumes</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-xs text-slate-500 font-semibold">Loading saved resumes...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          ) : resumes.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No Saved Resumes Yet</p>
              <p className="text-xs max-w-xs mx-auto text-slate-500">
                Generate an AI resume using Gemini and click "Save" to store it here.
              </p>
            </div>
          ) : (
            resumes.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  onLoadResume(item);
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-between group hover:shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ATS Match: {item.atsScore || 85}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>Target: {item.targetJobTitle || 'Tech Role'}</span>
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(e, item._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-200/50 rounded-lg transition-colors"
                  title="Delete resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
