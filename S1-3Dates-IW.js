//VERSION=3  
/* S-1 3Dates+Enhance by SAJV ; 
References / Adapted / custom-scripts / from : 
Pierre Markuse   : https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
Annamaria Luongo : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_false_color_visualization/
SAR-Ice          : https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/  */
//Date analysis:
function filterScenes (scenes) { return scenes.filter( function (scene) {var allowedDates = [Date_0, Date_1, Date_2]; var sceneDateStr = dateformat(scene.date);  if (allowedDates.indexOf(sceneDateStr)!= -1) return true; else return false; } ); } 
function dateformat(d) {var dd = d.getDate(); var mm = d.getMonth()+1; var yyyy = d.getFullYear(); if(dd<10){dd='0'+dd;} if(mm<10){mm='0'+mm;} var isodate = yyyy+'-'+mm+'-'+dd; return isodate; }
//Stretch RGB:
function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);}
function ApplyEnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-SATUR) + a * SATUR);}

function setup() {return {
  input:[{ bands: ["VH","VV"] }], 
  output: { bands: 3 },
  mosaicking: "ORBIT" };} // 
  
// SETUP TIMESPAN : (A)scending / (D)escending : 
// IW: La Palma :  28.5,-17.9 // 2021-11-09 - 2021-09-04 (D): 
var Date_0 = "2021-11-03"; // 0=recent
var Date_1 = "2021-10-04"; // 1=middle
var Date_2 = "2021-09-16"; // 2=earliest

//SETUP BAND COMPOSITIONS : // 1*VV ~ 3*VH ; sqVV ~ 1.5*sqVH
function Calc_FX(sample) { var VH=sample.VH ; var VV=sample.VV ; 
//---S1-EW BASICS : 
var dbVH = (Math.max(0,Math.log(VH)*0.21714724095+1));
var dbVV = (Math.max(0,Math.log(VV)*0.21714724095+1));   
var sqVH = (Math.sqrt(VH+0.012)); // 
var sqVV = (Math.sqrt(VV+0.012));
var nVH = (4*VH)/(VV+(4*VH)) ; // normalized=RVI
var nVV = 1*(VV/(VV+(4*VH))) ; // normalized=NVVI
//--SETUP COMPO MONO:  
var Compo_1 = 2*(VH/VV)  ;
var Compo_2 = (dbVH+dbVV)/2  ;
var Compo_3 = 1*(sqVH/sqVV)  ;
var Compo_4 = 0.75*(Math.log(sqVV/sqVH))  ;
return  sqVV ;} // sqVV

//SETUP Stretch & Saturation: 
var Rmin=0.0; var Rmax=1.0; var SATUR=1.0;
//RGB visualization: 
function evaluatePixel(samples) {var S0 = Calc_FX(samples[0]); var S1 = Calc_FX(samples[1]); var S2 = Calc_FX(samples[2]);
var RGBcompo = [ // (DEF=2,1,0):
   1*(stretch (S2,Rmin,Rmax)), //R//
   1*(stretch (S1,Rmin,Rmax)), //G 
   1*(stretch (S0,Rmin,Rmax))];//B 
return ApplyEnh (RGBcompo);}

====================================================================================

// SETUP TIMESPAN ; ASCEND/DESCEND :
// IW: La Palma :  28.5,-17.9 // 2021-11-09 - 2021-09-04 Descend: 
var Date_0 = "2021-11-03"; //=R=0=recent
var Date_1 = "2021-10-04"; //=G=1=middle
var Date_2 = "2021-09-16"; //=B=2=earliest

Greenland	:
Iceland, Fagradalsfjall	:	zoom=10	64.01,-22.21	2021-09-29	https://sentinelshare.page.link/fZhy

====================================================================================
