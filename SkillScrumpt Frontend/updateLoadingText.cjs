const fs = require('fs');
const filePath = 'src/pages/ProctoringInterface.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// We will add a new state `loadingStep` for the rotating text
if (!code.includes('const [loadingStep, setLoadingStep] = useState(0);')) {
  code = code.replace(
    'const [isSubmitting, setIsSubmitting] = useState(false);',
    'const [isSubmitting, setIsSubmitting] = useState(false);\n  const [loadingStep, setLoadingStep] = useState(0);\n\n  const loadingTexts = [\n    "Synthesizing telemetry data...",\n    "Analyzing proctoring logs...",\n    "Calculating technical score...",\n    "Finalizing certification...",\n    "Generating secure results..."\n  ];\n\n  useEffect(() => {\n    let interval;\n    if (isSubmitting) {\n      interval = setInterval(() => {\n        setLoadingStep(prev => (prev + 1) % loadingTexts.length);\n      }, 2000);\n    }\n    return () => clearInterval(interval);\n  }, [isSubmitting]);'
  );

  // Now replace the static text with the animated one
  const targetRegex = /<p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-16 leading-relaxed">Synthesizing telemetry data & <br\/>technical performance metrics<\/p>/;
  
  if (targetRegex.test(code)) {
    code = code.replace(
      targetRegex, 
      `<motion.p 
            key={loadingStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[#F97316] text-sm font-black uppercase tracking-widest mb-16 h-8 flex items-center justify-center"
          >
            {loadingTexts[loadingStep]}
          </motion.p>`
    );
    fs.writeFileSync(filePath, code);
    console.log('Added dynamic loading text to ProctoringInterface.');
  } else {
    console.log('Failed to find static text to replace.');
  }
} else {
  console.log('Loading text state already exists.');
}
