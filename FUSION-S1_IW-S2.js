//VERSION=3 + WATER MASK 
/* S1+S2 Fusion CLouds + WATER MASK + Enhancement by SAJV : Useful for CLOUDS ; 
References/Adapted from : 
Pierre Markuse : https://custom-scripts.sentinel-hub.com/data-fusion/s2l1c_s1grd_cloud_replacement/
                 https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
SAR-Ice          : https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674  */
// DISABLED AT ZOOM < 9 ; SETUP: TIMESPAN BOTH S1 & S2 // ADDITIONAL DATASETS 1)S2L1C + 2)S1GRD :
var setup=()=>({  input:[
    {datasource:"S2L1C",bands:["B02", "B03", "B04", "B08", "B11", "B12", "CLM", "CLP"], units: "REFLECTANCE", mosaicking: "ORBIT"},
    {datasource:"S1GRD",bands:["VV", "VH"], units: "REFLECTANCE", mosaicking: "ORBIT"},],
  output:[{ id:"default",bands:3,sampleType:SampleType.AUTO}],});

function a(a, b) {return a + b;} function stretch (val,min,max) {return (val-min)/(max-min);}
//Enhacement S1:
function SatuEnh_S1(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-Satur_S1) + a * Satur_S1);}
function applyEnh_S1(bArr) {return SatuEnh_S1([stretch(bArr[0], S1min, S1max), stretch(bArr[1], S1min, S1max), stretch(bArr[2], S1min, S1max)]);}
//Enhacement S2:
function SatuEnh_S2 (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-Satur_S2) + a * Satur_S2);}
function applyEnh_S2(bArr) {return SatuEnh_S2([stretch(bArr[0], S2min, S2max), stretch(bArr[1], S2min, S2max), stretch(bArr[2], S2min, S2max)]);}

//SETUP RGB_COMPOS ; WEIGHTS: 1*VV ~ 4*VH
function evaluatePixel(samples) {
  var S2=samples.S2L1C[0];
  var VV=samples.S1GRD[0].VV ; var VH=samples.S1GRD[0].VH ;
//---S1-EW BASICS : 
var dbVH = (Math.max(0,Math.log(VH)*0.21714724095+1));
var dbVV = (Math.max(0,Math.log(VV)*0.21714724095+1));   
var sqVH = (Math.sqrt(VH+0.012)); // 0.012 AFFECTS Water Threshold sqVH/sqVV
var sqVV = (Math.sqrt(VV+0.012)); // 0.012 AFFECTS Water Threshold sqVH/sqVV
//---S1 RGB_COMPOSITIONS : 
var S1_IW_1 = [4.5*VV , 3.5*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))]; // India_2
var S1_IW_2 = [1.25*(1-dbVV), 3.75*(VH/(VV+VH)), 0.95*(1-(sqVH/sqVV))]; // India_1 , La_Palma_1, Patanal ; WATER_MASK https://sentinelshare.page.link/H1id
var S1_IW_3a = [1.35*dbVV, 3*sqVH , 1*(sqVH/(sqVV+sqVH)) ]; // La_Palma_2
var S1_IW_3b = [1.5*dbVV, 4*sqVH , 1.25*(sqVH/(sqVV+sqVH)) ]; // La_Palma_2
var S1_IW_4 = [2*sqVV , 3.5*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))]; // La_Palma_3
var S1_IW_5 = [1.25*(dbVV), 3.75*(VH/(VV+VH)), 0.95*((sqVH/sqVV))]; // TEST 
var S1_IW_6 = [4*(VV-VH), 2*dbVH, 4*(((2*sqVH)-sqVV)/((2*sqVH)+sqVV))]; // TEST 
//---S2 RGB_COMPOSITIONS : 
var S2_Nat_Fire1=[S2.B04*0.25 + S2.B12*0.8, S2.B03*0.9, S2.B02*0.9]; 
var S2_Nat_Fire2=[S2.B04*1 + S2.B12*2.2 , S2.B03*1.4 + S2.B11*1 + S2.B08*0.4 , S2.B02*3]; 
//---SETUP S1 + S2 RGB_COMPOS: 
var mono = sqVV  ; var C_MONO = [mono,mono,mono] ;
var RGB_S1 = applyEnh_S1 ( S1_IW_2 ) ; // Clouds:[0,0,2] for test
var RGB_S2 = applyEnh_S2 ( S2_Nat_Fire2  ) ; 
//---SETUP WATER THRESHOLD FOR SUBSTITUTION :
//   Default = S1_WThresh_VV BETTER: LESS INTERFERENCE 
     var S1_WATER_Blue = [0 , 0.5*(sqVH/sqVV) , 1*(sqVH/sqVV)] ; // FOR WATER MASK ; CHANGE VALUES FOR ENHANCEMENT
     var S1_WThresh_VV = 0.030 ; // FOR VV : lower = less water ; def=0.025 
   //var S1_WThresh_sqHdV = 0.70  ; // WORSE, INTERFERENCES : FOR sqVH/sqVV : lower = less water ; def=0.800
//---CLOUDS AND RGB RETURN :
//var CLP=S2.B11*(1-((S2.B11-S2.B04)/(S2.B11+S2.B04))); var CLPT=0.3 ; // DEF=0.35;0-1:Higher=More Clouds // S2_B11_CLOUDS 
var CLP = S2.CLP / 2.55; // 0-100 Cloud Propability
var CLPT= 50;  // default=80 ; Cloud Propabilty Threshold 0-99 : HIGHER = MORE CLOUDS VISIBLE
  if ( CLP > CLPT )  // Cloud Cutting 
    //---WATER THRESHOLD (ONLY 01:ENABLE/DISABLE):
     {return (       VV > S1_WThresh_VV     ) ? {default: RGB_S1} : {default: S1_WATER_Blue} ;} 
   //{return ( sqVH/sqVV < S1_WThresh_sqHdV ) ? {default: RGB_S1} : {default: S1_WATER_Blue} ;} 
{return {default: RGB_S2 } ; }  }  // Duplicate for mono
//---SETUP ENHANCEMENT : Saturation + Stretch:
var S1min= 0 ; var S1max=1 ; var Satur_S1=1; 
var S2min= 0 ; var S2max=1 ; var Satur_S2=1; 

//OK

################################################################################################

EXAMPLES: 
INDIA : zoom=10 24.9,85.8	S2-CLOUDS : 2021-10-04 		S1 : 2021-10-25 	https://sentinelshare.page.link/7egH

################################################################################################