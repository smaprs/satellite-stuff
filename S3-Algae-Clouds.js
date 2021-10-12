// SCRIPT FOR ALGAE/SEDIMENTS/CLOUDS // 57.44266,18.30954
function a(a, b) {return a + b;} function stretch(val, min, max) {return (val - min) / (max - min);} 
function satEnh_V(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StV) + a * StV);}	
function satEnh_I(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StI) + a * StI);} 
function satEnh_C(rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; return rgbArr.map(a => avg * (1 - StC) + a * StC);} 
function applyEnh_V(bArr) {return satEnh_V([stretch(bArr[0], SmV, SMV), stretch(bArr[1], SmV, SMV), stretch(bArr[2], SmV, SMV)]);}
function applyEnh_I(bArr) {return satEnh_I([stretch(bArr[0], SmI, SMI), stretch(bArr[1], SmI, SMI), stretch(bArr[2], SmI, SMI)]);}
function applyEnh_C(bArr) {return satEnh_C([stretch(bArr[0], SmC, SMC), stretch(bArr[1], SmC, SMC), stretch(bArr[2], SmC, SMC)]);}

// /* //===(START-S2) better width < 20Km ============================
var NDWI=(B03-B08)/(B03+B08); 
var NDCI=(B05-B04)/(B05+B04);var IOX=(B04/B02);
var AlgSed=[B04*2.5*(IOX+2),(B03*2.32)*(NDCI+2),B02*3.1];
var NatL=[B04*2,B03*2,B02*3];
var NatC=[B04*1.2,B03*1,B02*2.8];

var MkV=AlgSed;var MkI=NatL;var MkC=NatC; 
var SmV=0.35; var SMV=0.95; var StV=15;//*AlgSed
var SmI=0.1; var SMI=0.9; var StI=0;//Land
var SmC=-0.6; var SMC=4; var StC=1; //Clouds
var EnhV=applyEnh_V(MkV); var EnhI=applyEnh_I(MkI); var EnhC=applyEnh_C(MkC);

return (NDWI>-0.05 && B8A<0.06)?EnhV:
(B01>0.2 ? EnhC : EnhI) ; // OK 
// */ //===(END-S2)============================

// /* //===(START-S3)============================
var NDWI = (B06-B17)/(B06+B17); 
var NDCI=(B11-B08)/(B11+B08);
var IOX=(B09/B04);
var AlgSed=[B07*2.4*(IOX+2),(B06*2.43)*(NDCI+2),B04*3.03];
var NatL=[B08*1,B06*1,B04*3];
var NatC=[B08*1.2,B06*1,B04*3];

var MkV=AlgSed;var MkI=NatL;var MkC=NatC; 
var SmV=0.37; var SMV=0.9; var StV=13;//*AlgSed
var SmI=0.1; var SMI=0.9; var StI=0;//Land
var SmC=-0.5; var SMC=4; var StC=1; //Clouds
var EnhV=applyEnh_V(MkV); var EnhI=applyEnh_I(MkI); var EnhC=applyEnh_C(MkC);

return (NDWI>-0.25 && B17<0.06)?EnhV:
(B01>0.25 ? EnhC : EnhI) ; 
// */ //===(END-S3)============================

/*Sediments only (Ganges):
//var Sedim=[B08*3+B16*0.4,B05*1.5+B18*2,B04*3-B03*0.6];

return (B20>0.1)?EnhC:((B20<=0.1)&(NDWI>0.0)?EnhV:EnhI) ; 
cloud=B20>0.05-0.20;aerosol=B01;B02;B03 */
********************************************************************************************************
//TEST-LIMITS-CLOUDS:
var NDWI=(B06-B17)/(B06+B17); 
var mNDWI=0;
var mB01=0.32; //++ clouds/land
var mB02=0.35; 
var mB03=0.3; //+
var mB04=0.25; 
var mB08=0.1; 
var mB17=0.05; //+++ water/clouds
var mB19=0.3; var mB20=0.2; var mB21=0.7; 
return (B17<mB17)?[0,0,2]:
[B07*2,B06*2,B04*2];
****************************************************
Algae Indices S2 : 
https://www.researchgate.net/publication/333838040_Performance_Evaluation_of_Newly_Proposed_Seaweed_Enhancing_Index_SEI/download

var SEI=(B08-B11)/(B08+B11); //*0.5 better
var FAI= B08-((B04+(B11-B04))*((832.8-664.6)/(1613.7-664.6))); //*20
var WPL  =(B05-B04)/(B05+B04); //*50 Interference 
var NDWI =(B03-B08)/(B03+B08);
return [A2FAI*8.5, WPL*5.5, NDWI*1];
---------------------------
ALGAE-CLOUDS LINK:
https://sentinelshare.page.link/KSFU
---------------------------
CASES-S3:

BALTIC - Cyanobacteria :
2016-06-23 : https://www.esa.int/ESA_Multimedia/Images/2016/07/Baltic_swirls
2018-07-23, x2018-07-26 : https://www.smhi.se/en/research/research-news/climate-change-makes-reducing-eutrophication-even-more-important-1.162273

DENMARK - Coccolithophorid - Green sea (dinoflagellate) // 2018 Sep to Nov :
x2018-09-18 ; x2018-10-11 ; 2018-10-14  // Bad:  /08- 21,23 /11- 16

Bornholm Island (and Gotland Island, Baltic), Sweden -  Baltic
2021-07-14 https://www.tellerreport.com/news/2021-07-14-large-algal-clouds-move-along-the-coast-of-the-southern-baltic-sea.SkZ6VYL36u.html

---------------------------
SOAR:
Algal Bloom - Baltic Sea - 2018

Last great Harmful Algal Bloom of Cyanobacteria in the Baltic. 
Sentinel-3 OLCI 2018-07-26 Selective Enhancement Script. 
Image 350x300Km - 2110x1905px. 
Contains modified EU/ESA/Copernicus data processed with sentinel-hub.com/eo-browser. 
Composed and Processed by SAJV
---------------------------
