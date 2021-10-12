// CONVERSION OF BANDS: S2, S3, L8, FOR SENTINEL-HUB SCRIPTS 
// ** UNDER TESTING ** IMPORTANT: ALWAYS DISABLE UNUSED GROUPS: S2, S3, L8
// SEE: https://custom-scripts.sentinel-hub.com/sentinel-2/composites/
// USE: https://custom-scripts.sentinel-hub.com/sentinel-2/selectiveenhancementbasedonindices

###################################################################################################################################
2) INDICES:				// (IDB-Index DataBase) - https://www.indexdatabase.de/db/ia.php
===================================================================================================================================
INDEX	 WaveLenght Formula:         								R,G,B,N ; SKM50						// IDB Full Name ; Description
-----------------------------------------------------------------------------------------------------------------------------------
RGBNir MAIN INDICES:				// #############  https://www.indexdatabase.de/db/a-single.php?id=22	#############
-----------------------------------------------------------------------------------------------------------------------------------
*ndwi	G/N : (G-N)/(G+N)	// WATER>0 Norm.Diff. Water/Moisture Index 
*ngrdi 	G/R : (G-R)/(G+R)	// Visible Atmospherically Resistant Indices Green (VIgreen)
*dndb	N/B : (N-B)/(N+B) 	// Norm.Diff. NIR/Blue
cg		N/G : (N/G)^-1		// Chlorophyll Green 
*gbndvi 	(N−(G+B))/(N+(G+B))	// Green-Blue NDVI BETTER:
gndvi		(N−G)/(N+G)			// Green NDVI  https://www.sciencedirect.com/science/article/abs/pii/S1672630807600274
dvi 	N/R	:				// LAI; SRDVI_NR; VIN; Leaf Area Index; Simple Ratio N/R
*ndvi 		(N-R)/(N+R) 	// Veg: H>.4;L=.>2 <.4  Water<0  Soils/Clouds: >-.1 <+.1 
**tdvi	1.5*((N-R)/(N^2+R+0.5)^(1/2)) //Transformed DVI - Bannari Abdou, 2002
cig			(N/R)-1 ; 		// Chlorophyll Index Green
evi		2.5((N−R)/((N+6R−7.5B)+1))	// Enhanced VI
savi 		(N-R)/(N+R+.5) *(1.5)	// Soil Adjuste VI
*osavi 		(N-R)/(N+R+.16)*(1.16)	// Optimized Soil Adjuste VI
*iox	R/B : 		// pyrite; FeS2 sulfide minerals iron oxidation
*Fe3+	R/G : 		// hematite Fe2O3, Magnetite Fe3O4
BROVEY: [B;G;R;N]/(B+G+R+N)
-----------------------------------------------------------------------------------------------------------------------------------
COMPOS 4-BANDS:R,G,B;N		RESULT: Render:	
---------------------------------------------------
1-RdG_fe3,G7N3,B		-c_2_98				/+++OK
2-N,GdR-ngrdi,BrovB		-c2_98				/+++OK
3-RdB_iox,G5N5,BrovB	-c_2_98				/+++OK
4-R,G9N1,B				-c_05_997-satur20	/+++OK
R,
G,
B,
N,
G5N5
G7N3
G9N1
GdR-grdi
NdR-tndvi
RdB_iox
RdG_fe3
BrovB
-------------------------------------
RdB_iox,NdG+B_gbndvi,BrovB-c15_985	/+++OK
RdB_iox,NdB-ndnb,GdN-ndwi-m2		/++discriminant 
RdB_iox,G5N5,B-c2_98				/+ 	(Arena)
R_G7N3_BrovB-c2_98					/+ 	
NdR_tndvi,NdG+B_gbi,BrovB-c_2_98 	/+
RdB_iox,N,B5+G5-c2_98				/--	(Maragua)
RdB_iox,N,BrovG-c2_98				/-- (Chile)
RdB_iox,N,BrovG-c2_98				/-- (Etna)2021-02-25
	BAD:
Brovey_RGB or NRG -c_2_98			/---						
R,G7N3,B		
N,RdG_fe3,B			
BdG_N_R		
NdB_R_G	
NdR_ndvi,N,G			
NdR_tndvi,N,RdG_fe3
RdB_iox,NdR_ndvi,RdG_fe3		
RdB_iox,G5+N5,BrovB-c2_98		
RdG_fe3,G7N3,GdN_ndwi			-
###################################################################################################################################
###################################################################################################################################
ALL INDICES  WaveLenght Formula:         			=Sentinel2				= SKM50					// IDB Full Name ; Description
-----------------------------------------------------------------------------------------------------------------------------------
// HYDROLOGY:
NDWI 	= 											= (B03-B08)/(B03+B08)	= (G-N)/(G+N)			// Water bodies > 0 
NDCI	= (708-665)/(708+665) 			     S3NDCI = (B11-B08)/(B11+B08)	//[Bx*(NDCI+2)] //Algae; Normalized difference chlorophyll index  (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7544481/)

// GEOLOGY (SWIR) : 
*Fe2+	=[2145:2185]/[760:860]+[520:600]/[630:690]	= 12/8+3/4  			= // 					// Ferric iron, Fe2+ 
Fe3+	=[630:690]	/[520:600]						= 4/3  					= R/G							// Ferric iron, Fe3+ ; Heavy metal contamination 
*FeOx	=[1600:1700]/[760:860]						= 11/8  				= //(N+R)/N	(emulate)			// Ferric Oxides 
*FeIron	=[2145:2185]/[760:860]+[520:600]/[630:690]	= 12/8+3/4 				= //((N+R)/N)+(G/R)	(emulate) 	// Ferrous iron 
*FeSi 	=[2145:2185]/[1600:1700]					= 12/11 				= 						// Ferrous Silicates 

// VEGETATION:
NDVI	= 
GLI		=	(GLI*-0.001)							= (2*3−5−1)/(2*3+5+1)	= (2*G−R−B)/(2*G+R+B)	//OK	// Green leaf index 
ChlGr	=([760:800]/[540:560])^-1					= (7/3)^-1				= (N/G)^-1				// Chlorophyll Green 
*NBR	=(780:1400,1400:3000)						= (9−12)/(9+12)			= //					//Norm.Diff. NIR/SWIR Normalized Burn Ratio
NDMI=SEI=NDWIL 										= (B08-B11)/(B08+B11)

// ALGAE Index S2 : 
var SEI = (B03-B08)/(B03+B08); // *0.5 =NDMI;NDWIL 	
var FAI = B08-((B04+(B11-B04))*((832.8-664.6)/(1613.7-664.6))) // *20 (Floating Algae Index); >> ONLY FOR WATER NDWI>0
var WPL = (B05-B04)/(B05+B04); // *50 Water Plants; >>  Interference resoulution 10/20mpx
return [FAI*8.5, WPL*5.5, NDWI*1];
###################################################################################################################################
###################################################################################################################################
===================================================================================================================================
>> IOx-RB	=[640:760]/[420:480]					= 5/1					= B3/B1						//OK	// Simple Ratio Red/Blue Iron Oxide (1); 
	// IOX:"correctly highlights iron oxides mainly related to mafic saprolites; also under vegetation cover" (Ducart et al, Brazilian Journal of Geology, 46(3),2016)
	// "The Iron Oxide (IO) ratio is a geological index for identifying rock features that have experienced oxidation of iron-bearing sulfides using the red and blue bands. 
	// IO is useful in identifying iron oxide features below vegetation canopies and is used in mineral composite mapping." 
	// https://pro.arcgis.com/en/pro-app/help/data/imagery/band-arithmetic-function.htm
	//= pyrite (FeS2: iron (II) disulfide ; sediments from contact metamorphism , high-temperature hydrothermal mineral ) and pyrrhotite 
===================================================================================================================================
>> BROVEY Fusion (LANDSAT TM):	RGB	{R:b1,G:b2,B:b3}	= {R:TM4(NIR),	G:TM3(RED),	B:TM2(GREEN)}	/	(TM2+TM3+TM4)(OPT:xPAN)	// (BROVEY, 1991 in Hassan GHASSEMIAN, 2000.)
BROVEY SkyMao50					RGB	{b1,b2,b1}			= {B4(NIR), 	B3(RED), 	B2(GREEN)} 		/ 	(B2+B3+B4) 
BROVEY_G:b2:											= B3(RED) / (B2+B3+B4) 		
// BROVEY: "the most significant problem is color distortion" (Dong Jiang et al, Image Fusion and Its Applications. 2014.-researchgate)
// BROVEY b2:  0.3225 < mining < 0.5237; "highest discriminant potential for open-pit mining zone" (Castellanos et al, DYNA 84 (201), 2017)
===================================================================================================================================
Brovey-Wavelet (BW):								<<<<<<<<<< TO DO
===================================================================================================================================
IOX / BROVEY BASIC COMPOSITES:		
===================================================================================================================================
TESTS: 				Natural			FalseNIR
					R,G,B			N,R,G
