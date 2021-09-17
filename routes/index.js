var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Bus = require("../models/bus");
var Ticket = require("../models/ticket");

router.get("/",(req,res)=>{
      res.render("home");
});


router.get("/signup",(req,res)=>{
     res.render("signup");
});

router.post("/signup",(req,res)=>{
     var newUser = new User({username:req.body.username,email:req.body.email,gender:req.body.gender,phoneno:req.body.phoneno,firstname:req.body.firstname,lastname:req.body.lastname});
     User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            req.flash("error",err.message);
            res.redirect("/signup");
        }
        passport.authenticate("local")(req,res,()=>{
             req.flash("success","Welcome to OrangeBus "+ user.username);
             res.redirect("/");
        });
     });
});

router.get("/login",(req,res)=>{
    res.render("login");
});

router.post("/login",passport.authenticate("local",
    {
       successRedirect:"/dashboard",
       failureRedirect:"/login",failureFlash:true
    }),(req,res)=>{

});

router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","You have successfully logged out!");
    res.redirect("/login");
});

router.get("/aboutus",(req,res)=>{
    res.render("aboutus");
});

router.get("/profile",isLoggedIn,(req,res)=>{
    res.render("profile");
});

router.put("/profile",isLoggedIn,(req,res)=>{
      User.findByIdAndUpdate(req.user._id,req.body.user,(err,updatedUser)=>{
        if(err){
            res.redirect("/profile");
        }
        else{
            res.redirect("/");
        }
    });
});
router.get("/changepassword",isLoggedIn,(req,res)=>{
	res.render("changepassword");
});
router.put("/changepassword",isLoggedIn,(req,res)=>{
    User.findById(req.user._id)
        .then(foundUser => {
            foundUser.changePassword(req.body.cpassword, req.body.npassword)
                .then(() => {
                    console.log('password changed');
                    res.redirect("/");
                })
                .catch((error) => {
                    req.flash("error","Your entered password does not match current password");
                    res.redirect("/changepassword");
                })
        })
        .catch((error) => {
            console.log(error);
        });
});
router.get("/dashboard",isLoggedIn,(req,res)=>{
     res.render("dashboard");
});

router.get("/buses",(req,res)=>{
     Bus.find({},(err,allbuses)=>{
      if(err){
        console.log(err);
      }
      else{
        res.render("allbuses",{bus:allbuses});
      }
     });

});

router.get("/buses/new",isLoggedIn,verifyAdmin,(req,res)=>{
  res.render("newbus");
});

router.post("/buses",isLoggedIn,verifyAdmin,(req,res)=>{
     Bus.create(req.body.newBus,(err,newlyCreated)=>{
      if(err){
        console.log(err);
      }
      else{
             res.redirect("/buses");
      }
     });

});

router.get("/buses/:id",isLoggedIn,verifyAdmin,(req,res)=>{
  Bus.findById(req.params.id,function(err,foundBus){
         if(err){
          console.log(err);
         }
         else{
          res.render("busshow",{bus:foundBus});
         }
  });
});

router.get("/buses/:id/edit",isLoggedIn,verifyAdmin,(req,res)=>{
  Bus.findById(req.params.id,(err,foundBus)=>{         
    res.render("busedit",{bus:foundBus});
  });     
});

router.put("/buses/:id",isLoggedIn,verifyAdmin,(req,res)=>{

    Bus.findByIdAndUpdate(req.params.id,req.body.newBus,(err,updatedBus)=>{
        if(err){
            res.redirect("/buses");
        }
        else{
            res.redirect("/buses/"+ req.params.id);
        }
    });
});

router.delete("/buses/:id",isLoggedIn,verifyAdmin,(req,res)=>{
    Bus.findByIdAndRemove(req.params.id,(err)=>{
        if(err){

            res.redirect("/buses");
        }
        else{
            res.redirect("/buses");
        }
    });
});

router.get("/fare",(req,res)=>{
    Bus.find({},(err,allbuses)=>{
      if(err){
        console.log(err);
      }
      else{
        res.render("searchfare",{bus:allbuses});
      }
     });
});


