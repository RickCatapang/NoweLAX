// export interface MultipleChoicePromptOptions {
//   topic: string;
//   subject: string;
//   questionCount: number;
// }

// function clean(value: string): string {
//   return value.trim();
// }

// export function generateMultipleChoicePrompt({
//   topic,
//   subject,
//   questionCount,
// }: MultipleChoicePromptOptions): string {
//   const normalizedTopic = clean(topic);
//   const normalizedSubject = clean(subject);

//   return `You are an expert assessment-question writer, academic researcher, psychometrician, and subject-matter specialist.

// Your task is to create ${questionCount} high-quality multiple-choice questions about:

// Topic / Category:
// ${normalizedTopic}

// Specific Subject:
// ${normalizedSubject}

// ==================================================
// CORE PRINCIPLE: EXAMINATION-BLUEPRINT-FIRST
// ==================================================

// This is NOT a generic question-generation task.

// If the requested topic or subject is associated with a professional examination, licensure examination, certification examination, national examination, regulated profession, university curriculum, or formal competency framework, you MUST first identify the authoritative examination or curriculum blueprint before generating questions.

// The examination blueprint takes precedence over general assumptions about what is "important" in the subject.

// BEFORE GENERATING ANY QUESTION:

// 1. Locate the most recent applicable official:
//    - Table of Specifications (TOS)
//    - examination syllabus
//    - competency framework
//    - examination program
//    - curriculum
//    - professional regulatory document
//    - official subject outline
//    - or equivalent authoritative assessment specification.

// 2. Identify:
//    - the exact subject scope;
//    - major domains;
//    - subdomains;
//    - competencies;
//    - learning outcomes;
//    - cognitive levels;
//    - item distributions or weighting;
//    - terminology;
//    - jurisdiction-specific requirements.

// 3. Build an INTERNAL assessment blueprint for the requested ${questionCount} questions.

// 4. Map every generated question to an appropriate competency and cognitive level.

// 5. Only after completing this internal blueprint should you generate the questions.

// DO NOT simply generate questions from general knowledge of the subject.

// DO NOT substitute a generic textbook chapter outline for an official examination blueprint when an official blueprint is available.

// If an official blueprint is unavailable, use the strongest available authoritative academic and professional sources and clearly base the question design on those sources. Do not pretend that an unofficial topic distribution is an official examination distribution.

// ==================================================
// PHILIPPINE LICENSURE EXAMINATION REQUIREMENT
// ==================================================

// If the requested examination is Philippine-specific, treat the Philippine jurisdiction as mandatory.

// Prioritize authoritative Philippine sources, including where applicable:

// * Professional Regulation Commission (PRC)
// * Professional Regulatory Boards
// * Official Philippine government agencies
// * Official examination Tables of Specifications
// * Official examination syllabi and program documents
// * Republic Acts and other applicable laws
// * Official rules and regulations
// * Department of Agriculture publications
// * Bureau of Plant Industry and other appropriate government agencies
// * Philippine state universities and recognized academic institutions
// * Official professional organizations
// * Peer-reviewed scientific literature
// * Recognized academic textbooks and reference works

// For Philippine licensure examinations:

// * Use Philippine terminology where applicable.
// * Use Philippine agricultural conditions where relevant.
// * Use Philippine crops, production systems, standards, and practices when supported by authoritative sources.
// * Do not automatically import terminology, practices, laws, standards, varieties, or recommendations from the United States or other countries.
// * If a foreign scientific principle is universal, it may be used when appropriate, but the question must remain consistent with the Philippine examination context.
// * Do not invent Philippine-specific practices merely to make a question appear localized.

// ==================================================
// RESEARCH REQUIREMENT
// ==================================================

// Research and verify the subject BEFORE generating the questions.

// Use web search, official documents, academic databases, peer-reviewed literature, government publications, recognized textbooks, or other reliable sources when available.

// SOURCE PRIORITY:

// 1. Official examination documents and regulatory authorities
// 2. Philippine government agencies
// 3. Official laws, rules, and regulations
// 4. State universities and recognized academic institutions
// 5. Peer-reviewed scientific literature
// 6. Recognized academic textbooks
// 7. Established professional organizations
// 8. Other reputable educational sources

// Avoid relying primarily on:

// * blogs
// * anonymous websites
// * forums
// * social media
// * question banks of unknown origin
// * AI-generated summaries
// * SEO articles
// * unsourced study materials

// When sources disagree:

// 1. Prefer the authoritative source.
// 2. Prefer the most recent applicable source.
// 3. Consider the jurisdiction.
// 4. Consider whether the information is cultivar-, environment-, location-, or production-system dependent.
// 5. Do not combine conflicting claims into one question.
// 6. If the conflict cannot be resolved reliably, DO NOT use the disputed fact as the basis of a question.

// Never invent:

// * laws
// * regulations
// * examination requirements
// * statistics
// * scientific findings
// * terminology
// * organizations
// * crop varieties
// * recommended practices
// * dates
// * numerical values
// * production standards
// * procedures
// * citations

// ==================================================
// QUESTION BLUEPRINT REQUIREMENT
// ==================================================

