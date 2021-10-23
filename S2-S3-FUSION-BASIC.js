//VERSION=3 // MULTI-DATASET 
// Source: SAJV - https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ 
// Location Example: Pantanal: -16.9831,-57.34654  https://sentinelshare.page.link/mGYk 

function setup() {return {
    input: [
	{datasource: "S2L1C", bands: ["B02", "B03", "B04", "B08", "B11", "B12"]},
	{datasource: "S3OLCI", bands: ["B04", "B06", "B08", "B12", "B13", "B20"]}],
    output: [{bands: 3}]};}
function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);}
//Apply Enhacement for S2
function SatuEnh_S2 (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-Satur_S2) + a * Satur_S2);}
function applyEnh_S2(bArr) {return SatuEnh_S2([stretch(bArr[0], S2min, S2max), stretch(bArr[1], S2min, S2max), stretch(bArr[2], S2min, S2max)]);}
//Apply Enhacement for S3
function SatuEnh_S3(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-Satur_S3) + a * Satur_S3);}
function applyEnh_S3(bArr) {return SatuEnh_S3([stretch(bArr[0], S3min, S3max), stretch(bArr[1], S3min, S3max), stretch(bArr[2], S3min, S3max)]);}

//SETUP Enhacement : Saturation + Stretch:
var S3min=-0.2 ; var S3max=1.3 ; var Satur_S3=2; //BACKGROUND
var S2min=-0.2 ; var S2max=0.6 ; var Satur_S2=7; //FOREGROUND

//SETUP Band Compositions:
function evaluatePixel(samples) { 
 var S3OLCI = samples.S3OLCI[0];
 var S2L1C  = samples.S2L1C[0];
let ATMS3 = S3OLCI.B13/(S3OLCI.B13+S3OLCI.B20);
let S3EnhATMS3 = [(S3OLCI.B08*3)*ATMS3,(S3OLCI.B06*2.5+S3OLCI.B12*0.5)*ATMS3,(S3OLCI.B04*3)*ATMS3];
let S2Fire = [S2L1C.B04*0.8+S2L1C.B12*1.4,S2L1C.B03*1.0+S2L1C.B11*0.8+S2L1C.B08*0.1,S2L1C.B02*2];
let RGB_Enh_S2 = applyEnh_S2 ( S2Fire ) ;
let RGB_Enh_S3 = applyEnh_S3 ( S3EnhATMS3 ) ;

  if ((S2L1C.B11>0.6)||(S2L1C.B12>0.4)) { // SETUP CUT LIMIT
  return {default: RGB_Enh_S2 };} 
  return {default: RGB_Enh_S3 };}

//MONO for TESTS:
//if (S2L1C.B11>0.4) {return  [1,1,0] ;} return  [0,0,0];} 

//CUT LIMITS:
//for wildfires : ((S2L1C.B11>0.6)||(S2L1C.B12>0.5)) 