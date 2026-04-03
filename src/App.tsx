import { useState, useEffect, ReactNode } from 'react';
import { 
  Type, 
  Lock, 
  Code, 
  QrCode, 
  ArrowRightLeft, 
  Search, 
  ChevronLeft, 
  Copy, 
  Check,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type ToolId = 'home' | 'word-counter' | 'password-gen' | 'json-formatter' | 'qr-gen' | 'unit-converter';

interface Tool {
  id: ToolId;
  title: string;
  description: string;
  category: string;
  icon: ReactNode;
}

// --- Components ---

const Header = ({ onHome }: { onHome: () => void }) => (
  <header className="glass-effect sticky top-0 z-50 py-4">
    <div className="container mx-auto px-6 flex justify-between items-center">
      <button onClick={onHome} className="flex items-center gap-2 text-xl font-extrabold tracking-tight hover:opacity-80 transition-opacity">
        <div className="text-primary">
          <Lock size={28} strokeWidth={2.5} />
        </div>
        Tool<span className="text-primary">Hub</span> Pro
      </button>
      <button 
        onClick={() => alert('ToolHub Pro is free during Beta!')}
        className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all transform hover:-translate-y-0.5"
      >
        Join Beta
      </button>
    </div>
  </header>
);

const ToolCard = ({ tool, onClick, index }: { tool: Tool; onClick: () => void; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    onClick={onClick}
    className="bg-bg-card p-8 rounded-2xl border border-border-subtle cursor-pointer flex flex-col tool-card-hover group"
  >
    <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
      {tool.icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
    <p className="text-text-muted text-sm leading-relaxed mb-6 flex-grow">{tool.description}</p>
    <div>
      <span className="inline-block px-3 py-1 bg-bg-body rounded-full text-[10px] font-bold text-text-muted uppercase tracking-wider">
        {tool.category}
      </span>
    </div>
  </motion.div>
);

// --- Tool Implementations ---

const WordCounter = () => {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const readTime = Math.ceil(words / 200);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Words', value: words },
          { label: 'Characters', value: chars },
          { label: 'Read Time', value: `${readTime}m` }
        ].map((stat) => (
          <div key={stat.label} className="bg-bg-body p-6 rounded-xl text-center">
            <div className="text-2xl font-extrabold text-primary">{stat.value}</div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
      <textarea
        className="w-full h-80 p-6 rounded-xl border border-border-subtle focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none font-sans text-lg"
        placeholder="Start typing or paste content..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
    setCopied(false);
  };

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="space-y-8">
      <div className="bg-bg-body p-8 rounded-xl border border-dashed border-border-subtle text-center break-all font-mono text-2xl tracking-widest min-h-[100px] flex items-center justify-center">
        {password || 'Click Generate'}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-text-main">Password Length: {length}</label>
          <input 
            type="range" min="8" max="50" value={length} 
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-primary h-2 bg-border-subtle rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" checked={includeNumbers} 
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-5 h-5 rounded border-border-subtle text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">Include Numbers (123)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" checked={includeSymbols} 
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-5 h-5 rounded border-border-subtle text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">Include Symbols (@#$%)</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={generate} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:-translate-y-1">
          <RefreshCw size={20} /> Generate
        </button>
        <button onClick={copy} className="bg-text-main hover:bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:-translate-y-1">
          {copied ? <Check size={20} /> : <Copy size={20} />} {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj, null, 4));
    } catch (e: any) {
      alert("Invalid JSON: " + e.message);
    }
  };

  const copy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <label className="block text-sm font-bold text-text-main">Paste Raw JSON</label>
      <textarea
        className="w-full h-80 p-6 rounded-xl border border-border-subtle focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm resize-none"
        placeholder='{"name":"ToolHub","status":"awesome"}'
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-3">
        <button onClick={format} className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1">
          Beautify JSON
        </button>
        <button onClick={() => setInput('')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:-translate-y-1">
          <Trash2 size={20} /> Clear
        </button>
        <button onClick={copy} className="bg-text-main hover:bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:-translate-y-1">
          {copied ? <Check size={20} /> : <Copy size={20} />} {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

const QrGenerator = () => {
  const [data, setData] = useState('');
  const [size, setSize] = useState('400x400');
  const [qrUrl, setQrUrl] = useState('');

  const generate = () => {
    if (!data) return alert("Please enter a URL or text");
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(data)}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-text-main mb-2">URL or Text</label>
          <input 
            type="text" 
            className="w-full p-4 rounded-xl border border-border-subtle focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            placeholder="https://google.com"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-text-main mb-2">Image Size</label>
          <select 
            className="w-full p-4 rounded-xl border border-border-subtle focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-white"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="200x200">Small (200x200)</option>
            <option value="400x400">Medium (400x400)</option>
            <option value="600x600">Large (600x600)</option>
          </select>
        </div>
        <button onClick={generate} className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1">
          Generate QR Code
        </button>
      </div>
      <div className="flex flex-col items-center justify-center p-8 bg-bg-body rounded-2xl border border-dashed border-border-subtle min-h-[300px]">
        {qrUrl ? (
          <>
            <img src={qrUrl} alt="QR Code" className="max-w-full h-auto rounded-lg shadow-lg" referrerPolicy="no-referrer" />
            <p className="text-xs text-text-muted mt-6 font-medium">Right click to save image</p>
          </>
        ) : (
          <div className="text-text-muted text-center">
            <QrCode size={64} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">QR Preview will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

const UnitConverter = () => {
  const [km, setKm] = useState('');
  const miles = km ? (parseFloat(km) * 0.621371).toFixed(2) : '0';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-bold text-text-main mb-2">From (Kilometers)</label>
          <input 
            type="number" 
            className="w-full p-4 rounded-xl border border-border-subtle focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            placeholder="0"
            value={km}
            onChange={(e) => setKm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-text-main mb-2">To (Miles)</label>
          <div className="w-full p-4 rounded-xl border border-border-subtle bg-bg-body text-text-main font-bold text-lg">
            {miles}
          </div>
        </div>
      </div>
      <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
        <p className="text-sm text-primary font-medium">More unit types (Weight, Volume, Temperature) coming soon in Pro.</p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<ToolId>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const tools: Tool[] = [
    {
      id: 'word-counter',
      title: 'Word Counter Pro',
      description: 'Advanced text analysis with character, word, and reading time estimates.',
      category: 'Text',
      icon: <Type size={24} />
    },
    {
      id: 'password-gen',
      title: 'Password Generator',
      description: 'Create ultra-secure, randomized passwords with custom requirements.',
      category: 'Security',
      icon: <Lock size={24} />
    },
    {
      id: 'json-formatter',
      title: 'JSON Formatter',
      description: 'Clean, validate, and beautify messy JSON code instantly.',
      category: 'Dev',
      icon: <Code size={24} />
    },
    {
      id: 'qr-gen',
      title: 'QR Code Generator',
      description: 'Generate high-quality QR codes for URLs, text, or WiFi access.',
      category: 'Marketing',
      icon: <QrCode size={24} />
    },
    {
      id: 'unit-converter',
      title: 'Unit Converter',
      description: 'Quickly convert between metric and imperial units of measurement.',
      category: 'Utility',
      icon: <ArrowRightLeft size={24} />
    }
  ];

  const filteredTools = tools.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTool = () => {
    switch (currentView) {
      case 'word-counter': return <WordCounter />;
      case 'password-gen': return <PasswordGenerator />;
      case 'json-formatter': return <JsonFormatter />;
      case 'qr-gen': return <QrGenerator />;
      case 'unit-converter': return <UnitConverter />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onHome={() => setCurrentView('home')} />

      <main className="flex-grow container mx-auto px-6 max-w-6xl">
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20"
            >
              <div className="text-center mb-16">
                <motion.h1 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-text-main to-slate-600 bg-clip-text text-transparent"
                >
                  Everything you need, <br />minus the complexity.
                </motion.h1>
                <motion.p 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-text-muted max-w-2xl mx-auto"
                >
                  The premium, private-first toolkit for creators and developers.
                </motion.p>

                <div className="max-w-xl mx-auto mt-12 relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search 50+ utility tools..."
                    className="w-full pl-14 pr-6 py-5 rounded-full border border-border-subtle bg-white shadow-lg-custom focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool, index) => (
                  <div key={tool.id}>
                    <ToolCard 
                      tool={tool} 
                      index={index}
                      onClick={() => setCurrentView(tool.id)} 
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tool"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-12"
            >
              <div className="mb-10">
                <button 
                  onClick={() => setCurrentView('home')}
                  className="flex items-center gap-2 text-text-muted hover:text-primary font-bold transition-colors mb-4"
                >
                  <ChevronLeft size={20} /> Back to tools
                </button>
                <h2 className="text-4xl font-extrabold tracking-tight">
                  {tools.find(t => t.id === currentView)?.title}
                </h2>
              </div>

              <div className="bg-bg-card p-10 rounded-3xl border border-border-subtle shadow-lg-custom">
                {renderTool()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-border-subtle py-16 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xl font-extrabold mb-4">ToolHub Pro</p>
          <p className="text-text-muted max-w-lg mx-auto mb-10">
            Professional tools built for privacy. We never store your data. All calculations are performed on your device.
          </p>
          <div className="flex justify-center gap-8 text-sm font-bold text-text-muted">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">API Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
