// BASIC MONO https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ 
function a(a, b) {return a + b}; function stretch(val, min, max) {return (val - min) / (max - min);} 
function satEnh_V(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StV) + a * StV);}
function applyEnh_V(bArr) {return satEnh_V([stretch(bArr[0], SmV, SMV), stretch(bArr[1], SmV, SMV), stretch(bArr[2], SmV, SMV)]);}
var S2_NDWI2 = (B03-B08)/(B03+B08);
// WATER Turbidity // 
var S2SN1=[B04*3+B11*.5,B03*1+B08*3,B02*3];//enh:.2;.8;2;
// GEOLOGY // 
var S2GF1=[B12*1.55+B04*.25,B05*1.2+B08*0.6,B02*2.8];// S2 L1C // enh:.1;.9;2;
var MkV = S2GF1; 
var SmV=0.1;var SMV=.9;var StV=2;
var EnhV = applyEnh_V(MkV); 
return EnhV 
