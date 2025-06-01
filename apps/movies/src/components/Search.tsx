import * as React from 'react';

export interface ISearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

export function Search ({ searchTerm, setSearchTerm, placeholder = "Search through thousands of movies..." }: ISearchProps) {
  return (
    <div className='search'>
      <div>
        <img src="./search.svg" alt="Search" />
        <input 
        type="text" 
        placeholder={placeholder} 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
