import React, { useEffect, useRef, useState } from 'react';
import { ResumeData, ResumeStyle } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  style: ResumeStyle;
}

// A4 Dimensions in pixels (at 96 DPI, roughly)
// 210mm = 794px, 297mm = 1123px
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

// --- Style Components ---

const ModernStyle: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-[794px] h-[1123px] bg-white p-10 shadow-lg text-slate-800 font-sans mx-auto overflow-hidden relative">
    <header className="border-b-2 border-slate-800 pb-6 mb-8">
      <h1 className="text-5xl font-bold uppercase tracking-tight text-slate-900 mb-2 truncate">{data.personalInfo.fullName}</h1>
      <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
      </div>
    </header>

    <div className="grid grid-cols-3 gap-8 h-[900px]">
      <div className="col-span-2 space-y-8">
        <section>
          <h2 className="text-xl font-bold uppercase tracking-wider text-brand-600 mb-4 flex items-center">
            <span className="w-2 h-2 bg-brand-600 mr-2 rounded-full"></span> Profile
          </h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm">{data.summary}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold uppercase tracking-wider text-brand-600 mb-4 flex items-center">
             <span className="w-2 h-2 bg-brand-600 mr-2 rounded-full"></span> Experience
          </h2>
          <div className="space-y-6">
            {data.experience.slice(0, 4).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{exp.role}</h3>
                  <span className="text-sm font-mono text-slate-500 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-brand-700 font-medium mb-2">{exp.company}</p>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line line-clamp-4">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-8 border-l border-slate-200 pl-8">
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 mb-4">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="font-bold text-slate-800">{edu.institution}</h3>
                <p className="text-sm text-slate-600">{edu.degree}</p>
                <p className="text-xs text-slate-400 mt-1">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

const ClassicStyle: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-[794px] h-[1123px] bg-white p-12 shadow-lg text-gray-900 font-serif mx-auto overflow-hidden relative">
    <header className="text-center border-b border-gray-300 pb-6 mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-wide truncate">{data.personalInfo.fullName}</h1>
      <div className="flex justify-center gap-4 text-sm italic text-gray-600">
        <span>{data.personalInfo.location}</span>
        <span>|</span>
        <span>{data.personalInfo.email}</span>
        <span>|</span>
        <span>{data.personalInfo.phone}</span>
      </div>
    </header>

    <section className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-800 mb-3 uppercase text-sm tracking-widest">Professional Summary</h2>
      <p className="text-sm leading-relaxed text-justify">{data.summary}</p>
    </section>

    <section className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-800 mb-4 uppercase text-sm tracking-widest">Experience</h2>
      <div className="space-y-5">
        {data.experience.slice(0, 5).map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between font-bold text-gray-800 mb-1">
              <h3>{exp.company}</h3>
              <span className="text-sm font-normal italic">{exp.startDate} – {exp.endDate}</span>
            </div>
            <div className="text-sm font-semibold italic mb-2">{exp.role}</div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-1 line-clamp-4">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-6">
      <h2 className="text-lg font-bold border-b border-gray-800 mb-4 uppercase text-sm tracking-widest">Education</h2>
      {data.education.map((edu) => (
        <div key={edu.id} className="mb-3 flex justify-between items-end">
          <div>
            <div className="font-bold text-gray-800">{edu.institution}</div>
            <div className="text-sm italic">{edu.degree}</div>
          </div>
          <div className="text-sm text-gray-600">{edu.year}</div>
        </div>
      ))}
    </section>

    <section>
      <h2 className="text-lg font-bold border-b border-gray-800 mb-3 uppercase text-sm tracking-widest">Skills</h2>
      <p className="text-sm leading-relaxed">
        {data.skills.join(" • ")}
      </p>
    </section>
  </div>
);

const TechStyle: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-[794px] h-[1123px] bg-slate-900 text-slate-300 p-8 shadow-lg font-mono mx-auto overflow-hidden relative">
    <div className="border-l-4 border-green-400 pl-6 mb-8">
      <h1 className="text-4xl font-bold text-white mb-2 truncate">{data.personalInfo.fullName}</h1>
      <p className="text-green-400 text-sm">{`> ${data.personalInfo.email} | ${data.personalInfo.phone}`}</p>
      {data.personalInfo.linkedin && <p className="text-green-400 text-sm">{`> ${data.personalInfo.linkedin}`}</p>}
    </div>

    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8 space-y-8">
         <section>
           <h2 className="text-white font-bold text-lg mb-4 flex items-center">
             <span className="text-green-400 mr-2">#</span> Summary
           </h2>
           <div className="bg-slate-800/50 p-4 rounded border border-slate-700 text-sm leading-relaxed">
             {data.summary}
           </div>
         </section>

         <section>
           <h2 className="text-white font-bold text-lg mb-4 flex items-center">
             <span className="text-green-400 mr-2">#</span> Experience
           </h2>
           <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-0 before:border-l before:border-slate-700 before:ml-2">
             {data.experience.slice(0, 4).map((exp) => (
               <div key={exp.id} className="pl-8 relative">
                 <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-green-500 -ml-[5px]"></div>
                 <div className="flex justify-between items-center mb-1">
                   <h3 className="text-xl text-white font-bold">{exp.role}</h3>
                   <span className="text-xs bg-slate-800 px-2 py-1 rounded text-green-300 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                 </div>
                 <p className="text-green-400 text-sm mb-3">@{exp.company}</p>
                 <p className="text-sm text-slate-400 whitespace-pre-line line-clamp-4">{exp.description}</p>
               </div>
             ))}
           </div>
         </section>
      </div>

      <div className="col-span-4 space-y-8">
        <section>
          <h2 className="text-white font-bold text-lg mb-4 flex items-center">
            <span className="text-green-400 mr-2">#</span> Skills
          </h2>
          <div className="flex flex-wrap gap-2">
             {data.skills.map((skill, i) => (
               <span key={i} className="text-xs border border-green-500/30 text-green-300 px-2 py-1 rounded bg-green-500/10">
                 {skill}
               </span>
             ))}
          </div>
        </section>

        <section>
           <h2 className="text-white font-bold text-lg mb-4 flex items-center">
            <span className="text-green-400 mr-2">#</span> Education
          </h2>
           <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id} className="bg-slate-800 p-3 rounded border border-slate-700">
                <h3 className="text-white font-bold text-sm">{edu.institution}</h3>
                <p className="text-xs text-slate-400">{edu.degree}</p>
                <p className="text-xs text-green-500 mt-1 text-right">[{edu.year}]</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