// Before generating the final questions, internally construct an assessment blueprint containing at minimum:

// * domain
// * competency
// * subtopic
// * cognitive level
// * intended difficulty
// * question type
// * number of questions

// The final question set must represent the official examination blueprint as closely as possible.

// If the official examination contains a specified cognitive-level distribution, preserve that distribution proportionally for ${questionCount} questions.

// If the requested ${questionCount} differs from the official examination item count, scale the distribution proportionally rather than inventing a new distribution.

// Do NOT arbitrarily divide questions equally among topics.

// Do NOT assume every topic deserves the same number of questions.

// The official examination blueprint determines relative emphasis whenever such information is available.

// ==================================================
// COGNITIVE-LEVEL REQUIREMENT
// ==================================================

// When an official TOS provides cognitive levels, follow them.

// Prioritize higher-order and competency-based questions when the official blueprint requires them.

// Use a meaningful mixture of:

// * Remembering
// * Understanding
// * Applying
// * Analyzing
// * Evaluating
// * Creating

// Do not turn an application-oriented competency into a simple definition question.

// For technical subjects, particularly prioritize:

// * application
// * analysis
// * interpretation
// * diagnosis
// * comparison
// * quantitative problem solving
// * decision making
// * evaluation of alternatives
// * prediction of outcomes

// A technically correct question is not automatically a good examination question.

// The question must assess a meaningful competency.

// ==================================================
// TECHNICAL DEPTH REQUIREMENT
// ==================================================

// For technical and scientific subjects, questions must demonstrate genuine subject-matter depth.

// Avoid superficial questions that can be answered through general common knowledge alone.

// Where appropriate, questions should require the examinee to:

// * apply scientific principles;
// * interpret technical information;
// * analyze a field or laboratory situation;
// * diagnose a production problem;
// * select an appropriate management practice;
// * compare technical alternatives;
// * predict the consequence of a management decision;
// * interpret physiological responses;
// * perform appropriate calculations;
// * identify relationships between variables;
// * evaluate competing management options;
// * apply principles to realistic scenarios.

// For Crop Science or similarly technical agricultural subjects, where supported by the official blueprint, consider competencies involving:

// * crop classification;
// * botanical and economic classification;
// * scientific names and crop families;
// * crop morphology;
// * crop anatomy;
// * plant physiology;
// * photosynthesis;
// * respiration;
// * transpiration;
// * plant-water relations;
// * mineral nutrition;
// * plant growth and development;
// * plant hormones and growth regulators;
// * photoperiodism;
// * flowering;
// * reproductive biology;
// * seed dormancy and germination;
// * source-sink relationships;
// * genetics;
// * Mendelian principles;
// * genetic variation;
// * heritability;
// * selection;
// * hybridization;
// * heterosis;
// * plant breeding;
// * biotechnology;
// * seed quality;
// * seed viability;
// * seed vigor;
// * germination;
// * seed purity;
// * seed production;
// * crop establishment;
// * direct seeding;
// * transplanting;
// * plant population;
// * spacing;
// * seeding rate;
// * site selection;
// * environmental adaptation;
// * crop management;
// * irrigation and water management;
// * nutrient management;
// * crop-specific production practices;
// * harvesting;
// * interpretation of field observations.

// IMPORTANT:

// Only include these areas when they are actually within the official scope of the requested examination.

// Do not force technical calculations into topics where calculations are inappropriate.

// Do not force Philippine-specific details where reliable Philippine evidence is unavailable.

// ==================================================
// SUBJECT-BOUNDARY REQUIREMENT
// ==================================================

// Every question must primarily test the requested subject.

// For example, when generating Philippine ALE Crop Science questions, do not simply generate generic "agriculture" questions.

// A question can be agriculturally relevant but still belong primarily to another ALE subject.

// Avoid questions whose primary competency belongs to:

// * Agricultural Economics
// * Agricultural Extension
// * Animal Science
// * Soil Science
// * Agricultural Engineering
// * Agricultural Education
// * Agricultural Chemistry
// * other separate examination subjects

// UNLESS the official Crop Science competency explicitly requires integration with that discipline.

// When interdisciplinary knowledge is necessary, Crop Science must remain the primary competency being assessed.

// ==================================================
// PHILIPPINE CROP SCIENCE CONTEXT
// ==================================================

// When the requested subject is Philippine Crop Science, prioritize technically relevant Philippine conditions where appropriate.

// Examples of contextualization may include:

// * tropical production environments;
// * Philippine cropping systems;
// * economically important Philippine crops;
// * local production constraints;
// * crop adaptation to environmental conditions;
// * appropriate planting systems;
// * crop establishment methods;
// * locally relevant crop management decisions.

// However:

// Do not insert Philippine names, varieties, statistics, government programs, or production recommendations merely for localization.

// Every such detail must be supported by an authoritative source.

// The scientific principle must remain correct regardless of superficial localization.

// ==================================================
// QUANTITATIVE QUESTION REQUIREMENT
// ==================================================

// Where the official competency naturally supports quantitative assessment, include appropriate numerical problems.

// Possible examples include, when relevant:

