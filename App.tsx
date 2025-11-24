import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, ResumeStyle, Industry, GenerationState } from './types';
import { parseResumeText } from './services/geminiService';
import { Button } from './components/Button';
import { FullPageLoader } from './components/Spinners';
import { EditorSection } from './components/EditorSection';
import { ResumePreview } from './components/ResumePreview';
import { MONETIZATION_CONFIG } from './config';

// Placeholder data for initial state
const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: "Your Name",
    email: "youremail@example.com",
    phone: "123-456-7890",
    location: "City, Country",
    linkedin: "linkedin.com/in/yourprofile"
  },
  summary: "A motivated professional with experience in...",
  experience: [],
  education: [],
  skills: ["Skill 1", "Skill 2"]
};

// Monetization Modal
const PremiumModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-1">Go Pro 🚀</h2>
          <p className="text-brand-100 text-sm">Unlock the full potential of your career.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
              <div>
                <h4 className="font-semibold text-slate-900">Unlimited AI Enhancements</h4>
                <p className="text-xs text-slate-500">Perfect every bullet point with smart AI.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
              <div>
                <h4 className="font-semibold text-slate-900">Premium Templates</h4>
                <p className="text-xs text-slate-500">Access exclusive Harvard & Creative styles.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
              <div>
                <h4 className="font-semibold text-slate-900">Cover Letter Generator</h4>
                <p className="text-xs text-slate-500">Auto-generate matching cover letters.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-100">
             <p className="text-2xl font-bold text-slate-900">$9.99<span className="text-sm font-normal text-slate-500">/mo</span></p>
             <p className="text-xs text-slate-400 mt-1">Cancel anytime.</p>
          </div>

          <div className="space-y-3">
            <Button className="w-full py-3" onClick={() => window.open(MONETIZATION_CONFIG.payment.stripeCheckoutUrl, '_blank')}>
              Upgrade Now
            </Button>
            <Button variant="ghost" className="w-full text-slate-500 text-sm" onClick={onClose}>
              Maybe later
            </Button>
          </div>
          
          <div className="pt-2 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400">Love the free tool? <a href={MONETIZATION_CONFIG.payment.buyMeCoffeeUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">Buy us a coffee ☕</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Affiliate / Download Interstitial Modal (Ad Logic)
const DownloadModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void }> = ({ isOpen, onClose, onConfirm }) => {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(5);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up transform transition-all">
        {/* Ad Header */}
        <div className="bg-slate-100 px-4 py-2 flex justify-between items-center border-b border-slate-200">
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sponsored Advertisement</span>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Your download is starting...</h2>
            <p className="text-slate-500 text-sm">Please wait while we prepare your file.</p>
          </div>

          {/* The Large Ad Unit */}
          <div 
            className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mb-6 relative group cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => window.open(MONETIZATION_CONFIG.ads.downloadModalAdUrl, '_blank')}
          >
             <div className="relative h-40 bg-slate-200 overflow-hidden">
                <img 
                  src={MONETIZATION_CONFIG.ads.downloadModalAdImage} 
                  alt="Ad" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white">
                   <div className="text-xs font-bold bg-yellow-400 text-slate-900 px-1.5 py-0.5 rounded inline-block mb-1">{MONETIZATION_CONFIG.ads.downloadModalAdLabel}</div>
                   <div className="font-bold">{MONETIZATION_CONFIG.ads.downloadModalAdTitle}</div>
                </div>
             </div>
             <div className="p-4 flex justify-between items-center bg-white">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{MONETIZATION_CONFIG.ads.downloadModalAdDescription}</p>
                  <p className="text-xs text-slate-500">Tap to learn more.</p>
                </div>
                <button className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-blue-700">Open</button>
             </div>
          </div>

          {/* Action Area */}
          <div className="space-y-3">
            <Button 
              onClick={onConfirm} 
              disabled={timeLeft > 0}
              className={`w-full py-3.5 text-base flex items-center justify-center transition-all ${
                timeLeft > 0 ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/20'
              }`}
            >
              {timeLeft > 0 ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Download in {timeLeft}s...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PDF Now
                </>
              )}
            </Button>
            <p className="text-center text-[10px] text-slate-400">
              Thanks for supporting our free tool.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const [viewMode, setViewMode] = useState<'upload' | 'editor'>('upload');
  const [selectedStyle, setSelectedStyle] = useState<ResumeStyle>(ResumeStyle.MODERN);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(Industry.GENERAL);
  const [genState, setGenState] = useState<GenerationState>({
    isParsing: false,
    isImproving: false,
    loadingMessage: ''
  });
  
  // Monetization State
  const [showProModal, setShowProModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  // Mobile View State
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');

  // Upload State
  const [uploadTab, setUploadTab] = useState<'file' | 'text'>('file');
  const [rawText, setRawText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const processResume = async () => {
    if (uploadTab === 'text' && !rawText.trim()) {
      alert("Please enter some resume text.");
      return;
    }
    if (uploadTab === 'file' && !selectedFile) {
      alert("Please select a file.");
      return;
    }

    setGenState({ isParsing: true, isImproving: false, loadingMessage: 'Analyzing your resume with Gemini AI...' });
    
    try {
      let parseInput: { text?: string; fileData?: string; mimeType?: string } = {};

      if (uploadTab === 'file' && selectedFile) {
        // Read file
        if (selectedFile.type === 'application/pdf') {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              // Remove data URL prefix (e.g. "data:application/pdf;base64,")
              const data = result.split(',')[1];
              resolve(data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(selectedFile);
          });
          parseInput = { fileData: base64, mimeType: 'application/pdf' };
        } else if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.md') || selectedFile.name.endsWith('.txt')) {
           const text = await new Promise<string>((resolve, reject) => {
             const reader = new FileReader();
             reader.onload = () => resolve(reader.result as string);
             reader.onerror = reject;
             reader.readAsText(selectedFile);
           });
           parseInput = { text };
        } else {
            // Fallback for doc/docx if browser supports reading or try generic binary
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve((reader.result as string).split(',')[1]);
              reader.onerror = reject;
              reader.readAsDataURL(selectedFile);
            });
            // Treat as PDF/Image stream for Gemini if possible, or application/octet-stream
            parseInput = { fileData: base64, mimeType: selectedFile.type || 'application/pdf' }; 
        }
      } else {
        parseInput = { text: rawText };
      }

      const parsedData = await parseResumeText(parseInput);
      setResumeData(parsedData);
      setViewMode('editor');
    } catch (error) {
      console.error(error);
      alert("Failed to parse resume. Please ensure the file is a readable PDF or text.");
    } finally {
      setGenState({ isParsing: false, isImproving: false, loadingMessage: '' });
    }
  };

  const startManual = () => {
    setResumeData(INITIAL_DATA);
    setViewMode('editor');
  };

  const handlePrintRequest = () => {
    setShowDownloadModal(true);
  };

  const executePrint = () => {
    setShowDownloadModal(false);
    // Slight delay to allow modal to close completely
    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (viewMode === 'upload') {
    return (
      <div className="h-[100dvh] bg-gradient-to-br from-slate-50 to-brand-50/50 flex flex-col font-sans relative overflow-hidden">
        {genState.isParsing && <FullPageLoader message={genState.loadingMessage} />}
        
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>

        <nav className="relative z-10 px-6 md:px-8 py-4 md:py-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center text-white font-bold text-lg md:text-xl shrink-0">R</div>
            <span className="font-bold text-lg md:text-xl text-slate-900 tracking-tight hidden sm:inline">Resume Editor AI</span>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setShowProModal(true)} className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors">
               Pricing
             </button>
             <a href="#" className="text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">Login</a>
          </div>
        </nav>
        
        <PremiumModal isOpen={showProModal} onClose={() => setShowProModal(false)} />

        <main className="flex-1 overflow-y-auto px-4 py-8 md:p-6 relative z-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center min-h-[calc(100vh-140px)]">
            
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8 animate-fade-in text-center lg:text-left">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold mb-6 border border-brand-200">
                  Powered by Gemini 2.0
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4 md:mb-6">
                  Craft your perfect <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">Resume instantly.</span>
                </h1>
                <p className="text-sm md:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Upload your old resume in any format. Our AI extracts the details, polishes your content, and styles it for your dream job.
                </p>
              </div>

              <div className="flex flex-col gap-3 max-w-sm mx-auto lg:mx-0 text-left">
                 <label className="text-sm font-medium text-slate-700 ml-1">Select Target Industry</label>
                 <div className="relative">
                   <select 
                    className="w-full appearance-none rounded-xl border-slate-200 bg-white py-3 px-4 pr-8 text-slate-700 shadow-sm focus:border-brand-500 focus:ring-brand-500 transition-shadow cursor-pointer"
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value as Industry)}
                   >
                     {Object.values(Industry).map(ind => (
                       <option key={ind} value={ind}>{ind}</option>
                     ))}
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                   </div>
                 </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="glass-panel rounded-3xl shadow-2xl shadow-slate-200/50 p-6 md:p-8 lg:p-10 animate-slide-up">
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-6">
                <button
                  onClick={() => setUploadTab('file')}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    uploadTab === 'file' 
                      ? 'bg-white text-brand-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => setUploadTab('text')}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    uploadTab === 'text' 
                      ? 'bg-white text-brand-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Paste Text
                </button>
              </div>

              {uploadTab === 'file' ? (
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-colors cursor-pointer ${selectedFile ? 'border-brand-400 bg-brand-50/50' : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50'}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                   <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.md"
                    />
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    {selectedFile ? (
                      <div>
                        <p className="text-slate-900 font-medium break-all">{selectedFile.name}</p>
                        <p className="text-sm text-slate-500 mt-1">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                        <button 
                          className="text-xs text-red-500 mt-3 hover:underline"
                          onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-900 font-medium mb-1">Click to upload or drag & drop</p>
                        <p className="text-sm text-slate-500">PDF, Word, or Text files</p>
                      </div>
                    )}
                </div>
              ) : (
                <textarea 
                  className="w-full h-48 md:h-56 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-brand-500 p-4 text-sm resize-none transition-all"
                  placeholder="Paste your resume content here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                />
              )}

              <div className="mt-6 md:mt-8 space-y-3">
                <Button 
                  onClick={processResume} 
                  className="w-full py-3.5 md:py-4 text-base shadow-lg shadow-brand-500/20"
                  disabled={uploadTab === 'file' ? !selectedFile : !rawText.trim()}
                >
                   Generate Resume
                </Button>
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Or</span>
                </div>
                <Button variant="ghost" onClick={startManual} className="w-full text-slate-600">
                  Start from scratch
                </Button>
              </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-100 font-sans overflow-hidden">
      {/* Modals */}
      <PremiumModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
      <DownloadModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} onConfirm={executePrint} />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setViewMode('upload')}>
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">R</div>
          <span className="font-bold text-lg text-slate-900 hidden md:inline group-hover:text-brand-700 transition-colors">Resume Editor AI</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
           {/* Mobile-friendly scrollable style selector */}
           <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto max-w-[150px] sm:max-w-xs no-scrollbar">
              {Object.values(ResumeStyle).map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    selectedStyle === style 
                      ? 'bg-white text-brand-700 shadow-sm ring-1 ring-black/5' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  {style}
                </button>
              ))}
           </div>
           
           <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
           
           {/* Go Pro Button (Monetization) */}
           <button 
            onClick={() => setShowProModal(true)}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all hover:scale-105"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1V8a1 1 0 011-1zm5-5a1 1 0 110 2h5a1 1 0 010 2h-5a1 1 0 110-2h5a1 1 0 010-2h-5z" clipRule="evenodd" />
             </svg>
             Go Pro
           </button>

           <Button onClick={handlePrintRequest} variant="primary" size="sm" className="whitespace-nowrap px-3 shadow-brand-500/20">
             <span className="hidden sm:inline mr-2">Download PDF</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
           </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left: Editor (Visible on Mobile if Tab is Edit) */}
        <div className={`w-full md:w-1/2 lg:w-5/12 border-r border-slate-200 bg-white overflow-y-auto no-print ${
          mobileTab === 'edit' ? 'block' : 'hidden md:block'
        }`}>
          <div className="p-5 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
            <div className="flex justify-between items-end mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Your Details</h2>
                <p className="text-xs md:text-sm text-slate-500 mt-1">Refine the AI-generated content below.</p>
              </div>
              <span className="text-[10px] md:text-xs px-2 md:px-3 py-1 bg-brand-50 text-brand-700 rounded-full font-bold border border-brand-100 uppercase tracking-wider whitespace-nowrap">
                Target: {selectedIndustry}
              </span>
            </div>
            <EditorSection 
              data={resumeData} 
              onChange={setResumeData} 
              industry={selectedIndustry}
            />
          </div>
        </div>

        {/* Right: Preview (Visible on Mobile if Tab is Preview) */}
        <div className={`w-full md:flex md:flex-1 bg-slate-200/50 items-start justify-center relative print-only ${
          mobileTab === 'preview' ? 'flex h-full' : 'hidden md:flex'
        }`}>
           {/* ResumePreview handles its own internal layout and scaling now */}
           <ResumePreview data={resumeData} style={selectedStyle} />
        </div>

        {/* Mobile Floating Navigation */}
        <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 z-50 flex p-1.5 gap-1">
           <button 
             onClick={() => setMobileTab('edit')}
             className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
               mobileTab === 'edit' 
                 ? 'bg-slate-900 text-white shadow-md' 
                 : 'text-slate-500 hover:text-slate-900'
             }`}
           >
             Edit
           </button>
           <button 
             onClick={() => setMobileTab('preview')}
             className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
               mobileTab === 'preview' 
                 ? 'bg-brand-600 text-white shadow-md' 
                 : 'text-slate-500 hover:text-slate-900'
             }`}
           >
             Preview
           </button>
        </div>

      </div>
    </div>
  );
};

export default App;