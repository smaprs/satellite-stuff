/*S-1 Multi-temporal - Adapted from Annamaria Luongo :
https://custom-scripts.sentinel-hub.com/sentinel-1/sar_multi-temporal_backscatter_coefficient_composite/#
Example: https://sentinelshare.page.link/EJqq
*/  // TIMESPAN // -75.639,-28.471 A-74 1270km2
var latest   = "2021-10-10"; //=S0 09-05,08-20
var middle   = "2021-06-12"; //=S1 
var earliest = "2021-02-12"; //=S2 02-26

//SETUP Stretch & Saturation: (Default: 0;1;1 )
var Rmin=-0.1; var Rmax=1.2; var SATUR=0.9;

//SETUP Polarization: >> VV or VH
function setup() { return {
  input:[{bands: ["VV","VH"]}], // IW
  //input:[{bands: ["HH","HV"]}], // EW
  output: { bands: 3 },
  mosaicking: "ORBIT" };}

//Date analysis: 
function filterScenes (scenes) { return scenes.filter( function (scene) {
  var allowedDates = [latest, middle, earliest]; 
  var sceneDateStr = dateformat(scene.date);  
  if (allowedDates.indexOf(sceneDateStr)!= -1) 
  return true; else return false; } ); } 
//Date conversion:  
function dateformat(d) {var dd = d.getDate(); var mm = d.getMonth()+1; var yyyy = d.getFullYear();
  if(dd<10){dd='0'+dd;} if(mm<10){mm='0'+mm;} var isodate = yyyy+'-'+mm+'-'+dd;
  return isodate; }

// SETUP COMPOSITION:
function Calc_FX(sample) {
return (sample.VV*3+sample.VH*9);} // IW
//return ((sample.VV*3-sample.VH*9)/(sample.VV*3+sample.VH*9));} // IW
//return (sample.HH*1+sample.HV*0);} // EW

//Stretch RGB:
function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);} //=PIERRE
function SATUREnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - SATUR) + a * SATUR);}
//=======================================================
//RGB visualization: NORMALIZED DIFFERENCE: // OK
function evaluatePixel(samples) {

var S0 = Calc_FX(samples[0]);//latest
var S1 = Calc_FX(samples[1]);//middle
var S2 = Calc_FX(samples[2]);//earliest

//NORMALIZED VERSION:
var N0 = S0/(S0+S1+S2) ; 
var N1 = S1/(S0+S1+S2) ;
var N2 = S2/(S0+S1+S2) ;

var RGBcompo = [
   (stretch (S0,Rmin,Rmax))*1, //R
   (stretch (S1,Rmin,Rmax))*1, //G
   (stretch (S2,Rmin,Rmax))*1];//B
   
return SATUREnh (RGBcompo);}