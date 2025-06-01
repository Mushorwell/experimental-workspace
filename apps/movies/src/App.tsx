import { useEffect, useState } from 'react';

import { TemplateLiteralLogger } from 'utilities';

import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import { MovieCard } from './components/MovieCard';
import { Search } from './components/Search';
import { Spinner } from './components/Spinner';

const API_BASE_URL = "https://api.themoviedb.org/3"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const logger = TemplateLiteralLogger.createLog({ 
  prefix: '🪵[movies-app]:',
  enabled: true, 
  options: { 
    excludeOutputObject: false, 
    skipPrimitivesIncludedInMessage: false, 
    primitivesAllowedInTemplateString: ['function', 'bigint', 'number', 'string', 'boolean'] 
  } 
}, 'log');

const errorLog = TemplateLiteralLogger.createLog({ 
  prefix: '💔[movies-app-error]:',
  enabled: true, 
  options: { 
    excludeOutputObject: false, 
    skipPrimitivesIncludedInMessage: false, 
    primitivesAllowedInTemplateString: ['function', 'bigint', 'number', 'string', 'boolean'] 
  } 
}, 'err');

function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [loading, setLoading] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState<any[]>([])

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  const fetchMovies = async (query: string = '') => {
    setLoading(true)
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)
      if(!response.ok){
        throw new Error('Failed to fetch movies')
      }
      const data = await response.json()
      logger`Fetched movies: ${data}`

      if (data.Response == 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setMovieList([])
        return;
      }

      setMovieList(data.results)
      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }
    } catch (error: unknown) {
      errorLog`Error fetching movies: ${error}`
      setErrorMessage((error as Error).message || 'Error fetching movies. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error: unknown) {
      errorLog`Error fetching trending movies: ${error}`
    }
  }

  useEffect(() => {
    debouncedSearchTerm ? logger`App mounted` : logger`App refreshed`
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  useEffect(() => {
    fetchTrendingMovies()
  }, [])

  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero__img.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
          {trendingMovies.length > 0 && (<section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>)}
          <section className="all-movies">
            <h2 className="mt-[2rem]">All Movies</h2>
            {loading ? 
            <Spinner /> :
            errorMessage ?
            <p className="text-red-500">{errorMessage}</p> :
            <ul>{
              movieList.map((movie: any) => 
              <MovieCard key={movie.id} movie={movie} />
              )
              }</ul>
            }
          </section>
      </div>
    </main>
  )
}

export default App
