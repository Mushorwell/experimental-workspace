import * as React from 'react';

export interface IMovieCardProps extends React.HTMLAttributes<HTMLDivElement> {
  movie: {
    title: string;
    vote_average: number;
    release_date: string;
    original_language: string;
    poster_path: string;
  };
}

export function MovieCard ({ movie: { title, vote_average, release_date, original_language, poster_path}, ...props }: IMovieCardProps) {
  return (
    <div className="movie-card" {...props}>
      <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "./no-poster.png"} alt={title} />
      <div className='mt-4'>
      <h3>{title}</h3>
      </div>
      <div className="content">
        <div className="rating">
          <img src="./star.svg" alt="Star Icon" />
          <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
        </div>
        <span>•</span>
        <p className="lang">
          {original_language}
        </p>
        <span>•</span>
        <p className="year">
          {release_date ? release_date.split('-')[0] : 'N/A'}
        </p>
      </div>
    </div>
  );
}
