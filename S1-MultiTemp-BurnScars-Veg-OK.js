//VERSION=3
/*S-1 Multi-Temporal Selective Enhancement by SAJV
Useful for (changing compositions):  Burnscars, Landslides, Eruptions, Hydrology, what else...
References/Adapted from : 
Annamaria Luongo (temporal analysis) : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_multi-temporal_backscatter_coefficient_composite
Pierre Markuse (enhancement): https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
Valters Zeizis (RVI index) : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_rvi_temporal_analysis 
SERVIRglobal.net (Vegetation Indices): https://servirglobal.net/Global/Articles/Article/2674
*/  

// TIMESPAN ASCEND/DESCEND: D // https://sentinelshare.page.link/R3XF PANTANAL
var latest   = "2021-10-14"; //=0
var middle   = "2021-09-08"; //=1
var earliest = "2021-08-03"; //=2

//SETUP Stretch & Saturation: 
var Rmin=0.3; var Rmax=1.0; var SATUR=3;

//SETUP Polarization: >> VV or VH
function setup(){return{ input:[{bands:["VV","VH"]}], output:{bands:3}, mosaicking:"ORBIT"   };}
//Date analysis: 
function filterScenes (scenes) { return scenes.filter( function (scene) {
  var allowedDates = [latest, middle, earliest]; 
  var sceneDateStr = dateformat(scene.date);  
  if (allowedDates.indexOf(sceneDateStr)!= -1) 
  return true; else return false; } ); } 
//Date conversion:  
function dateformat(d) {var dd = d.getDate(); var mm = d.getMonth()+1; 
  var yyyy = d.getFullYear(); if(dd<10){dd='0'+dd;} if(mm<10){mm='0'+mm;} 
  var isodate = yyyy+'-'+mm+'-'+dd; return isodate; }

// SETUP COMPOSITION:
function Calc_FX(sample) {
var VVLi = 3*sample.VV;
var VHLi = 9*sample.VH;
//var VVdB = 1*(Math.max(0, Math.log(sample.VV) * 0.21714724095 + 1));
//var VHdB = 2*(Math.max(0, Math.log(sample.VH) * 0.21714724095 + 1));
//  var SUMdB =0.6*(VVdB+VHdB);
//  var NVVli=3*(VVLi-VHLi)/(VVLi+VHLi);
 var VVr  = VVLi/(VVLi+VHLi); //WILDFIRE++
return  VVr ;} 

//Stretch RGB:
function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);}
function SATUREnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / 
    rgbArr.length; return rgbArr.map(a => avg * (1-SATUR) + a * SATUR);}
//=======================================================
//RGB visualization: 
function evaluatePixel(samples) {
var S0 = Calc_FX(samples[0]);//latest
var S1 = Calc_FX(samples[1]);//middle
var S2 = Calc_FX(samples[2]);//earliest

var RGBcompo = [
   1*(stretch (S0,Rmin,Rmax)), //R
   1*(stretch (S1,Rmin,Rmax)), //G 
   1*(stretch (S2,Rmin,Rmax))];//B 

return SATUREnh (RGBcompo);}

//=======================================================

/*
//NORMALIZED VERSION:
var N0 = S0/(S0+S1+S2) ;
var N1 = S1/(S0+S1+S2) ;
var N2 = S2/(S0+S1+S2) ;
*/


//=======================================================
/*
// MONO S2-L2A 2021-08-26
function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);} //=ANNA
function SATUREnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; 
  return rgbArr.map(a => avg * (1 - SATUR) + a * SATUR);}
function ApplyEnh (bArr) {return SATUREnh ([
stretch (bArr[0], Rmin, Rmax), 
stretch (bArr[1], Rmin, Rmax), 
stretch (bArr[2], Rmin, Rmax)]);   }

var S2nat=[B04*3,B03*3,B02*3];
var COMPO = S2nat; 
var Rmin=-0.1;var Rmax=0.5;var SATUR=1.1;
var Enh = ApplyEnh (COMPO); return Enh;
*/

/* 
//SETUP-B Polarization: >> VV or VH // BAD
function setup(){return{
	input:[{bands:["VV","VH"]}],
	output:{bands:3},
	mosaicking:"ORBIT",
	orthorectify: "true",
    backCoeff: "GAMMA0_TERRAIN"
  	};} 
*/

//