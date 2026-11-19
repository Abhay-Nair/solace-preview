import{test,expect}from'@playwright/test';
test('all main routes open',async({page})=>{for(const route of ['/','/medspace','/planner','/unwind','/games','/focus','/companion','/settings']){await page.goto(route);await expect(page.locator('main h1').first()).toBeVisible();}});
test('planner adds task and generates a draft',async({page})=>{await page.goto('/planner');await page.getByPlaceholder('Review anatomy chapter 3').fill('Review anatomy');await page.getByRole('button',{name:'Add task'}).click();await expect(page.getByText('Review anatomy').first()).toBeVisible();await page.getByRole('button',{name:'Generate my schedule'}).click();await expect(page.getByText('Suggested schedule')).toBeVisible();await page.getByRole('button',{name:'Accept plan'}).click();await expect(page.getByText('Saved schedule')).toBeVisible();});
test('games are interactive',async({page})=>{await page.goto('/games');await expect(page.getByRole('button',{name:'Hidden tile'})).toHaveCount(12);await page.getByRole('button',{name:'New garden'}).click();await page.getByRole('button',{name:'Peach'}).click();await expect(page.getByText('1 found')).toBeVisible();});
test('breathing controls operate',async({page})=>{await page.goto('/unwind');await page.getByRole('button',{name:'Start',exact:true}).click();await expect(page.getByRole('button',{name:'Pause',exact:true})).toBeVisible();await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Reset',exact:true}).click();await expect(page.getByRole('button',{name:'Start',exact:true})).toBeVisible();});
test('companion does not pretend to be live',async({page})=>{await page.goto('/companion');await expect(page.getByText(/Illustrative preview only/)).toBeVisible();});
test('mobile navigation is usable',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/');await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'MedSpace'}).click();await expect(page.locator('main h1')).toHaveText('MedSpace');});

test('planner disables generation when empty',async({page})=>{
 await page.goto('/planner');
 await expect(page.getByRole('button',{name:'Generate my schedule'})).toBeDisabled();
});
test('planner edits an existing task without duplicating it',async({page})=>{
 await page.goto('/planner');
 await page.getByPlaceholder('Review anatomy chapter 3').fill('Review anatomy');
 await page.getByRole('button',{name:'Add task'}).click();
 await page.getByRole('button',{name:'Edit Review anatomy'}).click();
 await page.getByPlaceholder('Review anatomy chapter 3').fill('Revised anatomy');
 await page.getByRole('button',{name:'Save task changes'}).click();
 await expect(page.getByText('Revised anatomy')).toHaveCount(1);
 await expect(page.getByText('1 tasks')).toBeVisible();
 await page.getByRole('button',{name:'Generate my schedule'}).click();
 await expect(page.getByRole('list',{name:'Timeline for the selected day'})).toBeVisible();
});
test('MedSpace search and filters are functional',async({page})=>{
 await page.goto('/medspace');
 await page.getByRole('textbox',{name:'Search facts'}).fill('double helix');
 await expect(page.getByText('DNA is shaped like a twisted ladder')).toBeVisible();
 await expect(page.getByText('Showing 1 fact')).toBeVisible();
 await page.getByRole('textbox',{name:'Search facts'}).fill('unlikely nonexistent science phrase');
 await expect(page.getByText('No matching discoveries')).toBeVisible();
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.getByText('Showing 23 facts')).toBeVisible();
});
test('breathing patterns can be changed safely',async({page})=>{
 await page.goto('/unwind');
 await page.getByRole('button',{name:'Even · 4 in / 4 out'}).click();
 await expect(page.getByRole('button',{name:'Even · 4 in / 4 out'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Start',exact:true}).click();
 await expect(page.getByRole('button',{name:'Pause',exact:true})).toBeVisible();
});

test('desktop canvas expands and protected commitments stay inside planner',async({page})=>{
 await page.setViewportSize({width:1600,height:900});
 await page.goto('/planner');
 const main=page.locator('main.main-content');
 const bounds=await main.boundingBox();
 expect(bounds).not.toBeNull();
 expect(bounds!.width).toBeGreaterThan(1250);
 await page.getByPlaceholder('Review anatomy chapter 3').fill('Revision');
 await page.getByRole('button',{name:'Add task'}).click();
 await page.getByPlaceholder('Lecture, lunch, commute, sleep...').fill('Sleep');
 await page.getByRole('button',{name:'Add commitment'}).click();
 await page.getByRole('button',{name:'Generate my schedule'}).click();
 const row=page.locator('.visual-event.is-commitment');
 await expect(row).toBeVisible();
 await expect(row).not.toHaveCSS('position','fixed');
 const panel=page.locator('.schedule-panel');
 const rowBox=await row.boundingBox();
 const panelBox=await panel.boundingBox();
 expect(rowBox).not.toBeNull();
 expect(panelBox).not.toBeNull();
 expect(rowBox!.x).toBeGreaterThanOrEqual(panelBox!.x);
 expect(rowBox!.x+rowBox!.width).toBeLessThanOrEqual(panelBox!.x+panelBox!.width+1);
});

test('tablet and mobile layouts do not overflow horizontally',async({page})=>{
 for(const width of [390,768,1024]){
  await page.setViewportSize({width,height:850});
  await page.goto('/planner');
  const overflowing=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
  expect(overflowing,`Horizontal overflow at ${width}px`).toBe(false);
 }
});


test('MedSpace learning paths filter, reset and remain accessible on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/medspace');
 await page.getByRole('button',{name:/Anatomy Structures/}).click();
 await expect(page.getByRole('button',{name:/Anatomy Structures/})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByText('Your lungs are not quite symmetrical')).toBeVisible();
 await page.getByRole('button',{name:'Reset browsing'}).click();
 await expect(page.getByText('Showing 23 facts')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
});


test('planner schedule and help card remain separated while scrolling',async({page})=>{
 await page.setViewportSize({width:1440,height:750});
 await page.goto('/planner');
 for(const name of ['Revision one','Revision two','Revision three','Revision four']){
  await page.getByPlaceholder('Review anatomy chapter 3').fill(name);
  await page.getByRole('button',{name:'Add task'}).click();
 }
 await page.getByPlaceholder('Lecture, lunch, commute, sleep...').fill('Protected study break');
 await page.getByRole('button',{name:'Add commitment'}).click();
 await page.getByRole('button',{name:'Generate my schedule'}).click();
 const panel=page.locator('.schedule-panel');
 const help=page.getByRole('heading',{name:'How it works'}).locator('..');
 await expect(panel).toHaveCSS('position','static');
 for(const scroll of [0,350,850]){
  await page.evaluate(y=>window.scrollTo(0,y),scroll);
  const panelBox=await panel.boundingBox();
  const helpBox=await help.boundingBox();
  expect(panelBox).not.toBeNull();
  expect(helpBox).not.toBeNull();
  expect(panelBox!.y+panelBox!.height).toBeLessThanOrEqual(helpBox!.y+1);
 }
});
