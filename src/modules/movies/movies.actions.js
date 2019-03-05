import axios from 'axios';
import * as types from '../../constants/actionTypes';
import { TMDB_URL, TMDB_API_KEY } from '../../constants/api';
axios.defaults.headers['Referer'] = 'http://net.adjara.com/Search';
// GENRES
export function retrieveMoviesGenresSuccess(res) {
	return {
		type: types.RETRIEVE_MOVIES_GENRES_SUCCESS,
		moviesGenres: res.data
	};
}






export function retrieveMoviesGenres() {
	return function (dispatch) {

		return axios.get(`http://net.adjara.com/Search/SearchResults?ajax=1&display=15&startYear=1900&endYear=2018&offset=0&isnew=0&needtags=0&orderBy=date&order%5Border%5D=desc&order%5Bdata%5D=published&language=georgian&country=false&game=0&softs=0&videos=0&xvideos=0&vvideos=0&dvideos=0&xphotos=0&vphotos=0&dphotos=0&trailers=0&episode=0&tvshow=0&flashgames=0`)
		.then(res => {
			dispatch(retrieveMoviesGenresSuccess(res));
		})
		.catch(error => {
			console.log(error); //eslint-disable-line
		});
	};
}

// POPULAR
export function retrievePopularMoviesSuccess(res) {
	return {
		type: types.RETRIEVE_POPULAR_MOVIES_SUCCESS,
		popularMovies: res.data
	};
}

export function retrievePopularMovies(page,cb) {
	return function (dispatch) {
		return axios.get("http://net.adjara.com/cache/cached_home_premiere.php?type=premiere&order=new&period=week&limit=25")
		.then(res => {
			cb(res.data)
			dispatch(retrievePopularMoviesSuccess(res));
		})
		.catch(errr => {
		//	alert(JSON.stringify(errr))
			//console.log('Popular', error); //eslint-disable-line
		//	alert(error)
		});
	};
}






// NOW PLAYING
export function retrieveNowPlayingMoviesSuccess(res) {
	return {
		type: types.RETRIEVE_NOWPLAYING_MOVIES_SUCCESS,
		nowPlayingMovies: res.data
	};
}





export function retrieveNowPlayingMovies(page,cb) {

 if(page == "სერიალები ქართულად") {
	 return function (dispatch) {
 return axios.get(`http://net.adjara.com/Search/SearchResults?ajax=1&display=16&startYear=1900&endYear=2018&offset=0&isnew=0&needtags=0&orderBy=date&order%5Border%5D=data&order%5Bdata%5D=published&language=false&country=false&game=0&softs=0&episode=1&trailers=0&tvshow=0&videos=0&xvideos=0&vvideos=0&dvideos=0&xphotos=0&vphotos=0&dphotos=0&flashgames=0`)
 .then(res => {
	 cb()

	 dispatch(retrieveNowPlayingMoviesSuccess(res.data));
 })
 .catch(error => {
	 //alert(error)
 });
};


 }else{
	return function (dispatch) {
		return axios.get(`http://net.adjara.com/Search/SearchResults?ajax=1&display=15&startYear=1900&endYear=2018&offset=0&isnew=0&needtags=0&orderBy=date&order%5Border%5D=desc&order%5Bdata%5D=published&language=georgian&country=false&game=0&softs=0&videos=0&xvideos=0&vvideos=0&dvideos=0&xphotos=0&vphotos=0&dphotos=0&trailers=0&episode=0&tvshow=0&flashgames=0`)
		.then(res => {
			cb()
			dispatch(retrieveNowPlayingMoviesSuccess(res.data));
		})
		.catch(error => {
			//alert(error)
		});
	};
 }
}


export function retrieveSeriesSuccess(res) {
	return {
		type: types.RETRIVE_SERIES_SUCCESS,
		Series: res.data
	};
}

export function retrieveSeries(cb) {
	return function (dispatch) {
		return axios.get(`http://net.adjara.com/Search/SearchResults?ajax=1&display=16&startYear=1900&endYear=2018&offset=0&isnew=0&needtags=0&orderBy=date&order%5Border%5D=data&order%5Bdata%5D=published&language=false&country=false&game=0&softs=0&episode=1&trailers=0&tvshow=0&videos=0&xvideos=0&vvideos=0&dvideos=0&xphotos=0&vphotos=0&dphotos=0&flashgames=0`)
		.then(res => {
			cb()
			dispatch(retrieveSeriesSuccess(res.data));
		})
		.catch(error => {
	 	alert(error)
		});
	};
}















// MOVIES LIST
export function retrieveMoviesListSuccess(res) {
	return {
		type: types.RETRIEVE_MOVIES_LIST_SUCCESS,
		list: res.data
	};
}

export function retrieveMoviesList(type, page) {

	return function (dispatch) {
		return axios.get(`http://net.adjara.com/Search/SearchResults?ajax=1&display=15&startYear=1900&endYear=2018&offset=0&isnew=0&needtags=0&orderBy=date&order%5Border%5D=desc&order%5Bdata%5D=published&language=georgian&country=false&game=0&softs=0&videos=0&xvideos=0&vvideos=0&dvideos=0&xphotos=0&vphotos=0&dphotos=0&trailers=0&episode=0&tvshow=0&flashgames=0`)
		.then(res => {
			dispatch(retrieveMoviesListSuccess(res.data));
		})
		.catch(error => {
			console.log('Movies List', error); //eslint-disable-line
		});
	};
}

// SEARCH RESULTS
export function retrieveMoviesSearchResultsSuccess(res) {
	return {
		type: types.RETRIEVE_MOVIES_SEARCH_RESULT_SUCCESS,
		searchResults: res.data
	};
}

export function retrieveMoviesSearchResults(query, page) {
	return function (dispatch) {
		return axios.get(`http://net.adjara.com/Search/SearchResults?ajax=1&display=15&startYear=1900&endYear=2018&offset=0&isnew=0&needtags=0&orderBy=date&order%5Border%5D=desc&order%5Bdata%5D=published&language=georgian&country=false&game=0&softs=0&videos=0&xvideos=0&vvideos=0&dvideos=0&xphotos=0&vphotos=0&dphotos=0&trailers=0&episode=0&tvshow=0&flashgames=0`)
		.then(res => {
			dispatch(retrieveMoviesSearchResultsSuccess(res.data));
		})
		.catch(error => {
			console.log('Movies Search Results', error); //eslint-disable-line
		});
	};
}

// MOVIE DETAILS
export function retrieveMovieDetailsSuccess(res) {
	return {
		type: types.RETRIEVE_MOVIE_DETAILS_SUCCESS,
		details: res.data
	};
}

export function retrieveMovieDetails(movieId) {
	return function (dispatch) {
		return axios.get(`http://net.adjara.com/Search/SearchResults?ajax=1&display=15&startYear=1900&endYear=2018&offset=0&isnew=0&needtags=0&orderBy=date&order%5Border%5D=desc&order%5Bdata%5D=published&language=georgian&country=false&game=0&softs=0&videos=0&xvideos=0&vvideos=0&dvideos=0&xphotos=0&vphotos=0&dphotos=0&trailers=0&episode=0&tvshow=0&flashgames=0`)
		.then(res => {
			dispatch(retrieveMovieDetailsSuccess(res));
		})
		.catch(error => {
			console.log('Movie Details', error); //eslint-disable-line
		});
	};
}
