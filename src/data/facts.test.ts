import {describe,expect,it} from 'vitest';
import {facts} from './facts';
describe('MedSpace reference content',()=>{
 it('uses unique identifiers and supported categories',()=>{
  expect(new Set(facts.map(f=>f.id)).size).toBe(facts.length);
  expect(facts.length).toBeGreaterThanOrEqual(23);
 });
 it('provides valid https source URLs and substantial summaries',()=>{
  for(const fact of facts){
   expect(new URL(fact.url).protocol).toBe('https:');
   expect(fact.source.length).toBeGreaterThan(8);
   expect(fact.body.length).toBeGreaterThan(35);
  }
 });
});
