import type {PlanResult,Slot} from './engine';
import {clock} from './engine';

const label:Record<Slot['kind'],string>={task:'Study / task',fixed:'Protected commitment',break:'Rest break'};

/** Accessible chronological schedule, including unscheduled work and conflict feedback. */
export function ScheduleTimeline({result}:{result:PlanResult}){
 const scheduled=result.slots.filter(s=>s.kind==='task').length;
 const minutes=result.slots.filter(s=>s.kind==='task').reduce((sum,s)=>sum+s.end-s.start,0);
 return <div className="schedule-overview">
  <div className="schedule-stats" aria-label="Schedule summary">
   <div><strong>{scheduled}</strong><span>tasks planned</span></div>
   <div><strong>{minutes}</strong><span>study minutes</span></div>
   <div><strong>{result.unscheduled.length}</strong><span>not scheduled</span></div>
  </div>
  {result.slots.length>0?<ol className="visual-timeline" aria-label="Timeline for the selected day">{result.slots.map(s=><li className={`visual-event ${s.kind==='fixed'?'is-commitment':s.kind==='break'?'is-rest':'is-task'}`} key={`${s.kind}-${s.id}`}>
   <div className="visual-time"><strong>{clock(s.start)}</strong><span>{clock(s.end)}</span></div>
   <div className="visual-rail" aria-hidden="true"><span/></div>
   <div className="visual-event-body"><div className="visual-event-heading"><strong>{s.title}</strong><span>{s.end-s.start} min</span></div><small>{label[s.kind]}</small></div>
  </li>)}</ol>:<p className="empty">There are no scheduled blocks yet.</p>}
  {result.unscheduled.length>0&&<div className="unscheduled-panel" role="status"><strong>Needs another time slot</strong><ul>{result.unscheduled.map(t=><li key={t.id}>{t.title} · {t.duration} minutes</li>)}</ul><p>Try extending availability, splitting work into smaller tasks or moving lower-priority items.</p></div>}
 </div>;
}
