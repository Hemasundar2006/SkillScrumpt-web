import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Camera, Mic, Monitor, AlertTriangle, CheckCircle, Info, X, Users } from 'lucide-react';
import { Button, GlassContainer, Badge, Card } from '../components/UI';
import { Link } from 'react-router-dom';

export function AIProctoringInterface() {
  const [isIdentityVerified, setIsIdentityVerified] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(1);
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isDesktop) {
    return <DesktopRequiredView />;
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col font-inter">
      {/* Top Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-secondary/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Shield className="text-primary" size={24} />
          <div className="h-4 w-[1px] bg-white/20" />
          <div>
            <h1 className="text-sm font-bold tracking-tight">Advanced React Architecture Assessment</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time Remaining: 01:24:45</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ProctorIndicator icon={Camera} label="Camera" active />
          <ProctorIndicator icon={Mic} label="Mic" active />
          <ProctorIndicator icon={Monitor} label="Screen" active />
          <div className="h-8 w-[1px] bg-white/10" />
          <Button variant="danger" size="sm" className="h-8 px-4 text-xs">Finish Test</Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Assessment Section */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-4">
              <Badge variant="primary" className="bg-primary/20 text-blue-300 border-none font-bold">Question {currentQuestion} of 25</Badge>
              <h2 className="text-3xl font-bold leading-tight">
                Explain the difference between useLayoutEffect and useEffect in the context of browser painting and layout measurement.
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-400 font-medium">Select the most accurate explanation:</p>
              <div className="grid gap-4">
                <OptionCard 
                  label="A" 
                  text="useEffect runs synchronously after all DOM mutations but before the browser has a chance to paint. useLayoutEffect runs asynchronously after paint."
                />
                <OptionCard 
                  label="B" 
                  text="useLayoutEffect runs synchronously after all DOM mutations but before the browser has a chance to paint. useEffect runs asynchronously after paint."
                  selected
                />
                <OptionCard 
                  label="C" 
                  text="Both run asynchronously after paint, but useLayoutEffect has priority in the scheduler for heavy computations."
                />
                <OptionCard 
                  label="D" 
                  text="useEffect is for functional components, while useLayoutEffect is a legacy hook used only for class-based component compatibility."
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-10 border-t border-white/5">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">Previous</Button>
              <Button className="px-12" onClick={() => setCurrentQuestion(q => q + 1)}>Next Question</Button>
            </div>
          </div>
        </main>

        {/* AI Monitoring Sidebar */}
        <aside className="w-80 border-l border-white/10 bg-secondary/30 backdrop-blur-xl p-6 hidden lg:flex flex-col gap-6">
          <section>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Live Video Feed</h4>
            <div className="relative aspect-video bg-black rounded-custom overflow-hidden border border-white/10 group">
              {/* Fake video feed placeholder */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <Users size={48} className="text-gray-500" />
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">REC</span>
              </div>
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-2 animate-scanline pointer-events-none" />
              
              {/* AI Detection Overlay */}
              <div className="absolute bottom-2 left-2 right-2">
                <GlassContainer className="p-2 bg-black/40 border-white/10 text-[9px] font-bold text-primary flex items-center gap-2">
                  <Shield size={12} /> IDENTITY VERIFIED: ALEX RIVERA
                </GlassContainer>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Security Status</h4>
            <div className="space-y-3">
              <SecurityItem label="Eye Tracking" status="Stable" />
              <SecurityItem label="Keystroke Pattern" status="Normal" />
              <SecurityItem label="Tab Switching" status="None" />
              <SecurityItem label="Background Noise" status="Silent" />
            </div>
          </section>

          <section className="mt-auto">
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="flex gap-3">
                <Info size={16} className="text-primary flex-shrink-0" />
                <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                  The AI is monitoring your environment. Ensure you remain in the center of the frame and avoid using external resources.
                </p>
              </div>
            </Card>
          </section>
        </aside>
      </div>

      {/* Identity Verification Modal Overlay (Initial State) */}
      <AnimatePresence>
        {!isIdentityVerified && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <Card className="w-full max-w-lg bg-secondary border-white/10 p-10 text-center relative z-10 shadow-2xl">
              <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Shield size={40} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Identity Verification</h3>
              <p className="text-gray-400 mb-10 leading-relaxed">
                Before we begin, the AI needs to verify your identity. Please look directly into the camera for a biometric scan.
              </p>
              <div className="space-y-4">
                <Button className="w-full h-14 text-lg" onClick={() => setIsIdentityVerified(true)}>
                  Start Verification Scan
                </Button>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Encryption Key: CD72-XXXX-8921-BA03
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProctorIndicator({ icon: Icon, label, active = false }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-full ${active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        <Icon size={14} />
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function OptionCard({ label, text, selected = false }) {
  return (
    <button className={`w-full text-left p-6 border rounded-custom transition-all flex gap-4 group ${
      selected ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-white/5 border-white/10 hover:border-white/30'
    }`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${
        selected ? 'bg-primary border-primary text-white' : 'border-white/10 text-gray-500 group-hover:border-white/30'
      }`}>
        {label}
      </div>
      <p className={`text-sm font-medium leading-relaxed ${selected ? 'text-white' : 'text-gray-400'}`}>
        {text}
      </p>
    </button>
  );
}

function SecurityItem({ label, status }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
      <span className="text-[11px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
        <CheckCircle size={10} /> {status}
      </span>
    </div>
  );
}

function DesktopRequiredView() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-8">
        <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/10 border border-red-500/20">
          <Monitor size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Desktop Required</h2>
          <p className="text-gray-400 font-medium leading-relaxed">
            AI Proctoring requires a desktop environment for full biometric monitoring and screen sharing capabilities.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-custom p-6 text-left flex gap-4">
           <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
           <p className="text-xs text-gray-400 leading-relaxed font-medium">
             Mobile devices and tablets are currently not supported for verified assessments to maintain platform integrity.
           </p>
        </div>
        <Link to="/dashboard/student" className="block">
          <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
