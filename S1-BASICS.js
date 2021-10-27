**************************************************************************
//VERSION=3
/*S-1 Multi-temporal Selective Enhancement by SAJV
References/Adapted from : 
**************************************************************************
//VERSION=3
/*S-1 BASIC SCRIPT MULTI-COMPO by SAJV
References/Adapted from : 
Annamaria Luongo : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_multi-temporal_backscatter_coefficient_composite
Pierre Markuse : https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
Valters Zeizis : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_rvi_temporal_analysis 
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674
https://sentinelshare.page.link/X1rh   */  

function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);} //=ANNA
function SATUREnh (rgbArr) {var avg = rgbArr.reduce((a, b)=>a+b,0)/rgbArr.length; 
  return rgbArr.map(a => avg * (1 - SATUR) + a * SATUR);}  
function ApplyEnh (bArr) {return SATUREnh ([
  stretch (bArr[0], Rmin, Rmax), 
  stretch (bArr[1], Rmin, Rmax), 
  stretch (bArr[2], Rmin, Rmax)]);}
//function gamma(arr, val) {return arr ^ (1.0 / val);}

// SETUP COMPOSITION (REDO WEIGHTED POLARIZATIONS : VV~3*VH ; VVB~1.5*VHB) : 
 var VVL  = VV   ; // linear 
 var VHL  = VH*1 ; // linear 
 var VVB  = (Math.max(0, Math.log(VV) * 0.21714724095 + 1))  ; // dB
 var VHB  = 1*(Math.max(0, Math.log(VH) * 0.21714724095 + 1)); // dB
// SIMPLE SUMS:
var SUML  = (VV+(1*VH)) ;  
var SUMB  = (1*VVB)+VHB ;
// VERTICAL SERIES:
var VdH   = VV/(1*VH) ;      
var VdHB  = VVB/(1*VHB) ; 
var Vn    = VV/(VV+VH) ;     // degr.pol.(norm.)
var VnB   = VVB/(VVB+VHB) ; 
var Vdn   = (VH-VV)/(VV+VH); // norm.diff. 
var VdnB  = (VVB-VHB)/(VVB+VHB) ; 
// HORIZONTAL SERIES:
var HdV   = VH/VV ;          
var HdVB  = VHB/VVB ; 
var Hn    = VH/(VV+VH) ;    // RVI : [4*VH/(VV+VH)] depol.
var HnB   = VHB/(VHB+VVB) ; 
var Hdn   = (VH-VV)/(VV+VH); 
var HdnB  = (VHB-VVB)/(VHB+VVB); // RFI (norm.diff.)
// INDICES and APLICATIONS SERIES: 
// https://custom-scripts.sentinel-hub.com/sentinel-1/radar_vegetation_index/
var mod = 1-(VV/(VV+VH)) ; var depol = (Math.sqrt(mod))*(4*VH/(VV+VH)) ; // depol.
// https://custom-scripts.sentinel-hub.com/sentinel-1/forest_hurricane/
var ForestHurricane = [VV*3,VH*8,VH*3]; 
// https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
var sqVV = Math.sqrt(VV + 0.022); //var GsqVV=gamma(stretch(sqVV,0.02,0.1),1.1);
var sqVH = Math.sqrt(VH + 0.022); //var GsqVH=gamma(stretch(sqVH,0.02,0.1),1.1);

// RGB COMPOSITION:
//var MONO  = sqVV ; var RGBcompo = [MONO,MONO,MONO] ; //MONO
var RGBcompo = [sqVV, 1.5*sqVH, 0.5*(sqVV/(sqVV+(1.5*sqVH)))]; //[VV,VH,VV/VH]

var Rmin=0.05 ; var Rmax=0.8 ; var SATUR=1.8 ;
var Enh = ApplyEnh (RGBcompo); return Enh;

**************************************************************************
//VERSION=3 // https://apps.sentinel-hub.com/eo-browser 
// SIMPLE VV - decibel gamma0
function setup() {
  return {
    input: ["VV", "dataMask"],
    output: { bands: 4 }};}
function evaluatePixel(sample) {
  const value = Math.max(0, Math.log(sample.VV) * 0.21714724095 + 1);
  return [value, value, value, sample.dataMask];}
// ---
// displays VV in decibels from -20 to 0
// the following is simplified below 
var log = 10 * Math.log(VV) / Math.LN10;
var val = Math.max(0, (log + 20) / 20);
//SIMPLIFIED:
return [Math.max(0, Math.log(VV) * 0.21714724095 + 1)];

**************************************************************************
// MOST COMMON COMBINATIONS:
------------------------------------
// SETUP COMPOSITION (REDO WEIGHTED POLARIZATIONS : VV~3*VH ; VVB~1.5*VHB) : 
 var VVL  = VV   ; // linear 
 var VHL  = VH*1 ; // linear 
 var VVB  = (Math.max(0, Math.log(VV) * 0.21714724095 + 1))  ; // dB
 var VHB  = 1*(Math.max(0, Math.log(VH) * 0.21714724095 + 1)); // dB
