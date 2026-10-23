import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const reviews=JSON.parse(readFileSync(new URL('../src/data/detection-review.json',import.meta.url)));
const papers=JSON.parse(readFileSync(new URL('../src/data/driving-papers.json',import.meta.url)));
assert.equal(Object.keys(reviews).length,11);
for(const [id,r] of Object.entries(reviews)){
 assert(papers.some(p=>p.id===id),`Unknown paper ${id}`);
 assert(Object.keys(r.tasks).length,`No task review ${id}`);
 for(const [task,value] of Object.entries(r.tasks)){
  assert(['detection2d','detection3d'].includes(task));
  assert(['official','potential'].includes(value.status));
  assert(value.reason.length>20);assert(new URL(value.source).protocol==='https:');
 }
 for(const key of ['weather','labels','split','access'])assert(r.sources[key],`${id}: missing ${key} evidence`);
 assert(['supported','not-listed'].includes(r.py123d.status));
 assert(r.access.verification.includes('not tested'));
 assert(r.checked==='2026-10-19');
}
assert.equal(reviews.d0001.py123d.status,'not-listed','Do not conflate KITTI with KITTI-360');
assert.equal(reviews.d0008.py123d.status,'supported');
assert.equal(reviews.d0003.tasks.detection2d.status,'potential','Projected boxes are not an official 2D benchmark');
assert.equal(reviews.d0003.tasks.detection3d.status,'official');
assert(!reviews.d0009,'Do not conflate Waymo Motion with Perception');
assert.match(reviews.d0030.tasks.detection2d.reason,/radar/,'RADIATE 2D space must be explicit');
assert.equal(Object.values(reviews).filter(r=>r.py123d.status==='supported').length,5);
console.log('Detection review integrity and dataset-scope checks passed.');
