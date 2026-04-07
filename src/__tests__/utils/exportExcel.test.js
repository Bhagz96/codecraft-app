import { describe, it, expect } from 'vitest';
import {
  buildUsersSheet,
  buildSessionsSheet,
  buildMABSheet,
  buildAnalysisSheet,
} from '../../utils/exportExcel';

// ── Fixtures ─────────────────────────────────────────────────────────────────

const profiles = [
  { id: 'u1', nus_id: 'E1111111', first_name: 'Alice', last_name: 'Tan', skill_level: 'beginner',     role: 'student' },
  { id: 'u2', nus_id: 'E2222222', first_name: 'Bob',   last_name: 'Lee', skill_level: 'intermediate', role: 'student' },
  { id: 'u3', nus_id: 'E3333333', first_name: 'Cara',  last_name: 'Ng',  skill_level: 'expert',       role: 'student' },
];

const heroMap = {
  u1: { name: 'Aria', level: 2, xp: 150, health: 110, attack: 13, defense: 7, gold: 75 },
  u2: { name: 'Bolt', level: 1, xp: 0,   health: 100, attack: 10, defense: 5, gold: 0  },
  // u3 has no hero
};

const progressMap = {
  u1: { variables: 5, loops: 2, conditions: 0 },
  u2: { variables: 3 },
  // u3 has no progress
};

const sessions = [
  {
    id: 's1', session_id: 'sess-1', user_id: 'u1',
    concept_id: 'variables', level: 1,
    modality: 'codeSimulation', support_strategy: 'try_first_then_hint',
    completed: true, correct_count: 4, total_steps: 5, first_try_count: 3,
    total_attempts: 6, total_hints: 1, scaffold_used: false,
    reward_score: 0.8, time_spent: 120, timestamp: '2026-04-01T10:00:00Z',
  },
  {
    id: 's2', session_id: 'sess-2', user_id: 'u2',
    concept_id: 'loops', level: 2,
    modality: 'dragDrop', support_strategy: 'hint_first',
    completed: false, correct_count: 2, total_steps: 5, first_try_count: 1,
    total_attempts: 8, total_hints: 3, scaffold_used: true,
    reward_score: 0.4, time_spent: 200, timestamp: '2026-04-02T11:00:00Z',
  },
  {
    id: 's3', session_id: 'sess-3', user_id: 'u1',
    concept_id: 'variables', level: 2,
    modality: 'speedCoding', support_strategy: 'try_first_then_hint',
    completed: true, correct_count: 5, total_steps: 5, first_try_count: 5,
    total_attempts: 5, total_hints: 0, scaffold_used: false,
    reward_score: 1.0, time_spent: 90, timestamp: '2026-04-03T12:00:00Z',
  },
];

const profileMap = { u1: profiles[0], u2: profiles[1], u3: profiles[2] };

// ── buildUsersSheet ───────────────────────────────────────────────────────────

describe('buildUsersSheet', () => {
  it('returns one row per profile', () => {
    const rows = buildUsersSheet(profiles, heroMap, progressMap);
    expect(rows).toHaveLength(3);
  });

  it('populates NUS ID, name, and skill level', () => {
    const rows = buildUsersSheet(profiles, heroMap, progressMap);
    expect(rows[0]['NUS ID']).toBe('E1111111');
    expect(rows[0]['First Name']).toBe('Alice');
    expect(rows[0]['Skill Level']).toBe('beginner');
  });

  it('populates hero stats when hero exists', () => {
    const rows = buildUsersSheet(profiles, heroMap, progressMap);
    expect(rows[0]['Hero Name']).toBe('Aria');
    expect(rows[0]['Hero Level']).toBe(2);
    expect(rows[0]['Hero XP']).toBe(150);
  });

  it('leaves hero fields empty when no hero', () => {
    const rows = buildUsersSheet(profiles, heroMap, progressMap);
    const caraRow = rows[2]; // u3 has no hero
    expect(caraRow['Hero Name']).toBe('');
    expect(caraRow['Hero Level']).toBe('');
  });

  it('populates per-concept progress', () => {
    const rows = buildUsersSheet(profiles, heroMap, progressMap);
    expect(rows[0]['Variables (/ 5)']).toBe(5);
    expect(rows[0]['Loops (/ 5)']).toBe(2);
    expect(rows[0]['Conditions (/ 5)']).toBe(0);
  });

  it('calculates total levels completed correctly', () => {
    const rows = buildUsersSheet(profiles, heroMap, progressMap);
    expect(rows[0]['Total Levels Completed']).toBe(7); // 5 + 2 + 0
    expect(rows[1]['Total Levels Completed']).toBe(3); // 3 + 0 + 0
    expect(rows[2]['Total Levels Completed']).toBe(0); // no progress
  });

  it('defaults to 0 for missing concepts', () => {
    const rows = buildUsersSheet(profiles, heroMap, progressMap);
    expect(rows[1]['Loops (/ 5)']).toBe(0);
    expect(rows[1]['Conditions (/ 5)']).toBe(0);
  });
});

// ── buildSessionsSheet ────────────────────────────────────────────────────────

