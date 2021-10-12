// MONO https://custom-scripts.sentinel-hub.com/sentinel-2/selective_enhancement_based_on_indices/ 
function a(a, b) {return a + b;} 
function stretch (val,min,max) {return (val-min)/(max-min);} //=ANNA
function SATUREnh (rgbArr) {var avg = rgbArr.reduce((a, b) => a + b, 0) / rgbArr.length; 
  return rgbArr.map(a => avg * (1 - SATUR) + a * SATUR);}
function ApplyEnh (bArr) {return SATUREnh ([
stretch (bArr[0], Rmin, Rmax), 
stretch (bArr[1], Rmin, Rmax), 
stretch (bArr[2], Rmin, Rmax)]);   }

var S2Fire=[B04*1+B12*1,B03*1.6+B11*0.2+B08*0.3,B02*2.5];
//var L8Fire=[B04*1.4+B07*1.5,B03*0.5+B05*0.2+B06*2,B02*3];

var COMPO = S2Fire; 
var Rmin=-0.1;var Rmax=0.9;var SATUR=2;

var Enh = ApplyEnh (COMPO); return Enh;