// SIMPLE SUMS:
var SUML  = (VV+(1*VH)) ;  
var SUMB  = (1*VVB)+VHB ;
// VERTICAL SERIES:
var VdH   = VV/(1*VH) ;      
var VdHB  = VVB/(1*VHB) ; 
var Vn    = VV/(VV+VH) ;     // degr.pol.(norm.)
var VnB   = VVB/(VVB+VHB) ; 
var Vdn   = (VH-VV)/(VV+VH); // norm.diff. 
var VdnB  = (VVB-VHB)/(VVB+VHB) ; 
// HORIZONTAL SERIES:
var HdV   = VH/VV ;          
var HdVB  = VHB/VVB ; 
var Hn    = VH/(VV+VH) ;    // RVI : [4*VH/(VV+VH)] depol.
var HnB   = VHB/(VHB+VVB) ; 
var Hdn   = (VH-VV)/(VV+VH); 
var HdnB  = (VHB-VVB)/(VHB+VVB); // RFI (norm.diff.)
// INDICES and APLICATIONS SERIES: 
// https://custom-scripts.sentinel-hub.com/sentinel-1/radar_vegetation_index/
var mod = 1-(VV/(VV+VH)) ; var depol = (Math.sqrt(mod))*(4*VH/(VV+VH)) ; // depol.
// https://custom-scripts.sentinel-hub.com/sentinel-1/forest_hurricane/
var ForestHurricane = [VV*3,VH*8,VH*3]; 
// https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
var sqVV = Math.sqrt(VV + 0.022); //var GsqVV=gamma(stretch(sqVV,0.02,0.1),1.1);
var sqVH = Math.sqrt(VH + 0.022); //var GsqVH=gamma(stretch(sqVH,0.02,0.1),1.1);

// RGB COMPOSITION:
//var MONO  = sqVV ; var RGBcompo = [MONO,MONO,MONO] ; //MONO
var RGBcompo = [sqVV, 1.45*sqVH, 0.5*(sqVV/(sqVV+(1.45*sqVH)))]; //[VV,VH,VV/VH]
return [RGBcompo]

**************************************************************************
SAR INDICES:
---------------------------------------------------------------
var RVI =  HV / (HH + VV + HV)
  //SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674
  //RADAR VEGETATION INDEX: 0-1=flat-growth(irregular)
var RFI = (HH - HV) / (HH + HV) (normalized)
  //RADAR FOREST (DEGRADATION) INDEX: <0.3=dense .. 0.4-0.6=degraded .. >0.6=deforested
---------------------------------------------------------------
//ALTERNATIVE RVI - Valters Zeizis (temporal): https://custom-scripts.sentinel-hub.com/sentinel-1/sar_rvi_temporal_analysis/
function calcRVI(sample) {
  var denom = sample.VH*2+sample.VV*2;
  return ((denom!=0) ? (sample.VH*8) / denom : 0.0);}
//SUMMARY:
var RVI = VH*8/(VH*2+VV*2) 
---------------------------------------------------------------
//ALTERNATIVE RVI - Dipankar Mandal : https://custom-scripts.sentinel-hub.com/sentinel-1/radar_vegetation_index/
function Calc_FX(sample) {
let dop = (sample.VV/(sample.VV+sample.VH)); //equivalent to complement of the degree of polarization
let m = 1 - dop;  
let value = (Math.sqrt(dop))*((4*(sample.VH))/(sample.VV+sample.VH));  //depolarization within the vegetation 
return [ value ];} // =GRAYSCALE

**************************************************************************
//-- SENTINEL-1 EW ---------- 
var Bhv=[HV*500];
var Bhh=[HH*20];
var bd=[Bhv]; var MONO = [bd,bd,bd];
//var BLSH=[HV*200,HV*300+HH*10,HH*15];//sea=blue,ice=green
var BLSH2=[HV*200,HV*200+HH*10,HH*15];//sea=blue,ice=green
//var GRSH=[HV*200,HH*15,HV*300+HH*10];//sea=green,ice=blue
var GRSH2=[HV*100,HH*15,HV*400+HH*15];//sea=green,ice=blue
//------------------------
//SEA,ICE:
var MkV = BLSH2; var MkI = GRSH2; 
var SmV=0;var SMV=1.5;var StV=1;
var SmI=-.1;var SMI=.5;var StI=1; 
var EnhV = applyEnh_V(MkV); var EnhI = applyEnh_I(MkI);
//------------------------
//(HH>.012 & HV<.0005)=NON-ICE
return (HH>.01 & HV<.0002)? EnhV : EnhI;
//return (MONO);
**************************************************************************