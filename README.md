# Bus Ticket Reservation System

The project is created using HTML, CSS, Javascript for Frontend purposes, MongoDB for database and Node.js for backend.

#### Requirements :-

1) Node.js
2) MongoDB


#### How to setup :-

1) Clone this repo
2) In command prompt navigate to this folder and run " npm install ".
3) Initialize the folder using " npm init " command.
4) Install all the dependencies using the command " npm install (name of dependencies) ".
5) Open another command line and run the mongodb server using command " mongod ".
6) To start the server type "node app.js" in command prompt.
7) Open Browser and go to address http://localhost:3000

Note: To make an user an admin you have to go directly to database to change it.
      In the command prompt type " mongo ". The mongo command line will appear.
      Type the command "db.users.update({username:"yourusername"},{$set:{admin:true}});"
      This will make the user you require to be admin. The admin only has the privileges
      to add or edit or delete a bus. Login in as usual using the username your set as admin
      to see the admin privileges.
