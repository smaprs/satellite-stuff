//VERSION=3  
/* S-2 3Dates+Enhance by SAJV ; 
References / Adapted / custom-scripts / from : 
Pierre Markuse   : https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/   */

//Date analysis:
function filterScenes (scenes) { return scenes.filter( function (scene) {var allowedDates = [Date_0, Date_1, Date_2]; var sceneDateStr = dateformat(scene.date);  if (allowedDates.indexOf(sceneDateStr)!= -1) return true; else return false; } ); } 
function dateformat(d) {var dd = d.getDate(); var mm = d.getMonth()+1; var yyyy = d.getFullYear(); if(dd<10){dd='0'+dd;} if(mm<10){mm='0'+mm;} var isodate = yyyy+'-'+mm+'-'+dd; return isodate; }
//Stretch RGB:
function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);}
function ApplyEnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-SATUR) + a * SATUR);}
  
function setup() {return {
  input:[{ bands: ["B02", "B03", "B04", "B08"] }], 
  output: { bands: 3 }, mosaicking: "ORBIT" };} 

// SETUP TIMESPAN : Example: ARGENTINA, Santiago del Estero y Chaco		-26.989,-61.715
var Date_0 = "2021-10-26"; // 0=recent
var Date_1 = "2020-10-26"; // 1=middle
var Date_2 = "2019-10-27"; // 2=earliest

//SETUP MONO COMPOSITION : //
function Calc_FX(sample) { var B02=sample.B02 ; var B03=sample.B03 ; var B04=sample.B04 ; var B08=sample.B08 ; 
var NDVI = (B08-B04)/(B08+B04);
var NDWI = (B03-B08)/(B03+B08);
return  B04*3 ;} // B08*3

//SETUP Stretch & Saturation: 
var Rmin=0.1; var Rmax=0.9; var SATUR=2.0;

//RGB visualization: 
function evaluatePixel(samples) {var S0 = Calc_FX(samples[0]); var S1 = Calc_FX(samples[1]); var S2 = Calc_FX(samples[2]);
var RGBcompo = [ // (DEF=2,1,0):
   1*(stretch (S0,Rmin,Rmax)), //R//
   1*(stretch (S1,Rmin,Rmax)), //G 
   1*(stretch (S2,Rmin,Rmax))];//B 
return ApplyEnh (RGBcompo);}

====================================================================================
EXAMPLE:

// SETUP TIMESPAN : Example: ARGENTINA, Santiago del Estero y Chaco		zoom=11	-27.054,-61.708		https://sentinelshare.page.link/rCKa	~35m/px
var Date_0 = "2021-10-26"; // 0=recent
var Date_1 = "2020-10-26"; // 1=middle
var Date_2 = "2019-10-27"; // 2=earliest

====================================================================================

