import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './Header.tsx';
import { MainContent } from './MainContent.tsx';
import { Player } from './Player.tsx';
import { useRef, useState } from 'react';
import { Lyrics } from './Lyrics.tsx';
import { Search } from './Search.tsx';
import { Fof } from './404.tsx';
import { Artist } from './Artist.tsx';

function App() {
  const audioRef = useRef(new Audio());
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songID, setSongID] = useState(["-Nx59g2q5kkDAJ-WazKS"]); 
  const [artistID, setArtistID] = useState("-NjPNo0KfAmtVJPAFV9U"); 
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<MainContent setArtistID={setArtistID} setSongID={setSongID} audio={audioRef.current}/>} />
          <Route path="/lyrics" element={<Lyrics currentSongIndex={currentSongIndex} queue={songID} audio={audioRef.current}/>} />
          <Route path="/search" element={<Search song={audioRef.current} songID={songID} setSongID={setSongID}/>} />
          <Route path="/artist" element={<Artist song={audioRef.current} setSongID={setSongID} artistID={artistID}/>} />

          {/* <Route path="/about" element={<Fof />} />
          <Route path="/config" element={<Fof />} />
          <Route path="/account" element={<Fof />} /> */}
          <Route path="*" element={<Fof />}/> 
        </Routes>

        <Player queue={songID} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} audio={audioRef.current}/>
      </BrowserRouter>
    </>
  )
}

export default App
