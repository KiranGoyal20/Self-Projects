"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProtocolText = parseProtocolText;
function parseProtocolText(rawText) {
    const rules = [];
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    let currentType = 'INCLUSION';
    let counter = 1;
    for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes('inclusion criteria') || lower.startsWith('inclusion')) {
            currentType = 'INCLUSION';
            continue;
        }
        if (lower.includes('exclusion criteria') || lower.startsWith('exclusion')) {
            currentType = 'EXCLUSION';
            continue;
        }
        if (line.length < 5 || lower.startsWith('protocol') || lower.startsWith('phase')) {
            continue;
        }
        const cleaned = line.replace(/^(\d+\.|\*|-|•)\s*/, '');
        let category = 'CONDITION';
        let operator = 'EXISTS';
        let thresholdValue;
        let thresholdRange;
        let thresholdString;
        let systemCode;
        let systemName;
        let expectedUnit;
        let timeWindowDays;
        let name = cleaned.slice(0, 60);
        const cleanLower = cleaned.toLowerCase();
        if (cleanLower.includes('age') && (cleanLower.includes('year') || cleanLower.includes('yr'))) {
            category = 'DEMOGRAPHICS';
            name = 'Patient Age Criteria';
            const betweenMatch = cleanLower.match(/(\d+)\s*(to|-)\s*(\d+)/);
            const gteMatch = cleanLower.match(/>=\s*(\d+)|at least\s*(\d+)|aged?\s*(\d+)\s*and older/);
            if (betweenMatch) {
                operator = 'BETWEEN';
                thresholdRange = { min: parseInt(betweenMatch[1]), max: parseInt(betweenMatch[3]) };
            }
            else if (gteMatch) {
                operator = '>=';
                thresholdValue = parseInt(gteMatch[1] || gteMatch[2] || gteMatch[3]);
            }
        }
        else if (cleanLower.includes('anc') || cleanLower.includes('neutrophil')) {
            category = 'LABORATORY';
            name = 'Absolute Neutrophil Count (ANC)';
            systemName = 'LOINC';
            systemCode = '26499-4';
            expectedUnit = '/uL';
            operator = '>=';
            const valMatch = cleanLower.match(/>=\s*([0-9,]+)/);
            if (valMatch) {
                thresholdValue = parseInt(valMatch[1].replace(/,/g, ''));
            }
            else {
                thresholdValue = 1500;
            }
        }
        else if (cleanLower.includes('platelet')) {
            category = 'LABORATORY';
            name = 'Platelet Count';
            systemName = 'LOINC';
            systemCode = '777-3';
            expectedUnit = '/uL';
            operator = '>=';
            const valMatch = cleanLower.match(/>=\s*([0-9,]+)/);
            if (valMatch) {
                thresholdValue = parseInt(valMatch[1].replace(/,/g, ''));
            }
            else {
                thresholdValue = 100000;
            }
        }
        else if (cleanLower.includes('egfr') || cleanLower.includes('glomerular filtration') || cleanLower.includes('creatinine')) {
            category = 'LABORATORY';
            name = 'Adequate Renal Function (eGFR)';
            systemName = 'LOINC';
            systemCode = '33914-3';
            expectedUnit = 'mL/min/1.73m2';
            const betweenMatch = cleanLower.match(/(\d+)\s*(to|-)\s*(\d+)/);
            const gteMatch = cleanLower.match(/>=\s*(\d+)/);
            if (betweenMatch) {
                operator = 'BETWEEN';
                thresholdRange = { min: parseInt(betweenMatch[1]), max: parseInt(betweenMatch[3]) };
            }
            else if (gteMatch) {
                operator = '>=';
                thresholdValue = parseInt(gteMatch[1]);
            }
            else {
                operator = '>=';
                thresholdValue = 60;
            }
        }
        else if (cleanLower.includes('hba1c') || cleanLower.includes('glycated hemoglobin')) {
            category = 'LABORATORY';
            name = 'Glycemic Control (HbA1c)';
            systemName = 'LOINC';
            systemCode = '4548-4';
            expectedUnit = '%';
            const betweenMatch = cleanLower.match(/(\d+(\.\d+)?)\s*(%|\s)?\s*(to|-)\s*(\d+(\.\d+)?)/);
            if (betweenMatch) {
                operator = 'BETWEEN';
                thresholdRange = { min: parseFloat(betweenMatch[1]), max: parseFloat(betweenMatch[5]) };
            }
        }
        else if (cleanLower.includes('egfr') || cleanLower.includes('mutation') || cleanLower.includes('cd19')) {
            category = 'LABORATORY';
            name = cleanLower.includes('cd19') ? 'CD19+ Tumor Expression' : 'EGFR Activating Mutation';
            systemName = 'LOINC';
            systemCode = cleanLower.includes('cd19') ? '55447-7' : '48000-4';
            operator = '==';
            thresholdString = 'POSITIVE';
        }
        else if (cleanLower.includes('brain') || cleanLower.includes('cns') || cleanLower.includes('leptomeningeal')) {
            category = 'CONDITION';
            name = 'Central Nervous System (CNS) Metastases';
            systemName = 'ICD-10';
            systemCode = 'C79.31';
            operator = 'EXISTS';
        }
        else if (cleanLower.includes('washout') || cleanLower.includes('chemotherapy') || cleanLower.includes('systemic therapy')) {
            category = 'MEDICATION';
            name = 'Prior Systemic Chemotherapy Washout';
            systemName = 'RxNorm';
            systemCode = 'CHEMO';
            operator = 'WITHIN_DAYS';
            const daysMatch = cleanLower.match(/(\d+)\s*(day|days)/);
            timeWindowDays = daysMatch ? parseInt(daysMatch[1]) : 28;
        }
        else if (cleanLower.includes('ecog') || cleanLower.includes('karnofsky')) {
            category = 'CLINICAL_NOTE';
            name = 'ECOG Performance Status 0 or 1';
            operator = 'CONTAINS_TEXT';
            thresholdString = 'ECOG 0 or 1';
        }
        else {
            category = 'CONDITION';
            systemName = 'ICD-10';
            systemCode = cleanLower.includes('lung') ? 'C34' : cleanLower.includes('diabet') ? 'E11' : 'C83.3';
            operator = 'EXISTS';
        }
        rules.push({
            id: `parsed-${currentType.toLowerCase().slice(0, 3)}-${counter++}`,
            type: currentType,
            category,
            name,
            description: cleaned,
            operator,
            thresholdValue,
            thresholdRange,
            thresholdString,
            systemName,
            systemCode,
            expectedUnit,
            timeWindowDays,
            requiredForEligibility: true
        });
    }
    return rules;
}
//# sourceMappingURL=protocolParser.js.map