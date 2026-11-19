import {z} from 'zod';
export const taskSchema=z.object({id:z.string().min(1),title:z.string().trim().min(1).max(120),duration:z.number().int().min(5).max(720),priority:z.enum(['high','medium','low']),deadline:z.string().optional()});
export const commitmentSchema=z.object({id:z.string().min(1),title:z.string().trim().min(1),start:z.string().regex(/^\d{2}:\d{2}$/),end:z.string().regex(/^\d{2}:\d{2}$/)});
export type Task=z.infer<typeof taskSchema>;export type Commitment=z.infer<typeof commitmentSchema>;
export type Slot={id:string;title:string;start:number;end:number;kind:'task'|'fixed'|'break';priority?:Task['priority']};
export type PlanInput={date:string;tasks:Task[];commitments:Commitment[];start:string;end:string;breakMinutes:number;breakAfterMinutes:number};
export type PlanResult={slots:Slot[];unscheduled:Task[];warnings:string[];valid:boolean};
export function toMinutes(clock:string):number{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(clock))throw new Error('Time must be HH:MM (24-hour)');const [h,m]=clock.split(':').map(Number);return h*60+m;}
export function clock(min:number):string{return `${String(Math.floor(min/60)).padStart(2,'0')}:${String(min%60).padStart(2,'0')}`;}
function validDate(value:string):boolean{if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(`${value}T12:00:00Z`);return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value;}
export function makePlan(input:PlanInput):PlanResult{
 const warnings:string[]=[];
 if(!validDate(input.date))throw new Error('Choose a valid calendar date');
 const start=toMinutes(input.start),end=toMinutes(input.end);
 if(end<=start)throw new Error('Available end must be after start; split overnight availability into separate days');
 if(!Number.isInteger(input.breakMinutes)||input.breakMinutes<0||input.breakMinutes>120||!Number.isInteger(input.breakAfterMinutes)||input.breakAfterMinutes<15)throw new Error('Invalid break settings');
 const tasks=input.tasks.map(t=>taskSchema.parse(t));const fixed:Slot[]=input.commitments.map(c=>{const x=commitmentSchema.parse(c);return {id:x.id,title:x.title,start:toMinutes(x.start),end:toMinutes(x.end),kind:'fixed' as const};}).sort((a,b)=>a.start-b.start||a.id.localeCompare(b.id));
 for(let i=0;i<fixed.length;i++){if(fixed[i].start>=fixed[i].end)throw new Error(`Commitment '${fixed[i].title}' has an invalid time range`);if(i>0&&fixed[i].start<fixed[i-1].end)throw new Error(`Fixed commitments overlap: ${fixed[i-1].title} and ${fixed[i].title}`);}
 const priority={high:0,medium:1,low:2};const sortable=[...tasks].sort((a,b)=>{
  const ad=a.deadline&&validDate(a.deadline)?a.deadline:'9999-12-31',bd=b.deadline&&validDate(b.deadline)?b.deadline:'9999-12-31';
  return ad.localeCompare(bd)||priority[a.priority]-priority[b.priority]||a.id.localeCompare(b.id);
 });
 for(const t of tasks){if(t.deadline&&!validDate(t.deadline))throw new Error(`Invalid deadline for '${t.title}'`);if(t.deadline&&t.deadline<input.date)warnings.push(`Deadline for '${t.title}' has already passed.`);}
 let blocks=[...fixed];const unscheduled:Task[]=[];let accumulated=0;let breakIndex=0;
 const gaps=()=>{const used=[...blocks].sort((a,b)=>a.start-b.start);let cursor=start;const result:{start:number;end:number}[]=[];for(const b of used){if(b.end<=start||b.start>=end)continue;if(b.start>cursor)result.push({start:cursor,end:Math.min(b.start,end)});cursor=Math.max(cursor,Math.min(end,b.end));}if(cursor<end)result.push({start:cursor,end});return result;};
 for(const task of sortable){let found=false;const shouldBreak=input.breakMinutes>0&&accumulated>=input.breakAfterMinutes;
  for(const g of gaps()){
   const extra=shouldBreak?input.breakMinutes:0;
   if(g.end-g.start<task.duration+extra)continue;
   let s=g.start;
   if(shouldBreak){blocks.push({id:`break-${breakIndex++}`,title:'Gentle break',start:s,end:s+extra,kind:'break'});s+=extra;accumulated=0;}
   blocks.push({id:task.id,title:task.title,start:s,end:s+task.duration,kind:'task',priority:task.priority});accumulated+=task.duration;found=true;break;
  }
  if(!found){unscheduled.push(task);warnings.push(`No available ${task.duration}-minute block for '${task.title}'.`);}
 }
 blocks=blocks.sort((a,b)=>a.start-b.start||a.end-b.end);
 return {slots:blocks,unscheduled,warnings,valid:unscheduled.length===0&&!warnings.some(x=>x.startsWith('Deadline'))};
}
export function samePlan(a:PlanResult,b:PlanResult):boolean{return JSON.stringify(a.slots)===JSON.stringify(b.slots)&&JSON.stringify(a.unscheduled)===JSON.stringify(b.unscheduled);}
