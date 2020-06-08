/* BASIC MONO / MORE INFO: https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ */
function a(a, b) {return a + b};
function stretch(val, min, max) {return (val - min) / (max - min);} 
function satEnh_V(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - SATU_V) + a * SATU_V);}	
function applyEnh_V(bArr) {return satEnh_V([stretch(bArr[0], Smin_V, Smax_V), stretch(bArr[1], Smin_V, Smax_V), stretch(bArr[2], Smin_V, Smax_V)]);}
var S2_NDVI = (B08-B04)/(B08+B04); 
var S2_NatNir=[B04*1+B05*2.2,B03*.5+B08*1.3,B02*3];
//var S2_NatRN1At=[B04*2+B12*.7-ATM,B03*2+B08*.6-ATM,B02*2.5-ATM];
// 4) CONTRAST & SATURATION:
var Smin_V=0.3; var Smax_V=.8; var SATU_V=1;
// 5) COMPOSITE/INDEX
var EnhV = applyEnh_V(S2_NatNir);
//return EnhV;
return (S2_NDVI>.2) ? EnhV : [0,0,0];
