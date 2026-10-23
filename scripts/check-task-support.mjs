import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync(new URL(`../src/data/${name}.json`,import.meta.url)));
const records=read('task-support'),papers=read('driving-papers'),detection=read('detection-review');
const allowed=new Set(['semantic','instance','panoptic','tracking','trajectory','planning','depth','flow','localization']);
for(const [id,r] of Object.entries(records)){
 assert.equal(papers.find(p=>p.id===id)?.name,r.name,`Dataset identity ${id}`);
 assert.equal(r.verified_by,'agent');assert.match(r.checked,/^\d{4}-\d{2}-\d{2}$/);
 for(const [task,t] of Object.entries(r.tasks)){
  assert(allowed.has(task));assert.equal(t.status,'official');
  assert(t.scope.length>5);assert(t.reason.length>20);assert.equal(new URL(t.source).protocol,'https:');
  assert(!detection[id]?.tasks[task],`Do not overwrite detection review ${id}/${task}`);
 }
}
assert.match(records.d0015.tasks.semantic.reason,/model-generated/);
assert.match(records.d0007.tasks.trajectory.scope,/Motion Forecasting/);
assert.match(records.d0007.tasks.tracking.scope,/Sensor/);
assert(!records.d0009,'Do not copy Waymo Perception metadata to Motion');
assert.equal(detection.d0003.tasks.detection2d.status,'potential');
console.log('Task evidence identity, scope and detection-preservation checks passed.');
