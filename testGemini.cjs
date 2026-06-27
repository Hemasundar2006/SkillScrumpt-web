async function run() {
  const apiKey = "AQ.Ab8RN6IbHbduQooCoqsCGNf2hheTyQ-UIrQuEaSN7e7w_EjL-Q";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: 'hello' }] }]
    })
  });
  console.log(response.status);
  console.log(await response.text());
}
run();
