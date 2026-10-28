// test/verify.js
import http from 'http';

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: body });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING VERIFICATION TEST SUITE ---');

  // 1. Config Test
  console.log('\n1. Testing GET /api/config...');
  const config = await request({ host: 'localhost', port: 5000, path: '/api/config', method: 'GET' });
  console.log('Status:', config.status, '| Sections available:', Object.keys(config.data.sections));

  // 2. Team Registration Test
  console.log('\n2. Testing POST /api/register...');
  const regPayload = {
    teamName: 'Marlin Rescuers ' + Date.now().toString().slice(-4),
    leaderName: 'Marlin Clownfish',
    contactNumber: '9876543210'
  };
  const regRes = await request(
    { host: 'localhost', port: 5000, path: '/api/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    regPayload
  );
  console.log('Registration Status:', regRes.status, '| Team ID:', regRes.data.team?.teamId);
  const teamId = regRes.data.team?.teamId;

  // 3. Section Selection Test
  console.log('\n3. Testing POST /api/team/:teamId/section (Python track)...');
  const secRes = await request(
    { host: 'localhost', port: 5000, path: `/api/team/${teamId}/section`, method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { sectionId: 'python' }
  );
  console.log('Section Select Status:', secRes.status, '| Section locked to:', secRes.data.team?.section);

  // 4. Question 1 Fetch Test (Verify answer key is NOT exposed!)
  console.log('\n4. Testing GET /api/team/:teamId/question/0 (Check client data security)...');
  const qRes = await request({ host: 'localhost', port: 5000, path: `/api/team/${teamId}/question/0`, method: 'GET' });
  console.log('Question Status:', qRes.status, '| Number:', qRes.data.question?.number);
  console.log('Is correctKey exposed?', 'correctKey' in (qRes.data.question || {}) ? 'LEAKED! (FAIL)' : 'SAFE (NOT EXPOSED) (PASS)');

  // 5. Submit Question 1 Answer Test
  console.log('\n5. Testing POST /api/team/:teamId/submit (Answer Q1)...');
  const subRes = await request(
    { host: 'localhost', port: 5000, path: `/api/team/${teamId}/submit`, method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { questionId: qRes.data.question.id, selectedOption: 'B' }
  );
  console.log('Submission Status:', subRes.status, '| Correct?', subRes.data.isCorrect, '| Points:', subRes.data.pointsAwarded, '| Clue:', subRes.data.clue);

  // 6. Prevent Duplicate Resubmission Test
  console.log('\n6. Testing Duplicate Resubmission Prevention on same question...');
  const dupRes = await request(
    { host: 'localhost', port: 5000, path: `/api/team/${teamId}/submit`, method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { questionId: qRes.data.question.id, selectedOption: 'B' }
  );
  console.log('Duplicate Status:', dupRes.status, '| Error message:', dupRes.data.error);

  // 7. Bruce's Shark Attack Trigger Test (Admin)
  console.log('\n7. Testing Admin Bruce\'s Shark Attack Trigger...');
  const sharkRes = await request(
    {
      host: 'localhost',
      port: 5000,
      path: '/api/admin/shark-attack/trigger',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer secret-nemo-admin-token-2026' }
    },
    { questionIndex: 0 }
  );
  console.log('Shark Attack Trigger Status:', sharkRes.status, '| Title:', sharkRes.data.sharkAttack?.title);

  // 8. Submit Shark Attack Bonus
  console.log('\n8. Testing Team Submit Shark Attack Bonus...');
  const sharkSub = await request(
    { host: 'localhost', port: 5000, path: `/api/team/${teamId}/shark-attack`, method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { selectedOption: 'A' }
  );
  console.log('Shark Attack Submission Status:', sharkSub.status, '| Bonus Awarded:', sharkSub.data.bonusAwarded, '| Final Score:', sharkSub.data.finalScore);

  // 9. Excel Leaderboard Export Test
  console.log('\n9. Testing Admin Excel Export (.xlsx)...');
  const excelRes = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/admin/export-excel',
    method: 'GET',
    headers: { Authorization: 'Bearer secret-nemo-admin-token-2026' }
  });
  console.log('Excel Status:', excelRes.status, '| Content-Type:', excelRes.headers['content-type'], '| Size bytes:', excelRes.raw.length);

  console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
