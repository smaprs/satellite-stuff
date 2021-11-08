################################################################################################
SENTINE-1 BASIC COMPOSTIONS AND INDICES
################################################################################################
References / Adapted / custom-scripts / from : 
Pierre Markuse   : https://custom-scripts.sentinel-hub.com/data-fusion/s2l1c_s1grd_cloud_replacement/
                   https://custom-scripts.sentinel-hub.com/sentinel-2/markuse_fire/
Annamaria Luongo : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_false_color_visualization/
Valters Zeizis   : https://custom-scripts.sentinel-hub.com/sentinel-1/sar_rvi_temporal_analysis 
SAR-Ice          : https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
SERVIRglobal.net : SAR Vegetation Indices https://servirglobal.net/Global/Articles/Article/2674 
################################################################################################
EXAMPLE: INDIA :  zoom=7  25.001,69.001  2021-10-15 to 2021-11-06 https://sentinelshare.page.link/HWnf 
################################################################################################

INDICES and APLICATIONS SERIES:   ( VV ≈ HH   &   VH ≈ HV ) : 
==================================================================
WATER:
var WATER sqVH/sqVV  <  0.75 // = water lower=more water
//var WATER  = [0 , 0.5*(sqVH/sqVV) , 1*(sqVH/sqVV)] ; var WTresh = 0.75 ; // Water Threshold : lower=more water
//var Enh = AppEnh (COMPO); return (sqVH/sqVV > WTresh ) ? Enh : Enh ; // [0,1,1] : [0,0,0] ;
==================================================================
WATER : SAR Water Index (SWI) : 
---------------------------------------------------------------
https://sentinel.esa.int/web/success-stories/-/copernicus-sentinel-1-data-help-establish-drought-monitoring-system-for-croplands
https://www.linkedin.com/pulse/automatic-water-extent-mapping-from-sentinel-1-sar-using-sivaranjan/

//WATER DETECTION / LIMITS : TESTING : 
var WATER = [0,2*(1-dbVV),4*(1-dbVV)]; var WTresh=0.75; if (sqVH/sqVV)>0.75 : WATER : NON_WATER // Water Threshold : lower=more water // TEST: dbVH/dbVV
//https://custom-scripts.sentinel-hub.com/sentinel-1/sar_false_color_visualization/
var WaterNoE = 2 - Math.log (0.05 / (0.045 - 0.9 * VV));//WATER Non-enhanced 
var WaterEnh = 5 - Math.log (0.05 / (0.045 - 0.9 * VV));//WATER Enhanced 
var WatRough = (Math.log(0.05/(0.018+VV*1.5))); // https://custom-scripts.sentinel-hub.com/sentinel-1/water_surface_roughness_visualization/
################################################################################################
COLLECTION OF MAIN COMPOSITONS:
-------------------------------------------------------------
// WEIGHTS:  (4x) 2*VV~8*VH ; (2x) 1*dbVV~2*dbVH ; (2x) 1.5*sqVV~3*sqVH 
//-------------------------------------------------------------
var dbVH=(Math.max(0,Math.log(VH)*0.21714724095+1));
var dbVV=(Math.max(0,Math.log(VV)*0.21714724095+1));
var sqVH=(Math.sqrt(VH+0.012)); 
var sqVV=(Math.sqrt(VV+0.012)); 

################################################################################################
//--SETUP RGB_COMPOS: 
var S1_NatEnhW1    = [(1-dbVV)*1.25, 3.75*(VH/(VV+VH)), 0.95*(1-(sqVH/sqVV))]; // Needs WATER_MASK // RVI = 4*(VH/(VV+VH)) India, Panatanal
var S1_NatEnhW2    = [4*(VV-VH), 2*dbVH, 4*(((2*sqVH)-sqVV)/((2*sqVH)+sqVV))] ; // TEST 
var S1_FalseColor1 = [2*sqVV , 3.5*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))]; // S1_LaPalma
var S1_FalseColor2 = [5*VV, 3.5*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))]; // India

################################################################################################
//--(**) ENABLE FOR WATER MASK :
var S1_WATER_MASK1  = [ 0 , 0.3 , 0.5 ] ; 
var S1_WATER_MASK2  = [1*dbVV , 3*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))] ; 
var S1_WDETECT1 = VV ;  
var S1_WTHRESH1 = 0.03 ; // DEF=0.03 ; HIGHER=MORE_WATER // BETTER FOR FORESTS
var S1_WDETECT2 = ((VV/(VH+VV))-(4*VV)) ; 
var S1_WTHRESH2 = 0.75; // BETTER // DEF= 0.75 ; LOWER=MORE_WATER // BETTER FOR DESERTS
################################################################################################

