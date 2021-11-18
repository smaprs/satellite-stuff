
//VERSION=3 // BASIC MONO https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ 

function a(a, b) {return a + b;} function stretch (val,min,max) {return (val-min)/(max-min);} 
function SATUREnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; 
  return rgbArr.map(a => avg * (1 - SATUR) + a * SATUR);}  
  function ApplyEnh (bArr) {return SATUREnh ([stretch (bArr[0], Rmin, Rmax), stretch (bArr[1], Rmin, Rmax), stretch (bArr[2], Rmin, Rmax)]);   }
var Rmin=-0.1;var Rmax=0.9;var SATUR=2;

// SETUP COMPOSITION: 
//var S2nat = [B04*3,B03*3,B02*3];
//var S2NatEnh =[B04*2.8+B12*0.6,B03*2+B08*1.2  ,B02*3];
var S2NatFire=[B04*1+B12*2.2,B03*2+B11*0.5+B08*0.5,B02*3]; 

var COMPO = S2NatFire; 
var Enh = ApplyEnh (COMPO); return Enh;

===========================================================================================
//VERSION=3 // BASIC DUAL COMPO: https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ 
function a(a, b) {return a + b;} function stretch(val, min, max) {return (val - min) / (max - min);} 
function satEnh_V(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StV) + a * StV);}	
function satEnh_I(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StI) + a * StI);} 
function applyEnh_V(bArr) {return satEnh_V([stretch(bArr[0], SmV, SMV), stretch(bArr[1], SmV, SMV), stretch(bArr[2], SmV, SMV)]);}
function applyEnh_I(bArr) {return satEnh_I([stretch(bArr[0], SmI, SMI), stretch(bArr[1], SmI, SMI), stretch(bArr[2], SmI, SMI)]);}
// INDEX :
var S2_NDWI = (B03-B08)/(B03+B08); 
// SETUP COMPOSITION: 
var NEnh = [B04*3+B05*.2,B03*2.5+B08*.2+B12*.2,B02*3.2];
var NatWater= [B04*2, B03*4, B02*6]; 
var Geo1=[B12*1.7+B04*.30,B05*1.1+B08*.9,B02*3.2];
var MkV = Geo1; var MkI = NatWater ;

var SmV=0.07;var SMV=.8;var StV=1.7;
var SmI=0;var SMI=.8;var StI=2;
var EnhV = applyEnh_V(MkV); var EnhI = applyEnh_I(MkI);
return (S2_NDWI<0) ? EnhV : EnhI;

===========================================================================================

// Sentinel S2-S3 BASIC COMPOSITES https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ 
// Conversion Table for other satellite bands: https://github.com/smaprs/satellite-stuff
//----------------------------------------------
// **INDICES**
var S2NDVI = (B08-B04)/(B08+B04); 
 var S3NDVI = (B17-B08)/(B17+B08); // DenseVeg>.4  LowV=.2,.4  Soils,Clouds:-.1,+.1  Water<0 
var S2NDWI = (B03-B08)/(B03+B08); 
 var S3NDWI = (B06-B17)/(B06+B17); 
var S2NDSI = (B03-B11)/(B03+B11); // std>0.42; // hard:(S2NDSI>0.1 & B03>0.1) // soft=(S2NDSI>0.5 & B03>0.3); 
// **COMPOSITIONS**
var NATURAL= [B04*2.5, B03*2.5, B02*2.5]; 
 var S3NAT = [(B08+B09+B10)*1, B06*3, (B04+B05)*1.5]
var NATEnh1= [B04*2.5, B03*1.8+B08*.6, B02*2.5];
var NATEnh2= [B04*3+B05*.2,B03*2.5+B08*.2+B12*.2,B02*3.2]; // Turbidity
var NATEnh3= [B04*3,B03*2.5+B06*.5,B02*3];//High algae
var FNIR   = [B08*2.5, B04*2.5, B03*2.5];
 var S3FNIR = [B17*2, (B08+B09+B10)*1, (B04+B05)*1.5] //FalseColor NIR
var FSWN= [B12*2.5, B08*2.5, B04*2.5];
 var S3FSWN = [S6*3, B17*3, (B08+B09+B10)*1] //FalseColor SWIR12+NIR
var FSNIR  = [B11*2.5, B08*2.5, B04*2.5];//FalseColor SWIR11+NIR
var FSWIRa = [B12*2.5, B11*2.5, B04*2.5];//FalseColor SWIR double
var FSWIRb = [B02*2.5, B11*2.5, B12*2.5];//FalseColor SWIR double
var AGRI   = [B11*2.5, B08*2, B02*2.5];
var FGEO   = [B12*2.5, B04*2, B02*2.5];
var GEOENH = [B12*1.7+B04*.4,B05*1.8+B08*0.35,B02*3]; 
 //var S3GEOENH = S6*1.5+B08*1, B11*1.5+B17*.5,  (B04+B05)*1.5 // BAD
var BATHY1 = [B12*2.5, B11*2.5, B02*2.5];
var BATHY2 = [B04*2.5, B03*2.5, B01*2.5];
var MOISTIX= [(B8A-B11)/(B8A+B11)];
//----------------------------------------------
//**Landsat-4/5**
var NDWI = (B02-B04)/(B02+B04);
var NatE=[B03*3, B02*2.7+B04*0.3, B01*3];
var Water=[B03*2, B02*3, B01*4];

//===========================================================================================