describe('buildSessionsSheet', () => {
  it('returns one row per session', () => {
    const rows = buildSessionsSheet(sessions, profileMap);
    expect(rows).toHaveLength(3);
  });

  it('joins NUS ID and name from profileMap', () => {
    const rows = buildSessionsSheet(sessions, profileMap);
    expect(rows[0]['NUS ID']).toBe('E1111111');
    expect(rows[0]['Name']).toBe('Alice Tan');
    expect(rows[0]['Skill Level']).toBe('beginner');
  });

  it('computes Correct % from correct_count / total_steps', () => {
    const rows = buildSessionsSheet(sessions, profileMap);
    expect(rows[0]['Correct %']).toBe(80); // 4/5 = 80%
    expect(rows[1]['Correct %']).toBe(40); // 2/5 = 40%
  });

  it('formats Completed as Yes/No', () => {
    const rows = buildSessionsSheet(sessions, profileMap);
    expect(rows[0]['Completed']).toBe('Yes');
    expect(rows[1]['Completed']).toBe('No');
  });

  it('uses human-readable modality labels', () => {
    const rows = buildSessionsSheet(sessions, profileMap);
    expect(rows[0]['Modality']).toBe('Code Simulation');
    expect(rows[1]['Modality']).toBe('Drag & Drop');
    expect(rows[2]['Modality']).toBe('Speed Coding');
  });

  it('uses human-readable strategy labels', () => {
    const rows = buildSessionsSheet(sessions, profileMap);
    expect(rows[0]['Support Strategy']).toBe('Try → Hint');
    expect(rows[1]['Support Strategy']).toBe('Hint First');
  });

  it('formats Scaffold Used as Yes/No', () => {
    const rows = buildSessionsSheet(sessions, profileMap);
    expect(rows[0]['Scaffold Used']).toBe('No');
    expect(rows[1]['Scaffold Used']).toBe('Yes');
  });

  it('handles zero total_steps without dividing by zero', () => {
    const zeroSteps = [{ ...sessions[0], total_steps: 0, correct_count: 0 }];
    const rows = buildSessionsSheet(zeroSteps, profileMap);
    expect(rows[0]['Correct %']).toBe(0);
  });
});

// ── buildMABSheet ─────────────────────────────────────────────────────────────

describe('buildMABSheet', () => {
  it('includes a row for each support strategy', () => {
    const rows = buildMABSheet(sessions);
    const strategyRows = rows.filter(r => r['Type'] === 'Support Strategy (MAB)');
    expect(strategyRows).toHaveLength(5); // 5 support strategies
  });

  it('includes a row for each modality', () => {
    const rows = buildMABSheet(sessions);
    const modalityRows = rows.filter(r => r['Type'] === 'Modality (random)');
    expect(modalityRows).toHaveLength(3); // 3 modalities
  });

  it('counts sessions per strategy correctly', () => {
    const rows = buildMABSheet(sessions);
    const tryFirst = rows.find(r => r['Variation'] === 'Try → Hint');
    expect(tryFirst['Total Sessions']).toBe(2); // s1 and s3
  });

  it('counts sessions per modality correctly', () => {
    const rows = buildMABSheet(sessions);
    const codeSim = rows.find(r => r['Variation'] === 'Code Simulation');
    expect(codeSim['Total Sessions']).toBe(1); // s1 only
  });

  it('calculates avg correct % per strategy', () => {
    const rows = buildMABSheet(sessions);
    const tryFirst = rows.find(r => r['Variation'] === 'Try → Hint');
    // s1: 4/5=80%, s3: 5/5=100% → avg = 90%
    expect(tryFirst['Avg Correct %']).toBe(90);
  });
});

// ── buildAnalysisSheet ────────────────────────────────────────────────────────

describe('buildAnalysisSheet', () => {
  it('generates rows for strategy × skill-level combinations that have data', () => {
    const rows = buildAnalysisSheet(sessions, profiles);
    const dataRows = rows.filter(r => r['Sessions'] > 0);
    expect(dataRows.length).toBeGreaterThan(0);
  });

  it('skips strategy × skill-level combinations with no sessions', () => {
    const rows = buildAnalysisSheet(sessions, profiles);
    // u3 (expert) has no sessions — expert rows should not appear
    const expertRows = rows.filter(r => r['Skill Level'] === 'Expert' && r['Sessions'] > 0);
    expect(expertRows).toHaveLength(0);
  });

  it('correctly aggregates sessions for a strategy + skill-level pair', () => {
    const rows = buildAnalysisSheet(sessions, profiles);
    // try_first_then_hint + beginner (u1): s1 (80%) and s3 (100%) → 90% avg correct
    const row = rows.find(r => r['Group'] === 'Try → Hint' && r['Skill Level'] === 'Beginner');
    expect(row).toBeDefined();
    expect(row['Sessions']).toBe(2);
    expect(row['Avg Correct %']).toBe(90);
  });

  it('includes modality × skill-level rows', () => {
    const rows = buildAnalysisSheet(sessions, profiles);
    const modalityRows = rows.filter(r =>
      ['Code Simulation', 'Drag & Drop', 'Speed Coding'].includes(r['Group']) && r['Sessions'] > 0
    );
    expect(modalityRows.length).toBeGreaterThan(0);
  });

  it('marks Avg Reward as — for modality rows', () => {
    const rows = buildAnalysisSheet(sessions, profiles);
    const modalityRow = rows.find(r => r['Group'] === 'Drag & Drop' && r['Sessions'] > 0);
    expect(modalityRow?.['Avg Reward']).toBe('—');
  });
});
