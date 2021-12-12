
function montaCidade(estado, pais) {
	$.ajax({
		type: 'GET',
		url: 'http://api.londrinaweb.com.br/PUC/Cidades/' + estado + '/' + pais + '/0/10000',
		contentType: "application/json; charset=utf-8",
		dataType: "jsonp",
		async: false
	}).done(function (response) {
		cidades = '';

		$.each(response, function (c, cidade) {

			cidades += '<option value="' + cidade + '">' + cidade + '</option>';

		});
		$('#cidade').html(cidades);
		$('#cidade').prop("disabled", false);
	});
}

function realizarLogin() {
	var usuario = {
		username: $("#login").val(),
		password: $("#senha").val()
	}
	$.post(' https://sdmdc19.herokuapp.com/login', usuario).done(function (response) {
		if (response.status == 400) {
			alert("Esse usuário não existe com essa senha!")
		} else {
			localStorage.setItem('login', response);
			$("#contact-inner").show();
			$("#formLogin").hide();
			if(JSON.parse(response).username == "admin") { 
				$("#Cadastro_Pessoa").show();
			} else {
				$("#Cadastro_Pessoa").hide();
			}
		}
	}).error()
}

function verificarLogin() {
	let validUser = JSON.parse(localStorage.getItem('login'));
	console.log(validUser)
	if (validUser == null) {
		$("#contact-inner").hide();
	} else {
		$("#contact-inner").show();
		$("#formLogin").hide();
		if(validUser.username == "admin") { 
			$("#Cadastro_Pessoa").show();
		}
	}
}

function denyStatus() { 
	$("#firstcontact").hide();
	$("#sintomasApresentados").show();

}
function confirmStatus() { 
	$("#firstcontact").hide();
	$("#positiveMessage").show();
	var today = new Date();
	var date = today.getDate()+'/'+(today.getMonth()+1)+"/"+today.getFullYear()
	let validUser = JSON.parse(localStorage.getItem('login'));
	var novoLog = {
		nome: validUser.nome,
		username: validUser.username,
		data: date.toString(),
		sintomas: "",
		outros: $("#outros").val()
	}
	$.post('https://sdmdc19.herokuapp.com/logs', novoLog).done(function (response) {
		if (response.status == 400) {
			alert("Erro")
		} else {
			alert("Log criado com sucesso!")
		}
	}).error()
}


function realizarLogout() {
	$("#formLogin").show();
	$("#login").prop('value', "")
	$("#senha").prop('value', "")
	$("#contact-inner").hide();
	let webpage = window.location.toString()
	window.location.href= webpage.replace("Cadastro_Pessoa.html", "").replace("Cadastro_sintomas.html","").replace("logs.html","")
	localStorage.clear();
}

function montaUF(pais) {
	$.ajax({
		type: 'GET',
		url: 'http://api.londrinaweb.com.br/PUC/Estados/' + pais + '/0/10000',
		contentType: "application/json; charset=utf-8",
		dataType: "jsonp",
		async: false
	}).done(function (response) {
		estados = '';
		$.each(response, function (e, estado) {
			estados += '<option value="' + estado.UF + '">' + estado.Estado + '</option>';
		});
		$('#estado').html(estados);
		montaCidade($('#estado').val(), pais);
		$('#estado').change(function () {
			montaCidade($(this).val(), pais);
		});

	});
}

function montaPais() {
	$.ajax({
		type: 'GET',
		url: 'http://api.londrinaweb.com.br/PUC/Paisesv2/0/1000',
		contentType: "application/json; charset=utf-8",
		dataType: "jsonp",
		async: false
	}).done(function (response) {

		paises = '';

		$.each(response, function (p, pais) {

			if (pais.Pais == 'Brasil') {
				paises += '<option value="' + pais.Sigla + '" selected>' + pais.Pais + '</option>';
			}
		});


		$('#pais').html(paises);

		montaUF($('#pais').val());

	});
}



