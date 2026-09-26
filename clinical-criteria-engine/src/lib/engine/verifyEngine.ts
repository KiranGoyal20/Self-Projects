import { evaluatePatientForTrial } from './criteriaEngine';
import { parseProtocolText } from './protocolParser';
import { SAMPLE_PATIENTS } from '../data/samplePatients';
import { SAMPLE_PROTOCOLS } from '../data/sampleProtocols';

function runVerification() {
  console.log('=====================================================');
  console.log('  BOND HEALTH CLINICAL CRITERIA ENGINE VERIFICATION');
  console.log('=====================================================\n');

  const bond001 = SAMPLE_PROTOCOLS[0]; // BOND-001 NSCLC
  const bond002 = SAMPLE_PROTOCOLS[1]; // BOND-002 T2D
  const bond003 = SAMPLE_PROTOCOLS[2]; // BOND-003 DLBCL

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`✗ [FAIL] ${testName} - ${detail || ''}`);
    }
  }

  // TEST 1: Eleanor Vance (p-001) - Expected: ELIGIBLE for BOND-001
  const evalP1 = evaluatePatientForTrial(SAMPLE_PATIENTS[0], bond001);
  assert(
    evalP1.overallStatus === 'ELIGIBLE',
    'Patient p-001 (Eleanor Vance) is ELIGIBLE for BOND-001',
    `Got: ${evalP1.overallStatus}`
  );
  assert(
    evalP1.inclusionMetCount === 7 && evalP1.exclusionMetCount === 0,
    'Patient p-001 meets all 7 inclusion criteria and 0 exclusions',
    `Inclusions: ${evalP1.inclusionMetCount}/7, Exclusions: ${evalP1.exclusionMetCount}`
  );

  // TEST 2: David Miller (p-002) - Expected: INELIGIBLE due to ANC < 1500
  const evalP2 = evaluatePatientForTrial(SAMPLE_PATIENTS[1], bond001);
  assert(
    evalP2.overallStatus === 'INELIGIBLE',
    'Patient p-002 (David Miller) is INELIGIBLE for BOND-001',
    `Got: ${evalP2.overallStatus}`
  );
  assert(
    evalP2.blockerReasons.some(b => b.includes('ANC') || b.includes('Neutrophil')),
    'Patient p-002 blocker accurately cites ANC lab insufficiency',
    `Blockers: ${JSON.stringify(evalP2.blockerReasons)}`
  );

  // TEST 3: Sarah Jenkins (p-003) - Expected: INELIGIBLE due to Brain Metastases
  const evalP3 = evaluatePatientForTrial(SAMPLE_PATIENTS[2], bond001);
  assert(
    evalP3.overallStatus === 'INELIGIBLE',
    'Patient p-003 (Sarah Jenkins) is INELIGIBLE for BOND-001',
    `Got: ${evalP3.overallStatus}`
  );
  assert(
    evalP3.blockerReasons.some(b => b.includes('Brain') || b.includes('Central Nervous System')),
    'Patient p-003 blocker accurately cites CNS metastases exclusion',
    `Blockers: ${JSON.stringify(evalP3.blockerReasons)}`
  );

  // TEST 4: Maria Santos (p-005) - Expected: INELIGIBLE due to Chemo Washout
  const evalP5 = evaluatePatientForTrial(SAMPLE_PATIENTS[4], bond001);
  assert(
    evalP5.overallStatus === 'INELIGIBLE',
    'Patient p-005 (Maria Santos) is INELIGIBLE for BOND-001',
    `Got: ${evalP5.overallStatus}`
  );
  assert(
    evalP5.blockerReasons.some(b => b.includes('Washout') || b.includes('Chemotherapy') || b.includes('WASHOUT')),
    'Patient p-005 blocker accurately cites 28-day chemo washout violation',
    `Blockers: ${JSON.stringify(evalP5.blockerReasons)}`
  );

  // TEST 5: Arthur Pendelton (p-006) - Expected: ELIGIBLE for BOND-002 (T2D)
  const evalP6 = evaluatePatientForTrial(SAMPLE_PATIENTS[5], bond002);
  assert(
    evalP6.overallStatus === 'ELIGIBLE',
    'Patient p-006 (Arthur Pendelton) is ELIGIBLE for BOND-002 T2D trial',
    `Got: ${evalP6.overallStatus}`
  );

  // TEST 6: Amina Al-Mansoor (p-010) - Expected: NEEDS_REVIEW due to missing labs
  const evalP10 = evaluatePatientForTrial(SAMPLE_PATIENTS[9], bond001);
  assert(
    evalP10.overallStatus === 'NEEDS_REVIEW',
    'Patient p-010 (Amina Al-Mansoor) is flagged as NEEDS_REVIEW due to missing lab tests',
    `Got: ${evalP10.overallStatus}`
  );

  // TEST 7: Protocol Parser NLP Extraction
  const sampleProtocolRaw = `Inclusion Criteria:
1. Adult patients aged 18 to 75 years.
2. Histologically confirmed NSCLC.
3. Absolute Neutrophil Count (ANC) >= 1,500 /uL.
4. eGFR >= 60 mL/min/1.73m2.

Exclusion Criteria:
1. Active CNS brain metastases.
2. Systemic chemotherapy within 28 days.`;

  const parsedRules = parseProtocolText(sampleProtocolRaw);
  assert(
    parsedRules.length >= 6,
    'AI Protocol Parser extracted all 6 criteria rules from raw text',
    `Extracted count: ${parsedRules.length}`
  );

  const ancRule = parsedRules.find(r => r.name.includes('ANC') || r.name.includes('Neutrophil'));
  assert(
    ancRule?.thresholdValue === 1500 && ancRule?.operator === '>=',
    'AI Protocol Parser normalized ANC operator (>=) and threshold (1500 /uL)',
    `Rule: ${JSON.stringify(ancRule)}`
  );

  console.log('\n=====================================================');
  console.log(`  RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('=====================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runVerification();
