//VERSION=3
/* S1+S2 Fusion CLouds + Enhancement by SAJV : Useful for CLOUDS ; 
References/Adapted from : 
Pierre Markuse : https://custom-scripts.sentinel-hub.com/data-fusion/s2l1c_s1grd_cloud_replacement/
                 https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
SAR-Ice          : https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674  */
// DISABLED AT ZOOM < 8 ; SETUP: TIMESPAN BOTH S1 & S2 // ADDITIONAL DATASETS 1)S2L1C + 2)S1GRD :
var setup=()=>({ input:[
    {datasource:"S2L1C",bands:["B01", "B02", "B03", "B04", "B08", "B10", "B11", "B12", "CLM", "CLP"], units: "REFLECTANCE", mosaicking: "ORBIT"},
    {datasource:"S1GRD",bands:["HH", "HV"], units: "REFLECTANCE", mosaicking: "SIMPLE"},], //IW=VH,VV or EW=HV,HH
  output:[{ id:"default",bands:3,sampleType:SampleType.AUTO}],});

function a(a, b) {return a + b;} function stretch (val,min,max) {return (val-min)/(max-min);}
//Enhacement S1:
function SatuEnh_S1(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-Satur_S1) + a * Satur_S1);}
function applyEnh_S1(bArr) {return SatuEnh_S1([stretch(bArr[0], S1min, S1max), stretch(bArr[1], S1min, S1max), stretch(bArr[2], S1min, S1max)]);}
//Enhacement S2:
function SatuEnh_S2 (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-Satur_S2) + a * Satur_S2);}
function applyEnh_S2(bArr) {return SatuEnh_S2([stretch(bArr[0], S2min, S2max), stretch(bArr[1], S2min, S2max), stretch(bArr[2], S2min, S2max)]);}

//SETUP RGB_COMPOS ; WEIGHTS: 1*HH ~ 4*HV
function evaluatePixel(samples) {
  var S2=samples.S2L1C[0];
  var HV=samples.S1GRD[0].HV ; var HH=samples.S1GRD[0].HH ;
//---S1-EW BASICS : 
var dbHV = (Math.max(0,Math.log(HV)*0.21714724095+1)); // 1.25*
var dbHH = (Math.max(0,Math.log(HH)*0.21714724095+1)); // 1*
var sqHV = (Math.sqrt(HV+0.002)); // 1.5*//0.002:higher=brighter
var sqHH = (Math.sqrt(HH+0.002)); // 1.* //0.002:higher=brighter
//---S1 RGB_COMPOSITIONS : 
var S1_EW_1 = [ 1.2*dbHV , 0.95*dbHH , 2.5*(sqHH-sqHV) ] ; // ++ sea dark gr.blue, rocks brown , ice white
var S1_EW_2 = [ 1.5*sqHV , 1*sqHH , 2*(sqHH-sqHV) ] ; // + sea dark blue, rocks brown , ice white
var S1_EW_3 = [ 1.2*dbHV , 0.85*dbHH , 1.2*(1-(sqHV/sqHH))  ] ; // sea vivid 
var S1_EW_4 = [ 1.5*dbHV , 1*dbHH ,  1*(sqHV/sqHH) ] ; //  sea x ice  
//---S2 RGB_COMPOSITIONS : 
var S2_Nat_Fire1=[S2.B04*0.25 + S2.B12*0.8, S2.B03*0.9, S2.B02*0.9]; 
var S2_Nat_Fire2=[S2.B04*1 + S2.B12*2.2 , S2.B03*1.4 + S2.B11*1 + S2.B08*0.4 , S2.B02*3]; 
//---SETUP S1 + S2 RGB_COMPOS: 
var mono = sqHH  ; var C_MONO = [mono,mono,mono] ;
var RGB_S1 = applyEnh_S1 ( S1_EW_2 ) ;  // S1_Ratiosq
var RGB_S2 = applyEnh_S2 ( S2_Nat_Fire1 ) ; // S2_FalseSWIR

//---CLOUDS AND RGB RETURN :
//var CLP=S2.CLP/2.55; var CLPT=99; // ORIG.;DEF=80;0-99:Higher=More Clouds  
var CLP=S2.B11*(1-((S2.B11-S2.B04)/(S2.B11+S2.B04))); var CLPT=0.35 ; // DEF=0.35;0-1:Higher=More Clouds // S2_B11_CLOUDS 
   if ( CLP < CLPT )  {  
	  return {default: RGB_S2 } ;} // RGB_S2
	  return {default: RGB_S1 } ;} // RGB_S1 ; DUPLICATE FOR MONO
//---SETUP ENHANCEMENT : Saturation + Stretch:
var S1min= 0 ; var S1max=1 ; var Satur_S1=1; 
var S2min= 0 ; var S2max=1 ; var Satur_S2=1; 

################################################################################################

EXAMPLES: 
Mount Erebus , Antarctica	:  zoom=8  -77.1,165.1	S-2 (clouds) : 2019-02-12  ; S-1 : 2019-02-01 to  2019-03-01   https://sentinelshare.page.link/USnx

Greenland	:
Iceland, Fagradalsfjall	:	zoom=10	64.01,-22.21	2021-09-29	https://sentinelshare.page.link/fZhy

################################################################################################