---------------------------------------------------
SKM50: 				3,2,1			4,3,2
---------------------------------------------------
IOX_b1:				IOX,2,1 <<		IOX,3,2 <<
IOX_b2:				3,IOX,1			4,IOX,2 <<
IOX_b3:				3,2,IOX			4,3,IOX

BROVEY_b2R_SKM3_1:	b2,2,1 <<		b2,3,2
BROVEY_b2R_SKM3_2:	3,b2,1			4,b2,2 <<
BROVEY_b2R_SKM3_3:	3,2,b2			4,3,b2

VIRTUAL:		BANDS: 	1,2,3,4
IOX+SKM321-VRT			1,2,3,IOX
BR2+SKM421-VRT			1,2,4,b2
###################################################################################################################################
##################################################################################
// INDICES 

//CLOUDS: 
return (B01<.2)? EnhV : EnhI; // low clouds
return (B10<.2)? EnhV : EnhI; // high clouds

//---Vegetation:
var S2NBR = (B08-B12)/(B08+B12); // BURN Ratio: H.Burn>0.6  Unburned-0.1to+0.1  H.Regrowth<-0.25 /(B08orB09)
var S2ARVI = (B08-B04-0.106*(B04-B02))/(B08+B04-0.106*(B04-B02)); // ATMOSPHERICALLY Resistant V.I. VEG:0.2-0.8 /(or B09;B05) 
var S2SAVI = (B08-B04)/(B08+B04+0.428)*(1.0+0.428); // SOIL bright. minimized (NDVI) std>0.2
var S2NDVI = (B08-B04)/(B08+B04); // VEGET x NON-V.: DenseV>.4  LowV=.2,.4  Soils,Clouds:-.1,+.1  Water<0 

var S3NDVI = (B17-B08)/(B17+B08); 
var L8NDVI = (B05-B04)/(B05+B04); var L8NDBI = (B06-B05)/(B06+B05); var L8BU = (L8NDVI-L8NDBI);

//---Water:
var S2NDWIL = (B08-B11)/(B08+B11); // (S2NDWI1>0.2 & B03>0.12) OPT / std>0.3; Water on leaves (=NDMI);
var S2NDWI = (B03-B08)/(B03+B08); // return(S2_NDWI>-.05 & B01<.25) // (S2_NDWI>-.1 & B03<.2) // (S2NDWI>-.015)&(B03<.15) OPT / std>0; Water bodies (=NDMI);
var S2NDSI = (B03-B11)/(B03+B11); // (S2NDSI>0.2 & B03>0.15) // (S2NDSI>0.55 & B03>0.4) :SOFT // Snow&Water x NON-W: std>0.42; 

var S3NDSI = (B06-B21)/(B06+B21); //Snow&Water x NON-W: std>0.42 /TEST;
var S3CLOUD = [B13>0.17] ; // OPT: B01 > 0.3; B20 > 0.3
var S3NDWI = (B06-B17)/(B06+B17); // Water bodies; std>0.05 /TEST
var L8NDWI = (B03-B05)/(B03+B05);

//---Geology 
var S2GEOAlt= B11/B12 // (SWIR1/SwIR2)
var S2GEOFeOx= B11/B08

var S3GEOAlt= B20/B21 // ~(SWIR1/SwIR2)
var S3GEOFeOx= B20/B17

//var S2-MOISTIX= [(B8A-B11)/(B8A+B11)];

/##################################################################################
===================================================================================================================================
S-2 SENTINEL-HUB CUSTOM ORIGINAL BASIC COMBINATIONS:

NATURAL                     = 	[B04*3       ,B03*3       ,B02*3]
NATURAL ENHANCED (MARKUSE)  = 	[B04*2+B05*.2,B03*2+B08*.4,B02*4]
FALSE NIR (RED VEG)         = 	[B08*2,B04*3,B03*3]
FALSE SWIR (URBAN)          = 	[B12*2,B11*3,B04*3]
FALSE SWIR-NIR (SWIR)       = 	[B12*3,B8A*3,B04*3]
FALSE GEOLOGY               = 	[B12*3,B04*3,B02*3]
BATHYMETRIC                 = 	[B04*3,B03*3,B01*3]
AGRICULTURE                 = 	[B11*3,B08*3,B02*3]
GEOLOGY ENHANCED            = 	[B12*1.5+B04*1,B05*1.5+B08*0.5,B02*2.8]

