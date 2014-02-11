exports.makeWire = makeWire;
exports.delayed = delayed;
exports.dLiftN = dLiftN;

exports.andGate = andGate;
exports.inverter = inverter;

var Wire = function(){
    this.value = undefined;
    this.actionProcedures = [];
};

function makeWire() {
    return new Wire();
}

Wire.prototype.getValue = function() {
    return this.value;
};

Wire.prototype.setValue = function(newValue) {
    if (this.value != newValue) {
        this.value = newValue;
	this.actionProcedures.forEach(function(proc){
	    proc();
	});

    }
    return this;
};

Wire.prototype.addAction = function (proc) {
    this.actionProcedures.push(proc);
    proc();
};


var PriorityQueue = require('priorityqueuejs');
var schedule = new PriorityQueue(function(a,b) {
    return b.priority - a.priority;
});
schedule.currentTime = 0;

function simulate() {
    while (!schedule.isEmpty()) {
	var action = schedule.deq();
	schedule.currentTime = action.time;
	action.proc();
    }
}

function delayed(delay, action) {
    return function () {
        if(schedule.isEmpty()) {
	    schedule.enq({time: delay, proc: action});
	    simulate();
        }
        else {
	    schedule.enq({time: schedule.currentTime + delay, proc: action});
        }
    };
}

function inverter (input, output) {
    var output = output || makeWire();
    var action = delayed(1, function(){
        var val = input.getValue();
        if(val != undefined) {
            output.setValue(!val);
        }
    });
    input.addAction(action);
}


function andGate (input_a, input_b, output) {
    var output = output || makeWire();
    var action = delayed(1, function() {
	var aVal = input_a.getValue();
	var bVal = input_b.getValue();
	if (aVal != undefined && bVal != undefined) {
	    output.setValue(aVal && bVal);
	}
    });
    input_a.addAction(action);
    input_b.addAction(action);
    return output;
}

function dLiftN (delay, fun, output /* inputs for fun */) {
    var output = output || new Wire();
    var inputs = Array.prototype.slice.call(arguments, 3);

    var action = delayed(delay, function () {
	var inputValues = inputs.map(function(input){
	    return input.getValue();
	});
	if (inputValues.every(function(value){return value != undefined;})) {
	    output.setValue(fun.apply(this, inputValues));
	}
    });

    inputs.forEach(function(input){
	input.addAction(action);
    });

    return output;
}
