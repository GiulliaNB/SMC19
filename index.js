var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
const cors = require('cors');
var app = express();
app.use(cors());
app.options('*', cors());
var bodyParser = require('body-parser');
var listaDeCadastro = []  

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/', function (req, res) {
   console.log(req.body.numero)
if(listaDeCadastro.some(user => {return user.numero === req.body.numero})) { 
   res.status(400).send("usuário já cadastrado com esse número!")
} else { 
   listaDeCadastro.push(req.body);
   fs.writeFileSync('database.json',JSON.stringify(listaDeCadastro))
   res.send("usuário cadastrado com sucesso")
}
 })

 app.get('/users', function (req, res) {
console.log(listaDeCadastro)
   res.send(JSON.stringify(listaDeCadastro));
    })
 app.on('error', function(err) {
   fs.writeFileSync('database.json',JSON.stringify(listaDeCadastro))
   console.log("salvo!");
 });
app.on('SIGINT', function() {
   fs.writeFileSync('database.json',JSON.stringify(listaDeCadastro))
   console.log("salvo!");
 });
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   var cadastros = fs.readFileSync('database.json')
  
   listaDeCadastro = JSON.parse(cadastros)
   console.log(listaDeCadastro)
})