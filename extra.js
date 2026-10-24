(function(){
'use strict';
var rm=matchMedia('(prefers-reduced-motion: reduce)');
if(rm.matches)return;
var $=function(s){return document.querySelector(s)};
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))};
var coll=$('.coll'),ring=$('#ring'),handy=$('.handy'),fan=$('#fan');
if(!coll||!ring||!handy||!fan)return;
var caps=[].slice.call(document.querySelectorAll('.cap')),dots=[].slice.call(document.querySelectorAll('#rdots li'));
var N=caps.length,cur=0,ticking=false;
function prog(el){var t=el.offsetHeight-innerHeight;return t>0?clamp(-el.getBoundingClientRect().top/t,0,1):0}
function update(){
  ticking=false;
  var p=prog(coll);
  ring.style.setProperty('--rot',(-p*(N-1)*45).toFixed(2)+'deg');
  var i=clamp(Math.round(p*(N-1)),0,N-1);
  if(i!==cur){caps[cur].classList.remove('is-on');dots[cur].classList.remove('is-on');caps[i].classList.add('is-on');dots[i].classList.add('is-on');cur=i}
  var q=clamp(prog(handy)*2.2,0,1);q=1-Math.pow(1-q,3);
  fan.style.setProperty('--p',q.toFixed(3));
}
function req(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);
dots[0]&&dots[0].classList.add('is-on');
update();
})();
