export const concepts = {
 night: ['night','nighttime','dark','low light','야간','밤'],
 weather: ['adverse weather','all weather','악천후'],
 rain: ['rain','rainy','비오는','우천'], snow:['snow','snowy','winter','눈','겨울'], fog:['fog','foggy','안개'],
 lidar:['lidar','laser','point cloud','라이다','포인트 클라우드'], radar:['radar','레이다','레이더'],
 camera:['camera','image','visual','rgb','카메라','영상'], thermal:['thermal','infrared','열화상','적외선'],
 event:['event camera','event based','event enhanced','이벤트 카메라'],
 pedestrian:['pedestrian','vulnerable road user','보행자'], cyclist:['cyclist','bicycle','bike','자전거'],
 prediction:['prediction','forecasting','예측'], trajectory:['trajectory','trajectories','궤적'],
 segmentation:['segmentation','분할'], detection:['detection','detecting','검출','탐지'],
 highway:['highway','freeway','고속도로'], urban:['urban','city','cities','도심'], offroad:['off road','offroad','unstructured','비포장','오프로드'],
 cooperative:['cooperative','collaborative','v2x','v2v','vehicle to','협력'],
 india:['india','indian','인도'], china:['china','chinese','중국'], africa:['africa','african','아프리카'],
 language:['language','question answering','vqa','언어','질의'], multimodal:['multimodal','multi modal','multi sensor','멀티모달'],
 parking:['parking','주차'], simulation:['synthetic','simulation','simulated','합성','시뮬레이션']
};
export const normalize = s => s.toLowerCase().normalize('NFKD').replace(/[–—_-]/g,' ').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
const stops=new Set('i need want find show me a an the for with and or of in on to that have has is are data dataset datasets driving autonomous research looking at from about please can you give using available collected containing looking use study 논문 데이터 데이터셋 찾아줘 있는 위한 찾고 싶어 보여줘'.split(' '));
export function parseQuery(q){
 let rest=normalize(q); const terms=[];
 for(const [key,aliases] of Object.entries(concepts)){
  const hit=aliases.some(a=>(' '+rest+' ').includes(' '+normalize(a)+' '));
  if(hit){terms.push({label:key,aliases:aliases.map(normalize)});for(const a of [...aliases].sort((a,b)=>b.length-a.length))rest=(' '+rest+' ').split(' '+normalize(a)+' ').join(' ').trim();}
 }
 for(const word of rest.split(' '))if(word&&!stops.has(word)&&!/^\d{4}$/.test(word)&&!['after','before','since','이후','이전'].includes(word))terms.push({label:word,aliases:[word]});
 const year=q.match(/\b(19\d{2}|20\d{2})\b/);return {terms,year:year?+year[1]:null,op:/after|since|이후/i.test(q)?'after':/before|이전/i.test(q)?'before':'exact'};
}
export function searchPapers(data,q,{year='',sort='relevance'}={}){
 const parsed=parseQuery(q); const query=normalize(q);let results=[];
 for(const d of data){
  if(year&&d.year!==+year)continue;
  if(parsed.year&&(parsed.op==='after'?d.year<parsed.year:parsed.op==='before'?d.year>parsed.year:d.year!==parsed.year))continue;
  const name=normalize(d.name),body=normalize(d.name+' '+d.title);let matched=[];let score=0;
  for(const term of parsed.terms){if(term.aliases.some(a=>(' '+body+' ').includes(' '+a+' ')|| (a.length>3&&body.includes(a)))){matched.push(term.label);score+=term.aliases.some(a=>name.includes(a))?3:1;}}
  const exact=query&&name===query;if(exact)score+=100;
  if(parsed.terms.length&&!matched.length)continue;
  results.push({...d,matched,score,complete:matched.length===parsed.terms.length});
 }
 results.sort((a,b)=>sort==='newest'?b.year-a.year||b.score-a.score:sort==='oldest'?a.year-b.year||b.score-a.score:Number(b.complete)-Number(a.complete)||b.score-a.score||b.year-a.year);
 return {results,terms:parsed.terms.map(t=>t.label)};
}