===================================================================================================================================
/##################################################################################
// COMPOSITIONS - BANDS 
/##################################################################################
var MONOB = B04*3; var MONO=[MONOB*1,MONOB*1,MONOB*1];
//##################################################################################
// ATMOSPHERE / CLOUD REDUCTION
var ATM = // S2:-B10*5; S3:-B13*1 [B13>0.17] or -B21*.4; L8: -B09*
/##################################################################################
//##### VERSE: ~ WATER //NDWI<0.1 , 0.25/0.7 min/max stretch, 1.5x 
// Natural / RedEgde / NearInfrared / ShortWave Infrared
var S2N1=[B04*3,B03*3,B02*3];
var S2NEnh1=[B04*2.5+B05*1+B12*.5,B03*2.5+B08*.5,B02*2.8];
var S2NEnh2=[B04*3+B05*.2,B03*2.6+B08*.2+B12*.2,B02*3];

var S2NReRe=[B04*.3+B06*2.8,B03*1+B05*2.6,B02*3];//Better; Water smooth; turbidity,algae
var S2NREdg=[B04*3,B03*2.5+B06*.5,B02*3];//Satur; High turbidity,algae
--------------
//Sentinel3: GOOD ***
var NDCI=(B11-B08)/(B11+B08);var IOX=(B09/B04);
var Alg=[B07*2.5*(IOX+2),(B06*1.9+B08*0.4)*(NDCI+2),B04*3];
--------------
var S3NEnh = [B07*1+B09*1.4-B14*.1,B05*1.1+B06*1.4-B14*.2,(B04*2.6- B14*.6)*1]; // FIX //Markuse: https://custom-scripts.sentinel-hub.com/sentinel-3/enhancedtruecolor-2/
var S3NRe1 = [B08*3,B06*2.5+B12*.5,B04*3];// GOOD; turbidity, algae 
var S3NNiRe2=[B08*3+B20*.7,B06*2.6+B12*.5,B04*3];// GOOD; turbidity, algae 

var S2REg=[B04*3,B03*2.5+B06*.5,B02*3];// High algae //  ************************** *good* 

var S3NReRe3=[B07*.2+B12*3,B06*.5+B08*3,B04*2.7];//Veg.Red; better
var S3NReRe4=[B08*1+B12*3.5,B06*1+B11*2.3,B04*2.7]; //Veg.Orange;

// Turbidity 
var S2SN1=[B04*3+B11*.4,B03*1.4+B08*4.2,B02*2.9];//enh: 0.3; 0.4; 2
var S2Re1=[B04*4.2-B08*3.2,B03*3+B07*1.35,B02*5];// Turbidity S2 L2A // var SmV=0.23;var SMV=.42;var StV=1.9; ************************** *BEST* 
var S2NiAtm=[B04*7-B08*3-ATM,B03*2+B07*5-ATM,B02*4-ATM]; 

var S3SN1a=[B08*3+B20*3,B05*1.5+B17*2,B04*3-B03*.6];//OK
var S3SN1b=[B08*2+B20*4,B05*1.5+B17*2,B04*3-B03*.6];//OK
var S3SN2a=[B08*1+B21*4,B05*.5+B17*3,B04*3.2-B03*.6];//xx

var L8TNR=[B08*4-B05*3,B03*3.4,B02*5];
var L8T3Atm=[B04*7-B05*3-ATM,B03*4-ATM,B02*4-ATM];
// FALSE COLOR blue;algae 
var S2F1=[B08*3,B04*3,B03*3];
var S2FNiRe=[B08*3,B03*1+B05*2,B02*3];
var S3FNiRe=[B17*3,B06*1+B11*3,B04*3]; //Veg.Orange;
/##################################################################################
//##### INVERSE: LAND // Enhanced Natural-OK
var S2NRNAt1=[B04*2+B12*.7-ATM,B03*2+B08*.6-ATM,B02*2.5-ATM]; // Natural+Veg
var S2NRNAt2=[B04*2+B05*.5-ATM,B03*2+B08*.3-ATM,B02*2.6-ATM];  
var S3NRNAt2=[B08*2.1+B11*.5-ATM,B06*2.5+B17*.5-ATM,B04*2.6-ATM];
var L8NRNAt2=[B04*2.2+B08*0.5-ATM,B03*2.3+B08*0.5-ATM,B02*2.3+B08*0.5-ATM];
//==================================================================================
// GEOLOGY - S2 / False Color & Natural

