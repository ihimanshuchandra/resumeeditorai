
import React from 'react';
import { ResumeData, Industry } from '../types';
import { Button } from './Button';
import { improveText } from '../services/geminiService';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  industry: Industry;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-6 transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
    <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
    </div>
    <div className="p-6 space-y-5">
      {children}
    </div>
  </div>
);

const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5 ml-0.5">{label}</label>
    {children}
  </div>
);

const TextAreaWithAI: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onImprove: () => void;
  isImproving?: boolean;
  rows?: number;
}> = ({ value, onChange, onImprove, isImproving, rows = 4 }) => (
  <div className="relative group">
    <textarea
      className="w-full rounded-lg border-slate-200 bg-slate-50/30 focus:bg-white shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm leading-relaxed p-3.5 transition-all"
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
      <Button 
        size="sm" 
        variant="secondary" 
        onClick={onImprove} 
        isLoading={isImproving}
        type="button"
        className="shadow-lg border border-slate-600/20 text-xs py-1 px-3"
      >
        ✨ Enhance with AI
      </Button>
    </div>
  </div>
);

export const EditorSection: React.FC<EditorProps> = ({ data, onChange, industry }) => {
  const [improvingId, setImprovingId] = React.useState<string | null>(null);

  const handleChange = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const handlePersonalInfoChange = (key: keyof ResumeData['personalInfo'], val: string) => {
    handleChange('personalInfo', { ...data.personalInfo, [key]: val });
  };

  const handleExperienceChange = (id: string, field: keyof ResumeData['experience'][0], val: string) => {
    const newExp = data.experience.map(exp => exp.id === id ? { ...exp, [field]: val } : exp);
    handleChange('experience', newExp);
  };

  const handleEducationChange = (id: string, field: keyof ResumeData['education'][0], val: string) => {
    const newEdu = data.education.map(edu => edu.id === id ? { ...edu, [field]: val } : edu);
    handleChange('education', newEdu);
  };

  const handleSkillsChange = (val: string) => {
    // Simple comma separated parsing for UI simplicity
    handleChange('skills', val.split(',').map(s => s.trim()));
  };

  const triggerImprovement = async (id: string, text: string, type: 'summary' | 'experience') => {
    setImprovingId(id);
    try {
      const improved = await improveText(text, type, industry);
      if (type === 'summary') {
        handleChange('summary', improved);
      } else {
        handleExperienceChange(id, 'description', improved);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to improve text. Please try again.');
    } finally {
      setImprovingId(null);
    }
  };

  const addExperience = () => {
    handleChange('experience', [
      ...data.experience, 
      { 
        id: Math.random().toString(36).substr(2, 9), 
        company: '', 
        role: '', 
        startDate: '', 
        endDate: '', 
        description: 'Key responsibility...' 
      }
    ]);
  };

  const removeExperience = (id: string) => {
    handleChange('experience', data.experience.filter(e => e.id !== id));
  };

  const inputClass = "w-full rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm py-2.5 px-3 transition-colors";

  return (
    <div className="space-y-8 pb-20">
      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputGroup label="Full Name">
            <input 
              type="text" 
              className={inputClass}
              value={data.personalInfo.fullName}
              onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
            />
          </InputGroup>
          <InputGroup label="Email">
            <input type="email" className={inputClass} value={data.personalInfo.email} onChange={(e) => handlePersonalInfoChange('email', e.target.value)} />
          </InputGroup>
          <InputGroup label="Phone">
            <input type="text" className={inputClass} value={data.personalInfo.phone} onChange={(e) => handlePersonalInfoChange('phone', e.target.value)} />
          </InputGroup>
          <InputGroup label="Location">
            <input type="text" className={inputClass} value={data.personalInfo.location || ''} onChange={(e) => handlePersonalInfoChange('location', e.target.value)} />
          </InputGroup>
          <InputGroup label="LinkedIn">
            <input type="text" className={inputClass} value={data.personalInfo.linkedin || ''} onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)} />
          </InputGroup>
          <InputGroup label="Website">
            <input type="text" className={inputClass} value={data.personalInfo.website || ''} onChange={(e) => handlePersonalInfoChange('website', e.target.value)} />
          </InputGroup>
        </div>
      </Section>

      <Section title="Professional Summary">
        <TextAreaWithAI 
          value={data.summary}
          onChange={(val) => handleChange('summary', val)}
          onImprove={() => triggerImprovement('summary', data.summary, 'summary')}
          isImproving={improvingId === 'summary'}
          rows={5}
        />
      </Section>

      <Section title="Experience">
        {data.experience.map((exp) => (
          <div key={exp.id} className="bg-white p-5 rounded-xl border border-slate-200 mb-5 relative group/item shadow-sm hover:border-brand-300 transition-colors">
             <button 
              onClick={() => removeExperience(exp.id)}
              className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all transform hover:scale-110"
              title="Remove entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputGroup label="Role">
                <input type="text" className={inputClass} value={exp.role} onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)} />
              </InputGroup>
              <InputGroup label="Company">
                <input type="text" className={inputClass} value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} />
              </InputGroup>
              <InputGroup label="Start Date">
                <input type="text" className={inputClass} value={exp.startDate} onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)} />
              </InputGroup>
              <InputGroup label="End Date">
                <input type="text" className={inputClass} value={exp.endDate} onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)} />
              </InputGroup>
            </div>
            <InputGroup label="Description">
               <TextAreaWithAI 
                value={exp.description}
                onChange={(val) => handleExperienceChange(exp.id, 'description', val)}
                onImprove={() => triggerImprovement(exp.id, exp.description, 'experience')}
                isImproving={improvingId === exp.id}
                rows={4}
              />
            </InputGroup>
          </div>
        ))}
        <Button variant="outline" onClick={addExperience} className="w-full border-dashed border-2 border-slate-300 text-slate-500 hover:border-brand-500 hover:text-brand-600">
          + Add Position
        </Button>
      </Section>

      <Section title="Education">
         {data.education.map((edu) => (
          <div key={edu.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
             <InputGroup label="Institution">
               <input type="text" className={inputClass} value={edu.institution} onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)} />
             </InputGroup>
             <InputGroup label="Degree">
               <input type="text" className={inputClass} value={edu.degree} onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)} />
             </InputGroup>
             <InputGroup label="Year">
               <input type="text" className={inputClass} value={edu.year} onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)} />
             </InputGroup>
          </div>
         ))}
         <Button variant="ghost" size="sm" onClick={() => {
           handleChange('education', [...data.education, { id: Date.now().toString(), institution: '', degree: '', year: '' }]);
         }} className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 mt-2">
            + Add Education
         </Button>
      </Section>

      <Section title="Skills">
        <div className="space-y-2">
          <p className="text-xs text-slate-400 mb-2">Separate skills with commas</p>
          <textarea 
            className="w-full rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 text-sm"
            rows={3}
            value={data.skills.join(', ')}
            onChange={(e) => handleSkillsChange(e.target.value)}
          />
        </div>
      </Section>
    </div>
  );
};
