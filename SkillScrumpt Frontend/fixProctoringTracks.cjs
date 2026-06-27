const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'hooks', 'useProctoring.js');
let code = fs.readFileSync(filePath, 'utf8');

// Add allTracksRef
if (!code.includes('const allTracksRef')) {
  code = code.replace(
    'const sessionIdRef   = useRef(null);   // stable ref for cleanup',
    'const sessionIdRef   = useRef(null);   // stable ref for cleanup\n  const allTracksRef   = useRef([]);     // stable ref for all media tracks'
  );
}

// Fix cleanup on unmount
const unmountTarget = `  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      wsRef.current?.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);`;

const unmountReplacement = `  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      wsRef.current?.close();
      if (allTracksRef.current) {
        allTracksRef.current.forEach(t => { try { t.stop(); } catch(e) {} });
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => { try { t.stop(); } catch(e) {} });
      }
    };
  }, []);`;

code = code.replace(unmountTarget, unmountReplacement);

fs.writeFileSync(filePath, code);
console.log('Fixed useProctoring.js tracks cleanup');
