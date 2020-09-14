// Sentinel S2-S3 BASIC COMPOSITES https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ 
// Conversion Table for other satellite bands: https://github.com/smaprs/satellite-stuff
function a(a, b) {return a + b}; function stretch(val, min, max) {return (val - min) / (max - min);} 
function satEnh_V(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StV) + a * StV);}	
function satEnh_I(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StI) + a * StI);} 
function applyEnh_V(bArr) {return satEnh_V([stretch(bArr[0], SmV, SMV), stretch(bArr[1], SmV, SMV), stretch(bArr[2], SmV, SMV)]);}
function applyEnh_I(bArr) {return satEnh_I([stretch(bArr[0], SmI, SMI), stretch(bArr[1], SmI, SMI), stretch(bArr[2], SmI, SMI)]);}
//----------------------------------------------
//-- SENTINEL-2 --
// INDICES // 
//var S2NDVI = (B08-B04)/(B08+B04); // var S3NDVI = (B17-B08)/(B17+B08); // DenseVeg>.4  LowV=.2,.4  Soils,Clouds:-.1,+.1  Water<0 
//var S2NDWI2 = (B03-B08)/(B03+B08); // 
//var S2NDSI = (B03-B11)/(B03+B11); // (S2NDSI>0.2 & B03>0.15) OPT:SOFT=(S2NDSI<0.55 & B03<0.4);
//-- BASIC COMPOSITES --
//var NATURAL= [B04*2.5, B03*2.5, B02*2.5]; // S3 = [(B08+B09+B10)*1, B06*3, (B04+B05)*1.5]
//var NATEnh1= [B04*2.5, B03*1.8+B08*.6, B02*2.5];
//var NATEnh2= [B04*3+B05*.2,B03*2.5+B08*.2+B12*.2,B02*3.2]; // Turbidity
//var NATEnh3= [B04*3,B03*2.5+B06*.5,B02*3];//High algae
//var FNIR   = [B08*2.5, B04*2.5, B03*2.5];// S3 = [B17*2, (B08+B09+B10)*1, (B04+B05)*1.5] //FalseColor NIR
//var FSWINIR= [B12*2.5, B08*2.5, B04*2.5];// S3 = [S6*3, B17*3, (B08+B09+B10)*1] //FalseColor SWIR12+NIR
//var FSNIR  = [B11*2.5, B08*2.5, B04*2.5];//FalseColor SWIR11+NIR
//var FSWIRa = [B12*2.5, B11*2.5, B04*2.5];//FalseColor SWIR double
//var FSWIRb = [B02*2.5, B11*2.5, B12*2.5];//FalseColor SWIR double
//var AGRI   = [B11*2.5, B08*2, B02*2.5];
//var FGEO   = [B12*2.5, B04*2, B02*2.5];
//var GEOENH = [B12*1.7+B04*.4,B05*1.8+B08*0.35,B02*3]; //  S3 = S6*1.5+B08*1, B11*1.5+B17*.5,  (B04+B05)*1.5
//var BATHY1 = [B12*2.5, B11*2.5, B02*2.5];
//var BATHY2 = [B04*2.5, B03*2.5, B01*2.5];
//var MOISTIX= [(B8A-B11)/(B8A+B11)];
//----------------------------------------------
//-- SENTINEL-3 --
var S3NDWI2 = (B06-B17)/(B06+B17); // WATER INEX (S2NDWI2>-.015)&(B03<.15) OPT
//var S3NATEnh2 = [(B08+B09+B10)*.7+B11*.3, B06*1.8+(B16+B18)*.4, (B04+B05)*1.5] //Turbidity
var S3G1a=[B20*.15+B08*1.7,B06*1.6+B17*.2,B04*2-B21*.1];
//var S3G2a=[B20*1+B08*1,B16*.2+B06*1.2,B04*2.1-B21*.5];
//----------------------------------------------
var MkV = S3G1a; var MkI = MkV; //Default: no distinction
var SmV=0.05;var SMV=.9;var StV=2;
var SmI=SmV;var SMI=SMV;var StI=StV; //Default: no distinction
var EnhV = applyEnh_V(MkV); var EnhI = applyEnh_I(MkI);
return (S3NDWI2>0)? EnhV : EnhI;
