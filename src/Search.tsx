import React, { useState, useEffect } from 'react';
import './css/Search.css';

type Objparams = {
  song: HTMLAudioElement,
  songID: string[], 
  setSongID: React.Dispatch<React.SetStateAction<string[]>>,
}

type songObj = {
  iconURL: string,
  lyricsURI: string,
  songArtists: string[],
  songName: string,
  songURL: string,
}

export const Search = ({ song, songID, setSongID }: Objparams) => {
  const [songs, setSongs] = useState<Record<string, songObj>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<songObj[]>([]);
  const [songKeys, setSongKeys] = useState<string[]>([]);
  const apiUrl = 'https://zxqm-rest-api-default-rtdb.firebaseio.com/songs.json';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data: Record<string, songObj> = await response.json();
        setSongs(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Verificar si el término de búsqueda contiene al menos un carácter distinto de un espacio
    if (searchTerm.trim() !== '') {
      // Eliminar espacios solo al principio del término de búsqueda
      const trimmedSearchTerm = searchTerm.replace(/^\s+/g, '');

      const filteredSongs = Object.keys(songs).filter(uri =>
        songs[uri].songName.toLowerCase().includes(trimmedSearchTerm.toLowerCase()) ||
        songs[uri].songArtists.some(artist => artist.toLowerCase().includes(trimmedSearchTerm.toLowerCase()))
      );

      // Guardar las claves de los objetos filtrados en la lista songsKeys
      const songsKeys = filteredSongs.slice(0, 6);
      setSongKeys(songsKeys);

      // Tomar los primeros 5 resultados
      const firstFiveResults = songsKeys.map(uri => songs[uri]);

      // Actualizar el estado para mostrar los resultados
      setSearchResults(firstFiveResults);
    } else {
      // Si el término de búsqueda está vacío, limpiar los resultados
      setSearchResults([]);
      setSongKeys([]); // Asegurar que songKeys también se limpie en este caso
    }
  }, [searchTerm, songs]);

  const formatArtists = (artists: string[]): string => {
    const artistCount = artists.length;

    if (artistCount === 1) {
      return artists[0];
    } else if (artistCount === 2) {
      return `${artists[0]} & ${artists[1]}`;
    } else {
      return `${artists.slice(0, -1).join(', ')} & ${artists[artistCount - 1]}`;
    }
  };

  return (
    <div className='contentWrapper'>
      <input className='searchinput' type="text" placeholder="Buscar canciones por nombre o artista" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <div className='resultsWrapper'>
        {/* Mostrar los resultados solo si hay un término de búsqueda válido */}
        {searchResults.length > 0 ? (
          <>
            <h1>Resultados de la búsqueda:</h1>
            <div className='cards'>
              {searchResults.map((result, index) => (
                <div className='card' key={index} onClick={() => { 
                  song.pause();
                  setSongID([songKeys[index]]);
                  }}>
                  <img draggable={false} src={result.iconURL} alt={result.songName} />
                  <h2 className='name'>{result.songName}</h2>
                  <h3 className='arts'>{formatArtists(result.songArtists)}</h3>
                </div>
              ))}
            </div>
          </>
        ) : (
          searchTerm.trim() !== "" && // Verifica que la búsqueda no sea una cadena vacía
          <>
            <h1>Resultados de la búsqueda:</h1>
            <div className='results'>
              <h2 className='noneresult'>No se encontraron resultados para "{searchTerm}"</h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
