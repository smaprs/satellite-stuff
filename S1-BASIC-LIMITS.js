//VERSION=3
/*S-1 Multi-temporal Selective Enhancement by SAJV
References/Adapted from : 
Annamaria Luongo : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_multi-temporal_backscatter_coefficient_composite
Valters Zeizis : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_rvi_temporal_analysis 
Pierre Markuse : https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674
https://sentinelshare.page.link/jeA3
*/  

======================================================================
COMPOS:
======================================================================
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

return (RVIdB > 0.5) ? SUMdB : VVr ;} // Stretch 0.1;1;2 excelent
//return SUMdB ;} // Stretch 0;1;2

======================================================================

//SCRIPT - S1 - LIMITS - TESTS:
//LA PALMA VOLCANO 28.573,-17.915
// SETUP COMPOSITION:
function Calc_FX(sample) {
var VVdB= (Math.max(0, Math.log(sample.VV) * 0.21714724095 + 1)); // *1
var VHdB= (Math.max(0, Math.log(sample.VH) * 0.21714724095 + 1)); // *2
var VVL= sample.VV; // linear *5
var VHL= sample.VH; // linear *20

var compo = VVdB+VHdB;//+-++
var compo = VVL*2+VHL*8;  //+-

var compo = (VVL/(VVL+VHL*5));//*GOOD*==
var compo = (VVdB-VHdB)/(VVdB+VHdB)*0.25; //+-
   //var compo = VVdB/(VVdB+VHdB); //BAD

var compo =  VHL*5 /(VHL*5+VVL);//RVI 0=FLAT //*GOOD*
   //var compo = (VHL-VVL)/(VHL+VVL);//RFDI>0.6=deforested //BAD
var compo =  VHdB*3/(VHdB+VVdB);//RVI  dB //+-
   //var compo = (VHdB-VVdB)/(VHdB+VVdB);//RFDI dB //BAD

return compo   ;}

=====================================================================
return (sample.HH*1+sample.HV*1);} // EW
======================================================================
SAR INDICES:
//SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674
//RADAR VEGETATION INDEX: 0-1=flat-growth(irregular)
var RVI =  HV / (HH + VV + HV)
//RADAR FOREST (DEGRADATION) INDEX: <0.3=dense .. 0.4-0.6=degraded .. >0.6=deforested
var RFI = (HH - HV) / (HH + HV) (normalized)

ALTERNATIVE: VALTERS ZEISIZ - Radar Vegetation :
function calcRVI(sample) {
  var denom = sample.VH*2+sample.VV*2;
  return ((denom!=0) ? (sample.VH*8) / denom : 0.0);}
 
var RVI = VH*8/(VH*2+VV*2) // VALTERS ZEISIZ 
======================================================================
// Radar vegetation index for Sentinel-1 (RVI4S1) SAR data
// Institute: MRSLab, Indian Institute of Technology Bombay, India
// Data requirements: Sentinel-1 GRD data
function Calc_FX(sample) {
let dop = (sample.VV/(sample.VV+sample.VH)); //equivalent to complement of the degree of polarization
let m = 1 - dop;  
let value = (Math.sqrt(dop))*((4*(sample.VH))/(sample.VV+sample.VH));  //depolarization within the vegetation 
return [ value ];} // =GRAYSCALE
======================================================================