// * plant population;
// * spacing;
// * seeding rate;
// * germination percentage;
// * seed purity;
// * genetic ratios;
// * probability;
// * yield calculations;
// * physiological relationships;
// * other scientifically valid calculations.

// Requirements for quantitative questions:

// * All numerical values must be internally consistent.
// * Units must be clearly stated.
// * The calculation must have one objectively correct result.
// * Do not require assumptions that are not stated.
// * Do not introduce unnecessary arithmetic difficulty that obscures the actual competency.
// * Verify every calculation independently before including the question.

// Do not fabricate numerical constants, coefficients, thresholds, or recommended rates.

// ==================================================
// SCENARIO AND APPLICATION REQUIREMENT
// ==================================================

// When appropriate, use realistic technical scenarios.

// Good scenarios should contain enough information for the examinee to reason toward one answer.

// For example, a technical question may describe:

// * crop condition;
// * soil or environmental condition;
// * developmental stage;
// * production objective;
// * management constraint;
// * observed physiological response;
// * genetic situation;
// * seed-quality problem;
// * field-management problem.

// Then ask the examinee to determine the most appropriate action, interpretation, diagnosis, or conclusion.

// Do not make scenarios unnecessarily long.

// Every included detail should serve a purpose.

// ==================================================
// QUESTION QUALITY REQUIREMENTS
// ==================================================

// Every question must:

// 1. Assess a specific competency.
// 2. Have one clearly defensible correct answer.
// 3. Be factually accurate.
// 4. Be supported by reliable evidence.
// 5. Use technically appropriate terminology.
// 6. Be appropriate for the intended examination level.
// 7. Avoid unnecessary ambiguity.
// 8. Avoid hidden assumptions.
// 9. Avoid dependence on obscure trivia unless the competency explicitly requires it.
// 10. Avoid testing facts outside the requested subject.
// 11. Avoid excessive repetition.
// 12. Avoid clues that reveal the answer.
// 13. Avoid wording that makes one choice obviously correct.
// 14. Avoid grammatical inconsistencies between the stem and choices.
// 15. Avoid culturally or jurisdictionally inappropriate assumptions.

// ==================================================
// DISTRACTOR REQUIREMENTS
// ==================================================

// Distractors must be plausible.

// Good distractors should represent:

// * common misconceptions;
// * incorrect applications of the same principle;
// * confusion between closely related concepts;
// * technically plausible but incorrect decisions;
// * incorrect calculations;
// * incorrect interpretation of the scenario.

// Do NOT create obviously ridiculous distractors.

// Do NOT make the correct answer:

// * noticeably longer;
// * more detailed;
// * more technical;
// * grammatically superior;
// * more qualified;
// * or otherwise visually identifiable

// than the distractors.

// All four choices should be reasonably comparable in structure and specificity.

// Never use:

// * "All of the above"
// * "None of the above"

// unless the subject and assessment objective genuinely require such a format.

// ==================================================
// QUESTION VARIETY
// ==================================================

// Avoid generating ${questionCount} questions using the same template.

// Vary appropriately among:

// * direct technical concepts;
// * application problems;
// * calculations;
// * field scenarios;
// * diagnosis;
// * comparison;
// * interpretation;
// * cause-and-effect;
// * prediction;
// * classification;
// * selection of management practices;
// * genetics problems;
// * physiological reasoning;
// * crop-specific situations;
// * experimental interpretation;
// * decision-making.

// Do not sacrifice technical accuracy merely to increase variety.

// ==================================================
// DIFFICULTY DISTRIBUTION
// ==================================================

// When an official TOS specifies difficulty or cognitive distribution, follow it.

// Otherwise create a realistic examination-preparation distribution containing:

// * foundational questions;
// * intermediate application questions;
// * difficult analytical questions;
// * higher-order decision-making questions.

// Do not make every question extremely difficult.

// Do not make the set predominantly simple recall questions.

// Difficulty should arise from the competency and reasoning required, NOT from obscure wording.

// ==================================================
// SOURCE-TO-QUESTION TRACEABILITY
// ==================================================

// Before accepting each question, internally identify the authoritative source or sources supporting the underlying fact, principle, calculation, or recommended practice.

// Do not include a question if its correct answer cannot be reliably supported.

// For questions involving:

// * laws;
// * regulations;
// * official standards;
// * government programs;
// * official classifications;
// * current recommendations;
// * examination requirements;

// use primary official sources whenever possible.

// For scientific principles, use authoritative academic or peer-reviewed sources.

// Do not fabricate citations.

// The final output does not need to expose the research sources unless explicitly requested, but every question must have a defensible research basis.

// ==================================================
// ACCURACY REQUIREMENTS
// ==================================================

// Before including a question:

