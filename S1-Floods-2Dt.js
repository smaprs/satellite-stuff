//VERSION=3 // S1-IW 
//ADAPTED FROM: https://custom-scripts.sentinel-hub.com/sentinel-1/flood_mapping/ 
function setup() {return { 
 input: ["VV","VH","dataMask"],
 output: { bands: 4 }, mosaicking: "ORBIT"};} 
function filterScenes (scenes) { return scenes.filter(function (scene) {
  var allowedDates = [AFT_date0,BEF_date1]; 
  var sceneDateStr = dateformat(scene.date);
  if (allowedDates.indexOf(sceneDateStr)!= -1) return true; else return false; }); }
function dateformat(d){  
  var dd = d.getDate(); var mm = d.getMonth()+1; var yyyy = d.getFullYear();
  if(dd<10){dd='0'+dd;} if(mm<10){mm='0'+mm;} var isodate = yyyy+'-'+mm+'-'+dd; 
  return isodate; } 
var AFT_date0="2023-12-16"; 
var BEF_date1="2023-12-04";//12 days intervals
 // FLOOD MAPPING: 
  function calcFM(sample) {
var VV=sample.VV; var VH=sample.VH; 
var DBVV = (Math.max(0,Math.log(VV)*0.217+1));
var DBVH = (Math.max(0,Math.log(VH)*0.217+1));
var RatDB = DBVV/DBVH;
return [ DBVV ] ;} // Base Values
  function evaluatePixel(samples) {
var MK0=samples[0].dataMask;//var MK1
var AFT=0; AFT=calcFM(samples[0]); 
var BEF=0; BEF=calcFM(samples[1]);  
var SUM=(1*AFT)+(1*BEF);
var DIF=(1*AFT)-(1*BEF);
  // RGB COMPOSITIONS:
var AVG =[SUM*0.3,SUM*0.2,SUM*0.1,MK0];//BROWN
var MONO=[DIF,DIF,DIF,MK0];//For tests
var RED =[BEF,AFT,AFT,MK0];
var BLUE=[AFT*1+DIF,SUM*0.6,BEF*1.1-DIF,MK0];
var CYAN=[0,1,1,MK0];
   // DEFAULT COMPOSITION: BLUE; (RED;MONO)
return BLUE ; } 
   // FOR THRESHOLD HIGHLIGHTED, LAND=BROWN:
//return (DIF<-0.2) ? CYAN : AVG ; }

