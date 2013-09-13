$(function () {

	var server = 'http://api.rottentomatoes.com/api/public/v1.0/';
	var dataSearch = {q: '', apiKey:'gvru729uj8x33ykh4zjvw4nv'};
	var searchKey;
	var apkey = "hcrurhsttexasrgfm2y6yahm";
	var total;
	//var pageNum;
	//var pageLimit = 15;




	$('#textbox').keydown(function(event){
		if (event.which == 13) {
			$('#btn_s').click();
		};
	});
	
	$('#btn_s').click(function(){
		searchKey = $('#textbox').val();
		dataSearch.q = searchKey;
		removeContent();
		$('#textbox').val(searchKey);
		
		if (searchKey.length > 0){
			search(server + "movies.json", dataSearch);
		} 
		//else {
			//console.log("input movie title");
			//alert("input movie title");
		//}
	});

	//Search Movies using ajax request
	function search(server1, dataSearch1){

		$('#prg-bar').hide();
		var serverP = server1;
		var dataP = dataSearch1;

			$.ajax({
					url: server1,
					dataType: 'jsonp',
					data: dataSearch1,
					
					success: showMovies
					});
		}


	function getTemplate(template_id, dataSearch1) {
        var template, $template, markup;
        template = $('#' + template_id).html();
        $template = Handlebars.compile(template);
        markup = $template(dataSearch1);
        return markup;
	}


	//Show Result
	function showMovies(response){

		console.log(response);
		
		var total = response.total;
		var movies = response.movies;
		var movieObject ="";

			for (var i = 0; i < movies.length; i++) {
				var movie = movies[i];
				$('#movie-result-list').append(getTemplate('tpl-movie-detail', movie));
			}
		
		//Event
			//$("#btn-more").click(function(){
			//	$('#myModal').modal('toggle')
			//});
	};


	//Removes the Content of the HTML
	function removeContent(){
		//$('.row-fluid').remove();
		var myNode = document.getElementById("movie-result-list");
		myNode.innerHTML = '';
		
		$('#textbox').val('');
		movies = [];
		pageNum = 1;
		total = 0;
		pageNum = 1;
		serverP = '';
		dataP = '';
		dataSearch.page = 1;
	}


	//Box Office Movies
	$('li#bom').click(function(){
		removeContent()
		search(server + "lists/movies/box_office.json", dataSearch);
	});


	//In Theaters Movies
	$('li#itm').click(function(){
		removeContent()
		search(server + "lists/movies/in_theaters.json", dataSearch);
	});


	//Opening Movies
	$('li#opm').click(function(){
		removeContent()
		search(server + "lists/movies/in_theaters.json", dataSearch);
	});


	//Upcoming Movies
	$('li#upm').click(function(){
		removeContent()
		search(server + "lists/movies/in_theaters.json", dataSearch);
	});


	//Top Rental Movies
	$('li#tor').click(function(){
		removeContent()
		search(server + "lists/movies/in_theaters.json", dataSearch);
	});


	//Current Release DVDs
	$('li#crd').click(function(){
		removeContent()
		search(server + "lists/movies/in_theaters.json", dataSearch);
	});


	//New Release DVDs
	$('li#nrd').click(function(){
		removeContent()
		search(server + "lists/movies/in_theaters.json", dataSearch);
	});


	//Upcoming DVDs
	$('li#upd').click(function(){
		removeContent()
		search(server + "lists/movies/in_theaters.json", dataSearch);
	});
});
