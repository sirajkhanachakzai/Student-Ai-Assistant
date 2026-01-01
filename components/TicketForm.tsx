
import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { StudentQuery } from '../types';

interface TicketFormProps {
  onClose: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    studentId: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query: StudentQuery = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      subject: formData.subject,
      description: formData.description,
      status: 'pending',
      createdAt: Date.now()
    };
    storageService.saveQuery(query);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">Ticket Submitted</h3>
        <p className="text-slate-600">Our administrative team will review your query and respond via email within 24 hours.</p>
        <button 
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Chat
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Open Support Ticket</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
          <input 
            required
            type="text"
            value={formData.studentId}
            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
            placeholder="e.g. GTU-2024-1234"
            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input 
            required
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            placeholder="What do you need help with?"
            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea 
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Provide as much detail as possible..."
            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          ></textarea>
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
