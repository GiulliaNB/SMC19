function montaCidade(estado, pais){
	$.ajax({
		type:'GET',
		url:'http://api.londrinaweb.com.br/PUC/Cidades/'+estado+'/'+pais+'/0/10000',
		contentType: "application/json; charset=utf-8",
		dataType: "jsonp",
		async:false
	}).done(function(response){
		cidades='';

		$.each(response, function(c, cidade){

			cidades+='<option value="'+cidade+'">'+cidade+'</option>';

		});
		$('#cidade').html(cidades);
        $('#cidade').prop( "disabled", false );
	});
}

function montaUF(pais){
	$.ajax({
		type:'GET',
		url:'http://api.londrinaweb.com.br/PUC/Estados/'+pais+'/0/10000',
		contentType: "application/json; charset=utf-8",
		dataType: "jsonp",
		async:false
	}).done(function(response){
		estados='';
		$.each(response, function(e, estado){
			estados+='<option value="'+estado.UF+'">'+estado.Estado+'</option>';
		});
		$('#estado').html(estados);
		montaCidade($('#estado').val(), pais);
		$('#estado').change(function(){
			montaCidade($(this).val(), pais);
		});

	});
}

function montaPais(){
	$.ajax({
		type:	'GET',
		url:	'http://api.londrinaweb.com.br/PUC/Paisesv2/0/1000',
		contentType: "application/json; charset=utf-8",
		dataType: "jsonp",
		async:false
	}).done(function(response){
		
		paises='';

		$.each(response, function(p, pais){

			if(pais.Pais == 'Brasil'){
				paises+='<option value="'+pais.Sigla+'" selected>'+pais.Pais+'</option>';
			}
		});


		$('#pais').html(paises);

		montaUF($('#pais').val());

	});
}

function enableButtons() { 

    $("#Cadastrar").click(function(){
        alert("Olá");
    });
$("#Baixar").click(function(){
    submitForm();
});    
}

function baixarCSV() {
	$.get( 'http://Localhost:80/users', function( result ) {
let data = prepareCSV(JSON.parse(result))
var csvContent = "data:text/csv;charset=utf-8,";
data.forEach(rowArray => { 
    csvContent += rowArray + "\r\n";
})

var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "my_data.csv");
document.body.appendChild(link); 
link.click();
});
	  };


function clearForm(){
    $("formulario").reset();
}

function prepareCSV(array) { 
	console.log(array)
	var header = "numero;nome;func;setor;estado;cidade;data";
	var contentArray = [];
	contentArray.push(header)
	array.forEach(person => {
		contentArray.push(""+person.numero+";"+person.nome+";"+person.func+";"+person.setor+";"+person.estado+";"+person.cidade+";"+person.data)
	});
return contentArray;
}

function calculaSintomas(){
    var sintomas = []
    if($("#febre").val()) {
    sintomas.push("febre");
    }
    if($("#tosse").val()) {
    sintomas.push("tosse");
    }
    if($("#cansaço").val()) {
    sintomas.push("cansaço");
    }
    if($("#perda").val()) {
    sintomas.push("perda");
    }

return sintomas
}

function submitForm() {
    var novoCadastro = {setor: $("#Setor").val(),
                        data: $("#start").val(), 
                        nome: $("#nome").val(), 
                        numero:$("#numero").val(),
                        func:  $("#func").val(),
                        estado:$("#estado").val(),
                        cidade:$("#cidade").val(),
                        sintomas:calculaSintomas(),
                        outros:$("#outros").val(),
}
$.post( 'http://Localhost:80/',novoCadastro).done(function(response){
	if(response.status == 400){
		alert ("Já existe um usuário com esse número!")
	} else { 
		alert ("Criado com sucesso!")
	}
}).error(
)
}
enableButtons();
montaUF('BR');		