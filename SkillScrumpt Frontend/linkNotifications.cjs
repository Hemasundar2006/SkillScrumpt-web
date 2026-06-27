const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src', 'layout', 'DashboardLayout.jsx');
let code = fs.readFileSync(layoutPath, 'utf8');

const targetBtn = `<button className="p-2 text-slate-500 hover:text-[#38BDF8] transition-all relative bg-white/60 border border-white/50 rounded-[12px] hidden sm:block backdrop-blur-md hover:-translate-y-0.5">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F97316] rounded-full border-2 border-white shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            </button>`;

const replaceLink = `<Link to="/notifications" className="p-2 text-slate-500 hover:text-[#38BDF8] transition-all relative bg-white/60 border border-white/50 rounded-[12px] hidden sm:block backdrop-blur-md hover:-translate-y-0.5">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F97316] rounded-full border-2 border-white shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            </Link>`;

if (code.includes(targetBtn)) {
  code = code.replace(targetBtn, replaceLink);
  fs.writeFileSync(layoutPath, code);
  console.log('Linked bell icon to /notifications in DashboardLayout.jsx');
} else {
  console.log('Bell button not found in DashboardLayout.jsx or already updated');
}