const CreativeStyle: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-[794px] h-[1123px] bg-white flex shadow-lg font-sans mx-auto overflow-hidden relative">
    {/* Left Sidebar */}
    <aside className="w-[35%] bg-purple-900 text-purple-50 p-8 flex flex-col gap-10 relative">
       {/* Decorative Elements */}
       <div className="absolute top-0 right-0 w-32 h-32 bg-purple-800 rounded-bl-full opacity-50 -mr-0 -mt-0"></div>
       <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-800 rounded-tr-full opacity-30"></div>

       <div className="z-10 mt-8 text-center">
         <div className="w-28 h-28 bg-orange-400 mx-auto rounded-full flex items-center justify-center text-5xl font-serif font-bold text-white shadow-lg border-4 border-purple-700">
            {data.personalInfo.fullName.charAt(0)}
         </div>
       </div>

       <div className="z-10 space-y-4 text-center text-sm">
         {data.personalInfo.email && <div className="break-all">{data.personalInfo.email}</div>}
         {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
         {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
         {data.personalInfo.linkedin && <div className="text-xs opacity-75">{data.personalInfo.linkedin}</div>}
         {data.personalInfo.website && <div className="text-xs opacity-75">{data.personalInfo.website}</div>}
       </div>

       <div className="z-10">
         <h3 className="text-orange-300 font-bold uppercase tracking-widest text-xs mb-4 border-b border-purple-700 pb-1">Education</h3>
         <div className="space-y-4">
           {data.education.map((edu) => (
             <div key={edu.id}>
               <div className="font-bold text-white">{edu.institution}</div>
               <div className="text-sm text-purple-200">{edu.degree}</div>
               <div className="text-xs text-purple-400 italic">{edu.year}</div>
             </div>
           ))}
         </div>
       </div>

       <div className="z-10">
         <h3 className="text-orange-300 font-bold uppercase tracking-widest text-xs mb-4 border-b border-purple-700 pb-1">Skills</h3>
         <div className="flex flex-wrap gap-2 justify-center">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-purple-800/80 text-purple-100 px-3 py-1 rounded-lg text-xs border border-purple-700">
                {skill}
              </span>
            ))}
         </div>
       </div>
    </aside>

    {/* Main Content */}
    <main className="w-[65%] p-10 bg-white text-slate-800 relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full"></div>

      <header className="mb-10 relative z-10 pt-4">
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-2 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-600">
            {data.personalInfo.fullName}
          </span>
        </h1>
        <div className="h-1.5 w-20 bg-orange-400 rounded-full"></div>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
           <span className="text-purple-600 mr-2">✦</span> Profile
        </h2>
        <p className="text-slate-600 leading-relaxed text-base">{data.summary}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
           <span className="text-purple-600 mr-2">✦</span> Experience
        </h2>
        <div className="space-y-8">
          {data.experience.slice(0, 4).map((exp) => (
            <div key={exp.id} className="relative pl-6 border-l-2 border-purple-100">
               <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-purple-600"></div>
               <div className="flex flex-col mb-1">
                 <h3 className="text-xl font-bold text-slate-800">{exp.role}</h3>
                 <div className="flex justify-between items-center w-full text-sm mt-1">
                    <span className="font-semibold text-purple-700">{exp.company}</span>
                    <span className="text-slate-400 font-mono">{exp.startDate} - {exp.endDate}</span>
                 </div>
               </div>
               <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mt-2 line-clamp-4">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Resize observer to auto-scale the resume to fit the container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Add some padding/margin: 32px total horizontal padding
        const availableWidth = containerWidth - 40; 
        const newScale = Math.min(availableWidth / A4_WIDTH_PX, 1); // Max scale 1 (don't zoom in past 100%)
        setScale(newScale > 0 ? newScale : 0.4); // Min scale safety
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    
    // ResizeObserver is better for container changes that aren't window resizes
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, []);

  const getStyleComponent = () => {
    switch (style) {
      case ResumeStyle.MODERN: return <ModernStyle data={data} />;
      case ResumeStyle.CLASSIC: return <ClassicStyle data={data} />;
      case ResumeStyle.TECH: return <TechStyle data={data} />;
      case ResumeStyle.CREATIVE: return <CreativeStyle data={data} />;
      default: return <ModernStyle data={data} />;
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto overflow-x-hidden flex justify-center bg-gray-500/10 p-4 md:p-8">
      {/* 
         Wrapper for the scaled content. 
         We set the width/height explicitly based on scale so the parent scrollbar works correctly. 
      */}
      <div 
        style={{ 
          width: `${A4_WIDTH_PX * scale}px`, 
          height: `${A4_HEIGHT_PX * scale}px`,
          transition: 'width 0.2s, height 0.2s'
        }}
        className="relative shadow-2xl bg-white shrink-0"
      >
        <div 
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top left',
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`
          }}
          className="overflow-hidden"
        >
          {getStyleComponent()}
        </div>
      </div>
    </div>
  );
};