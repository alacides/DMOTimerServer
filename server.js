var http = require('http');
var firebase = require('firebase-admin');
const { getDatabase } = require('firebase-admin/database');

var Server = require('socket.io');
var admin = require("firebase-admin");

var serviceAccount = require("./dmotimer-fec6c-firebase-adminsdk-rhvlr-d257689ca0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dmotimer-fec6c-default-rtdb.firebaseio.com"
});
const httpServer = http.createServer();

const db = getDatabase();
const refe = db.ref("Horario/");

var runs = {dreaper:{status:'off',minutes:'5m',seconds:'1'},minato:{status:'off',hour:'1h',minutes:'5m',seconds:'1'},chaveirot:{status:'off',minutes:'5m',seconds:'1'},chaveiro:{status:'off',minutes:'5m',seconds:'1'}}

setInterval(function() {

  refe.set(runs)
}, 1000);
refe.get("Horario/").then((data) => {
  runs = data.val()
})

const io = new Server.Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true
    }
  });
  
  io.on('connection', (socket) => {
    let id = socket.id; 
    console.log('Um usuario com id: '+id+' conectou');
 
socket.on('checkr', function(data) {
  console.log(data.hora)
  vetord = data.hora
  runs.dreaper.minutes = vetord;
  runs.dreaper.seconds = 1;
  if(runs.dreaper.status == 'off'){
    runs.dreaper.status = 'on'
    setInterval(function() {

      if(runs.dreaper.seconds == 0){
        runs.dreaper.minutes = runs.dreaper.minutes-1;
          runs.dreaper.seconds = 59;
          if(runs.dreaper.minutes == -1){
            runs.dreaper.minutes = 59;
              runs.dreaper.seconds = 59;
          }
          runs.dreaper.seconds = 59;
      }
      else{
        runs.dreaper.seconds = runs.dreaper.seconds-1;
      }
      io.emit("dreaper",{msg: runs.dreaper.minutes + "m " + runs.dreaper.seconds + "s"});
      //document.getElementById("DReaper").innerHTML = minutes + "m " + seconds + "s ";
      }, 1000);
  }
  
  
  
});

socket.on('checkc', function(data) {
  console.log(data.hora)
  vetord = data.hora
  runs.chaveiro.minutes = vetord;
  runs.chaveiro.seconds = 1;
  if(runs.chaveiro.status == 'off'){
    runs.chaveiro.status = 'on'
  setInterval(function() {

  if(runs.chaveiro.seconds == 0){
    runs.chaveiro.minutes = runs.chaveiro.minutes-1;
      runs.chaveiro.seconds = 59;
      if(runs.chaveiro.minutes == -1){
        runs.chaveiro.minutes = 59;
          runs.chaveiro.seconds = 59;
      }
      runs.chaveiro.seconds = 59;
  }
  else{
    runs.chaveiro.seconds = runs.chaveiro.seconds-1;
  }
  io.emit("chaveiro",{msg: runs.chaveiro.minutes + "m " + runs.chaveiro.seconds + "s"});
  //document.getElementById("DReaper").innerHTML = minutes + "m " + seconds + "s ";
  }, 1000);
}
  
});

socket.on('checkt', function(data) {
  console.log(data.hora)
  vetord = data.hora
  runs.chaveirot.minutes = vetord;
  runs.chaveirot.seconds = 1;
  if(runs.chaveirot.status == 'off'){
    runs.chaveirot.status = 'on'
  setInterval(function() {

  if(runs.chaveirot.seconds == 0){
    runs.chaveirot.minutes = runs.chaveirot.minutes-1;
      runs.chaveirot.seconds = 59;
      if(runs.chaveirot.minutes == -1){
        runs.chaveirot.minutes = 59;
          runs.chaveirot.seconds = 59;
      }
      runs.chaveirot.seconds = 59;
  }
  else{
    runs.chaveirot.seconds = runs.chaveirot.seconds-1;
  }
  io.emit("chaveirot",{msg: runs.chaveirot.minutes + "m " + runs.chaveirot.seconds + "s"});
  //document.getElementById("DReaper").innerHTML = minutes + "m " + seconds + "s ";
  }, 1000);
}
});

socket.on('checkm', function(data){
  console.log(data.hora)
  vetorm = data.hora
  if(data.hora[1])
  {
   
  vetorm[1] = vetorm[1].split("m").join("")
  //console.log(vetorm)
 runs.minato.hour = vetorm[0];
  runs.minato.minutes = vetorm[1];
  runs.minato.seconds = 1;
  }
  else{
    vetorm = vetorm[0].split("m").join("")
  runs.minato.hour = 0;
  runs.minato.minutes = vetorm;
  runs.minato.seconds = 1;
  }
  if(runs.minato.status == 'off'){
    runs.minato.status = 'on'
  setInterval(function() {

    if(runs.minato.seconds == 0){
      runs.minato.minutes = runs.minato.minutes-1;
      runs.minato.seconds = 59;
        if(runs.minato.minutes == -1){
          runs.minato.hour = runs.minato.hour - 1
            if(runs.minato.hour == -1){
                
              runs.minato.hour = 1;
                runs.minato.minutes = 59;
                runs.minato.seconds = 59;
            }
            runs.minato.minutes = 59;
            runs.minato.seconds = 59;
        }
    }
    else{
      runs.minato.seconds = runs.minato.seconds-1;
    }
    
  // Output the result in an element with id="demo"
  io.emit("minato",{msg:runs.minato.hour + "h "+  runs.minato.minutes + "m " + runs.minato.seconds + "s"});
  }, 1000);
}

})

socket.on('pong',function(data){
  socket.emit('ping','bee');
})


socket.on("disconnect", (reason) => {
  io.emit('FimDeRota',socket.id)
});


});




io.listen(10000);