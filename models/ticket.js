var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');


var PassengerSchema = new mongoose.Schema({
	name:String,
	gender:String,
	age:Number,
	seatno:Number
});

var TicketSchema = new mongoose.Schema({
    ticketid:Number,
    type:String,
    from:String,
    to:String,
    totalfare:Number,
    ticketowner:{
        id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:String
	},
	bus:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Bus"
		},
		busno:Number,
		busname:String
	},	
    date:String,
    passengers:[PassengerSchema]

});

module.exports = mongoose.model("Ticket",TicketSchema);
autoIncrement.initialize(mongoose.connection);
TicketSchema.plugin(autoIncrement.plugin, {
    model: 'Ticket',
    field: 'ticketid',
    startAt: 0,
    incrementBy: 1
});


