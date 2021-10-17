//VERSION=3
/*S-1 Multi-temporal Selective Enhancement by SAJV
References/Adapted from : 
Annamaria Luongo : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_multi-temporal_backscatter_coefficient_composite
Valters Zeizis : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_rvi_temporal_analysis 
Pierre Markuse : https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674
https://sentinelshare.page.link/VXGS
*/  

// TIMESPAN ASCEND/DESCEND: D // LOCATION: Kilimanjaro ; Poland 54.29,16.79
var latest   = "2021-09-22"; //=S0 
var middle   = "2021-05-13"; //=S1 
var earliest = "2021-01-25"; //=S2 

//SETUP Stretch & Saturation: (Default: 0;1;1 )
var Rmin=0.1; var Rmax=1.0; var SATUR=2;

//SETUP Polarization: >> VV or VH
function setup(){return{input:[{bands:["VV","VH"]}],
output:{bands:3},mosaicking:"ORBIT"};}

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
// (VV/VH reflectivity empirically pre-weighted)
function Calc_FX(sample) { 
var VVLi   =2*sample.VV; //linear
var VHLi   =8*sample.VH;
var VVdB   =0.75*(Math.max(0, Math.log(sample.VV) * 0.21714724095 + 1));
var VHdB   =2*(Math.max(0, Math.log(sample.VH) * 0.21714724095 + 1));
 var SUMli =VVLi+VHLi ;   //+
 var SUMdB =0.6*(VVdB+VHdB) ; //++
 var VVr   =VVLi/(VVLi+VHLi); //*GOOD*==
 var RVI   =VHLi/(VVLi+VHLi); //>0.5=growth //*GOOD*
 var RVIdB =VHdB/(VHdB+VVdB); //>0.5 alternative dB +sharp
 var RFI   =(VVLi-VHLi)/(VVLi+VHLi);//>0.4=deforested
 var RFIdB =3*((VHdB-VVdB)/(VHdB+VVdB));//>0.4 alternative dB

return (RVIdB > 0.5) ? SUMdB : VVr ;} // Stretch 0.1;1;2 

//Stretch RGB:
function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);} //=PIERRE
function SATUREnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / 
    rgbArr.length; return rgbArr.map(a => avg * (1-SATUR) + a * SATUR);}
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
