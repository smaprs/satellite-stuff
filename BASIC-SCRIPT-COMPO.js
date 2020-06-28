// SHORT SCRIPT of https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ 
function a(a, b) {return a + b};
function stretch(val, min, max) {return (val - min) / (max - min);} 
function satEnh_V(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - SATU_V) + a * SATU_V);}	
function satEnh_I(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - SATU_I) + a * SATU_I);} 
function applyEnh_V(bArr) {return satEnh_V([stretch(bArr[0], Smin_V, Smax_V), stretch(bArr[1], Smin_V, Smax_V), stretch(bArr[2], Smin_V, Smax_V)]);}
function applyEnh_I(bArr) {return satEnh_I([stretch(bArr[0], Smin_I, Smax_I), stretch(bArr[1], Smin_I, Smax_I), stretch(bArr[2], Smin_I, Smax_I)]);}
var S2_NDWI2 = (B03-B08)/(B03+B08); 
// BANDS :
//var MONOB = B04*3; var MONO=[MONOB*1,MONOB*1,MONOB*1];
//var ATM = B10*1; var S2_NatRN1At=[B04*2+B12*.7-ATM,B03*2+B08*.6-ATM,B02*2.5-ATM];// Natural+Veg
var S2_Nat2Enh=[B04*2.7+B05*.3,B03*2.7+B08*.3,B02*3];
var S2_GeoFals1=[B11*1.5+B04*.5,B06*1+B08*1,B02*3];//**excel**
var S2_GeoFals2=[B12*1.6+B04*.3,B05*1.6+B08*0.35,B02*3];
var MaskV = S2_GeoFals2 ; var MaskI = S2_GeoFals2 ;
var Smin_V=0.15; var Smax_V=.8; var SATU_V=1.5;
var Smin_I=0.15; var Smax_I=.8; var SATU_I=1.5;
var EnhV = applyEnh_V(MaskV); var EnhI = applyEnh_I(MaskI);
return (S2_NDWI2>0.3) ? EnhV : EnhI;