var C = require('../contraption.js');
var a = C.makeWire();
var b = C.makeWire();
var andGate = C.dLiftN(1, function(a,b) {return a && b;}, undefined, a, b);
console.log(andGate);
a.setValue(true);
b.setValue(false);
console.log(andGate);
b.setValue(true);
console.log(andGate);

console.log("inverter");
var inp = C.makeWire();
var out = C.makeWire();
C.inverter(inp,out);
console.log(out);
inp.setValue(true);
console.log(out);