var dbVH   = (Math.max(0,Math.log(VH)*0.21714724095+1)) ; // 2* ; decibel
var dbVV   = (Math.max(0,Math.log(VV)*0.21714724095+1)) ; // 1* ; decibel
var sqVH   = (Math.sqrt(VH+0.012)); // https://custom-scripts.sentinel-hub.com/sentinel-1/sar-ice/
var sqVV   = (Math.sqrt(VV+0.012)); // 
//-------------------------------------------------------------
//   Difference:
//var difHV    = 3*(6*VH-1*VV) ; 
//var difVH    = 3*(1*VV-4*VH) ;
//var difVHdb  = 1.5*(dbVV-dbVH) ;
//var difVHsq  = 2*(sqVV-sqVH) ;
//-------------------------------------------------------------
//   Simple Ratios:
//var rtH    = 1*((2*VH)/VV) ; // Polarized Ratio (VH to VV)
//var rtHdb  = 1*((1*dbVH)/dbVV) ; 
var rtHsq  = 1*((1*sqVH)/sqVV) ; 
//var rtV    = 1*(VV/(8*VH)) ; // Polarized Ratio (VV to VH)
//var rtVdb  = 1*(dbVV/(2*dbVH)) ; 
//var rtVsq  = 1*(sqVV/(2*sqVH)) ; 
//-------------------------------------------------------------
//   Normalized Values:
//var RVI    = (4*VH)/(VV+(4*VH)) ;     // Normalized VH Index = NVHI: https://www.mdpi.com/2072-4292/10/5/797  // ~ WILDFIRES
//var RVIdb  = (2*dbVH)/(dbVV+(2*dbVH)) ; 
var RVIsq  = (2*sqVH)/(sqVV+(2*sqVH)) ;
//var RVI4S1 = (Math.sqrt(VV/(VV+VH)))*(4*(VH/(VV+VH)));  // https://custom-scripts.sentinel-hub.com/sentinel-1/radar_vegetation_index/ 
//var nVVI   = 1*(VV/(VV+(4*VH))) ;     // Normalized VV Index  https://www.mdpi.com/2072-4292/10/5/797
//var nVVIdb = 1*(dbVV/(dbVV+(2*dbVH))) ; 
//var nVVIsq = 1*(sqVV/(sqVV+(2*sqVH))) ; 
//-------------------------------------------------------------
//   Normalized Differences:
//var RFDI   = 2*(VV-(6*VH)) / (VV+(6*VH))  ; // Normalized Difference VV-VH (=NDPI=NDV)
//var RFDIdb = 2*((dbVV-(2*dbVH))/((2*dbVH)+dbVV)) ; 
//var RFDIsq = 2*((sqVV-(2*sqVH))/((2*sqVH)+sqVV)) ; 
//var ndH   = 2*((6*VH)-VV) / (VV+(6*VH))  ; // Normalized Difference VH-VV
//var ndHdb = 2*(((4*dbVH)-dbVV)/((4*dbVH)+dbVV)) ; 
var ndVHsq = 4*(((2*sqVH)-sqVV)/((2*sqVH)+sqVV)) ;
//-------------------------------------------------------------
//   Other Compositions for testing:
//var RVI4S1o= (Math.sqrt (VV /     (VV+VH) )) * (4*(    VH  / (VV+VH)     ));
  var RVI4S1b= (Math.sqrt (VV / (VV+(1*VH)) )) * (4*( (2*VH) / (VV+(1*VH)) ));
//-------------------------------------------------------------
//---SETUP WATER THRESHOLD FOR SUBSTITUTION :
var S1_W_Thresh_VV  = 0.015; // FOR VV : lower = less water ; def=0.015 // OK
//---SETUP RGB_COMPOS: 
var S1_LAND_FOREST = [(1-dbVV)*1.5, 4*(VH/(VV+VH)), 1-(sqVH/sqVV)]; // RVI = 4*(VH/(VV+VH))
var S1_LaPalma= [1.5*sqVV , 3*sqVH , 1*((2*dbVH)/(dbVV+(2*dbVH)))]; // Lava

################################################################################################
################################################################################################
SENTINEL-1 EW: HV,HH 
==================================================================
VEGETATION / FOREST : 
--------------------------------------------------------
var RVI =  HV / (HH + VV + HV) // NOT IN Sentinel1
var RFI = (HH - HV) / (HH + HV) (normalized) //RADAR FOREST (DEGRADATION) INDEX: <0.3=dense .. 0.4-0.6=degraded .. >0.6=deforested
  //https://servirglobal.net/Global/Articles/Article/2674
  //RADAR VEGETATION INDEX: 0-1=flat-growth(irregular)  
==================================================================
SEA,ICE: SOURCE = MINE? TWITTER A-68a ICEBERG?
-------------------------------------------------------
var Bhv=[HV*500];
var Bhh=[HH*20];
var bd=[Bhv]; var MONO = [bd,bd,bd];
//var BLSH=[HV*200,HV*300+HH*10,HH*15];//sea=blue,ice=green
var BLSH2=[HV*200,HV*200+HH*10,HH*15];//sea=blue,ice=green
//var GRSH=[HV*200,HH*15,HV*300+HH*10];//sea=green,ice=blue
var GRSH2=[HV*100,HH*15,HV*400+HH*15];//sea=green,ice=blue
//------------------------
//SEA,ICE:
var MkV = BLSH2; var MkI = GRSH2; 
var SmV=0;var SMV=1.5;var StV=1;
var SmI=-.1;var SMI=.5;var StI=1; 
var EnhV = AppEnhV(MkV); var EnhI = AppEnhI(MkI);
//------------------------
//(HH>.012 & HV<.0005)=NON-ICE
return (HH>.01 & HV<.0002)? EnhV : EnhI;
//return (MONO);
################################################################################################