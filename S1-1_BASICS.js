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
COLLECTION OF MAIN COMPOSITONS: 
-------------------------------------------------------------
// WEIGHTS:  (4x) 2*VV~8*VH ; (2x) 1*dbVV~2*dbVH ; (2x) 1.5*sqVV~3*sqVH // BASIC : [VV,VH,VV/VH]
//-------------------------------------------------------------
var dbVH=(Math.max(0,Math.log(VH)*0.21714724095+1));
var dbVV=(Math.max(0,Math.log(VV)*0.21714724095+1));
var sqVH=(Math.sqrt(VH+0.012)); 
var sqVV=(Math.sqrt(VV+0.012)); 
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
################################################################################################
//   Other Compositions for testing:
//var RVI4S1o= (Math.sqrt (VV /     (VV+VH) )) * (4*(    VH  / (VV+VH)     ));
  var RVI4S1b= (Math.sqrt (VV / (VV+(1*VH)) )) * (4*( (2*VH) / (VV+(1*VH)) ));
//-------------------------------------------------------------
var 1_sqHV = (sqVH/sqVV) ;
var 1_dbVV = (1-dbVV) ; // ++good distinction 
var 1_RVIsq =  1.5* ( 1-((sqVH)/(sqVV+(sqVH))) ) ; // RVI
//-------------------------------------------------------------
################################################################################################
var mono = VV/(4*VH) ; MONO_COMPO = [mono,mono,mono];
################################################################################################
################################################################################################
SETUP RGB_COMPOS : IW=VH,VV or EW=HV,HH 
################################################################################################
// BASIC COMPOS S1_IW
//--SETUP IW=VH,VV / (DISABLE FOR EW)
function evaluatePixel(sample) {
  var VV=sample.VV; var VH=sample.VH;  
var dbVH = (Math.max(0,Math.log(VH)*0.21714724095+1));
var dbVV = (Math.max(0,Math.log(VV)*0.21714724095+1));   
var sqVH = (Math.sqrt(VH+0.012)); 
var sqVV = (Math.sqrt(VV+0.012)); 
//--SETUP IW RGB COMPO:  
var S1_IW_1 = [4.5*VV , 3.5*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))]; // India_2
var S1_IW_2 = [1.25*(1-dbVV), 3.75*(VH/(VV+VH)), 0.95*(1-(sqVH/sqVV))]; // India_1 , La_Palma_1, Patanal ; WATER_MASK https://sentinelshare.page.link/H1id
var S1_IW_3a = [1.35*dbVV, 3*sqVH , 1*(sqVH/(sqVV+sqVH)) ]; // La_Palma_2
var S1_IW_3b = [1.5*dbVV, 4*sqVH , 1.25*(sqVH/(sqVV+sqVH)) ]; // La_Palma_2
var S1_IW_4 = [2*sqVV , 3.5*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))]; // La_Palma_3
var S1_IW_5 = [1.25*(dbVV), 3.75*(VH/(VV+VH)), 0.95*((sqVH/sqVV))]; // TEST 
var S1_IW_6 = [4*(VV-VH), 2*dbVH, 4*(((2*sqVH)-sqVV)/((2*sqVH)+sqVV))]; // TEST 
  return  S1_IW_1  ;} 
  
//OTHER COMPOS:
RGB ratio https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-1-sar/product-overview/polarimetry
var S1_Ratio = [4*VV , 16*VH , 0.25*(VV/(4*VH))] ;
var S1_Ratio_sq = [2*sqVV , 3.5*sqVH , 1.5*(sqVV/(4*sqVH))] ;
===============================================================================
//--(**) ENABLE FOR WATER MASK :
var S1_WATER_MASK1  = [ 0 , 0.3 , 0.5 ] ; 
var S1_WATER_MASK2  = [1*dbVV , 3*sqVH , 1.25*((sqVV)/(sqVV+(2*sqVH)))] ; 
var S1_WDETECT1 = VV ;  
var S1_WTHRESH1 = 0.03 ; // DEF=0.03 ; HIGHER=MORE_WATER // BETTER FOR FORESTS
var S1_WDETECT2 = ((VV/(VH+VV))-(4*VV)) ; 
var S1_WTHRESH2 = 0.75; // BETTER // DEF= 0.75 ; LOWER=MORE_WATER // BETTER FOR DESERTS

################################################################################################
// BASIC COMPOS S1_EW

//--SETUP EW=HV,HH  // (DISABLE FOR IW)
function evaluatePixel(sample) { 
  var HH=sample.HH; var HV=sample.HV;  
var dbHV = (Math.max(0,Math.log(HV)*0.21714724095+1));
var dbHH = (Math.max(0,Math.log(HH)*0.21714724095+1));   
var sqHV = (Math.sqrt(HV+0.012)); 
var sqHH = (Math.sqrt(HH+0.012)); 
var dbH_V = 0.25*((4*dbHH)-(dbHV)) ; // sea + wind
//--SETUP RGB COMPO:  
//--SETUP RGB COMPO:  
var mono = sqHH  ; var C_MONO = [mono,mono,mono] ;
var S1_EW_1 = [ 1.2*dbHV , 0.95*dbHH , 2.5*(sqHH-sqHV) ] ; // ++ sea dark gr.blue, rocks brown , ice white
var S1_EW_2 = [ 1.5*sqHV , 1*sqHH , 2*(sqHH-sqHV) ] ; // + sea dark blue, rocks brown , ice white
var S1_EW_3 = [ 1.2*dbHV , 0.85*dbHH , 1.2*(1-(sqHV/sqHH))  ] ; // sea vivid 
var S1_EW_4 = [ 1.5*dbHV , 1*dbHH ,  1*(sqHV/sqHH) ] ; //  sea x ice  

return   S1_EW_1  ;}  
################################################################################################
################################################################################################
Math.log( ) Math.exp( ) 
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
SENTINEL-1 EW: HV,HH 
==================================================================
VEGETATION / FOREST : 
--------------------------------------------------------
var RVI =  HV / (HH + VV + HV) // NOT IN Sentinel1
var RFI = (HH - HV) / (HH + HV) (normalized) //RADAR FOREST (DEGRADATION) INDEX: <0.3=dense .. 0.4-0.6=degraded .. >0.6=deforested
  //https://servirglobal.net/Global/Articles/Article/2674
  //RADAR VEGETATION INDEX: 0-1=flat-growth(irregular)  
