import { getTaskSupport } from './task-support.mjs';
import { getReview } from './review.mjs';
import { cardMetadata } from './card-metadata.mjs';
import { concepts, normalize } from './discovery.mjs';
export const groups = [
 {id:'task',label:'Task',options:[['detection2d','2D Object Detection'],['detection3d','3D Object Detection'],['semantic','Semantic Segmentation'],['instance','Instance Segmentation'],['panoptic','Panoptic Segmentation'],['trajectory','Trajectory Prediction'],['planning','Motion Planning'],['tracking','Object Tracking'],['depth','Depth Estimation'],['flow','Optical Flow'],['localization','Localization & SLAM']]},
 {id:'sensors',label:'Sensors',options:[['camera','Camera'],['lidar','LiDAR'],['radar','Radar'],['thermal','Thermal'],['event','Event camera']]},
 {id:'conditions',label:'Conditions',options:[['night','Night'],['rain','Rain'],['snow','Snow'],['fog','Fog'],['offroad','Off-road'],['highway','Highway'],['urban','Urban']]},
 {id:'location',label:'Location',options:[['india','India'],['china','China'],['korea','Korea'],['japan','Japan'],['germany','Germany'],['usa','United States'],['africa','Africa']]},
];
const extra={detection2d:['2d object detection','2d detection'],detection3d:['3d object detection','3d detection'],semantic:['semantic segmentation'],instance:['instance segmentation'],panoptic:['panoptic segmentation'],trajectory:['trajectory prediction','trajectory forecasting','motion prediction','motion forecasting','pedestrian prediction','pedestrian forecasting'],depth:['depth estimation','depth prediction','depth completion'],flow:['optical flow'],planning:['planning','planner'],tracking:['tracking'],localization:['localization','localisation','odometry','slam'],korea:['korea','korean'],japan:['japan','japanese'],germany:['germany','german'],usa:['united states','usa','us']};
export const labels={reviewed:'Reviewed detection data (11)',py123d:'123D supported',...Object.fromEntries(groups.flatMap(g=>g.options)),detection:'Object Detection',segmentation:'Segmentation',prediction:'Prediction'};
const officialTaskIds = new Set(groups.find(group => group.id === 'task').options.map(([id]) => id));
export function matchesFacet(row,id){
 const review=getReview(row.id);
 if(id==='reviewed')return !!review;
 if(id==='py123d')return review?.py123d.status==='supported';
 // Task filtering requires an explicit official-support review and evidence.
 // Curated tags and title keywords do not establish official task support.
 if(officialTaskIds.has(id)){const support=getTaskSupport(row.id)[id];return support?.status==='official' && !!support.source;}
 if(review?.facets.includes(id))return true;

 if(cardMetadata[row.name]?.facets.includes(id)) return true;
 const text=' '+normalize(row.name+' '+row.title)+' ';
 return (extra[id]||concepts[id]||[]).some(a=>text.includes(' '+normalize(a)+' '));
}
export function filterFacets(rows,selected){return rows.filter(row=>selected.every(id=>matchesFacet(row,id)));}

export function cardTags(row){return groups.filter(g=>g.id!=='location').map(g=>({...g,options:g.options.filter(([id])=>matchesFacet(row,id))})).filter(g=>g.options.length);}
