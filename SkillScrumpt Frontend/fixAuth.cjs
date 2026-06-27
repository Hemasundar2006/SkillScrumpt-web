const fs = require('fs');
const filePath = 'src/pages/AuthPages.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// General Wrapper (used in both Login and Register)
code = code.split('className="min-h-screen flex items-center justify-center bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white pt-32 pb-20 px-4 relative overflow-hidden"').join('className="h-screen flex flex-col items-center justify-center bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white py-4 px-4 relative overflow-hidden"');

// Login Adjustments
// Header text
code = code.split('<div className="text-center mb-12">').join('<div className="text-center mb-4">');
code = code.split('<Link to="/" className="inline-block text-3xl font-bold tracking-tight mb-8 hover:scale-105 transition-transform text-slate-900">').join('<Link to="/" className="inline-block text-2xl font-bold tracking-tight mb-4 hover:scale-105 transition-transform text-slate-900">');
code = code.split('<h2 className="text-5xl font-bold tracking-tight mb-4 text-slate-900">').join('<h2 className="text-4xl font-bold tracking-tight mb-2 text-slate-900">');

// Form padding
code = code.split('<div className="p-8 md:p-12 border border-white/50 bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50">').join('<div className="p-6 md:p-8 border border-white/50 bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50">');
code = code.split('<form className="space-y-8" onSubmit={handleLogin}>').join('<form className="space-y-4" onSubmit={handleLogin}>');
code = code.split('<div className="mt-8 pt-8 border-t border-slate-200/50">').join('<div className="mt-4 pt-4 border-t border-slate-200/50">');

// Signup Adjustments
code = code.split('<div className="text-center mb-16">').join('<div className="text-center mb-4">');
code = code.split('<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">').join('<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">');

// Role selector buttons
code = code.split("className={`p-8 border rounded-2xl transition-all ${role === 'professional' ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm' : 'bg-white/50 border-white/50 hover:border-[#F97316] text-slate-700'}`}").join("className={`p-4 border rounded-2xl transition-all ${role === 'professional' ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm' : 'bg-white/50 border-white/50 hover:border-[#F97316] text-slate-700'}`}");

code = code.split("className={`p-8 border rounded-2xl transition-all ${role === 'client' ? 'bg-[#38BDF8] text-white border-[#38BDF8] shadow-sm' : 'bg-white/50 border-white/50 hover:border-[#38BDF8] text-slate-700'}`}").join("className={`p-4 border rounded-2xl transition-all ${role === 'client' ? 'bg-[#38BDF8] text-white border-[#38BDF8] shadow-sm' : 'bg-white/50 border-white/50 hover:border-[#38BDF8] text-slate-700'}`}");

code = code.split('<h4 className="font-bold text-xl mt-6 mb-2">').join('<h4 className="font-bold text-lg mt-2 mb-1">');

// Form
code = code.split('<form className="space-y-6" onSubmit={handleRegister}>').join('<form className="space-y-3" onSubmit={handleRegister}>');
code = code.split('<div className="grid grid-cols-2 gap-6">').join('<div className="grid grid-cols-2 gap-4">');

// Input styles (reduce padding)
code = code.split('className="w-full px-6 py-4 bg-white/60 border border-white/50 focus:border-[#38BDF8] outline-none transition-all font-bold placeholder:text-slate-400 uppercase rounded-xl shadow-sm text-slate-900"').join('className="w-full px-4 py-3 bg-white/60 border border-white/50 focus:border-[#38BDF8] outline-none transition-all font-bold placeholder:text-slate-400 uppercase rounded-xl shadow-sm text-slate-900"');

fs.writeFileSync(filePath, code);
console.log('Fixed AuthPages.jsx layout using split.join!');
