//VERSION=3  
/* S-1 EW HV_HH 3Dates/Single_Compo/Enhancement Script, by SAJV ; 
References / Adapted / custom-scripts / from : 
Pierre Markuse   : https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
Annamaria Luongo : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_multi-temporal_backscatter_coefficient_composite/
SAR-Ice          : https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/  */
//Date analysis:
function filterScenes (scenes) { return scenes.filter( function (scene) {var allowedDates = [Date_0, Date_1, Date_2]; var sceneDateStr = dateformat(scene.date);  if (allowedDates.indexOf(sceneDateStr)!= -1) return true; else return false; } ); } 
function dateformat(d) {var dd = d.getDate(); var mm = d.getMonth()+1; var yyyy = d.getFullYear(); if(dd<10){dd='0'+dd;} if(mm<10){mm='0'+mm;} var isodate = yyyy+'-'+mm+'-'+dd; return isodate; }
//Stretch RGB:
function a(a, b) {return a + b;} function stretch (val,min,max) {return (val-min)/(max-min);}
function ApplyEnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-SATUR) + a * SATUR);}

function setup() {return {
  input:[{ bands: ["HH","HV"] }], 
  output: { bands: 3 },
  mosaicking: "ORBIT" };} // MAX ZOOM = 6

// SETUP TIMESPAN : (A)scending / (D)escending : 
// EXAMPLE : Greenland : 64.1,-46.1 
var Date_0 = "2021-11-10"; // 0=recent
var Date_1 = "2021-06-07"; // 1=middle 
var Date_2 = "2021-03-27"; // 2=earliest

//SETUP BAND COMPOSITIONS : // 1*HH ~ 3*HV ; sqHH ~ 1.5*sqHV
function Calc_FX(sample) { var HV=sample.HV ; var HH=sample.HH; 
//---S1-EW BASICS : 
var dbHV=(Math.max(0,Math.log(HV)*0.21714724095+1));// 
var dbHH=(Math.max(0,Math.log(HH)*0.21714724095+1));//++ 0,1,2
var sqHV=(Math.sqrt(HV+0.002)); // 0.002:higher=brighter
var sqHH=(Math.sqrt(HH+0.002)); // 0.002:higher=brighter
var nHVsq=(2*sqHV)/(sqHH+(sqHV));//++ 2,1,0 // normalized=RVI 
var nHHsq=(sqHH/(sqHH+(2*sqHV)));// normalized=NVVI 
var dbH_V = 0.25*((4*dbHH)-(dbHV)) ; // +++ sea + wind
//--SETUP COMPO MONO:  
var Compo_1=2*(HV/HH); // bad
var Compo_2=(dbHV+dbHH)/2;// + 0,1,2
var Compo_3=1*(sqHV/sqHH);// + 2,1,0
var Compo_4=0.75*(Math.log(sqHH/sqHV));// + 0,1,2
return  nHVsq ;} // nHVsq ; dbHH

//SETUP Stretch & Saturation: 
var Rmin=0.0; var Rmax=1.0; var SATUR=1.0;
//RGB visualization: 
function evaluatePixel(samples) {var S0 = Calc_FX(samples[0]); var S1 = Calc_FX(samples[1]); var S2 = Calc_FX(samples[2]);
var RGBcompo = [ 
   // (DEF=0,1,2) ; DISABLE(Sx=0) FOR 2 DATES EXTREMES 
   1*(stretch (S2,Rmin,Rmax)),  //R
   1*(stretch (S1,Rmin,Rmax)),  //G 
   1*(stretch (S0,Rmin,Rmax))]; //B 
return ApplyEnh (RGBcompo);}

====================================================================================
EXAMPLES : 
====================================================================================
Greenland:	S1_EW_HV_HH		zoom=8		60.6,-45.4		3DATES:		Ascending	https://sentinelshare.page.link/C49G
var Date_0 = "2021-11-10"; // 0=recent
var Date_1 = "2021-06-07"; // 1=middle 
var Date_2 = "2021-03-27"; // 2=earliest
====================================================================================
A-74-Iceberg 		2021-03-21 zoom=7	-75.1,-29.1	 https://sentinelshare.page.link/ebSf
var Date_0 = "2021-09-05"; //=R=0=recent
var Date_1 = "2021-08-12"; //=G=1=middle
var Date_2 = "2021-03-21"; //=B=2=earliest
====================================================================================