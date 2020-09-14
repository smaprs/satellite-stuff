// BASIC COMPO https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ 
function a(a, b) {return a + b}; function stretch(val, min, max) {return (val - min) / (max - min);} 
function satEnh_V(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StV) + a * StV);}	
function satEnh_I(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StI) + a * StI);} 
function applyEnh_V(bArr) {return satEnh_V([stretch(bArr[0], SmV, SMV), stretch(bArr[1], SmV, SMV), stretch(bArr[2], SmV, SMV)]);}
function applyEnh_I(bArr) {return satEnh_I([stretch(bArr[0], SmI, SMI), stretch(bArr[1], SmI, SMI), stretch(bArr[2], SmI, SMI)]);}
var S2_NDWI2 = (B03-B08)/(B03+B08);

// WATER Turbidity // 
var S2TNR=[B04*4.2-B08*3.2,B03*3+B07*1.35,B02*5];// Turbidity S2 L2A // var SmV=0.23;var SMV=.42;var StV=1.9;
var S2NEnh=[B04*3+B05*.2,B03*2.8+B08*.1+B12*.2,B02*3.2];//NaturalEnhanced
var S2REg=[B04*3,B03*2.5+B06*.5,B02*3];// High algae

// GEOLOGY // 
var S2GF1=[B12*1.60+B04*.23,B05*1.55+B08*0.5,B02*3];// S2 L1C // var SmV=0.09;var SMV=.92;var StV=3.5;

var MkV = S2TNR; var MkI = MkV ;
var SmV=0.23;var SMV=.42;var StV=1.9;
var SmI= -0.2;var SMI=1.2;var StI=0;
var EnhV = applyEnh_V(MkV); var EnhI = applyEnh_I(MkI);
return (S2_NDWI2>0)? EnhV : EnhI;
