// CONVERSION OF BANDS: S2, S3, L8, FOR SENTINEL-HUB SCRIPTS 
// ** UNDER TESTING ** IMPORTANT: ALWAYS DISABLE UNUSED GROUPS: S2, S3, L8
// SEE: https://custom-scripts.sentinel-hub.com/sentinel-2/composites/
// USE: https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices
//##################################################################################
// INDICES 
//---Vegetation:
var S2_NBR = (B08-B12)/(B08+B12); // BURN Ratio: H.Burn>0.6  Unburned-0.1to+0.1  H.Regrowth<-0.25 /(B08orB09)
var S2_ARVI = (B08-B04-0.106*(B04-B02))/(B08+B04-0.106*(B04-B02)); // ATMOSPHERICALLY Resistant V.I. VEG:0.2-0.8 /(or B09;B05) 
var S2_SAVI = (B08-B04)/(B08+B04+0.428)*(1.0+0.428); // SOIL bright. minimized (NDVI) std>0.2
var S2_NDVI = (B08-B04)/(B08+B04); // VEGET x NON-V.: DenseV>.4  LowV=.2,.4  Soils,Clouds:-.1,+.1  Water<0 
var S3_NDVI = (B17-B08)/(B17+B08); 
var L8_NDVI = (B05-B04)/(B05+B04); var L8_NDBI = (B06-B05)/(B06+B05); var L8_BU = (L8_NDVI-L8_NDBI);
//---Water:
var S2_NDWI1 = (B08-B11)/(B08+B11); // Water on leaves; std>0.3 (=NDMI)
var S2_NDSI = (B03-B11)/(B03+B11); // Snow&Water x NON-W: std>0.42; / OPT: return ((ndsi>0.2)&(B03>0.15)) ? v : i ;
var S3_NDSI = (B06-B21)/(B06+B21); //Snow&Water x NON-W: std>0.42 /TEST;
var S3_CLOUD = [B13>0.17] ; // OPT: B01 > 0.3; B20 > 0.3
var S2_NDWI2 = (B03-B08)/(B03+B08); // Water bodies; std>0.3 (=NDMI)
var S3_NDWI2 = (B06-B17)/(B06+B17); // Water bodies; std>0.06 /TEST
var L8_NDWI2 = (B03-B05)/(B03+B05);
//---Geology 
var S2_GEO_Alt= B11/B12 // (SWIR1/SwIR2)
var S2_GEO_FeOx= B11/B08
var S3_GEO_Alt= B20/B21 // ~(SWIR1/SwIR2)
var S3_GEO_FeOx= B20/B17

//##################################################################################
var MONOB = B04*3; var MONO=[MONOB*1,MONOB*1,MONOB*1];
//##################################################################################
// ATMOSPHERE / CLOUD REDUCTION
var ATM = // S2:-B10*5; S3:-B13*1 [B13>0.17] or -B21*.4; L8: -B09*
//##################################################################################
// VERSE: ~ WATER //NDWI2<0.1 , 0.25/0.7 min/max stretch, 1.5x 
var S2_Nat1=[B04*3,B03*3,B02*3];
var S2_Nat2Enh=[B04*3+B05*.2,B03*3+B08*.2,B02*3];

var S2_Nat1ReRe=[B04*.3+B06*2.8,B03*1+B05*2.6,B02*3];//Better; Water smooth; turbidity,algae
var S2_Nat2Redg=[B04*3,B03*2.5+B06*.5,B02*3];//Satur; High turbidity,algae

var S3_Nat1ReRe1=[B07*.2+B12*3,B06*.5+B08*3,B04*2.7];//better
var S3_Nat1ReRe2=[B08*1+B12*3.5,B06*1+B11*2.3,B04*2.7];
var =[B07*.2+B12*3-B13*.5,B06*.5+B08*3-B13*.5,B04*2.7-B13*.5];

var S3_Nat2Redg=[B08*3,B06*2.5+B12*.5,B04*3];
//  turbidity, algae 
var S2_Turb1SwN=[B04*3+B11*.4,B03*1.4+B08*4.2,B02*2.9];//enh: 0.3; 0.4; 2
var S2_Turb2NRe=[B04*8-B08*6,B03*3.9+B07*3.2,B02*4.95];
var S2_Turb3Atm=[B04*7-B08*3-ATM,B03*2+B07*5-ATM,B02*4-ATM]; 
var S3_Turb1SwN=[B08*3+B20*.5,B06*1.4+B17*4.2,B04*2.9];// B20 or B21 test / enh: 0.3; 0.4; 2
var L8_Turb3Atm=[B04*7-B05*3-ATM,B03*4-ATM,B02*4-ATM];
// FALSE COLOR blue;algae 
var S2_Fals1=[B08*3,B04*3,B03*3];
var S2_FalsNiRe=[B08*3,B03*1+B05*2,B02*3];
var S3_FalsNiRe=[B17*3,B06*1+B11*3,B04*3]; 
//##################################################################################
// INVERSE: LAND // Enhanced Natural-OK
var S2_NatRN1At=[B04*2+B12*.7-ATM,B03*2+B08*.6-ATM,B02*2.5-ATM]; // Natural+Veg
var S2_NatRN2At=[B04*2+B05*.5-ATM,B03*2+B08*.3-ATM,B02*2.6-ATM];  
var S3_NatRN2At=[B08*2.1+B11*.5-ATM,B06*2.5+B17*.5-ATM,B04*2.6-ATM];
var L8_NatRN2At=[B04*2.2+B08*0.5-ATM,B03*2.3+B08*0.5-ATM,B02*2.3+B08*0.5-ATM];
//==================================================================================
// GEOLOGY 
var S2_GeoFals1=[B11*1.5+B04*.5,B06*1+B08*1,B02*3];//**excel**
var S2_GeoFals2=[B12*1.6+B04*.3,B05*1.6+B08*0.35,B02*3];//*excel*//Enhacement: Smin_I=0.2; Smax_I=.8; SATU_I=2;
var S2_GeoFals3=[B12*2.1,B11*1.3+B08*0.45,B02*3];//good
var S2_Geo_Nat1=[B12*1.8+B03*1,B04*1.4+B08*1,B02*2.5];//good
var S2_Geo_Nat2=[B12*2.4,B04*1.4+B08*1,B02*2.5];
var S2_Geo_FrAt=[B12*1+B04*1.55-ATM,B03*2.2+B08*.45-ATM,B02*2.55-ATM];//Fire, Bare soil, Veg.

var S3_GeoFals1=[B20*1.2+B08*1.3-B13*1,B17*1-B07*1+B06*1.8-B13*.8,B04*2.6-B13*.5];//GOOD: MOROCCO to ARABIA 2020-06-02 // ATM = B13;
var S3_GeoFals2=[B21*1.9,B08*2.2+B17*.2,B03*2.7];//TESTING:VegRed;B03orB04
var S3_Geo_Nat1=[B21*2+B06*1,B08*1.5+B17*1,B04*2.6];
var S3_Geo_FrAt=[B20*.8+B08*1-ATM,B05*.7+B17*.3-ATM,B04*1-ATM];//

var L8_GeoFals1=[B06*2+B04*.4,B05*2.6,B02*3];//test
var L8_Geo_Nat1=[B07*2+B03*1,B04*1.5+B05*1,B02*2.8]; 
var L8_Geo_FrAt=[B04*2+B07*.6+B08*.5-ATM,B03*2+B05*.4+B08*.5-ATM,B02*2.3+B08*.5-ATM];//+pan
//==================================================================================
