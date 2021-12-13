var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
const cors = require('cors');
var app = express();
app.use(cors());
app.options('*', cors());
var bodyParser = require('body-parser');
var listaDeCadastro = []
var usuariosCadastrados = []

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
   extended: true
}));

app.post('/', function (req, res) {
   console.log(req.body.username)
   if (usuariosCadastrados.some(user => {
         return user.username === req.body.username
      })) {
      res.status(400).send("usuário já cadastrado com esse número!")
   } else {
      usuariosCadastrados.push(req.body);
      fs.writeFileSync('users.json', JSON.stringify(usuariosCadastrados))
      res.send("usuário cadastrado com sucesso")
   }
})

app.post('/logs', function (req, res) {
   console.log(req.body)
      listaDeCadastro.push(req.body);
      fs.writeFileSync('database.json', JSON.stringify(listaDeCadastro))
      res.send("usuário cadastrado com sucesso")
})

app.get('/logs', function (req, res) {
   console.log(listaDeCadastro)
   res.send(JSON.stringify(listaDeCadastro));
})

app.post('/login', function (req, res) {
   let usuario = usuariosCadastrados.find(user => {
      return user.username.toString() === req.body.username.toString() && user.password.toString() === req.body.password.toString()
   })
   console.log(JSON.stringify(usuario))
   if (usuario == null || usuario == undefined) res.status(400).send("usuário não existe!");
   res.status(200).send(JSON.stringify(usuario));
})

app.on('error', function (err) {
   fs.writeFileSync('database.json', JSON.stringify(listaDeCadastro))
   console.log("salvo!");
});
app.on('SIGINT', function () {
   fs.writeFileSync('database.json', JSON.stringify(listaDeCadastro))
   console.log("salvo!");
});

//var server = app.listen(80, function () {
//   var host = server.address().address
//   var port = server.address().port
//   var cadastros = fs.readFileSync('database.json')
//   var users = fs.readFileSync('users.json')
//   listaDeCadastro = JSON.parse(cadastros)
//   usuariosCadastrados = JSON.parse(users)
//   console.log(listaDeCadastro)
//   console.log(usuariosCadastrados)
//})
var server = app.listen(process.env.PORT, function () {
 var host = server.address().address
  var port = server.address().port
 var cadastros = fs.readFileSync('database.json')
 var users = fs.readFileSync('users.json')
 listaDeCadastro = JSON.parse(cadastros)
 usuariosCadastrados = JSON.parse(users)
 console.log(listaDeCadastro)
 console.log(usuariosCadastrados)
})