// 1. Verify the underlying fact or concept.
// 2. Verify that it belongs to the requested subject.
// 3. Verify that it belongs to the examination competency when an official blueprint exists.
// 4. Verify that the correct answer is objectively correct.
// 5. Verify that the other three choices are objectively incorrect under the stated conditions.
// 6. Verify calculations independently.
// 7. Check for alternate interpretations.
// 8. Check whether the answer changes according to cultivar, species, environment, developmental stage, production system, or other conditions.
// 9. Specify necessary conditions in the question when they materially affect the answer.
// 10. Avoid outdated information when a newer authoritative source supersedes it.
// 11. Ensure Philippine-specific claims are actually applicable to the Philippines.
// 12. Ensure terminology matches authoritative usage.
// 13. Ensure the explanation is consistent with the question.
// 14. Ensure the hint does not accidentally reveal the answer.

// ==================================================
// EXPLANATION REQUIREMENT
// ==================================================

// Every question must include an explanation.

// The explanation must:

// * identify why the correct answer is correct;
// * explain the relevant scientific or technical principle;
// * be concise but academically useful;
// * help the learner understand the competency;
// * remain consistent with the question's conditions;
// * avoid introducing new unsupported claims;
// * avoid relying on information that was not necessary to answer the question.

// For calculation questions, explain the essential calculation or reasoning.

// For scenario questions, explain why the selected action or interpretation is appropriate under the stated conditions.

// ==================================================
// HINT REQUIREMENT
// ==================================================

// Every question must include a useful hint.

// The hint must:

// * help the learner reason toward the answer;
// * point toward the relevant principle;
// * avoid simply restating the question;
// * avoid stating the correct answer;
// * avoid using the answer choice wording;
// * avoid explicitly revealing the answer label;
// * avoid introducing additional facts that create ambiguity.

// A good hint should guide reasoning, not provide the solution.

// ==================================================
// SECOND-PASS ACADEMIC REVIEW
// ==================================================

// After generating the complete question set, perform an independent second-pass review.

// Treat the first generated version as a draft.

// For EVERY question, verify:

// 1. Subject relevance
// 2. Examination relevance
// 3. Competency alignment
// 4. Cognitive-level alignment
// 5. Scientific accuracy
// 6. Factual accuracy
// 7. Philippine/jurisdictional appropriateness
// 8. One-best-answer validity
// 9. Distractor validity
// 10. Technical depth
// 11. Absence of hidden assumptions
// 12. Explanation accuracy
// 13. Hint quality
// 14. Non-repetition
// 15. Appropriate difficulty

// If a question fails any of these checks, REWRITE or REPLACE it before returning the final dataset.

// Do not keep a questionable question merely to reach the requested question count.

// ==================================================
// REJECT-AND-REPLACE RULE
// ==================================================

// Internally reject and regenerate any question that:

// * is primarily trivia;
// * is outside the official subject scope;
// * is not mapped to a relevant competency;
// * has more than one reasonably defensible answer;
// * has no defensible answer;
// * depends on an unstated assumption;
// * relies on an unsupported fact;
// * uses outdated information without justification;
// * uses ambiguous terminology;
// * depends on a regional practice without specifying the region;
// * depends on cultivar/species differences without specifying the relevant crop;
// * contains an incorrect calculation;
// * has an obviously weak distractor;
// * gives away the answer through wording;
// * is essentially a duplicate of another question;
// * tests another examination subject instead of the requested subject;
// * is scientifically correct but not meaningful for the examination;
// * is artificially difficult because of confusing wording rather than technical reasoning.

// ==================================================
// ANSWER-CHOICE DISTRIBUTION
// ==================================================

// Distribute correct answers reasonably across:

// A
// B
// C
// D

// Do not use a simple repeating pattern such as:

// A, B, C, D, A, B, C, D

// Do not cluster correct answers heavily under one label.

// The distribution should appear naturally randomized while remaining reasonably balanced.

// Every question must have exactly ONE correct answer.

// ==================================================
// OUTPUT FORMAT WITH COPY BUTTON
// ==================================================

// CRITICAL:

// Your entire response MUST be formatted as a JSON code block.

// This is the ONLY output format permitted.

// Do NOT include research notes, source lists, explanations of your methodology, commentary, headings, or any other text outside the JSON code block.

// The response MUST:

// 1. Start with:

// \`\`\`json

// 2. Contain one valid JSON object.
// 3. End with:

// \`\`\`

// 4. Contain no text outside the code block.

// ==================================================
// JSON STRUCTURE
// ==================================================

// The JSON inside the code block must follow exactly this structure:

// {
//   "questions": [
//     {
//       "question": "Question text",
//       "choices": [
//         {
//           "label": "A",
//           "content": "Choice text",
//           "isCorrect": false
//         },
//         {
//           "label": "B",
//           "content": "Choice text",
//           "isCorrect": true
//         },
//         {
//           "label": "C",
//           "content": "Choice text",
//           "isCorrect": false
//         },
//         {
//           "label": "D",
//           "content": "Choice text",
//           "isCorrect": false
//         }
//       ],
//       "explanation": "A concise explanation of why the correct answer is correct.",
//       "hint": "A useful hint that helps the learner reason toward the answer without directly giving it away."
//     }
//   ]
// }

// ==================================================
// STRICT FINAL VALIDATION
// ==================================================

// Before returning the response, internally validate the COMPLETE dataset.

// STRUCTURAL VALIDATION:

// * There are exactly ${questionCount} questions.
// * Every question has exactly four choices.
// * Choice labels are exactly A, B, C, and D.
// * Exactly one choice has isCorrect = true.
// * Exactly three choices have isCorrect = false.
// * Every question has non-empty text.
// * Every choice has non-empty content.
// * Every explanation is non-empty.
// * Every hint is non-empty.
// * The JSON is valid.

// ACADEMIC VALIDATION:

// * Every question belongs to the requested subject.
// * Every question aligns with the official examination scope when available.
// * Every question maps to an appropriate competency.
// * The cognitive-level distribution follows the official TOS when available.
// * The topic distribution follows the official TOS when available.
// * Technical questions genuinely test technical understanding.
// * Application and analysis questions actually require reasoning.
// * Quantitative questions have been independently checked.
// * No unsupported facts are used.
// * No fabricated laws, statistics, standards, procedures, organizations, or scientific findings are used.
// * Philippine-specific claims are supported and jurisdictionally appropriate.
// * No question unintentionally belongs primarily to another examination subject.
// * No question has multiple defensible answers.
// * No question depends on an unstated assumption.
// * Distractors are plausible and objectively incorrect.
// * Correct answers are reasonably distributed among A, B, C, and D.
// * Questions are not unnecessarily repetitive.
// * Difficulty is appropriate.
// * Explanations are technically accurate.
// * Hints do not reveal the answer.
// * Questions measure competencies rather than merely trivia.

// FINAL QUALITY GATE:

// If any question fails any validation requirement, revise or replace it.

// Do NOT return the dataset until all requirements have been satisfied.

// The final response must contain ONLY the JSON code block and nothing else.`;
// }

export interface MultipleChoicePromptOptions {
  topic: string;
  subject: string;
  questionCount: number;
}

function clean(value: string): string {
  return value.trim();
}

