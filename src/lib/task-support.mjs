import additions from '../data/task-support.json';
import { getReview } from './review.mjs';
// Task evidence is independent of the detection-specific access/split review.
export function getTaskSupport(id){return {...(getReview(id)?.tasks || {}),...(additions[id]?.tasks || {})};}
export const taskNames={detection2d:'2D detection',detection3d:'3D detection',semantic:'Semantic seg.',instance:'Instance seg.',panoptic:'Panoptic seg.',tracking:'Tracking',trajectory:'Trajectory',depth:'Depth',flow:'Optical flow',localization:'Localization',planning:'Planning'};