router.post("/fare",(req,res)=>{
    var from = req.body.from;
    var to = req.body.to;
    Bus.find({},(err,allbuses)=>{
      if(err){
        console.log(err);
      }
      else{
        res.render("fareresult",{bus:allbuses,from:from,to:to});
      }
     });

});

router.get("/bookticket",isLoggedIn,(req,res)=>{
    Bus.find({},(err,allbuses)=>{
      if(err){
        console.log(err);
      }
      else{

        res.render("bookticket",{bus:allbuses});
      }
    });
});

router.post("/bookticket",isLoggedIn,(req,res)=>{
    var from = req.body.from;
    var to = req.body.to;
    var date = req.body.date;
    Bus.find({},(err,allbuses)=>{
      if(err){
        console.log(err);
      }
      else{
        res.render("searchbuses",{bus:allbuses,from:from,to:to,date:date});
      }
     });

});

router.post("/ticket/:id",isLoggedIn,(req,res)=>{
    var date = req.body.date;
    var type = req.body.type;
    var value = 0;
    Bus.findById(req.params.id,(err,bus)=>{
      if(err){
        console.log(err);
      }
      else{
        res.render("ticket",{bus:bus,type:type,date:date,value:value});
      }
     });
});

router.post("/ticket/:id/confirmticket",isLoggedIn,(req,res)=>{
    var type = req.body.type;
    var date = req.body.date;
    var value = req.body.value;
    Bus.findById(req.params.id,(err,bus)=>{
        if(err){
            console.log(err);
            res.redirect("/");
        }
        else{
            var availability= bus.availableseats;
            Ticket.create({type:type,date:date},(err,ticket)=>{
                if(err){
                    console.log(err);
                }
                else{
                    ticket.from = bus.from;
                    ticket.to = bus.to;

                    ticket.ticketowner.id = req.user._id;
                    ticket.bus.id = req.params.id;
                    ticket.bus.busno = bus.busno;
                    ticket.bus.busname = bus.busname;
                    ticket.ticketowner.username = req.user.username;
                    var total=0;
                    req.body.p.forEach(function(passenger){
                      if(availability>0){
                        if(ticket.type==="Seater"){
                           total=total+bus.fareseater;
                        }  
                        if(ticket.type==="Semi-Sleeper"){
                           total=total+bus.faresemi;
                        } 
                        if(ticket.type==="Sleeper"){
                           total=total+bus.faresleeper;
                        }  
                      passenger.seatno = availability;
                      availability--;
                      ticket.passengers.push(passenger);
                      }
                      else{
                        req.flash("error","No more tickets available");
                      }
                     
                    });
                    ticket.totalfare = total;
                    ticket.save(function(err,tick){
                           Bus.findByIdAndUpdate(req.params.id,{availableseats:availability},(err,updatedBus)=>{
                             if(err){
                                console.log(err);
                             }
                             else{
                             res.redirect("/printticket/"+ tick._id);
                             }
                           });
                    });
                    
                }
            });

        }
    });
});
router.get("/printticket",(req,res)=>{
    Ticket.find({},(err,ticket)=>{
      if(err){
        console.log(err);
      }
      else{

            res.render("mybookings",{ticket:ticket});
          }
    });    
      
});

router.get("/printticket/:id",isLoggedIn,checkTicketOwner,(req,res)=>{
  Ticket.findById(req.params.id,function(err,foundTicket){
         if(err){
          console.log(err);
         }
         else{
              res.render("printticket",{ticket:foundTicket});
            }
          
  });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
      req.flash("error","You don't have permission to do that");
      res.redirect("/login");
    }
    
}

function verifyAdmin(req,res,next){
  if(req.user.admin === true)
  {
    next();
  }
  else
  {
    req.flash("error","You don't have permission to do that");
    err.status=403;
    res.redirect("/");
  }
}

function checkTicketOwner(req,res,next){
    if(req.isAuthenticated()){

         Ticket.findById(req.params.id,(err,foundTicket)=>{
         if(err){
            req.flash("error","Ticket not found!!");
            res.redirect("back");
         }
         else{
            if(foundTicket.ticketowner.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error","You don't have permission to do that");
                res.redirect("back"); 
            }
                    
         }
         });
    }
    else{
           req.flash("error","You don't have permission to do that");
           res.redirect("back");
    }
}



module.exports = router;
