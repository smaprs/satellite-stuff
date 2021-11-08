//VERSION=3
/*S-1 Multi-Temporal Selective Enhancement by SAJV : Useful for multi compos:  Burnscars, Landslides, Eruptions, Hydrology, what else...
References / Adapted / custom-scripts / from : 
Pierre Markuse   : https://custom-scripts.sentinel-hub.com/data-fusion/s2l1c_s1grd_cloud_replacement/
                   https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
Annamaria Luongo : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_false_color_visualization/
Valters Zeizis   : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_rvi_temporal_analysis 
SAR-Ice          : https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674  */  

// TIMESPAN ASCEND/DESCEND: D // other dates: 
var latest   = "2021-10-14"; //=0 10-26 , 14
var middle   = "2021-09-08"; //=1 09-20 , 08
var earliest = "2021-08-03"; //=2 08-27 , 03

// SETUP POLARIZATION
function setup(){return{ input:[{bands:["VV","VH"]}], output:{bands:3}, mosaicking:"ORBIT"};}
//Date analysis: 
function filterScenes (scenes) { return scenes.filter( function (scene) {var allowedDates = [latest, middle, earliest]; var sceneDateStr = dateformat(scene.date);  if (allowedDates.indexOf(sceneDateStr)!= -1) return true; else return false; } ); } 
//Date conversion:  
function dateformat(d) {var dd = d.getDate(); var mm = d.getMonth()+1; var yyyy = d.getFullYear(); if(dd<10){dd='0'+dd;} if(mm<10){mm='0'+mm;} var isodate = yyyy+'-'+mm+'-'+dd; return isodate; }

// SETUP COMPOSITION (REDO WEIGHTS) // BASIC : [VV,VH,VV/VH]
function Calc_FX(sample) {
var VV = sample.VV; var VH = sample.VH;
// EMPIRICAL WEIGHTS: 4*VV~12*VH ; 1.2*VVB~2.4*VHB ; 1.5*sqVV~3*sqVH
var LVV  = VV ; var LVH  = VH ; // linear
var dbVV   = (Math.max(0,Math.log(VV)*0.21714724095+1)) ; //decibel
var dbVH   = (Math.max(0,Math.log(VH)*0.21714724095+1)) ; 
var sqVV   = (Math.sqrt(VV+0.012)); // GOOD ; ORIG:0.002 ; https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
var sqVH   = (Math.sqrt(VH+0.012)); //
var RVH    = VV/VH ; // Polarized Ratio (VV to VH)
var RHV    = VH/VV ; // Polarized Ratio (VH to VV)
var NVVI   = VV/(VV+VH) ; // Normalized VV Index
var NVHI   = VH/(VV+VH) ; // Normalized VH Index (RVI=4*NVHI)
var RVIdep = ((Math.sqrt(NVVI))*(4*NVHI)) ; // https://custom-scripts.sentinel-hub.com/sentinel-1/radar_vegetation_index/ 

var COMPO1 = (VV/(VV+4*VH)) ; // BETTER
var COMPO2 = (sqVV/(3.5*sqVH)) ; 
  
return COMPO1 ;} // Test for COMPOS // *** RETRY ***

//SETUP Stretch & Saturation: 
var Rmin=0.1; var Rmax=0.9; var SATUR=2;

//Stretch RGB:
function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);}
function SATUREnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-SATUR) + a * SATUR);}
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