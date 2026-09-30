import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Code2,
  Terminal,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import Button from '../common/Button';

const defaultHTML = `<!-- SkillOrbit Live Code Playground -->
<div class="container">
  <h1>🚀 Welcome to Live Playground</h1>
  <p>Write your HTML, CSS, and JavaScript and see instant execution!</p>
  <button id="counterBtn" class="btn">Clicks: 0</button>
</div>`;

const defaultCSS = `body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  margin: 0;
}
.container {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}
h1 {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:hover {
  background: #4f46e5;
  transform: scale(1.05);
}`;

const defaultJS = `let count = 0;
const btn = document.getElementById('counterBtn');

btn.addEventListener('click', () => {
  count++;
  btn.textContent = 'Clicks: ' + count;
  console.log('Button clicked! New count:', count);
});

console.log('SkillOrbit Code Playground Initialized ✨');`;

const presets = [
  {
    name: 'Counter App',
    html: defaultHTML,
    css: defaultCSS,
    js: defaultJS,
  },
  {
    name: 'MERN API Fetch Demo',
    html: `<div class="container">
  <h2>📡 Simulated API Request</h2>
  <div id="dataList" class="loading">Loading courses...</div>
</div>`,
    css: `body { font-family: sans-serif; background: #0b0f19; color: #fff; padding: 2rem; }
.container { max-width: 400px; margin: auto; background: #1e293b; padding: 1.5rem; border-radius: 12px; }
.course-card { background: #334155; padding: 10px; margin: 8px 0; border-radius: 6px; }`,
    js: `setTimeout(() => {
  const courses = [
    { title: 'Full Stack MERN', price: '₹4,999' },
    { title: 'Next.js 15 Pro', price: '₹3,499' }
  ];
  const list = document.getElementById('dataList');
  list.innerHTML = courses.map(c => \`<div class="course-card"><strong>\${c.title}</strong> - \${c.price}</div>\`).join('');
  console.log('Data loaded successfully!', courses);
}, 800);`,
  },
];

const CodePlayground = () => {
  const [activeTab, setActiveTab] = useState('html'); // 'html' | 'css' | 'js' | 'console'
  const [htmlCode, setHtmlCode] = useState(defaultHTML);
  const [cssCode, setCssCode] = useState(defaultCSS);
  const [jsCode, setJsCode] = useState(defaultJS);
  const [srcDoc, setSrcDoc] = useState('');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);

  const runCode = () => {
    setConsoleLogs([]);
    const combinedDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>
            const originalLog = console.log;
            console.log = function(...args) {
              window.parent.postMessage({ type: 'CONSOLE_LOG', data: args.join(' ') }, '*');
              originalLog.apply(console, args);
            };
            window.onerror = function(msg, url, line) {
              window.parent.postMessage({ type: 'CONSOLE_ERROR', data: msg + ' (Line ' + line + ')' }, '*');
            };
            try {
              ${jsCode}
            } catch(e) {
              window.parent.postMessage({ type: 'CONSOLE_ERROR', data: e.message }, '*');
            }
          <\/script>
        </body>
      </html>
    `;
    setSrcDoc(combinedDoc);
  };

  useEffect(() => {
    runCode();
  }, []);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && (e.data.type === 'CONSOLE_LOG' || e.data.type === 'CONSOLE_ERROR')) {
        setConsoleLogs((prev) => [
          ...prev,
          {
            type: e.data.type === 'CONSOLE_ERROR' ? 'error' : 'log',
            text: e.data.data,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCopy = () => {
    const fullCode = `<!-- HTML -->\n${htmlCode}\n\n/* CSS */\n${cssCode}\n\n// JS\n${jsCode}`;
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setHtmlCode(defaultHTML);
    setCssCode(defaultCSS);
    setJsCode(defaultJS);
    runCode();
  };

  const loadPreset = (preset) => {
    setHtmlCode(preset.html);
    setCssCode(preset.css);
    setJsCode(preset.js);
    setTimeout(runCode, 50);
  };

  return (
    <div
      className={`glass-panel rounded-2xl border border-slate-800 bg-slate-900/90 flex flex-col overflow-hidden text-left ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'min-h-[480px]'
      }`}
    >
      {/* Playground Header */}
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-slate-800 bg-slate-950/70 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-bold text-white flex items-center gap-1.5 ml-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            Interactive Code Playground
          </span>
        </div>

        {/* Presets & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(p)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>

          <button
            onClick={runCode}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow transition-all active:scale-95"
            title="Run Code (Live Execute)"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run Code
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset to Template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy All Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor & Preview Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 min-h-[380px]">
        {/* Left Side: Code Editor Tabs */}
        <div className="flex flex-col bg-slate-950/90">
          <div className="flex items-center border-b border-slate-800 px-3 pt-2 gap-1 bg-slate-900/60">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all ${
                activeTab === 'html'
                  ? 'bg-slate-950 text-indigo-400 border-t border-x border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HTML
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all ${
                activeTab === 'css'
                  ? 'bg-slate-950 text-indigo-400 border-t border-x border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CSS
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all ${
                activeTab === 'js'
                  ? 'bg-slate-950 text-indigo-400 border-t border-x border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JavaScript
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all ml-auto flex items-center gap-1 ${
                activeTab === 'console'
                  ? 'bg-slate-950 text-emerald-400 border-t border-x border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Console ({consoleLogs.length})
            </button>
          </div>

          <div className="flex-1 p-3 font-mono text-xs overflow-auto">
            {activeTab === 'html' && (
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                placeholder="Write HTML here..."
                className="w-full h-full min-h-[300px] bg-transparent text-slate-200 focus:outline-none resize-none font-mono leading-relaxed"
                spellCheck={false}
              />
            )}
            {activeTab === 'css' && (
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                placeholder="Write CSS here..."
                className="w-full h-full min-h-[300px] bg-transparent text-slate-200 focus:outline-none resize-none font-mono leading-relaxed"
                spellCheck={false}
              />
            )}
            {activeTab === 'js' && (
              <textarea
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                placeholder="Write JavaScript here..."
                className="w-full h-full min-h-[300px] bg-transparent text-slate-200 focus:outline-none resize-none font-mono leading-relaxed"
                spellCheck={false}
              />
            )}
            {activeTab === 'console' && (
              <div className="space-y-1 text-slate-300">
                {consoleLogs.length > 0 ? (
                  consoleLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 rounded flex items-start justify-between gap-2 ${
                        log.type === 'error' ? 'bg-rose-950/50 text-rose-300' : 'bg-slate-900/60'
                      }`}
                    >
                      <span className="font-mono">{log.text}</span>
                      <span className="text-[10px] text-slate-500">{log.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic py-6 text-center">
                    No console outputs yet. Click "Run Code" to view execution logs.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Sandbox Output */}
        <div className="flex flex-col bg-slate-950">
          <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/40 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span>Live Output Preview</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Sandbox Active
            </span>
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            title="SkillOrbit Code Sandbox"
            sandbox="allow-scripts allow-modals"
            className="w-full h-full min-h-[300px] border-none bg-slate-950 flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
