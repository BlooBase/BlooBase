// Store.js
import React from 'react';
import { useParams } from 'react-router-dom';
import '../Store.css';
import Navbar from '../components/Navbar'; // Ensure this path is correct
import { useEffect } from 'react';
import FloatingCart from '../components/FloatingCart';

const productList = [
    {
      id: 1,
      title: "poiandkeely",
      image: "/keely.jpg",
      description: "3d Modeling and Character Design, @poiandkeely",
      color: '#FFEFF8',
      textColor: '#A38FF7',
      genre: '3D Modeling'
    },
    {
      id: 2,
      title: "Inio Asano",
      image: "/Asano.jpg",
      description: "Author and artist of 'Goodnight Punpun', 'Solanin' and 'A Girl On the Shore'.",
      color: '#ffffff',
      textColor: '#598EA0',
      genre: 'Digital Art'
    },
    {
      id: 3,
      title: "조기석 Cho Gi-Seok",
      image: "/Chogiseok.jpg",
      description: "Korean photographer, director and artisan, 조기석 Cho Gi-Seok @chogiseok",
      color: '#e7e4d7',
      textColor: '#141118',
      genre: 'Photography'
    },
    {
      id: 4,
      title: "Yusuke Murata",
      image: "/Murata.gif",
      description: "Artist of 'One Punch Man' and 'Eyeshield 21'.",
      color: '#1e1e1e',
      textColor: '#ffffff',
      genre: 'Digital Art'	
    },

    {
      id: 5,
      title: "Inspired Island",
      image: "/Island.jpg",
      description: "Digital Media editor, artist and director, @CultureStudios ",
      color: '#8C2C54',
      textColor: '#FFDFE2',
      genre:'Video Editing'
    },
    {
      id: 6,
      title: "Jamie Hewlett",
      image: "/Hewlett.jpg",
      description: "Digital Artist - @Hewll",
      color: '#1c6e7b',
      textColor: '#ffffff',
      genre: 'Digital Art'
    },
    {
      id: 7,
      title: "Kim Jung Gi",
      image: "/Kim.jpg",
      description: "Physical inking artist and illsustrator",
      color: '#ffffff',
      textColor: '#181818',
      genre: 'Physical Art'
    }
  ];

  const user = {
    name: 'DigitalJosh',
    avatarUrl: 'https://i.pravatar.cc/100',
    avatarLocal: '/pfp.jpeg'
  };

const Store = () => {
  const { id } = useParams();
  const artist = productList.find(p => p.id === parseInt(id));
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  

  if (!artist) return <p>Artist not found.</p>;

  return (

    <section className="store-page" style={{ backgroundColor: artist.color }} >
     <Navbar
      pageTitle="Artist"
      user={user}
      bgColor="transparent"
      textColor="#165a9c"
      />
    
      <section className="store-header" >
        <img src={artist.image} alt={artist.title} className="store-image" />
        <h1 className="store-title" style={{ color: artist.textColor }}>{artist.title}</h1>
      </section>

      <section className="store-main">

      <section
        className="store-column info"
        style={{ backgroundColor: artist.textColor, color: artist.color }}
        >
        <h2 className="section-title">Information</h2>
        <p className="store-description">{artist.description}</p>
        <p className="store-genre">Genre: {artist.genre}</p>
        </section>

      <section
        className="store-column products"
        style={{ backgroundColor: artist.textColor, color: artist.color }}
        >
        <h2 className="section-title">Art</h2>
        {/* Product listings go here */}
        </section>

      </section>

      <section className="opacity-fade1" />

      <FloatingCart />

    </section>
  );
};

export default Store;
