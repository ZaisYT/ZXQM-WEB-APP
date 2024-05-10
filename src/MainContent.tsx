import React, { useEffect, useState } from 'react';
import './css/MainContent.css';
import { useLocation } from 'react-router-dom';


type typeSongData = {
  "iconURL": string,
  "lyricsURI": string,
  "songArtists": string[],
  "songName": string,
  "songURL": string
}

type typeArtistData = {
  "bannerURL": string,
  "isPartner": boolean,
  "name": string,
  "pfp": string
}

type ContentType = {
  setArtistID: React.Dispatch<React.SetStateAction<string>>,
  setSongID: React.Dispatch<React.SetStateAction<string[]>>,
  audio: HTMLAudioElement,
}

export const MainContent = ({setArtistID, setSongID, audio}: ContentType) => {
  const [timeDisplay, setTimeDisplay] = useState("");
  const [songCards, setSongCards] = useState<JSX.Element[]>([]);
  const [artistCards, setArtistCards] = useState<JSX.Element[]>([]);

  function generateUniqueRandomNumbers(length: number, min: number, max: number) {
    if (length > (max - min + 1)) {
      throw new Error("Cannot generate unique random numbers. Length exceeds range.");
    }
  
    const result: number[] = [];
    while (result.length < length) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!result.includes(randomNumber)) {
        result.push(randomNumber);
      }
    }
    return result;
  }

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();

    if (hour > 5 && hour <= 12) {
      setTimeDisplay("Buenos Dias!");
    } else if (hour > 12 && hour <= 18) {
      setTimeDisplay("Buenas Tardes!");
    } else {
      setTimeDisplay("Buenas Noches!");
    }

    fetch("https://zxqm-rest-api-default-rtdb.firebaseio.com/songs.json")
      .then(res => res.json())
      .then(data => {
        let nofsongs = Object.keys(data).length;
        const uniqueSongIndexes = generateUniqueRandomNumbers(7, 0, (nofsongs - 1));

        let arrayOfCards = [];

        for(let num in uniqueSongIndexes){
          let id = Object.keys(data)[uniqueSongIndexes[num]];
          let newCard = generateSongCard(Number(num), data[id], id);

          arrayOfCards.push(newCard);
        }

        setSongCards(arrayOfCards); 
      });

    
      fetch("https://zxqm-rest-api-default-rtdb.firebaseio.com/artists.json")
      .then(res => res.json())
      .then(data => {
        let nofartists = Object.keys(data).length;
        const uniqueSongIndexes = generateUniqueRandomNumbers(5, 0, (nofartists - 1));

        let arrayOfCards = [];

        for(let num in uniqueSongIndexes){
          let newCard = generateArtistCard(Number(num), data[Object.keys(data)[uniqueSongIndexes[num]]], Object.keys(data)[uniqueSongIndexes[num]]);

          arrayOfCards.push(newCard);
        }

        setArtistCards(arrayOfCards); 
      });
  }, []);

  const locationData = useLocation();

  function generateSongCard(key: number, data: typeSongData, id: string) {
    return (
      <div key={key} className="card" onClick={() => {
        audio.pause();
        setSongID([id]);
      }}>
        <img src={data.iconURL} draggable="false" />
        <h2>{data.songName}</h2>
        <h3>{formatArtists(data.songArtists)}</h3>
      </div>
    )
  }

  function generateArtistCard(key: number, data: typeArtistData, id: string) {
    return (
      <div key={key} className="card" onClick={() => {
        setArtistID(id);
        locationData.pathname = "/artist";
      }}>
        <img src={data.pfp} draggable="false" />
        <h2>{data.name}</h2>
      </div>
    )
  }

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
      <h1 id='time'>{timeDisplay}</h1>
      <h2 className="title">{"Canciones para ti"}</h2>
      <div className="cardWrapper">
        {songCards}
      </div>

      <h2 className="title">{"Artistas para ti"}</h2>
      <div className="cardWrapper">
        {artistCards}
      </div>
    </div>
  )
}
