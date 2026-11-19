import {describe,it,expect} from 'vitest';
import {render,screen} from '@testing-library/react';
import {ScheduleTimeline} from './ScheduleTimeline';
import {makePlan} from './engine';
describe('schedule timeline',()=>{
 it('shows planned and unscheduled work without removing it',()=>{
  const result=makePlan({date:'2026-11-20',start:'08:00',end:'09:00',breakMinutes:0,breakAfterMinutes:90,commitments:[],tasks:[{id:'a',title:'Short task',duration:30,priority:'high'},{id:'b',title:'Long task',duration:90,priority:'low'}]});
  render(<ScheduleTimeline result={result}/>);
  expect(screen.getByRole('list',{name:'Timeline for the selected day'})).toBeInTheDocument();
  expect(screen.getByText('Short task')).toBeInTheDocument();
  expect(screen.getByText(/Needs another time slot/)).toBeInTheDocument();
  expect(screen.getByText(/Long task/)).toBeInTheDocument();
 });
});

describe('timeline layout safety',()=>{
 it('does not use Tailwind position utility for protected commitments',()=>{
  const result=makePlan({date:'2026-11-20',start:'08:00',end:'22:00',breakMinutes:10,breakAfterMinutes:90,commitments:[{id:'sleep',title:'Sleep',start:'09:00',end:'21:00'}],tasks:[{id:'a',title:'Revision',duration:45,priority:'high'}]});
  const {container}=render(<ScheduleTimeline result={result}/>);
  expect(container.querySelector('.visual-event.is-commitment')).toBeInTheDocument();
  expect(container.querySelector('.visual-event.fixed')).toBeNull();
 });
});
