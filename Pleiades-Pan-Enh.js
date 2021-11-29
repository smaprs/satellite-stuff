//VERSION=3
// PLEIADES-AIRBUS : ALL BANDS PANSHARPENED + MULTI-COMPOSITION + SELECTIVE ENHANCEMENT 
// Script by SAJV ; Script License: CC-BY-SA 4.0 ; Based on Pierre Markuse https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
// BANDS : B0=Blue; B1=Green; B2=Red; B3=NIR 

function setup() {  return {
    input: ["B0", "B1", "B2", "B3", "PAN", "dataMask"],
    output: { bands: 4 }};}

//Stretch RGB : 
function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);}
function ApplyEnh1 (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-Sat1) + a * Sat1);}
function ApplyEnh2 (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1-Sat2) + a * Sat2);}

function evaluatePixel(sample) {
var B0=sample.B0; var B1=sample.B1; var B2=sample.B2; var B3=sample.B3; var PAN=sample.PAN; 	
	
//let weight_210  = (B2+B1+B0*0.4)/2.4; // original, not used
let weight_0123 = ( B0*0.2 + B1*0.34 + B2*0.34 + B3*0.23 ) / 1 ; // Band Weights for Pleiades
let PanRatio = PAN / weight_0123 * 2.5; // PanRatio

//BRIGHTNESS FOR ALL BANDS : 
let Fx = 1 / 5000; // Factor for Brightness ; lower=brighter ; adjust for different scenes if needed.

//PAN-SHARPENING PROCESS :
var B0P= B0 * Fx * PanRatio ; 
var B1P= B1 * Fx * PanRatio ; 
var B2P= B2 * Fx * PanRatio ; 
var B3P= B3 * Fx * PanRatio ; 

//var NDVI = (B3P-B2P) / (B3P+B2P) ;
var NDWI = (B1P-B3P) / (B1P+B3P) ; // ~ THRESHOLD : Water > 0.0 to 0.4

//SETUP RGB OUTPUT AND BAND PROPORTION : 
var WatEnh = [
(stretch ((  B2P * 1.05 ), min1,max1)), 
(stretch ((  B1P * 1.00 ), min1,max1)), 
(stretch ((  B0P * 1.20 ), min1,max1)), sample.dataMask];
var NatEnh = [
(stretch ((  B2P * 1.00 ), min2,max2)), 
(stretch (( (B1P * 0.75 )+(B3P * 0.20) ), min2,max2)), 
(stretch ((  B0P * 1.10 ), min2,max2)), sample.dataMask];
var MONOTEST = [0,0,1,sample.dataMask];
 if (weight_0123 == 0) {return [0,0,0]; } //no data mask
 
//SETUP NDWI WATER MASK THRESHOLD : ( Set same compo for not masked ) 
return ( NDWI > 0.4 ) ? // Water > 0.0 to 0.4
  ApplyEnh1 ( WatEnh ) : // Try THRESHOLD with MONOTEST ; 
  ApplyEnh2 ( NatEnh ) ; } 

//SETUP ENHANCEMENT : Stretch & Saturation : 
var min1=-0.30; var max1=0.90; var Sat1=2.0; // FOR WATER MASK
var min2=-0.35; var max2=1.00; var Sat2=1.5; // FOR LAND