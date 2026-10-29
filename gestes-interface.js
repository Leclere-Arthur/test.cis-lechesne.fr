/* Gestes de zoom : défilement et formulaires conservés. */
(function(){'use strict';
const bloquer=e=>{if(e.cancelable)e.preventDefault();};
for(const type of ['gesturestart','gesturechange','gestureend'])document.addEventListener(type,bloquer,{passive:false});
document.addEventListener('touchmove',e=>{if(e.touches.length>1)bloquer(e);},{passive:false});
document.addEventListener('dblclick',bloquer,{passive:false});
document.addEventListener('wheel',e=>{if(e.ctrlKey)bloquer(e);},{passive:false});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['+','-','=','0','Add','Subtract'].includes(e.key))bloquer(e);});
})();