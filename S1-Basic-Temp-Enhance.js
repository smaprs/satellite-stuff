//VERSION=3  
/* S-1 BASIC Multi-Temp Selective Multi-Compo Enhancement by SAJV 
References / Adapted / custom-scripts / from : 
Pierre Markuse   : https://custom-scripts.sentinel-hub.com/data-fusion/s2l1c_s1grd_cloud_replacement/
                   https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
Annamaria Luongo : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_false_color_visualization/
Valters Zeizis   : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_rvi_temporal_analysis 
SAR-Ice          : https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674  */
// COMMON WEIGHTS EMPIRICAL (RETRY):  (4x) 2*VV~8*VH ; (2x) 1*dbVV~2*dbVH ; (2x) 1.5*sqVV~3*sqVH
// EXAMPLE: INDIA  zoom=7   26.01,70.01  2021-11-06 to 2021-10-06
// *IMPORTANT* : ENABLE EO-BROWSER TIMESPAN
function a(a, b) {return a + b;} function stretch(val, min, max) {return (val - min) / (max - min);} 
function SatEnh1(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - C1sat) + a * C1sat);}	
function SatEnh2(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - C2sat) + a * C2sat);}	
function AppEnh1(bArr) {return SatEnh1([stretch(bArr[0], C1min, C1max), stretch(bArr[1], C1min, C1max), stretch(bArr[2], C1min, C1max)]);}
function AppEnh2(bArr) {return SatEnh2([stretch(bArr[0], C2min, C2max), stretch(bArr[1], C2min, C2max), stretch(bArr[2], C2min, C2max)]);}
//--SETUP BAND COMPOSITIONS  :
var dbVH=(Math.max(0,Math.log(VH)*0.21714724095+1));var dbVV=(Math.max(0,Math.log(VV)*0.21714724095+1));
var sqVH=(Math.sqrt(VH+0.012)); var sqVV=(Math.sqrt(VV+0.012)); 
//--(**) ENABLE FOR WATER SUBSTITUTION :
var S1_WATER_MASK1  = [ 0 , 0.3 , 0.5 ] ; 
//var S1_WATER_MASK2  = [1*dbVV , 3*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))] ; 
var S1_WDETECT1 = VV ;  var S1_WTHRESH1 = 0.03 ; // DEF=0.03 ; HIGHER=MORE_WATER // BETTER FOR FORESTS
var S1_WDETECT2 = ((VV/(VH+VV))-(4*VV)) ; var S1_WTHRESH2 = 0.75; // BETTER // DEF= 0.75 ; LOWER=MORE_WATER // BETTER FOR DESERTS
//--SETUP RGB_COMPOS: 
var S1_NatEnhW1    = [(1-dbVV)*1.25, 3.75*(VH/(VV+VH)), 0.95*(1-(sqVH/sqVV))]; // Needs WATER_MASK // RVI = 4*(VH/(VV+VH)) India, Panatanal
var S1_NatEnhW2    = [4*(VV-VH), 2*dbVH, 4*(((2*sqVH)-sqVV)/((2*sqVH)+sqVV))] ; // TEST 
//var S1_FalseColor1 = [2*sqVV , 3.5*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))]; // S1_LaPalma
var S1_FalseColor2 = [5*VV, 3.5*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))]; // India
//--SETUP RGB AND ENHANCEMENT :  
var C1L = S1_NatEnhW1 ; var C2W = S1_WATER_MASK1 ; // (**C2W WATER_MASK)
var C1min=0.0 ; var C1max=1.0 ; var C1sat=1 ;  
var C2min=0.0 ; var C2max=1.0 ; var C2sat=1; // (**)
//---------------------------------------
var Enh1L=AppEnh1(C1L); var Enh2W=AppEnh2(C2W); // (**C2W)
return ( S1_WDETECT2 < S1_WTHRESH2 ) ? Enh1L  :  Enh2W ; // (**)
//return  Enh1L ; // FOR SINGLE COMPOSITION


/*
################################################################################################
EXAMPLE: INDIA :  zoom=7  25.001,69.001  2021-10-15 to 2021-11-06 https://sentinelshare.page.link/HWnf   
==============================================================================================
MULTI-TEMPORAL BASIC : Setup BROWSER timespan : 
-----------------------------------------------
India 		:	zoom=7   26.00001,87.00001  2021-03-04 to 2021-02-20  = Sentinel-2 (Less Clouds) / Sentinel-1 https://sentinelshare.page.link/1b7n
LaPalma		: 	zoom=12  28.57879,-17.8672  2021-11-03					https://sentinelshare.page.link/rq4h

Pantanal	:
Sentinel-2	:	zoom=7  -17.30001,-55.30001  2021-09-23 to 2021-09-15	https://sentinelshare.page.link/GxH2
Sentinel-1	:	zoom=7  -17.30001,-55.30001  2021-10-15 to 2021-09-15	https://sentinelshare.page.link/FxgN



################################################################################################
 */