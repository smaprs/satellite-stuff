//VERSION=3
// PLEIADES-AIRBUS : ALL BANDS PANSHARPENED + MULTI-COMPOSITION + SELECTIVE ENHANCEMENT 
// Script by SAJV ; Script License: CC-BY-SA 4.0 ; Based on Pierre Markuse https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
// BANDS : B0=Blue; B1=Green; B2=Red; B3=NIR 
	
function a(a, b) {return a + b;} function stretch(val, min, max) {return (val - min) / (max - min);} 
function satEnh_V(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StV) + a * StV);}	
function satEnh_I(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StI) + a * StI);} 
function applyEnh_V(bArr) {return satEnh_V([stretch(bArr[0], SmV, SMV), stretch(bArr[1], SmV, SMV), stretch(bArr[2], SmV, SMV)]);}
function applyEnh_I(bArr) {return satEnh_I([stretch(bArr[0], SmI, SMI), stretch(bArr[1], SmI, SMI), stretch(bArr[2], SmI, SMI)]);}

//PAN-SHARPENING PRE-PROCESS :
let Weight_0123 = ( B0*0.2 + B1*0.34 + B2*0.34 + B3*0.23 ) / 1 ; // Band Weights for Pleiades
let PanRatio = PAN / Weight_0123 * 2.5; 

//BRIGHTNESS FOR ALL BANDS : adjust for different scenes if needed
let Fx = 1 / 6000; // lower=brighte; default~6000; Snow~20000

//PAN-SHARPENING PROCESS :
var P0 = B0 * Fx * PanRatio ; 
var P1 = B1 * Fx * PanRatio ; 
var P2 = B2 * Fx * PanRatio ; 
var P3 = B3 * Fx * PanRatio ; 

// MAIN INDICES FOR MASKING: 
//var NDVI    = (P3-P2) / (P3+P2) ; // Ground < 0.2
var NDWI    = (P1-P3) / (P1+P3) ; // Water > 0.0 to 0.4
//var IOX     =  P2/P0 ; // > 1.70 ; // R/B

// COMPOSITIONS : 
var NaturalTC = [P2*1, P1*1, P0*1 ] ;
var NaturalEnh  = [P2*0.9, P1*0.75+P3*0.1, P0*1 ] ;
var Nat_IOxNir1=[(P2/P0)*0.1+P2*0.45, P1*0.55+P3*0.2, P0*1.1 ] ; 

var MkV = Nat_IOxNir1 ; var MkI = NaturalTC ;
var SmV= -0.05 ; var SMV=1.05 ; var StV= 1.3 ; // LAND
var SmI= -0.15 ; var SMI=1.15 ; var StI= 1.1 ; // WATER

var EnhV = applyEnh_V(MkV) ;  
var EnhI = applyEnh_I(MkI) ;

return ( NDWI < 0 ) ? EnhV : EnhI ; 