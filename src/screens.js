/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';

import Drawer from './modules/_global/Drawer';
import Movies from './modules/movies/Movies';
import MoviesList from './modules/movies/MoviesList';
import Movie from './modules/movies/Movie';
import Serie from './modules/movies/Serie';
import Search from './modules/movies/Search';
import Favorites from './modules/movies/Favorites';
import CatMoviesList from './modules/movies/CatMoviesList';
import ColMoviesList from './modules/movies/ColMoviesList';
import CatCol from './modules/movies/CatCol';


export function registerScreens(store, Provider) {
	Navigation.registerComponent('movieapp.Movie', () => Movie, store, Provider);
	Navigation.registerComponent('movieapp.Serie', () => Serie, store, Provider);
	Navigation.registerComponent('movieapp.Movies', () => Movies, store, Provider);
	Navigation.registerComponent('movieapp.MoviesList', () => MoviesList, store, Provider);
	Navigation.registerComponent('movieapp.Search', () => Search, store, Provider);
	Navigation.registerComponent('movieapp.Favorites', () => Favorites, store, Provider);
	Navigation.registerComponent('movieapp.CatMoviesList', () => CatMoviesList, store, Provider);
	Navigation.registerComponent('movieapp.ColMoviesList', () => ColMoviesList, store, Provider);
	Navigation.registerComponent('movieapp.CatCol', () => CatCol, store, Provider);
	Navigation.registerComponent('movieapp.Drawer', () => Drawer);
}
