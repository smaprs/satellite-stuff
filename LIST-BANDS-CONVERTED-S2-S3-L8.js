/* CONVERSION OF BANDS: S2, S3, L8, CBERS FOR SENTINEL-HUB SCRIPTS */
// UNDER TESTING; IMPORTANT: ALWAYS DISABLE UNUSED GROUPS
//##################################################################################
// IINDICES //IMPORTANT: ALWAYS DISABLE UNUSED GROUPS
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
var S3_CLOUD = (B01>0.3) ; // OPT: B20 > 0.3
var S2_NDWI2 = (B03-B08)/(B03+B08); // Water bodies; std>0.3 (=NDMI)
var S3_NDWI2 = (B06-B17)/(B06+B17); // Water bodies; std>0.3 /TEST
var L8_NDWI2 = (B03-B05)/(B03+B05);
//##################################################################################
var MONOB = B04*3; var MONO=[MONOB*1,MONOB*2,MONOB*1];
//---Atmosphere:
var ATM = B10*5;//def=0; S2:B10*5; S3:B21*.4; L8: B09*
//##################################################################################
// ****(WATER)VERSE: //NDWI2<0.1 , 0.25/0.7 min/max stretch, 1.5x 
var S2_Nat1ReRe=[B04*1+B06*3.5,B03*1+B05*2.3,B02*2.9];//V.good; turbidity,algae
var S2_Nat2Redg=[B04*3,B03*2.5+B06*.5,B02*3];//Good; Water smooth; turbidity,algae
var S3_Nat2ReRe=[B08*1+B12*3.5,B06*1+B11*2.3,B04*2.7];
var S3_Nat2Redg=[B08*3,B06*2.5+B12*.5,B04*3];
//  turbidity, algae 
var S2_Turb1SwN=[B04*3+B11*.4,B03*1.4+B08*4.2,B02*2.9];//enh: 0.3; 0.4; 2
var S2_Turb2NRe=[B04*8-B08*6,B03*3.9+B07*3.2,B02*4.95];
var S2_Turb3Atm=[B04*7-B08*3-ATM,B03*2+B07*5-ATM,B02*4-ATM]; 
var S3_Turb1SwN=[B08*3+B20*.5,B06*1.4+B17*4.2,B04*2.9];// B20 or B21 test / enh: 0.3; 0.4; 2
var L8_Turb3Atm=[B04*7-B05*3-ATM,B03*4-ATM,B02*4-ATM];
// FALSE COLOR blue;algae 
var S2_FalsNiRe=[B08*3,B03*1+B05*2,B02*3];
var S3_FalsNiRe=[B17*3,B06*1+B11*3,B04*3]; 
//##################################################################################
// ****(LAND)INVERSE: // Enhanced Natural-OK
var S2_NatRN1At=[B04*2+B12*.7-ATM,B03*2+B08*.6-ATM,B02*2.5-ATM];
var S2_NatRN2At=[B04*2+B05*.5-ATM,B03*2+B08*.3-ATM,B02*2.6-ATM];  

var S3_NatRN2At=[B08*2.1+B11*.5-ATM,B06*2.5+B17*.5-ATM,B04*2.6-ATM];
var L8_NatRN2At=[B04*2.2+B08*0.5-ATM,B03*2.3+B08*0.5-ATM,B02*2.3+B08*0.5-ATM];
//==================================================================================
// GEOLOGY -OK
var S2_GeoFals1=[B11*2+B04*.4,B05*2+B08*.6,B02*3];//excel B02*4+blue:opt
var S2_GeoFals2=[B12*2.3,B05*2+B08*0.2,B02*3];//excel
var S2_Geo_Nat1=[B12*1.8+B03*1,B04*1.4+B08*1,B02*2.5];//good
var S2_Geo_Nat2=[B12*2.4,B04*1.4+B08*1,B02*2.5];
var S2_Geo_FrAt=[B12*1+B04*1.55-ATM,B03*2.2+B08*.45-ATM,B02*2.55-ATM];//Fire, Bare soil, Veg.

var S3_GeoFals1=[B20*2+B04*.4,B11*2+B17*.6,B04*3];
var S3_Geo_Nat1=[B21*2+B06*1,B08*1.5+B17*1,B04*2.6];
var S3_Geo_FrAt=[B20*.8+B08*1-ATM,B05*.7+B17*.3-ATM,B04*1-ATM];//

var L8_GeoFals1=[B06*2+B04*.4,B05*2.6,B02*3];//test
var L8_Geo_Nat1=[B07*2+B03*1,B04*1.5+B05*1,B02*2.8]; 
var L8_Geo_FrAt=[B04*2+B07*.6+B08*.5-ATM,B03*2+B05*.4+B08*.5-ATM,B02*2.3+B08*.5-ATM];//+pan
//==================================================================================
