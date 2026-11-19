import{describe,it,expect}from'vitest';import{makePlan,clock,type PlanInput}from'./engine';
const base:PlanInput={date:'2026-11-20',start:'08:00',end:'18:00',tasks:[{id:'a',title:'Anatomy',duration:60,priority:'high'},{id:'b',title:'Physiology',duration:45,priority:'medium'}],commitments:[{id:'class',title:'Class',start:'09:00',end:'11:00'}],breakMinutes:10,breakAfterMinutes:90};
describe('deterministic schedule engine',()=>{
it('produces identical results for identical inputs',()=>expect(makePlan(base)).toEqual(makePlan(base)));
it('does not overlap tasks or fixed commitments',()=>{const slots=makePlan(base).slots;for(let i=1;i<slots.length;i++)expect(slots[i].start).toBeGreaterThanOrEqual(slots[i-1].end);});
it('preserves fixed commitments',()=>{const result=makePlan(base);expect(result.slots.find(s=>s.id==='class')).toMatchObject({start:540,end:660,kind:'fixed'});});
it('respects protected sleep/unavailable time',()=>{const result=makePlan({...base,commitments:[...base.commitments,{id:'rest',title:'Protected rest',start:'13:00',end:'17:00'}]});expect(result.slots.filter(x=>x.kind==='task').every(x=>x.end<=780||x.start>=1020)).toBe(true);});
it('reports impossible schedules and retains unscheduled tasks',()=>{const result=makePlan({...base,end:'09:00',tasks:[{id:'long',title:'Large task',duration:180,priority:'high'}],commitments:[]});expect(result.unscheduled.map(x=>x.id)).toEqual(['long']);expect(result.valid).toBe(false);expect(result.warnings.length).toBeGreaterThan(0);});
it('rejects overlapping commitments',()=>expect(()=>makePlan({...base,commitments:[...base.commitments,{id:'extra',title:'Overlap',start:'10:00',end:'11:30'}]})).toThrow(/overlap/i));
it('reports past deadlines',()=>{const result=makePlan({...base,tasks:[{id:'x',title:'Past due',priority:'high',duration:30,deadline:'2026-11-19'}]});expect(result.warnings.join(' ')).toMatch(/passed/i);});
it('protects current schedule from mutation on generation',()=>{const original=structuredClone(base);makePlan(base);expect(base).toEqual(original);});
it('sorts earliest deadlines before lower urgency work',()=>{const result=makePlan({...base,commitments:[],tasks:[{id:'a',title:'Later',priority:'high',duration:30,deadline:'2026-11-25'},{id:'b',title:'Soon',priority:'medium',duration:30,deadline:'2026-11-20'}]});expect(result.slots.find(x=>x.kind==='task')?.id).toBe('b');});
it('rejects invalid times and dates',()=>{expect(()=>makePlan({...base,start:'25:00'})).toThrow();expect(()=>makePlan({...base,date:'2026-02-31'})).toThrow();});
it('formats clock values',()=>expect(clock(545)).toBe('09:05'));
});
