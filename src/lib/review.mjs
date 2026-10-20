import records from '../data/detection-review.json';
export const detectionReview = records;
export const reviewDate = '2026-10-19';
export const supportLabels = {official:'Official support',potential:'Potential use'};
export const accessLabels = {public:'Public download documented',registration:'Registration required',documented:'Download documented · access unverified'};
export function getReview(id){return records[id];}
export function preparationManifest(rows){return {version:1,targetFormat:'123D',createdAt:new Date().toISOString(),notice:'Planning manifest only. No download or conversion has been run. Check provider terms, labels, splits and supported converter scope.',datasets:rows.map(row=>({id:row.id,name:row.name,paper:row.paper,review:records[row.id]||null}))};}