var S2GF1=[B12*1.60+B04*.23,B05*1.55+B08*0.5,B02*3];// S2L1C *BEST* NAMIBIA // ENH: 0.09; 0.92; 3.5; 
var S2GFb=[B12*1.60+B04*.25,B05*1.15+B08*0.7,B02*3];//good +NAMIBIA/Pucara/Yanacocha

var S2GF2=[B12*1.50+B04*.27,B06*1.25+B08*0.45,B02*3];//good 
var S2GF3=[B12*2,B05*1.8+B08*.3,B02*3];//good 
var S2GF4=[B12*2.1,B11*1.3+B08*0.45,B02*3];//good +salt +ATACAMA
var S2GF5=[B11*1.5+B04*.5,B06*1+B08*1,B02*3];//BEST +salt +ATACAMA
var S2GN1=[B12*1.8+B03*1,B04*1.4+B08*1,B02*2.5];//good NATURAL
var S2GN2=[B12*2.4,B04*1.4+B08*1,B02*2.5]; // +NATURAL

var ATM = B10*5
var S2GFireAtm=[B12*1+B04*1.55-ATM,B03*2.2+B08*.45-ATM,B02*2.55-ATM];//Fire, Bare soil, Veg.
var S2GFire1  =[B12*3,B08+B11,B02*2];//excellent
------------------------------------
// GEOLOGY - S3 // Masks:I=V 

var IOX1=B04/B02
var IOX2=B05/B01
var GRANITE=B11-B12


var S3G1a=[B20*.3+B08*1.5,B06*2,B04*2];

var S3G2a=[B20*1.2+B08*1,B17*.6+B06*1,B04*2.1-B21*.5];

var S3GNamib=[B20*1.4+B08*1,B17*1.2-B07*1+B06*1.4,B04*3-B03*.5];//BEST-TEST GREEN VEG


var S3G3a=[B20*1.2+B08*1.3,B17*1-B07*1+B06*1.8,B04*3.2-B03*.6];//BEST-TEST GREEN VEG
var S3G3b=[B20*1.4+B08*1,B17*1.2-B07*1+B06*1.4,B04*3-B03*.5];//BEST-TEST GREEN VEG
var S3G3c=[B20*1.2+B08*1.3-B13*1,B17*1-B07*1+B06*1.8-B13*.8,B04*2.6-B13*.5];//GOOD: MOROCCO to ARABIA 2020-06-02 // ATM = B13;

var S3G2R=[B21*1.9,B08*2.2+B17*.2,B04*2.7];// RED VEG // B03orB04  // var SmV=0.15;var SMV=.9;var StV=1.7; // ************************** good 
var S3GFireAtm=[B20*1+B08*1,B05*.8+B17*.5,B04*2];//
var S3GFireAtm=[B20*.8+B08*1-ATM,B05*.7+B17*.3-ATM,B04*1-ATM];//
------------------------------------
var L8GF1=[B06*2+B04*.4,B05*2.6,B02*3];//test
var L8GN1=[B07*2+B03*1,B04*1.5+B05*1,B02*2.8]; 

var L8GFireAtm1=[B04*1+B07*2.5-ATM, B03*1.4+B05*.4+B06*0.9-ATM,B02*3.5-ATM*1];
var L8GFireAtm2=[B04*.8+B07*2.8-ATM,B03*0.5+B05*.8+B06*1.0-ATM,B02*2.7-ATM*1];//EXCELLENT
var L8GFireAtm3=[B04*2+B07*.6+B08*.5-ATM,B03*2+B05*.4+B08*.5-ATM,B02*2.3+B08*.5-ATM];//+pan

//==================================================================================
/##################################################################################
//BASIC S3-SLSTR // A-68
var False_Basic=[S3*2,S2*2,S1*2];
var False_Atmos=[S3*1.97-S5*2.07,S2*2-S5*2,S1*2-S5*2];

/##################################################################################
//BAD:
var S3GN1=[B21*2+B06*1,B08*1.5+B17*1,B04*2.6];//bad
//==================================================================================
