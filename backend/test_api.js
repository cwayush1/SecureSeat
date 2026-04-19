
async function run() {
  const r = await fetch('http://localhost:5000/api/matches/1/blocks/89/seats');
  const d = await r.json();
  console.log(`Match 1 Block 89 returned ${d.length} seats`);
  
  const r2 = await fetch('http://localhost:5000/api/matches/4/blocks/89/seats');
  const d2 = await r2.json();
  console.log(`Match 4 Block 89 returned ${d2.length} seats`);
}
run();
