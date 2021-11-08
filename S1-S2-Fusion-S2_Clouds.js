//VERSION=3
/* S1+S2 Fusion Data Enhancement by SAJV : Useful for CLOUDS
References/Adapted from : 
Pierre Markuse : https://custom-scripts.sentinel-hub.com/data-fusion/s2l1c_s1grd_cloud_replacement/
                 https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
Valters Zeizis : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_rvi_temporal_analysis 
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674  */  

/* EXAMPLE: INDIA : 
   zoom=10  24.53859,85.71087   https://sentinelshare.page.link/6YMh
   Sentinel-1 : 2021-10-04 (with clouds) // cloudless : 
   Sentinel-2 : 2021-10-25  */  
   
// **IMPORTANT** : DISABLED AT ZOOM < 9 ; 
//   SET ADDITIONAL DATASETS 1)S2L1C + 2)S1GRD ; 
var setup=()=>({
  input:[
    {datasource:"S2L1C",bands:["B02", "B03", "B04", "B08", "B11", "B12", "CLM", "CLP"], units: "REFLECTANCE", mosaicking: "ORBIT"},
    {datasource:"S1GRD",bands:["VV", "VH"], units: "REFLECTANCE", mosaicking: "ORBIT"},],
  output:[{ id:"default",bands:3,sampleType:SampleType.AUTO}],});

function a(a, b) {return a + b;} function stretch (val,min,max) {return (val-min)/(max-min);}
//Enhacement for S1:
function SatuEnh_S1(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-Satur_S1) + a * Satur_S1);}
function applyEnh_S1(bArr) {return SatuEnh_S1([stretch(bArr[0], S1min, S1max), stretch(bArr[1], S1min, S1max), stretch(bArr[2], S1min, S1max)]);}
//Enhacement for S2:
function SatuEnh_S2 (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-Satur_S2) + a * Satur_S2);}
function applyEnh_S2(bArr) {return SatuEnh_S2([stretch(bArr[0], S2min, S2max), stretch(bArr[1], S2min, S2max), stretch(bArr[2], S2min, S2max)]);}

//SETUP ENHANCEMENT : Saturation + Stretch:
var S1min= -0.1 ; var S1max=0.9 ; var Satur_S1=1.2; 
var S2min= -0.1 ; var S2max=0.9 ; var Satur_S2=2; 

//SETUP BAND COMPOSITIONS :
function evaluatePixel(samples) {
  var S1  = samples.S1GRD[0]; var VV=S1.VV; var VH=S1.VH;
  var S2  = samples.S2L1C[0];
var dbVH = (Math.max(0,Math.log(VH)*0.21714724095+1));
var dbVV = (Math.max(0,Math.log(VV)*0.21714724095+1));   
var sqVH = (Math.sqrt(VH+0.012)); // 0.012 AFFECTS Water Threshold sqVH/sqVV
var sqVV = (Math.sqrt(VV+0.012)); // 0.012 AFFECTS Water Threshold sqVH/sqVV
//---SETUP BAND COMPOSITIONS
var S1_LAND_FOREST = [(1-dbVV)*1.5, 4*(VH/(VV+VH)), 1-(sqVH/sqVV)]; // RVI = 4*(VH/(VV+VH))
var S1NatFire1     =[1-dbVV , 3*(VH/(VV+VH))  , 1-(sqVH/sqVV) ];//R=Soil,Burn;G=Veg;B=Water
var S1NatFire2     =[1-sqVV , 3.5*(VH/(VV+VH)), 1-(sqVH/sqVV) ];
var S2NatFire      = [S2.B04*1.6 + S2.B12*1.4 , S2.B03*1.6 + S2.B11*0.8 + S2.B08*0.3 , S2.B02*3]; // Natural Enhanced
var S1_LaPalma= [1.5*dbVV , 3*sqVH , 1*((sqVV)/(sqVV+(2*sqVH)))]; // Lava https://sentinelshare.page.link/7fX3
//---SETUP RGB_COMPOS: 
var RGB_S1 = applyEnh_S1 ( S1_LAND_FOREST ) ; // Clouds:[0,0,2] for test
var RGB_S2 = applyEnh_S2 ( S2NatFire  ) ; 
//---SETUP WATER THRESHOLD FOR SUBSTITUTION :
//   DEFAULT = S1_WThresh_VV BETTER: LESS INTERFERENCE 
     var S1_WATER_Blue = [0 , 0.5*(sqVH/sqVV) , 1*(sqVH/sqVV)] ; // FOR WATER MASK ; CHANGE VALUES FOR ENHANCEMENT
     var S1_WThresh_VV = 0.025 ; // FOR VV : lower = less water ; def=0.025 
   //var S1_WThresh_sqHdV = 0.70  ; // WORSE, INTERFERENCES : FOR sqVH/sqVV : lower = less water ; def=0.800
//---CLOUDS AND RGB RETURN :
var CLP = S2.CLP / 2.55; // 0-100 Cloud Propability
var CLPT= 80;  // DEF=80 ; Cloud Propabilty Threshold 0-99 : HIGHER = MORE CLOUDS VISIBLE
  if ( CLP > CLPT )  // Cloud Cutting 
    //---ENABLE/DISABLE 01 WATER THRESHOLD:
     {return (       VV > S1_WThresh_VV     ) ? {default: RGB_S1} : {default: S1_WATER_Blue} ;} 
   //{return ( sqVH/sqVV < S1_WThresh_sqHdV ) ? {default: RGB_S1} : {default: S1_WATER_Blue} ;} 
{return {default: RGB_S2 } ; }  }  // Duplicate for mono

//OK

/* 
################################################################################
################################################################################
TESTS : NASA : Clouds,Fires: 2021-10-24,23,18,17,05
=================================================
INDIA :  zoom=12   28.95461,79.87043  Pilibhit, Uttar Pradesh //  zoom=11  28.92329,80.03626  /  zoom=9  28.87381,80.11848   
NASA_Fires	: 2021-10-13_16 , 28_30 
NASA_Clouds	: 2021-10-16

S2(+clouds)	: 2021-10-13	,28,23+,18++,13		https://sentinelshare.page.link/2b64
var S2NatFire = [B04*1+B12*2.2,B03*2+B11*0.5+B08*0.5,B02*3]; //ok 

S1 			: 2021-10-28 	,28,21d,13a,09d,01a  	https://sentinelshare.page.link/PQXR	ascending:better 

COMPOS:
var S1NatFire1 = [1-dbVV,3*(VH/(VV+VH)),1-(sqVH/sqVV)]; // First

TESTS:
var sqNDVH = 4*( ((2*sqVH)-sqVV) / ((2*sqVH)+sqVV) ) ; // = 	only water // Norm.Diff.VH Index sqrt // var NDVH   = (VH-VV)/(VV+VH) ;

################################################################################
=================================================
INDIA : 23.72173,86.29151 zoom=12 JHARKHAN
S2cloud		: 2021-10-04	,24+,19+,04++ ; 
S1 			: 2021-10-25	,25,13
=================================================
INDIA : 30.82792,74.42451 zoom=13 PUNJAB1
S2cloud		: 2021-10-29	,29,24c ; 
S1 			: 2021-10-31	,31,19,07
=================================================

RUSSIA, IAKUTIA :

################################################################################
*/  