export function generateMultipleChoicePrompt({
  topic,
  subject,
  questionCount,
}: MultipleChoicePromptOptions): string {
  const normalizedTopic = clean(topic);
  const normalizedSubject = clean(subject);

  return `You are an expert assessment-question writer, academic researcher, psychometrician, and subject-matter specialist.

Your task is to create exactly ${questionCount} high-quality multiple-choice questions about:

Topic / Category:
${normalizedTopic}

Specific Subject:
${normalizedSubject}


==================================================
CORE PRINCIPLE: ACCURACY BEFORE COMPLETION
==================================================

The most important requirement is NOT simply producing ${questionCount} questions.

The generated dataset must be:

1. Academically accurate.
2. Relevant to the requested subject.
3. Appropriate for the requested examination or curriculum.
4. Structurally valid JSON.
5. Internally consistent.
6. Composed of questions with exactly ONE correct answer each.

Never sacrifice correctness merely to reach the requested question count.

If a question cannot be made objectively valid, REPLACE IT with another valid question.


==================================================
EXAMINATION-BLUEPRINT-FIRST
==================================================

This is NOT a generic question-generation task.

If the requested topic or subject is associated with a professional examination, licensure examination, certification examination, national examination, regulated profession, university curriculum, or formal competency framework, identify the authoritative examination or curriculum blueprint before generating questions.

The examination blueprint takes precedence over general assumptions about what is important.

BEFORE GENERATING QUESTIONS:

1. Locate the most recent applicable official:
   - Table of Specifications (TOS)
   - examination syllabus
   - competency framework
   - examination program
   - curriculum
   - professional regulatory document
   - official subject outline
   - or equivalent authoritative assessment specification.

2. Identify:
   - subject scope;
   - major domains;
   - subdomains;
   - competencies;
   - learning outcomes;
   - cognitive levels;
   - item distributions or weighting;
   - terminology;
   - jurisdiction-specific requirements.

3. Build an INTERNAL assessment blueprint for ${questionCount} questions.

4. Map every question to an appropriate competency and cognitive level.

5. Generate questions only after the blueprint has been established.

DO NOT simply generate questions from general knowledge.

DO NOT substitute a generic textbook chapter outline for an official examination blueprint when an official blueprint is available.

If an official blueprint is unavailable, use the strongest available authoritative academic and professional sources.

Never claim that an unofficial distribution is an official examination distribution.


==================================================
PHILIPPINE LICENSURE EXAMINATION REQUIREMENT
==================================================

If the requested examination is Philippine-specific, the Philippine jurisdiction is mandatory.

Prioritize authoritative Philippine sources, including where applicable:

* Professional Regulation Commission (PRC)
* Professional Regulatory Boards
* Official Philippine government agencies
* Official examination Tables of Specifications
* Official examination syllabi and program documents
* Republic Acts and applicable laws
* Official rules and regulations
* Department of Agriculture publications
* Bureau of Plant Industry
* Philippine state universities
* Recognized academic institutions
* Official professional organizations
* Peer-reviewed scientific literature
* Recognized academic textbooks

For Philippine licensure examinations:

* Use Philippine terminology where applicable.
* Use Philippine agricultural conditions where relevant.
* Use Philippine crops, production systems, standards, and practices when supported by authoritative sources.
* Do not automatically import foreign laws, standards, practices, varieties, terminology, or recommendations.
* Universal scientific principles may be used when appropriate.
* Do not invent Philippine-specific information merely for localization.


==================================================
RESEARCH REQUIREMENT
==================================================

Research and verify the subject before generating the questions.

Use web search, official documents, academic databases, peer-reviewed literature, government publications, recognized textbooks, or other reliable sources when available.

SOURCE PRIORITY:

1. Official examination documents and regulatory authorities
2. Philippine government agencies
3. Official laws, rules, and regulations
4. State universities and recognized academic institutions
5. Peer-reviewed scientific literature
6. Recognized academic textbooks
7. Established professional organizations
8. Other reputable educational sources

Avoid relying primarily on:

* blogs
* anonymous websites
* forums
* social media
* unknown question banks
* AI-generated summaries
* SEO articles
* unsourced study materials

When sources disagree:

1. Prefer the authoritative source.
2. Prefer the most recent applicable source.
3. Consider jurisdiction.
4. Consider whether the information depends on species, cultivar, environment, location, developmental stage, or production system.
5. Do not combine conflicting claims into one question.
6. If the conflict cannot be reliably resolved, DO NOT use the disputed fact.

Never invent:

* laws
* regulations
* examination requirements
* statistics
* scientific findings
* terminology
* organizations
* crop varieties
* recommended practices
* dates
* numerical values
* production standards
* procedures
* citations


==================================================
QUESTION CONSTRUCTION PROTOCOL
==================================================

THIS PROCESS IS MANDATORY FOR EVERY QUESTION.

For each question, follow this exact internal sequence:

STEP 1 — IDENTIFY THE COMPETENCY

Determine the specific knowledge, skill, concept, or competency being tested.

STEP 2 — DETERMINE THE CORRECT ANSWER

Before writing the four choices, determine the single objectively correct answer.

The correct answer must be independently defensible based on reliable subject knowledge or authoritative evidence.

STEP 3 — WRITE THE QUESTION

Write a clear question that makes the intended competency and necessary conditions explicit.

STEP 4 — CREATE THE DISTRACTORS

Create exactly three plausible but objectively incorrect alternatives.

The distractors must NOT accidentally become correct under the conditions stated in the question.

STEP 5 — ASSIGN CORRECTNESS

Only after the four choices have been finalized, assign:

* exactly ONE choice: "isCorrect": true
* exactly THREE choices: "isCorrect": false

NEVER assign all four choices false.

NEVER assign more than one choice true.

STEP 6 — VERIFY THE ANSWER

Ask internally:

"Can I identify exactly one choice that is objectively correct?"

If NO:

REWRITE THE QUESTION.

If TWO OR MORE choices could reasonably be correct:

REWRITE THE QUESTION or replace the question.

If NONE of the choices is correct:

REWRITE THE QUESTION or replace the question.

STEP 7 — WRITE THE EXPLANATION

The explanation must explicitly support the selected correct answer.

STEP 8 — WRITE THE HINT

The hint must help the learner reason toward the answer without directly revealing it.


==================================================
ONE-BEST-ANSWER REQUIREMENT
==================================================

Every question MUST have exactly one correct answer.

This is a HARD STRUCTURAL REQUIREMENT.

For every question:

correctAnswerCount = number of choices where isCorrect === true

The required value is:

correctAnswerCount === 1

Therefore every question MUST contain:

ONE:
"isCorrect": true

THREE:
"isCorrect": false

The following are INVALID:

INVALID:
A = false
B = false
C = false
D = false

INVALID:
A = true
B = true
C = false
D = false

INVALID:
A = false
B = false
C = true
D = true

VALID:
A = false
B = true
C = false
D = false


==================================================
CHOICE STRUCTURE REQUIREMENT
==================================================

Every question MUST contain exactly four choices.

The choices MUST appear in this exact order:

A
B
C
D

Each choice MUST contain exactly:

* label
* content
* isCorrect

The labels MUST NOT be duplicated.

The labels MUST NOT be omitted.

Do not add additional choice properties.

Required structure:

{
  "label": "A",
  "content": "Choice text",
  "isCorrect": false
}


==================================================
DISTRACTOR REQUIREMENT
==================================================

Distractors must be plausible but objectively incorrect.

Before accepting each distractor, verify:

1. It does not become correct under the stated conditions.
2. It is not merely another valid interpretation.
3. It does not contain a partially correct statement that makes the question ambiguous.
4. It is not correct for a different species, cultivar, environment, developmental stage, or production system unless the question explicitly specifies that distinction.
5. It does not accidentally reproduce the correct answer using different wording.

If a distractor could reasonably be defended as correct, REPLACE IT.


==================================================
TECHNICAL DEPTH REQUIREMENT
==================================================

For technical and scientific subjects, questions should demonstrate genuine subject-matter depth.

Where appropriate, questions should require the examinee to:

* apply scientific principles;
* interpret technical information;
* analyze field or laboratory situations;
* diagnose production problems;
* select appropriate management practices;
* compare technical alternatives;
* predict consequences;
* interpret physiological responses;
* perform calculations;
* identify relationships between variables;
* evaluate competing management options;
* apply principles to realistic scenarios.

Do not force technical calculations into topics where calculations are inappropriate.


==================================================
SUBJECT-BOUNDARY REQUIREMENT
==================================================

Every question must primarily test the requested subject.

For Philippine ALE Crop Science, do not generate generic agriculture questions that primarily belong to:

* Agricultural Economics
* Agricultural Extension
* Animal Science
* Soil Science
* Agricultural Engineering
* Agricultural Education
* Agricultural Chemistry
* other separate examination subjects

unless integration with that discipline is explicitly relevant to the Crop Science competency.

When interdisciplinary knowledge is necessary, Crop Science must remain the primary competency.


==================================================
PHILIPPINE CROP SCIENCE CONTEXT
==================================================

When the requested subject is Philippine Crop Science, prioritize relevant Philippine conditions where appropriate.

Examples:

* tropical production environments;
* Philippine cropping systems;
* economically important Philippine crops;
* local production constraints;
* crop adaptation;
* planting systems;
* crop establishment;
* crop management decisions.

However, do not insert Philippine-specific names, varieties, statistics, government programs, or recommendations merely for localization.

Every such detail must be supported by reliable evidence.


==================================================
QUANTITATIVE QUESTION REQUIREMENT
==================================================

Where the competency naturally supports quantitative assessment, include appropriate numerical problems.

Possible areas include:

* plant population;
* spacing;
* seeding rate;
* germination percentage;
* seed purity;
* genetic ratios;
* probability;
* yield calculations;
* physiological relationships.

For every calculation:

1. Verify the arithmetic independently.
2. Verify the units.
3. Verify that all necessary information is provided.
4. Verify that exactly one answer is numerically correct.
5. Ensure no distractor accidentally equals the correct result.

Do not fabricate numerical constants, coefficients, thresholds, or recommended rates.


==================================================
QUESTION QUALITY REQUIREMENTS
==================================================

Every question must:

1. Assess a specific competency.
2. Have exactly one defensible correct answer.
3. Be factually accurate.
4. Be supported by reliable evidence.
5. Use technically appropriate terminology.
6. Be appropriate for the examination level.
7. Avoid unnecessary ambiguity.
8. Avoid hidden assumptions.
9. Avoid obscure trivia unless required by the competency.
10. Stay within the requested subject.
11. Avoid unnecessary repetition.
12. Avoid clues revealing the answer.
13. Avoid wording that makes one choice obviously correct.
14. Avoid grammatical inconsistencies between stem and choices.
15. Avoid jurisdictionally inappropriate assumptions.


==================================================
QUESTION VARIETY
==================================================

Avoid using the same question structure repeatedly.

Where appropriate, vary among:

* concepts;
* application;
* calculations;
* field scenarios;
* diagnosis;
* comparison;
* interpretation;
* cause-and-effect;
* prediction;
* classification;
* management decisions;
* genetics;
* physiological reasoning;
* crop-specific situations;
* experimental interpretation;
* decision-making.

Do not sacrifice accuracy for variety.


==================================================
DIFFICULTY
==================================================

When an official TOS specifies difficulty or cognitive distribution, follow it.

Otherwise use a realistic mixture of:

* foundational;
* intermediate;
* analytical;
* higher-order decision-making questions.

Difficulty must arise from reasoning and competency, not confusing wording.


==================================================
SOURCE-TO-QUESTION TRACEABILITY
==================================================

Before accepting each question, internally identify the authoritative source or sources supporting its underlying fact, principle, calculation, or recommendation.

Do not include a question if its correct answer cannot be reliably supported.

For laws, regulations, standards, government programs, classifications, current recommendations, and examination requirements, use primary official sources whenever possible.

For scientific principles, use authoritative academic or peer-reviewed sources.

Do not fabricate citations.


==================================================
EXPLANATION REQUIREMENT
==================================================

Every question MUST contain a non-empty explanation.

The explanation must:

* explain why the correct answer is correct;
* explain the relevant principle;
* remain consistent with the question;
* avoid introducing unsupported information;
* not contradict the selected isCorrect value.

CRITICAL CONSISTENCY CHECK:

The explanation MUST support the SAME choice whose isCorrect value is true.

If the explanation supports choice B, but choice C is marked true, the question is INVALID and must be corrected before returning the dataset.


==================================================
HINT REQUIREMENT
==================================================

Every question MUST contain a non-empty hint.

The hint must:

* guide reasoning;
* point toward the relevant principle;
* not directly state the answer;
* not state the answer label;
* not copy the correct choice;
* not introduce contradictory information.


==================================================
ANSWER DISTRIBUTION
==================================================

Distribute correct answers reasonably across A, B, C, and D.

Do not use an obvious repeating pattern such as:

A, B, C, D, A, B, C, D

Do not cluster correct answers excessively under one label.

However:

STRUCTURAL CORRECTNESS ALWAYS TAKES PRIORITY OVER DISTRIBUTION.

Never change a scientifically correct answer merely to improve answer-label distribution.

First make every question valid.

Then review the distribution.


==================================================
SECOND-PASS REVIEW
==================================================

After generating the complete dataset, treat it as a DRAFT and perform a separate second-pass review.

Review EVERY question individually.

For each question, verify:

1. The question exists.
2. The question is non-empty.
3. There are exactly four choices.
4. The labels are exactly A, B, C, D.
5. There are no duplicate labels.
6. Every choice has non-empty content.
7. Every choice has a boolean isCorrect value.
8. Exactly ONE choice has isCorrect === true.
9. Exactly THREE choices have isCorrect === false.
10. The selected correct answer is actually correct.
11. Every distractor is objectively incorrect.
12. No alternate answer is reasonably defensible.
13. The explanation supports the selected correct answer.
14. The hint does not reveal the selected answer.
15. The question belongs to the requested subject.
16. The question belongs to the appropriate examination scope.
17. The question is factually accurate.
18. The question does not contain hidden assumptions.
19. The question is not unnecessarily repetitive.


==================================================
MANDATORY PER-QUESTION STRUCTURAL AUDIT
==================================================

Before returning the final JSON, perform this exact audit for EVERY question.

For question N:

A_true = whether choice A has isCorrect === true
B_true = whether choice B has isCorrect === true
C_true = whether choice C has isCorrect === true
D_true = whether choice D has isCorrect === true

Calculate:

trueCount = A_true + B_true + C_true + D_true

The ONLY acceptable value is:

trueCount = 1

If:

trueCount = 0

then the question MUST be repaired before returning.

If:

trueCount > 1

then the question MUST be repaired before returning.

Do NOT return a question with trueCount = 0.

Do NOT return a question with trueCount = 2, 3, or 4.

This check MUST be performed independently for ALL ${questionCount} questions.


==================================================
FINAL DATASET AUDIT
==================================================

After the per-question audit, verify the complete dataset.

Required:

questions.length === ${questionCount}

For every question:

choices.length === 4

labels === ["A", "B", "C", "D"]

trueCount === 1

falseCount === 3

question is non-empty

every choice content is non-empty

explanation is non-empty

hint is non-empty


==================================================
CRITICAL FAILURE-RECOVERY RULE
==================================================

If ANY question fails ANY structural or academic validation:

DO NOT return the dataset yet.

Instead:

1. Identify the invalid question.
2. Determine why it failed.
3. Repair or completely replace the question.
4. Rebuild its four choices if necessary.
5. Reassign exactly one isCorrect: true.
6. Recheck the explanation.
7. Recheck the hint.
8. Re-run the per-question structural audit.
9. Continue until the question passes.

Do NOT simply change a random choice from false to true without verifying that the newly selected answer is actually correct.

Do NOT return an invalid question merely because ${questionCount} questions are required.


==================================================
FINAL ANSWER-KEY CONSISTENCY CHECK
==================================================

Before returning the JSON, internally determine the answer label for every question from the generated content.

Then compare that answer label against the choice whose:

"isCorrect": true

These MUST match.

For example:

If the academically correct answer is B:

A → false
B → true
C → false
D → false

If the academically correct answer is D:

A → false
B → false
C → false
D → true

If the correct answer cannot be determined with certainty, REPLACE THE QUESTION.


==================================================
OUTPUT FORMAT
==================================================

Your entire response MUST be a JSON code block.

Do NOT include any text outside the JSON code block.

Start with:

\`\`\`json

End with:

\`\`\`

The JSON code block must contain ONLY one JSON object.

No commentary.
No research notes.
No methodology.
No source list.
No headings outside the JSON.


==================================================
REQUIRED JSON STRUCTURE
==================================================

{
  "questions": [
    {
      "question": "Question text",
      "choices": [
        {
          "label": "A",
          "content": "Choice text",
          "isCorrect": false
        },
        {
          "label": "B",
          "content": "Choice text",
          "isCorrect": true
        },
        {
          "label": "C",
          "content": "Choice text",
          "isCorrect": false
        },
        {
          "label": "D",
          "content": "Choice text",
          "isCorrect": false
        }
      ],
      "explanation": "A concise explanation supporting the correct answer.",
      "hint": "A useful hint that guides reasoning without revealing the answer."
    }
  ]
}


==================================================
ABSOLUTE FINAL CHECK
==================================================

DO NOT RETURN THE DATASET UNTIL ALL OF THESE ARE TRUE:

✓ Exactly ${questionCount} questions exist.

✓ Every question has exactly 4 choices.

✓ Every question has labels A, B, C, D in that order.

✓ Every question has exactly ONE choice where isCorrect === true.

✓ Every question has exactly THREE choices where isCorrect === false.

✓ No question has zero correct answers.

✓ No question has multiple correct answers.

✓ The true answer matches the academically correct answer.

✓ Every distractor is objectively incorrect.

✓ Every explanation supports the selected correct answer.

✓ Every hint is non-empty and does not reveal the answer.

✓ Every question is relevant to the requested subject.

✓ Every question is factually defensible.

✓ Every question passes the academic review.

✓ The final JSON is valid.

✓ The response contains ONLY the JSON code block.

If even ONE question fails one of these checks, repair or replace it before returning the response.

NEVER return an incomplete, ambiguous, or structurally invalid question.
`;
}
