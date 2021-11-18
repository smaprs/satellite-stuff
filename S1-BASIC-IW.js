//VERSION=3  
/* S-1 IW/EW Basic/Temporal/Multi_Compo Script, by SAJV 
References / Adapted / custom-scripts / from : 
Pierre Markuse   : https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
SAR-Ice          : https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674  */

function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);}
function ApplyEnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-SATUR) + a * SATUR);}

// SETUP : ENABLE TIMESPAN ; max:zooom=6
function setup() {return {
  input:[{ bands:["VH","VV"] }],
  output: { bands: 3 }, mosaicking: "SIMPLE" };}

//--SETUP IW COMPOSTIONS :
function evaluatePixel(sample) {
  var VV=sample.VV; var VH=sample.VH;  
var dbVH = (Math.max(0,Math.log(VH)*0.21714724095+1));
var dbVV = (Math.max(0,Math.log(VV)*0.21714724095+1));   
var sqVH = (Math.sqrt(VH+0.012)); 
var sqVV = (Math.sqrt(VV+0.012)); 
//--SETUP IW RGB COMPO:  
var S1_IW_1 = [4.5*VV , 3.5*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))]; // India_2
  return  S1_IW_1  ;} 

//--SETUP ENHANCEMENT :  
var Rmin=-0.05; var Rmax=1.05; var SATUR=1.5;

################################################################################################
EXAMPLES IW :
----------------------------------------------------------------------------------------
INDIA	:	zoom=7    10.1,76.1		2021-09-01 ; 2021-11-09 

################################################################################################
