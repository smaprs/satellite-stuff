//VERSION=3  
/* S-1 IW/EW Basic/Temporal/Multi_Compo Script, by SAJV 
References / Adapted / custom-scripts / from : 
Pierre Markuse   : https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
SAR-Ice          : https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674  */

function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);}
function ApplyEnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-SATUR) + a * SATUR);}

// SETUP : ENABLE TIMESPAN ; max:zooom=6
function setup() {return {
  input:[{ bands: ["HH","HV"] }],
  output: { bands: 3 }, mosaicking: "SIMPLE" };} // MAX ZOOM = 6

//--SETUP EW COMPOSTIONS :
function evaluatePixel(sample) { 
  var HH=sample.HH; var HV=sample.HV;  // 1*HH ~ 3*HV
var dbHV = (Math.max(0,Math.log(HV)*0.21714724095+1)); // 1.25*
var dbHH = (Math.max(0,Math.log(HH)*0.21714724095+1)); // 1*
var sqHV = (Math.sqrt(HV+0.002)); // 1.5*//0.002:higher=brighter
var sqHH = (Math.sqrt(HH+0.002)); // 1.* //0.002:higher=brighter
var dbH_V = 0.25*((4*dbHH)-(dbHV)) ; // +++ sea + wind
//--SETUP EW RGB COMPO:  
var mono = sqHH  ; var C_MONO = [mono,mono,mono] ;
var S1_EW_1 = [ 1.2*dbHV , 0.95*dbHH , 2.5*(sqHH-sqHV) ] ; // ++ sea dark gr.blue, rocks brown , ice white
var S1_EW_2 = [ 1.5*sqHV , 1*sqHH , 2*(sqHH-sqHV) ] ; // + sea dark blue, rocks brown , ice white
var S1_EW_3 = [ 1.2*dbHV , 0.85*dbHH , 1.2*(1-(sqHV/sqHH))  ] ; // sea vivid 
var S1_EW_4 = [ 1.5*dbHV , 1*dbHH ,  1*(sqHV/sqHH) ] ; //  sea x ice  
  var RGBcompo =  S1_EW_1 ; return ApplyEnh (RGBcompo);}

//--SETUP ENHANCEMENT :  
var Rmin=-0.05; var Rmax=1.05; var SATUR=1.5;



################################################################################################
EXAMPLES EW :	BOUND LIMITS = zoom=9(EOB) -75.0000°(SOAR) 
----------------------------------------------------------------------------------------
Mount Erebus (Volcano), Ross Island	:			zoom=8	-77.1,165.1		2019: 02-12 (clouds)
----------------------------------------------------------------------------------------
Iceberg A74, Brunt, Ronne Ice Shelf	: Goo33%	zoom=6	-75.5,-29.1		2021: 02-25 ; 03-05* ; 03-09 ; 03-17 ; 04-26 ; 05-15 ; 06-25 ; 08-12 ; 09-05 ; 11-04	
----------------------------------------------------------------------------------------
Ice Tongue 	:	2021-11-04 zoom=9  75.18805,-142.16583 https://sentinelshare.page.link/Hn7g
----------------------------------------------------------------------------------------
Antarctic Peninsula, Larsen Ice Shelf	:	zoom=6	-72.5,-60.5		(< -74.9)	2021-11-11		https://sentinelshare.page.link/5LpC
----------------------------------------------------------------------------------------
Greenland	: 	zoom=6		60.8,-46.1			https://sentinelshare.page.link/qT7y
----------------------------------------------------------------------------------------
Iceland, Fagradalsfjall	:	zoom=10	64.01,-22.21	2021-09-29	https://sentinelshare.page.link/fZhy
################################################################################################
