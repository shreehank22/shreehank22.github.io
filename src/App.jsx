import React, { useState, useEffect } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  GraduationCap,
  BookOpen,
  Briefcase,
  Code,
  Award,
  ExternalLink,
  ChevronRight,
  Cpu,
  Navigation,
  Box,
  Globe,
  FileText,
  MapPin,
  Sun,
  Moon,
  ExternalLink as LinkIcon
} from 'lucide-react';

import { researchList } from './pages/researchData';
import { experienceList, extracurricularList } from './pages/experienceData';
import { projectsList } from './pages/projectsData';
import { publicationsList } from './pages/publicationsData';
import { skillsData, achievementsData } from './pages/skillsData';

// --- MAIN APP COMPONENT ---

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  
  // Theme logic fix: Initialize from local storage or system preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply theme to document root
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle scroll for navbar and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['about', 'research', 'publications', 'experience', 'projects', 'skills'];
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 150) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: 'about' },
    { name: 'Research', href: 'research' },
    { name: 'Publications', href: 'publications' },
    { name: 'Experience', href: 'experience' },
    { name: 'Projects', href: 'projects' },
    { name: 'Skills', href: 'skills' },
  ];

  const highlights = [
    { label: 'Publications', value: '3 Papers', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Fellowship', value: 'NITT STEM Award', icon: <Award className="w-5 h-5" /> },
    { label: 'Grant', value: '₹70,000 Grant', icon: <Globe className="w-5 h-5" /> },
  ];

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-700 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 group cursor-pointer" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Cpu size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">Shreehan Kate</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={`#${link.href}`}
                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeSection === link.href ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {link.name}
              </a>
            ))}
            <button
              className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full transition-all hover:bg-slate-300 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
              <span className="text-xs font-bold">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-white dark:bg-slate-950 transition-colors">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-20 dark:opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.2"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              ROBOTICS RESEARCHER • MS/PHD TRACK
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Shreehan Santosh <span className="text-blue-600 dark:text-blue-500">Kate</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Specializing in <span className="font-semibold text-slate-900 dark:text-white underline decoration-blue-500 decoration-2 underline-offset-4">Autonomous Navigation</span>, 
              Nonlinear Control, and Reinforcement Learning for UAVs and Legged Robots.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="mailto:shreehan1912@gmail.com" className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:scale-105 font-semibold">
                <Mail size={18} />
                <span>Contact Me</span>
              </a>
              <a href="/CV.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 px-6 py-3 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 font-semibold transition-all">
                <FileText size={18} />
                <span>Download CV</span>
              </a>
              <div className="flex items-center gap-3 px-2">
                <a href="https://github.com/shreehank22" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Github size={22} /></a>
                <a href="https://www.linkedin.com/in/shreehankate/" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><Linkedin size={22} /></a>
                <a href="https://ieeexplore.ieee.org/author/988421407121390" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><GraduationCap size={22} /></a>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10">
              {highlights.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-2xl relative z-10 overflow-hidden">
                <img 
                  src="/sh.jpeg" 
                  alt="Shreehan Kate" 
                  className="object-cover w-full h-full rounded-full" 
                  style={{ objectPosition: 'center top' }}
                />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-white/40 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col items-center">
                   <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 tracking-widest uppercase">NIT Trichy</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 animate-bounce">
                <Cpu size={24} className="text-blue-500" />
              </div>
              <div className="absolute -bottom-2 -left-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 animate-bounce delay-300">
                <Navigation size={24} className="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">About Me</h2>
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
          </div>
          <div className="prose prose-slate prose-lg max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              I am a robotics and control researcher passionate about building <span className="font-bold text-slate-900 dark:text-white">intelligent, adaptive systems</span>. 
              My work spans nonlinear control, reinforcement learning, kinematic modeling, and computer vision.
            </p>
            <p>
              Currently, I am a <span className="text-blue-600 dark:text-blue-400 font-bold">Robotics Software Intern at xTerra Robotics, IIT Kanpur</span>. 
              I have also interned at <span className="font-semibold text-slate-900 dark:text-white">IISc Bengaluru</span> and conducted research at <span className="font-semibold text-slate-900 dark:text-white">NIT Trichy</span>. 
              My mission is to push the boundaries of how machines interact with complex environments.
            </p>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Research Focus</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">Pushing the boundaries of autonomous navigation and control through rigorous mathematical modeling.</p>
          </div>
          <div className="grid gap-8">
            {researchList.map((res, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all p-8 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{res.org}</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase">{res.date}</span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">{res.role} • <span className="text-slate-400">{res.loc}</span></p>
                <ul className="grid gap-3">
                  {res.points.map((point, i) => (
                    <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400">
                      <ChevronRight size={18} className="text-blue-500 shrink-0 mt-1" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Experience</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="space-y-12">
            {experienceList.map((exp, idx) => (
              <div key={idx} className="relative pl-8 border-l-2 border-slate-100 dark:border-slate-800 hover:border-blue-400 transition-colors">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-500"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{exp.date}</span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{exp.org}</p>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  {exp.points.map((point, i) => <li key={i} className="text-sm">• {point}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {projectsList.map((proj, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{proj.title}</h3>
                  <a href={proj.link} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><LinkIcon size={20} /></a>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">{proj.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {proj.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section id="publications" className="py-24 bg-slate-900 dark:bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-4">Publications</h2>
              <p className="text-slate-400">Contributions to international robotics and control conferences.</p>
            </div>
          </div>
          <div className="grid gap-6">
            {publicationsList.map((pub, idx) => (
              <div key={idx} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-6">
                <div className="text-4xl font-black text-white/20 group-hover:text-blue-500/40 transition-colors">{idx + 1}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors">{pub.title}</h3>
                  <p className="text-sm text-slate-400 italic mb-3">{pub.authors}</p>
                  <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-blue-400">{pub.venue}</span>
                    <span className={pub.statusColor === 'green' ? 'text-emerald-400' : 'text-yellow-400'}>{pub.status}</span>
                    <span className="text-slate-500">{pub.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Technical Arsenal</h2>
            <p className="text-slate-500 dark:text-slate-400">Mathematics, control theory, and hardware implementation.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {skillsData.map((cat, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {achievementsData.map((ach, idx) => (
              <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="text-blue-600 dark:text-blue-400" size={20} />
                  <h3 className="font-bold text-blue-900 dark:text-blue-300">{ach.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{ach.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 py-24 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Let's build the future.</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto">
            Available for research collaborations, graduate program discussions, and industry opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a href="mailto:shreehan1912@gmail.com" className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-blue-950/20">
              <Mail size={20} />
              Say Hello
            </a>
            <a href="https://www.linkedin.com/in/shreehankate/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <Linkedin size={20} className="text-blue-600" />
              LinkedIn
            </a>
          </div>
          <div className="pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2024 Shreehan Santosh Kate • Researcher</p>
            <div className="flex gap-6 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1"><MapPin size={12} /> NIT Trichy Alum</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;