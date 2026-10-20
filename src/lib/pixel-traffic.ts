// Decorative, low-density traffic. Every car travels at the same speed.
export function startPixelTraffic(road: HTMLElement) {
 const template = road.querySelector<HTMLElement>('.pixel-car-run')!;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const variants = [
  {body:'M14 4h20v4h4v4h8v8H2v-8h8V8h4z',windows:'M16 7h7v5H12V10h4zm11 0h5v3h3v2h-8z'},
  {body:'M14 4h26v8h6v8H2v-8h8V8h4z',windows:'M16 7h7v5H12V10h4zm11 0h10v5H27z'},
  {body:'M14 1h28v11h4v8H2v-8h8V6h4z',windows:'M16 5h8v7H12V9h4zm12 0h10v7H28z'},
 ];
 const colors=['#91a8c5','#a6b6a2','#b7a8be','#c4af97'];
 let timer: ReturnType<typeof setTimeout> | undefined;
 let lastShape=-1,lastColor=-1;
 const cars=new Map<HTMLElement,Animation>();
 const pickOther=(length:number,last:number)=>{if(last<0)return Math.floor(Math.random()*length);const n=Math.floor(Math.random()*(length-1));return n>=last&&last>=0?n+1:n;};
 function spawn(initial=false){
  if(cars.size>=2)return;
  const car=template.cloneNode(true) as HTMLElement;
  lastShape=pickOther(variants.length,lastShape);lastColor=pickOther(colors.length,lastColor);
  const paths=car.querySelectorAll('path');
  paths[0].setAttribute('d',variants[lastShape].body);paths[0].setAttribute('fill',colors[lastColor]);
  paths[1].setAttribute('d',variants[lastShape].windows);
  road.append(car);
  const duration=innerWidth<=600?14000:24000;
  const animation=car.animate([{transform:'translateX(100%)'},{transform:'translateX(-100px)'}],{duration,easing:'linear',fill:'both'});
  cars.set(car,animation);
  if(initial)animation.currentTime=duration*.45;
  animation.onfinish=()=>{cars.delete(car);car.remove();};
 }
 function schedule(){
  if(motion.matches||document.hidden)return;
  const gap=(innerWidth<=600?9000:14000)+Math.random()*7000;
  timer=setTimeout(()=>{spawn();schedule();},gap);
 }
 function reset(){
  clearTimeout(timer);for(const [car,animation] of cars){animation.cancel();car.remove();}cars.clear();
  road.querySelectorAll('.pixel-car-run').forEach(car=>car.remove());
  if(motion.matches){road.append(template.cloneNode(true));return;}
  if(!document.hidden){spawn(true);schedule();}
 }
 function visibility(){
  clearTimeout(timer);
  if(document.hidden){for(const animation of cars.values())animation.pause();}
  else if(!motion.matches){if(!cars.size)spawn(true);for(const animation of cars.values())animation.play();schedule();}
 }
 motion.addEventListener('change',reset);document.addEventListener('visibilitychange',visibility);
 window.addEventListener('pagehide',()=>{clearTimeout(timer);for(const animation of cars.values())animation.cancel();motion.removeEventListener('change',reset);document.removeEventListener('visibilitychange',visibility);},{once:true});
 reset();
}
