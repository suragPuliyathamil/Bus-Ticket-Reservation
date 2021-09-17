var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username:String,
	firstname:String,
	lastname:String,
	password:String,
	admin: {
		type: Boolean,
		default: false
	},
	phoneno:Number,
	email:String,
	gender:String,
	tickets:[
       {
       	type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
       }
	]

});

UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User",UserSchema);
