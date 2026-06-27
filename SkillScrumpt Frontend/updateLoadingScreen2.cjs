const fs = require('fs');
const filePath = 'src/pages/ProctoringInterface.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetStr = `<div className="space-y-4 max-w-sm mx-auto">
              <div className="flex items-center justify-between px-8 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Protocol Audit</span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> SECURE
                </span>
              </div>
              <div className="flex items-center justify-between px-8 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score Vector</span>
                <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider animate-pulse">Calculating...</span>
              </div>
            </div>`;

const replacementStr = `<div className="space-y-4 max-w-lg mx-auto">
              {violations && violations.length > 0 ? (
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-left max-h-48 overflow-y-auto mb-6 shadow-inner">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Proctoring Logs</h4>
                  <ul className="space-y-3">
                    {violations.map((v, i) => (
                      <li key={i} className="text-sm font-medium text-slate-700 flex items-start gap-2">
                        <span className="text-rose-500 shrink-0 mt-0.5">⚠️</span>
                        <span className="leading-tight">{v.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex items-center justify-between px-8 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Protocol Audit</span>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> SECURE (0 Logs)
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between px-8 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score Vector Analysis</span>
                <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider animate-pulse">Calculating Deductions...</span>
              </div>
            </div>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync(filePath, code);
  console.log('Added violations logs to submitting screen.');
} else {
  console.log('Target string not found!');
}