function baixarCSV() {
	$.get('https://sdmdc19.herokuapp.com/users', function (result) {
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


function getPacientes() { 
	$.get('https://sdmdc19.herokuapp.com/logs', function (result) {
	var data = JSON.parse(result)
	
	let tableContent = "<tr><th>Nome</th><th>Número de Cadastro</th><th>Data</th><th>Sintomas</th><th>Outros Sintomas</th></tr>"
	data.filter(user => {
		if(JSON.parse(localStorage.getItem('login')).username == "admin") return true
		return user.username == JSON.parse(localStorage.getItem('login')).username
	}).forEach(element => {
		tableContent += "<tr><td>" + element.nome + "</td><td>" + element.username + "</td><td>" + element.data  + "</td><td>" + element.sintomas + "</td><td>" + element.outros + "</td>" 
	});
	$('#resultados').html(tableContent);
})

}

function clearForm() {
	$("formulario").reset();
}

function prepareCSV(array) {
	console.log(array)
	var header = "numero;nome;func;setor;estado;cidade;data;sintomas;outros_sintomas";
	var contentArray = [];
	contentArray.push(header)
	array.forEach(person => {
		contentArray.push("" + person.numero + ";" + person.nome + ";" + person.func + ";" + person.setor + ";" + person.estado + ";" + person.cidade + ";" + person.data + ";" + (person.sintomas != undefined && person.sintomas != null) ? person.sintomas.toString() : "" + ";" + person.outros)
	});
	return contentArray;
}

function calculaSintomas() {
	var sintomas = []
	if ($('#febre').is(":checked")) {
		sintomas.push("Febre");
	}
	if ($("#tosse").is(":checked")) {
		sintomas.push("Tosse");
	}
	if ($("#cansaço").is(":checked")) {
		sintomas.push("Cansaço excessivo");
	}
	if ($("#perdaOlfato").is(":checked")) {
		sintomas.push("Perda do olfato");
	}
	if ($("#perdaPaladar").is(":checked")) {
		sintomas.push("Perda do Paladar");
	}
	if ($("#faltaAr").is(":checked")) {
		sintomas.push("Falta de ar");
	}
	if ($("#calafrio").is(":checked")) {
		sintomas.push("Calafrio");
	}
	if ($("#dorGarganta").is(":checked")) {
		sintomas.push("Dor de Garganta");
	}
	if ($("#dorCabeca").is(":checked")) {
		sintomas.push("Dor de Cabeça");
	}
	if ($("#dorPeito").is(":checked")) {
		sintomas.push("Dor no Peito");
	}
	if ($("#dorMuscle").is(":checked")) {
		sintomas.push("Dores musculares");
	}
	if ($("#diarreia").is(":checked")) {
		sintomas.push("Diarreia");
	}
	if ($("#coriza").is(":checked")) {
		sintomas.push("Coriza");
	}
	if ($("#espirros").is(":checked")) {
		sintomas.push("Espirros");
	}
	return sintomas
}

function submitForm() {
	var novoCadastro = {
		setor: $("#Setor").val(),
		data: $("#start").val(),
		nome: $("#nome").val(),
		username: $("#numero").val(),
		func: $("#func").val(),
		estado: $("#estado").val(),
		cidade: $("#cidade").val(),
		password: $("#numero").val()
	}
	$.post('https://sdmdc19.herokuapp.com', novoCadastro).done(function (response) {
		if (response.status == 400) {
			alert("Já existe um usuário com esse número!")
		} else {
			alert("Criado com sucesso!")
		}
	}).error()
}
function submitLog() {
	let validUser = JSON.parse(localStorage.getItem('login'));
	var novoLog = {
		nome: validUser.nome,
		username: validUser.username,
		data: $('#dataInicioSintomas').val(),
		sintomas: calculaSintomas(),
		outros: $("#outros").val()
	}
	$.post('https://sdmdc19.herokuapp.com/logs', novoLog).done(function (response) {
		if (response.status == 400) {
			alert("Erro")
		} else {
			alert("Sugerimos que busque orientações através de um canal oficial do serviço de saúde (TeleSUS - https://aps.saude.gov.br/ape/corona/telesus)")
		}
	}).error()
}




function carregaForm() {
	localStorage.setItem("login", $("#login").val())
	if (localStorage.getItem("login") != null || localStorage.getItem("login") != undefined) {
		carregarForm();
	} else {
		escondeForm();
	}
}

function escondeForm() {
	$("#contact-inner").hide();
}

function carregarForm() {
	$("#contact-inner").show();
}

montaUF('BR');
