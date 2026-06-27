const fs = require('fs');
const filePath = 'src/pages/AssessmentResult.jsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  /const isPassed = passedStatus === 'passed';/g,
  "const isPassed = passedStatus === 'passed' || score >= 70;"
);

code = code.replace(
  /{currentUser\?\.firstName\?\.\[0\]}/g,
  "{currentUser?.name?.[0] || currentUser?.firstName?.[0] || 'U'}"
);

code = code.replace(
  /<h2 className=\"text-2xl font-bold tracking-tight\">{currentUser\?\.firstName} {currentUser\?\.lastName}<\/h2>/g,
  '<h2 className="text-2xl font-bold tracking-tight">{currentUser?.name || `${currentUser?.firstName || \'\'} ${currentUser?.lastName || \'\'}`.trim() || \'Candidate\'}</h2>'
);

code = code.replace(
  /<div className=\"max-w-\[1400px\] mx-auto px-6 pb-20\">/g,
  '<div className="max-w-[1400px] mx-auto px-6 h-[calc(100vh-80px)] flex flex-col pb-4">'
);

code = code.replace(
  /<header className=\"flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12\">/g,
  '<header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 shrink-0">'
);

code = code.replace(
  /<div className=\"grid grid-cols-1 lg:grid-cols-3 gap-8\">/g,
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">'
);

code = code.replace(
  /<div className=\"lg:col-span-2 space-y-8\">/g,
  '<div className="lg:col-span-2 space-y-4 overflow-y-auto custom-scrollbar pr-2">'
);

code = code.replace(
  /<div className=\"space-y-8\">/g,
  '<div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">'
);

code = code.replace(
  /className=\\{`p-10 rounded-\\[2\\.5rem\\]/g,
  'className={`p-6 rounded-[2rem]'
);

code = code.replace(
  /<div className=\"relative z-10 flex flex-col md:flex-row justify-between gap-10\">/g,
  '<div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">'
);

code = code.replace(
  /<Card className=\"p-8 rounded-\\[2rem\\]\">/g,
  '<Card className="p-6 rounded-[2rem]">'
);

fs.writeFileSync(filePath, code);
console.log('Fixed AssessmentResult.jsx!');
