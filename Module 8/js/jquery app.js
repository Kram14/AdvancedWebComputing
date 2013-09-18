$(function () {

	var server = 'http://api.rottentomatoes.com/api/public/v1.0/';
	var dataSearch = {q: '', apiKey:'gvru729uj8x33ykh4zjvw4nv'};
	var searchKey;
	var total;

	//Enter
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
	});


	//Search Movies using ajax request
	function search(server1, dataSearch1){
		
		var serverP = server1;
		var dataP = dataSearch1;

			$.ajax({
					url: server1,
					dataType: 'jsonp',
					data: dataSearch1,
					
					success: showMovies
					});
	}
	

	//Sa Handlebars toh---
	function getTemplate(template_id, dataSearch1) {
        var template, $template, markup;
        template = $('#' + template_id).html();
        $template = Handlebars.compile(template);
        markup = $template(dataSearch1);
        return markup;
	}


	//Show Results
	function showMovies(response){
		$('.b1').empty();
		console.log(response);
		
		var total = response.total;
		var movies = response.movies;

			for (var i = 0; i < movies.length; i++) {
				var movie = movies[i];
				$('#movie-result-list').append(getTemplate('tpl-movie-detail', movie));
			}
	};


	//Removes the Content of the HTML
	function removeContent(){
		var myNode = document.getElementById("movie-result-list");
		myNode.innerHTML = '';
		
		$('#textbox').val('');
		movies = [];
		total = 0;
		serverP = '';
		dataP = '';
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





	//Modal ng textbox.val()
	var modal = (function(){
				var 
				method = {},
				$overlay,
				$modal,
				$content,
				$close;

				// Center the modal in the viewport
				method.center = function () {
					var top, left;

					top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
					left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;

					$modal.css({
						top:top + $(window).scrollTop(), 
						left:left + $(window).scrollLeft()
					});
				};

				// Open the modal
				method.open = function (settings) {
					$content.empty().append(settings.content);

					$modal.css({
						width: settings.width || 'auto', 
						height: settings.height || 'auto'
					});

					method.center();
					$(window).bind('resize.modal', method.center);
					$modal.show();
					$overlay.show();
				};

				// Close the modal
				method.close = function () {
					$modal.hide();
					$overlay.hide();
					$content.empty();
					$(window).unbind('resize.modal');
				};

				// Generate the HTML and add it to the document
				$overlay = $('<div id="overlay"></div>');
				$modal = $('<div id="modal"></div>');
				$content = $('<div id="content"></div>');
				$close = $('<a id="close" href="#">close</a>');

				$modal.hide();
				$overlay.hide();
				$modal.append($content, $close);

				$(document).ready(function(){
					$('body').append($overlay, $modal);						
				});

				$close.click(function(e){
					e.preventDefault();
					method.close();
				});

				return method;
			}());

			// Wait until the DOM has loaded before querying the document
			$(document).ready(function(){

				/*$.get('ajax.html', function(data){
					modal.open({content: data});
				});*/

				$('#btn_s').click(function(e){
					if($('#textbox').val() == ''){
					modal.open({content: "Error. Invalid input."});
					e.preventDefault();
				};
				});
			});
			
	//end ng Modal ng textbox.val()
