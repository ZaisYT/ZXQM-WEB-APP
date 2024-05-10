import React, { useEffect, useState } from 'react';
import './css/Artist.css';

type ArtistObj = {
  artistID: String,
  song: HTMLAudioElement,
  setSongID: React.Dispatch<React.SetStateAction<string[]>>,
}

type songDataType = {
  "iconURL": string,
  "lyricsURI": string,
  "songArtists": string[],
  "songName": string,
  "songURL": string,
}

export const Artist = ({ artistID, song, setSongID }: ArtistObj) => {
  const ARTISTAPI = "https://zxqm-rest-api-default-rtdb.firebaseio.com/artists/";
  const SONGAPI = "https://zxqm-rest-api-default-rtdb.firebaseio.com/songs/";

  const [artistData, setArtistData] = useState({
    "bannerURL": "",
    "isPartner": "",
    "name": "",
    "pfp": "",
    "songs": [],
  });

  const [songCards, setSongCards] = useState<JSX.Element[]>([]);
  const [recommendedSongCards, setRecommendedSongCards] = useState<JSX.Element[]>([]);

  useEffect(() => {
    fetch(`${ARTISTAPI}${artistID}.json`)
      .then(res => res.json())
      .then(data => {
        setArtistData(data);
      });
  }, []);

  useEffect(() => {
    let banner: HTMLElement = document.querySelector(".BannerArea")!;
    banner.style.backgroundImage = `url(${artistData.bannerURL})`;

    if (artistData.songs.length > 0) {

      const datas: any = {};
      Promise.all(artistData.songs.map(songID =>
        fetch(`${SONGAPI}${songID}.json`)
          .then(res => res.json())
          .then(data => datas[`${songID}`] = data)
      )).then(() => {
        if (songCards.length != 0) return
        if (recommendedSongCards.length != 0) return

        let limit: number;
        if (artistData.songs.length <= 5){
          limit = artistData.songs.length - 1
        } else {
          limit = 4;
        }

        let arrayOfCards = [];
        for (let i = 0; i <= limit; i++) {
          let id = artistData.songs[i];          
          let newCard = generateSongCard(Number(i), datas[id], id);

          arrayOfCards.push(newCard);
        }
        setSongCards(arrayOfCards);

        let urn = generateUniqueRandomNumbers(limit, 0, artistData.songs.length - 1);
        console.log(urn);

        let recoarrayOfCards = [];
        for (let i = 0; i <= (urn.length - 1); i++) {
          let id = artistData.songs[urn[i]];
          let newCard = generateSongCard(Number(i), datas[id], id);

          recoarrayOfCards.push(newCard);
        }
        setRecommendedSongCards(recoarrayOfCards);
      });
    }
  }, [artistData]);

  function generateSongCard(key: number, data: songDataType, id: string) {
    return (
      <div key={key} className="card" onClick={() => {
        song.pause();
        setSongID([id]);
      }}>
        <img src={data.iconURL} draggable="false" />
        <h2>{data.songName}</h2>
        <h3>{formatArtists(data.songArtists)}</h3>
      </div>
    )
  }

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
    <div className='contentArtsWrapper'>
      <div className="BannerArea">
        <div className='info'>
          {artistData.isPartner ? <div className='isVerified'><p className='verified'> </p><p>PARTNER</p></div>
            : ""}
          <h1>{artistData.name}</h1>
        </div>
        <div className="redes">
          {/* <p>X</p>
          <p>TT</p>
          <p>IG</p>
          <p>YT</p> */}
        </div>
      </div>

      <div className="BiographyArea">

      </div>

      <div className="MainContentArea">
        <h1>Canciones Recomendadas</h1>
        <div className='cards'>
          {recommendedSongCards}
        </div>
      </div>

      <div className="DiscographyArea">
        <div className='Labels'>
          <h1>Discografia</h1>
          <p>Ver todo</p>
        </div>
        <div className='cards'>
          {songCards}
        </div>
      </div>
    </div>
  )
}
