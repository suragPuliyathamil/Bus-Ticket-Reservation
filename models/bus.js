var mongoose = require("mongoose");

var BusSchema = new mongoose.Schema({
	busno:Number,
	busname:String,
	type:String,
	distance:Number,
	from:String,
	to:String,
	departure:String,
	arrival:String,
	fareseater:Number,
	faresemi:Number,
	faresleeper:Number,
	availableseats:{
		type:Number,
		min:0,
		default:40
	}
});

module.exports = mongoose.model("Bus",BusSchema);