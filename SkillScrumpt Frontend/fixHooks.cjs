const fs = require('fs');
const filePath = 'src/hooks/useProctoring.js';
let code = fs.readFileSync(filePath, 'utf8');

if (!code.includes('const allTracksRef = useRef([]);')) {
  // Add allTracksRef to the hooks
  code = code.replace(
    'const intervalRef = useRef(null);',
    'const intervalRef = useRef(null);\n  const allTracksRef = useRef([]);'
  );

  // Update track collection
  const oldGetMedia = `          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: "user" },
            audio: false,
          });
          
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: "monitor" }
          });

          const screenTrack = displayStream.getVideoTracks()[0];`;

  const newGetMedia = `          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: "user" },
            audio: true, // Audio enabled for ambient noise checking
          });
          
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: "monitor" },
            audio: true // System audio
          });

          // Store all tracks securely to guarantee full shutdown
          allTracksRef.current = [...stream.getTracks(), ...displayStream.getTracks()];

          const screenTrack = displayStream.getVideoTracks()[0];`;

  code = code.replace(oldGetMedia, newGetMedia);

  // Update stopProctoring
  const oldStop = `    streamRef.current?.getTracks().forEach((t) => t.stop());`;
  const newStop = `    // Guarantee all tracks (video, audio, screen) are terminated
    allTracksRef.current.forEach(t => {
      try { t.stop(); } catch(e){}
    });
    streamRef.current?.getTracks().forEach((t) => {
      try { t.stop(); } catch(e){}
    });`;

  code = code.replace(oldStop, newStop);
  fs.writeFileSync(filePath, code);
  console.log('useProctoring updated for full track teardown.');
} else {
  console.log('Already updated useProctoring.');
}
