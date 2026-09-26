"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAge = calculateAge;
exports.getDaysAgo = getDaysAgo;
exports.evaluateCriterion = evaluateCriterion;
exports.evaluatePatientForTrial = evaluatePatientForTrial;
function calculateAge(birthDateStr, asOfDate = new Date()) {
    const birth = new Date(birthDateStr);
    let age = asOfDate.getFullYear() - birth.getFullYear();
    const m = asOfDate.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && asOfDate.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}
function getDaysAgo(isoDateStr) {
    const target = new Date(isoDateStr).getTime();
    const now = new Date().getTime();
    return Math.floor((now - target) / (1000 * 60 * 60 * 24));
}
function evaluateCriterion(rule, record) {
    const patient = record?.patient || {};
    const conditions = Array.isArray(record?.conditions) ? record.conditions : [];
    const observations = Array.isArray(record?.observations) ? record.observations : [];
    const medications = Array.isArray(record?.medications) ? record.medications : [];
    const documents = Array.isArray(record?.documents) ? record.documents : [];
    if (rule.category === 'DEMOGRAPHICS') {
        if (rule.targetField === 'age') {
            const age = calculateAge(patient.birthDate);
            let passed = false;
            if (rule.operator === 'BETWEEN' && rule.thresholdRange) {
                passed = age >= rule.thresholdRange.min && age <= rule.thresholdRange.max;
            }
            else if (rule.operator === '>=' && rule.thresholdValue !== undefined) {
                passed = age >= rule.thresholdValue;
            }
            else if (rule.operator === '<=' && rule.thresholdValue !== undefined) {
                passed = age <= rule.thresholdValue;
            }
            const status = passed ? 'PASS' : 'FAIL';
            return {
                criterionId: rule.id,
                criterionName: rule.name,
                criterionType: rule.type,
                status,
                confidenceScore: 1.0,
                sourceResourceType: 'Patient',
                sourceResourceId: patient.id,
                recordedDate: patient.birthDate,
                valueObserved: `${age} years old`,
                reasoning: passed
                    ? `Patient age (${age}) meets protocol criteria (${rule.thresholdRange ? `${rule.thresholdRange.min}-${rule.thresholdRange.max}` : rule.thresholdValue} yrs)`
                    : `Patient age (${age}) is outside required range (${rule.thresholdRange ? `${rule.thresholdRange.min}-${rule.thresholdRange.max}` : rule.thresholdValue} yrs)`
            };
        }
    }
    if (rule.category === 'CONDITION') {
        const targetCode = rule.systemCode?.toUpperCase() || '';
        const match = conditions.find(c => {
            const hasCodeMatch = c.code.coding?.some(coding => coding.code.toUpperCase().startsWith(targetCode));
            const hasTextMatch = c.code.text?.toLowerCase().includes(rule.name.toLowerCase()) ||
                c.code.coding?.some(cd => cd.display?.toLowerCase().includes(rule.name.toLowerCase()));
            return hasCodeMatch || hasTextMatch;
        });
        if (rule.type === 'INCLUSION') {
            if (match) {
                return {
                    criterionId: rule.id,
                    criterionName: rule.name,
                    criterionType: rule.type,
                    status: 'PASS',
                    confidenceScore: 0.98,
                    sourceResourceType: 'Condition',
                    sourceResourceId: match.id,
                    sourceCode: match.code.coding?.[0]?.code,
                    sourceCodeDisplay: match.code.text || match.code.coding?.[0]?.display,
                    recordedDate: match.onsetDate || match.recordedDate,
                    reasoning: `Confirmed active diagnosis: ${match.code.text || match.code.coding?.[0]?.display} (ICD-10: ${match.code.coding?.[0]?.code})`
                };
            }
            else {
                return {
                    criterionId: rule.id,
                    criterionName: rule.name,
                    criterionType: rule.type,
                    status: 'FAIL',
                    confidenceScore: 0.95,
                    reasoning: `No active diagnosis found matching ${rule.name} (Target ICD-10: ${rule.systemCode || 'N/A'})`
                };
            }
        }
        if (rule.type === 'EXCLUSION') {
            if (match) {
                return {
                    criterionId: rule.id,
                    criterionName: rule.name,
                    criterionType: rule.type,
                    status: 'FAIL',
                    confidenceScore: 0.99,
                    sourceResourceType: 'Condition',
                    sourceResourceId: match.id,
                    sourceCode: match.code.coding?.[0]?.code,
                    sourceCodeDisplay: match.code.text || match.code.coding?.[0]?.display,
                    recordedDate: match.onsetDate,
                    reasoning: `EXCLUSION TRIGGERED: Patient has documented history/condition: ${match.code.text || match.code.coding?.[0]?.display}`
                };
            }
            else {
                return {
                    criterionId: rule.id,
                    criterionName: rule.name,
                    criterionType: rule.type,
                    status: 'PASS',
                    confidenceScore: 0.92,
                    reasoning: `No record of exclusionary condition ${rule.name} found in patient history.`
                };
            }
        }
    }
    if (rule.category === 'LABORATORY') {
        const targetLoinc = rule.systemCode;
        const match = observations.find(obs => {
            const codeMatch = obs.code.coding?.some(c => c.code === targetLoinc);
            const textMatch = obs.code.text?.toLowerCase().includes(rule.name.toLowerCase()) ||
                obs.code.coding?.some(c => c.display?.toLowerCase().includes(rule.name.toLowerCase()));
            return codeMatch || textMatch;
        });
        if (!match) {
            return {
                criterionId: rule.id,
                criterionName: rule.name,
                criterionType: rule.type,
                status: 'INCONCLUSIVE',
                confidenceScore: 0.2,
                reasoning: `No recent observation found in EHR matching ${rule.name} (LOINC: ${rule.systemCode || 'N/A'}). Manual chart review or repeat panel required.`
            };
        }
        if (rule.thresholdString) {
            const valStr = (match.valueString || match.valueCodeableConcept?.text || '').toUpperCase();
            const interpStr = match.interpretation?.[0]?.coding?.[0]?.code?.toUpperCase() || '';
            const isPositive = valStr.includes('POS') || interpStr === 'POS' || valStr.includes('DETECTED');
            const targetExpectsPositive = rule.thresholdString.toUpperCase().includes('POS');
            let passed = targetExpectsPositive ? isPositive : !isPositive;
            let status = passed ? 'PASS' : 'FAIL';
            if (rule.type === 'EXCLUSION') {
                status = passed ? 'FAIL' : 'PASS';
            }
            return {
                criterionId: rule.id,
                criterionName: rule.name,
                criterionType: rule.type,
                status,
                confidenceScore: 0.98,
                sourceResourceType: 'Observation',
                sourceResourceId: match.id,
                sourceCode: match.code.coding?.[0]?.code,
                sourceCodeDisplay: match.code.text || match.code.coding?.[0]?.display,
                recordedDate: match.effectiveDateTime,
                valueObserved: match.valueString || (isPositive ? 'Positive' : 'Negative'),
                reasoning: `Observed result: ${match.valueString || (isPositive ? 'Positive' : 'Negative')} (Expected: ${rule.thresholdString})`
            };
        }
        if (match.valueQuantity !== undefined) {
            const val = match.valueQuantity.value;
            const unit = match.valueQuantity.unit;
            let passesComparison = false;
            if (rule.operator === '>=' && rule.thresholdValue !== undefined) {
                passesComparison = val >= rule.thresholdValue;
            }
            else if (rule.operator === '<=' && rule.thresholdValue !== undefined) {
                passesComparison = val <= rule.thresholdValue;
            }
            else if (rule.operator === '>' && rule.thresholdValue !== undefined) {
                passesComparison = val > rule.thresholdValue;
            }
            else if (rule.operator === '<' && rule.thresholdValue !== undefined) {
                passesComparison = val < rule.thresholdValue;
            }
            else if (rule.operator === 'BETWEEN' && rule.thresholdRange) {
                passesComparison = val >= rule.thresholdRange.min && val <= rule.thresholdRange.max;
            }
            let status = 'PASS';
            if (rule.type === 'INCLUSION') {
                status = passesComparison ? 'PASS' : 'FAIL';
            }
            else {
                status = passesComparison ? 'FAIL' : 'PASS';
            }
            const refRangeStr = match.referenceRange?.[0]
                ? `${match.referenceRange[0].low?.value ?? 0} - ${match.referenceRange[0].high?.value ?? 'N/A'} ${unit}`
                : undefined;
            return {
                criterionId: rule.id,
                criterionName: rule.name,
                criterionType: rule.type,
                status,
                confidenceScore: 0.99,
                sourceResourceType: 'Observation',
                sourceResourceId: match.id,
                sourceCode: match.code.coding?.[0]?.code,
                sourceCodeDisplay: match.code.text || match.code.coding?.[0]?.display,
                recordedDate: match.effectiveDateTime,
                valueObserved: `${val.toLocaleString()} ${unit}`,
                unitObserved: unit,
                referenceRangeText: refRangeStr,
                reasoning: rule.type === 'INCLUSION'
                    ? (passesComparison
                        ? `Laboratory result ${val} ${unit} meets requirement (${rule.operator} ${rule.thresholdRange ? `${rule.thresholdRange.min}-${rule.thresholdRange.max}` : rule.thresholdValue} ${rule.expectedUnit || unit})`
                        : `Laboratory result ${val} ${unit} fails requirement (${rule.operator} ${rule.thresholdRange ? `${rule.thresholdRange.min}-${rule.thresholdRange.max}` : rule.thresholdValue} ${rule.expectedUnit || unit})`)
                    : (passesComparison
                        ? `EXCLUSION TRIGGERED: Measured value ${val} ${unit} exceeds safety threshold (${rule.operator} ${rule.thresholdValue} ${unit})`
                        : `Within safe limit: ${val} ${unit} did not trigger exclusion`)
            };
        }
    }
    if (rule.category === 'MEDICATION') {
        if (rule.operator === 'WITHIN_DAYS' && rule.timeWindowDays) {
            const recentMed = medications.find(m => {
                const days = getDaysAgo(m.authoredOn);
                return days <= (rule.timeWindowDays ?? 28);
            });
            if (rule.type === 'EXCLUSION') {
                if (recentMed) {
                    const daysAgo = getDaysAgo(recentMed.authoredOn);
                    return {
                        criterionId: rule.id,
                        criterionName: rule.name,
                        criterionType: rule.type,
                        status: 'FAIL',
                        confidenceScore: 0.95,
                        sourceResourceType: 'MedicationRequest',
                        sourceResourceId: recentMed.id,
                        sourceCodeDisplay: recentMed.medicationCodeableConcept.text || recentMed.medicationCodeableConcept.coding?.[0]?.display,
                        recordedDate: recentMed.authoredOn,
                        valueObserved: `Administered ${daysAgo} days ago`,
                        reasoning: `WASHOUT VIOLATION: Patient received ${recentMed.medicationCodeableConcept.text || 'prohibited therapy'} ${daysAgo} days ago (minimum required washout: ${rule.timeWindowDays} days)`
                    };
                }
                else {
                    return {
                        criterionId: rule.id,
                        criterionName: rule.name,
                        criterionType: rule.type,
                        status: 'PASS',
                        confidenceScore: 0.90,
                        reasoning: `No prohibited medication orders found within the last ${rule.timeWindowDays} days.`
                    };
                }
            }
        }
    }
    if (rule.category === 'CLINICAL_NOTE') {
        const searchTarget = (rule.thresholdString || rule.name).toLowerCase();
        let matchedDoc;
        let snippet = '';
        for (const doc of documents) {
            const text = doc.content[0]?.attachment.textSnippet || '';
            const isEcogMatch = /ecog\s*(?:performance\s*status\s*)?[01]/i.test(text);
            if (isEcogMatch) {
                matchedDoc = doc;
                snippet = text;
                break;
            }
            else if (searchTarget && text.toLowerCase().includes(searchTarget)) {
                matchedDoc = doc;
                snippet = text;
                break;
            }
        }
        if (matchedDoc) {
            return {
                criterionId: rule.id,
                criterionName: rule.name,
                criterionType: rule.type,
                status: 'PASS',
                confidenceScore: 0.88,
                sourceResourceType: 'DocumentReference',
                sourceResourceId: matchedDoc.id,
                recordedDate: matchedDoc.date,
                clinicalNoteExcerpt: snippet,
                reasoning: `Clinical note grounding verified: "${snippet.slice(0, 140)}..."`
            };
        }
        else {
            return {
                criterionId: rule.id,
                criterionName: rule.name,
                criterionType: rule.type,
                status: 'MANUAL_REVIEW',
                confidenceScore: 0.45,
                reasoning: `Clinical encounter notes require manual review by research coordinator to confirm ${rule.name}.`
            };
        }
    }
    return {
        criterionId: rule.id,
        criterionName: rule.name,
        criterionType: rule.type,
        status: 'INCONCLUSIVE',
        confidenceScore: 0.3,
        reasoning: 'Evaluation criteria requires specialized data source or clinical review.'
    };
}
function evaluatePatientForTrial(record, protocol) {
    const patient = record?.patient || {};
    const nameObj = patient.name?.[0];
    const given = Array.isArray(nameObj?.given) ? nameObj.given.join(' ') : (nameObj?.given || '');
    const family = nameObj?.family || '';
    const patientName = `${given} ${family}`.trim() || patient.id || 'Unknown Patient';
    const mrn = patient.identifier?.[0]?.value || patient.id || 'N/A';
    const criteriaList = Array.isArray(protocol?.criteria) ? protocol.criteria : [];
    const results = criteriaList.map(rule => evaluateCriterion(rule, record));
    const inclusions = results.filter(r => r.criterionType === 'INCLUSION');
    const exclusions = results.filter(r => r.criterionType === 'EXCLUSION');
    const inclusionMetCount = inclusions.filter(r => r.status === 'PASS').length;
    const inclusionTotalCount = inclusions.length;
    const exclusionTriggeredCount = exclusions.filter(r => r.status === 'FAIL').length;
    const exclusionTotalCount = exclusions.length;
    const inconclusiveCount = results.filter(r => r.status === 'INCONCLUSIVE' || r.status === 'MANUAL_REVIEW').length;
    const blockerReasons = [];
    for (const inc of inclusions) {
        if (inc.status === 'FAIL') {
            blockerReasons.push(`Failed Inclusion: ${inc.criterionName} - ${inc.reasoning}`);
        }
    }
    for (const exc of exclusions) {
        if (exc.status === 'FAIL') {
            blockerReasons.push(`Exclusion Triggered: ${exc.criterionName} - ${exc.reasoning}`);
        }
    }
    let overallStatus = 'ELIGIBLE';
    if (blockerReasons.length > 0) {
        overallStatus = 'INELIGIBLE';
    }
    else if (inconclusiveCount > 0) {
        overallStatus = 'NEEDS_REVIEW';
    }
    else if (inclusionMetCount === inclusionTotalCount && exclusionTriggeredCount === 0) {
        overallStatus = 'ELIGIBLE';
    }
    else {
        overallStatus = 'NEEDS_REVIEW';
    }
    const matchScore = inclusionTotalCount > 0
        ? Math.round((inclusionMetCount / inclusionTotalCount) * 100)
        : 0;
    return {
        patientId: patient.id,
        patientName,
        mrn,
        trialId: protocol.id,
        trialTitle: protocol.shortTitle,
        overallStatus,
        matchScore: overallStatus === 'INELIGIBLE' ? Math.min(matchScore, 65) : matchScore,
        evaluatedAt: new Date().toISOString(),
        inclusionMetCount,
        inclusionTotalCount,
        exclusionMetCount: exclusionTriggeredCount,
        exclusionTotalCount,
        inconclusiveCount,
        criteriaResults: results,
        blockerReasons,
        reviewStatus: overallStatus === 'ELIGIBLE' ? 'CLEARED' : overallStatus === 'INELIGIBLE' ? 'REJECTED' : 'PENDING'
    };
}
//# sourceMappingURL=criteriaEngine.js.map