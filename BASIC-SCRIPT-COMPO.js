/* BASIC SCRIPT / MORE INFO: https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ */
// ENHANCEMENT FOR ANY DATA SET S2,L8,S3:
function a(a, b) {return a + b};
function stretch(val, min, max) {return (val - min) / (max - min);} 
function satEnh_V(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - SATU_V) + a * SATU_V);}	
function satEnh_I(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - SATU_I) + a * SATU_I);} 
function applyEnh_V(bArr) {return satEnh_V([stretch(bArr[0], Smin_V, Smax_V), stretch(bArr[1], Smin_V, Smax_V), stretch(bArr[2], Smin_V, Smax_V)]);}
function applyEnh_I(bArr) {return satEnh_I([stretch(bArr[0], Smin_I, Smax_I), stretch(bArr[1], Smin_I, Smax_I), stretch(bArr[2], Smin_I, Smax_I)]);}
//#1 INDICES:
//var S2_NDVI = (B08-B04)/(B08+B04); // VEGET x NON-V.: DenseV>.4  LowV=.2,.4  Soils,Clouds:-.1,+.1  Water<0 
var S2_NDWI2 = (B03-B08)/(B03+B08); // Water bodies; std>0.3 (=NDMI)
//var S3_NDWI2 = (B06-B17)/(B06+B17); 
//#2 BAND COMPOSITIONS (water x land) :
var ATM = B10*1;
var S2_Nat1ReRe=[B04*.3+B06*2.8,B03*1+B05*2.6,B02*3];//Better; Water smooth; turbidity,algae
var S2_NatRN1At=[B04*2+B12*.7-ATM,B03*2+B08*.6-ATM,B02*2.5-ATM];// Natural+Veg
//var S3_GeoFalsD=[B21*1.7,B17*1.6,B04*3];//test;VgGreen
//#3 VERSE & INVERSE: 
var MaskV = S2_Nat1ReRe ; var MaskI = S2_NatRN1At ;
//#4 CONTRAST & SATURATION:
var Smin_V=0.2; var Smax_V=.7; var SATU_V=1.3;
var Smin_I=0.1; var Smax_I=.9; var SATU_I=1.5;
//SELECTIVE ENHANCEMENT (FIXED):
var EnhV = applyEnh_V(MaskV); var EnhI = applyEnh_I(MaskI);
//#5 INDEX LIMIT:
return (S2_NDWI2>0.15) ? EnhV : EnhI;
//return (S3_NDWI2>0.15) ? EnhV : EnhI;