// JavaScript Document
//document.write('Hello World');
$(function(){
	$('.search-result').append('');
	var server = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json';
	
		

	function search(movie_name){
	$.ajax({
		url: server,
		dataType:"jsonp",
		data:{
			q:movie_name,
			apiKey: 'hcrurhsttexasrgfm2y6yahm',			
			},
		
		success: showMovies
		});
	}
		
	
			
		function showMovies(response){
			$(".search-result").show();
			$('#movie-result-list').append('Number of results found: ' + response.total);
			
			console.log('response',response);
			var movies = response.movies;
			var total = response.total;
			
			for(var i = 0; i<movies.length; i++){
				var movie = movies[i];
				$('#movie-result-list').append('<div class = "movie-div"> <div class = "movie-title"><a href="' + movie.links.alternate + '" target = "_blank">' + '<h3>' + movie.title + '</h3>' + '</a>' + 
				'</div> <div class = "movie-poster"> <img src = "' + movie.posters.thumbnail + '"/> </div>' +
				'<div class = "movie-desc">Year: ' + movie.year + 
				'<br>Release Date: ' + movie.release_dates.theater +
				'<br>Movie Runtime: ' + movie.runtime + " mins" +
				'<br>Rating: ' + movie.mpaa_rating +
				'<br><br><strong>Synopsis:</strong> ' + movie.synopsis + '<hr>' + '</div' + '</div>');
			}
				
		}
			

		$("#search-button").click(function() { 
			
			$('#movie-result-list').empty();
			
			var txt = $("#term").val();
			$.get(search(txt)); 
			$("#term").val('');
		});
		
			
			
			
	});