// EXAMPLE:
// https://browser.dataspace.copernicus.eu/?zoom=11&lat=-17.07877&lng=145.58533&themeId=DEFAULT-THEME&visualizationUrl=U2FsdGVkX1%2BTru%2FF0bPah%2B8yTDOhEOtmYl%2FwQlnZ1dbb%2FaYkGWK1ZjieRNbKaYd%2FjiChLS28uJZJPQeRCyT5APzR7GhizqvngwXFnKZZ%2FB1e0fpKA4udkhQyndapL0PR&evalscript=Ly9WRVJTSU9OPTMgLy8gUzEtSVcgCi8vQURBUFRFRCBGUk9NOiBodHRwczovL2N1c3RvbS1zY3JpcHRzLnNlbnRpbmVsLWh1Yi5jb20vc2VudGluZWwtMS9mbG9vZF9tYXBwaW5nLyAKZnVuY3Rpb24gc2V0dXAoKSB7cmV0dXJuIHsgCiBpbnB1dDogWyJWViIsIlZIIiwiZGF0YU1hc2siXSwKIG91dHB1dDogeyBiYW5kczogNCB9LCBtb3NhaWNraW5nOiAiT1JCSVQifTt9IApmdW5jdGlvbiBmaWx0ZXJTY2VuZXMgKHNjZW5lcykgeyByZXR1cm4gc2NlbmVzLmZpbHRlcihmdW5jdGlvbiAoc2NlbmUpIHsKwqAgdmFyIGFsbG93ZWREYXRlcyA9IFtBRlRfZGF0ZTAsQkVGX2RhdGUxXTsgCsKgIHZhciBzY2VuZURhdGVTdHIgPSBkYXRlZm9ybWF0KHNjZW5lLmRhdGUpOwrCoCBpZiAoYWxsb3dlZERhdGVzLmluZGV4T2Yoc2NlbmVEYXRlU3RyKSE9IC0xKSByZXR1cm4gdHJ1ZTsgZWxzZSByZXR1cm4gZmFsc2U7IH0pOyB9CmZ1bmN0aW9uIGRhdGVmb3JtYXQoZCl7IMKgCsKgIHZhciBkZCA9IGQuZ2V0RGF0ZSgpOyB2YXIgbW0gPSBkLmdldE1vbnRoKCkrMTsgdmFyIHl5eXkgPSBkLmdldEZ1bGxZZWFyKCk7CsKgIGlmKGRkPDEwKXtkZD0nMCcrZGQ7fSBpZihtbTwxMCl7bW09JzAnK21tO30gdmFyIGlzb2RhdGUgPSB5eXl5KyctJyttbSsnLScrZGQ7IArCoCByZXR1cm4gaXNvZGF0ZTsgfSAKdmFyIEFGVF9kYXRlMD0iMjAyMy0xMi0xNiI7IAp2YXIgQkVGX2RhdGUxPSIyMDIzLTEyLTA0IjsvLzEyIGRheXMgaW50ZXJ2YWxzCiAvLyBGTE9PRCBNQVBQSU5HOiAKICBmdW5jdGlvbiBjYWxjRk0oc2FtcGxlKSB7CnZhciBWVj1zYW1wbGUuVlY7IHZhciBWSD1zYW1wbGUuVkg7IAp2YXIgREJWViA9IChNYXRoLm1heCgwLE1hdGgubG9nKFZWKSowLjIxNysxKSk7CnZhciBEQlZIID0gKE1hdGgubWF4KDAsTWF0aC5sb2coVkgpKjAuMjE3KzEpKTsKdmFyIFJhdERCID0gREJWVi9EQlZIOwpyZXR1cm4gWyBEQlZWIF0gO30gLy8gQmFzZSBWYWx1ZXMKICBmdW5jdGlvbiBldmFsdWF0ZVBpeGVsKHNhbXBsZXMpIHsKdmFyIE1LMD1zYW1wbGVzWzBdLmRhdGFNYXNrOy8vdmFyIE1LMQp2YXIgQUZUPTA7IEFGVD1jYWxjRk0oc2FtcGxlc1swXSk7IAp2YXIgQkVGPTA7IEJFRj1jYWxjRk0oc2FtcGxlc1sxXSk7IMKgCnZhciBTVU09KDEqQUZUKSsoMSpCRUYpOwp2YXIgRElGPSgxKkFGVCktKDEqQkVGKTsKICAvLyBSR0IgQ09NUE9TSVRJT05TOgp2YXIgQVZHID1bU1VNKjAuMyxTVU0qMC4yLFNVTSowLjEsTUswXTsvL0JST1dOCnZhciBNT05PPVtESUYsRElGLERJRixNSzBdOy8vRm9yIHRlc3RzCnZhciBSRUQgPVtCRUYsQUZULEFGVCxNSzBdOwp2YXIgQkxVRT1bQUZUKjErRElGLFNVTSowLjYsQkVGKjEuMS1ESUYsTUswXTsKdmFyIENZQU49WzAsMSwxLE1LMF07CiAgIC8vIERFRkFVTFQgQ09NUE9TSVRJT046IEJMVUU7IChSRUQ7TU9OTykKcmV0dXJuIEJMVUUgOyB9IAogICAvLyBGT1IgVEhSRVNIT0xEIEhJR0hMSUdIVEVELCBMQU5EPUJST1dOOgovL3JldHVybiAoRElGPC0wLjIpID8gQ1lBTiA6IEFWRyA7IH0%3D&datasetId=S1_CDAS_IW_VVVH&fromTime=2023-12-04T00%3A00%3A00.000Z&toTime=2023-12-16T23%3A59%3A59.999Z&speckleFilter=%7B%22type%22%3A%22NONE%22%7D&orthorectification=%22COPERNICUS_30%22&demSource3D=%22MAPZEN%22&cloudCoverage=30&dateMode=TIME%20RANGE#custom-script
