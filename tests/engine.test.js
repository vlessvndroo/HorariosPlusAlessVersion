import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { timeToDec, decToTime, slotsOverlap, checkConflict } from '../src/utils/timeUtils.js';
import { computeCombinations, createDefaultOfferForMode } from '../src/services/schedulerEngine.js';
import { CURRICULUM_INFORMATICA } from '../src/data/curricula/informatica.js';
import { CURRICULUM_PSICOLOGIA } from '../src/data/curricula/psicologia.js';

describe('Time Utils', () => {
  test('timeToDec converts 24h strings correctly', () => {
    assert.equal(timeToDec('07:00'), 7.0);
    assert.equal(timeToDec('07:30'), 7.5);
    assert.equal(timeToDec('13:45'), 13.75);
    assert.equal(timeToDec('22:00'), 22.0);
  });

  test('decToTime converts decimals to 24h formatted string', () => {
    assert.equal(decToTime(7.0), '07:00');
    assert.equal(decToTime(7.5), '07:30');
    assert.equal(decToTime(13.75), '13:45');
  });

  test('slotsOverlap correctly detects collision', () => {
    const s1 = { day: 'LUN', start: '07:00', end: '09:00' };
    const s2 = { day: 'LUN', start: '08:00', end: '10:00' }; // overlap
    const s3 = { day: 'LUN', start: '09:00', end: '11:00' }; // adjacent, no overlap
    const s4 = { day: 'MAR', start: '07:00', end: '09:00' }; // different day

    assert.equal(slotsOverlap(s1, s2), true);
    assert.equal(slotsOverlap(s1, s3), false);
    assert.equal(slotsOverlap(s1, s4), false);
  });
});

describe('Scheduler Engine Backtracking & Combinations', () => {
  test('returns missing reason when a course has no valid sections', () => {
    const courses = [{ id: 'FING-02001', name: 'Álgebra', mode: 'standard' }];
    const offer = { 'FING-02001': { mode: 'standard', sections: [] } };
    const result = computeCombinations(courses, offer);

    assert.equal(result.combinations.length, 0);
    assert.equal(result.missingCourses.length, 1);
    assert.equal(result.missingCourses[0].id, 'FING-02001');
  });

  test('computes valid combination for non-conflicting standard courses', () => {
    const courses = [
      { id: 'FING-02001', name: 'Álgebra', mode: 'standard' },
      { id: 'INFO-02001', name: 'Lógica', mode: 'standard' }
    ];
    const offer = {
      'FING-02001': {
        mode: 'standard',
        sections: [{ nrc: '1001', sectionName: 'Sec 1', prof: 'Prof A', schedule: [{ day: 'LUN', start: '07:00', end: '09:00' }] }]
      },
      'INFO-02001': {
        mode: 'standard',
        sections: [{ nrc: '2001', sectionName: 'Sec 1', prof: 'Prof B', schedule: [{ day: 'MAR', start: '07:00', end: '09:00' }] }]
      }
    };

    const result = computeCombinations(courses, offer);
    assert.equal(result.missingCourses.length, 0);
    assert.equal(result.combinations.length, 1);
    assert.equal(result.combinations[0].length, 2);
  });

  test('filters out combinations that collide in time', () => {
    const courses = [
      { id: 'FING-02001', name: 'Álgebra', mode: 'standard' },
      { id: 'INFO-02001', name: 'Lógica', mode: 'standard' }
    ];
    const offer = {
      'FING-02001': {
        mode: 'standard',
        sections: [
          // Section 1 collides with Lógica
          { nrc: '1001', sectionName: 'Sec 1', schedule: [{ day: 'LUN', start: '07:00', end: '09:00' }] },
          // Section 2 is at 09:00 (no collision)
          { nrc: '1002', sectionName: 'Sec 2', schedule: [{ day: 'LUN', start: '09:00', end: '11:00' }] }
        ]
      },
      'INFO-02001': {
        mode: 'standard',
        sections: [
          { nrc: '2001', sectionName: 'Sec 1', schedule: [{ day: 'LUN', start: '07:00', end: '09:00' }] }
        ]
      }
    };

    const result = computeCombinations(courses, offer);
    assert.equal(result.combinations.length, 1);
    // Only section 1002 can be combined with 2001
    assert.equal(result.combinations[0][0].nrc, '1002');
    assert.equal(result.combinations[0][1].nrc, '2001');
  });

  test('correctly handles theory + practice linked sections', () => {
    const courses = [{ id: 'FING-02115', name: 'Mecánica', mode: 'theory_practice' }];
    const offer = {
      'FING-02115': {
        mode: 'theory_practice',
        theoryGroups: [
          {
            theoryNrc: '5001',
            theorySectionName: 'Teoría 1',
            theorySchedule: [{ day: 'LUN', start: '07:00', end: '09:00' }],
            practices: [
              { practiceNrc: '5002', practiceSectionName: 'Práctica 1', practiceSchedule: [{ day: 'MIE', start: '07:00', end: '09:00' }] },
              { practiceNrc: '5003', practiceSectionName: 'Práctica 2', practiceSchedule: [{ day: 'VIE', start: '07:00', end: '09:00' }] }
            ]
          }
        ]
      }
    };

    const result = computeCombinations(courses, offer);
    assert.equal(result.combinations.length, 2); // 1 theory with 2 practice options = 2 combinations
  });

  test('places virtual courses sequentially on Sunday', () => {
    const courses = [
      { id: 'IDIO-02002', name: 'Inglés Técnico', mode: 'virtual' },
      { id: 'HUM-02001', name: 'Ética', mode: 'virtual' }
    ];
    const offer = {
      'IDIO-02002': { mode: 'virtual', virtualSections: [{ nrc: '9001', sectionName: 'Sec V1' }] },
      'HUM-02001': { mode: 'virtual', virtualSections: [{ nrc: '9002', sectionName: 'Sec V1' }] }
    };

    const result = computeCombinations(courses, offer);
    assert.equal(result.combinations.length, 1);
    const comb = result.combinations[0];
    assert.equal(comb[0].schedule[0].day, 'DOM');
    assert.equal(comb[0].schedule[0].start, '07:00');
    assert.equal(comb[1].schedule[0].day, 'DOM');
    assert.equal(comb[1].schedule[0].start, '09:00');
  });
});

describe('Curricula Integrity', () => {
  test('Informatica curriculum has 8 semesters and non-empty courses with unique IDs', () => {
    assert.equal(CURRICULUM_INFORMATICA.length, 8);
    const seenIds = new Set();
    let totalCourses = 0;
    CURRICULUM_INFORMATICA.forEach(sem => {
      assert.ok(sem.courses.length > 0);
      sem.courses.forEach(c => {
        assert.ok(c.id && c.id.trim().length > 0, `Course ${c.name} has invalid ID`);
        assert.ok(!seenIds.has(c.id), `Duplicate course ID found: ${c.id}`);
        seenIds.add(c.id);
      });
      totalCourses += sem.courses.length;
    });
    assert.ok(totalCourses >= 45);
  });

  test('Psicologia curriculum has 8 semesters and non-empty courses', () => {
    assert.equal(CURRICULUM_PSICOLOGIA.length, 8);
    let totalCourses = 0;
    CURRICULUM_PSICOLOGIA.forEach(sem => {
      assert.ok(sem.courses.length > 0);
      totalCourses += sem.courses.length;
    });
    assert.ok(totalCourses >= 45);
  });
});
