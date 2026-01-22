// import houseImage1 from '../images/IMG_5688.png'
// import houseImage2 from '../images/IMG_5689.png'
// import houseImage3 from '../images/IMG_5690.png'
// import houseImage4 from '../images/IMG_5691.png'

import { marketplaceApi } from "../services/api";

/**************************************************************************************************/

/**
 * @file        artworksDriver.js
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     10/09/2025
 * @license     -- tbd
 */

var testArtworks = [
  {
    id: 1,
    artistId: 0,
    artist: "John Doe",
    title: "the great art",
    url: "",
    verified: true,
    price: 1200,
    dateOfProduction: { year: 2021, month: 5, day: 12 },
    tags: ["Painting"],
    listed: true,
    dimensions: { width: 1024, height: 768 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 2,
    artistId: 0,
    artist: "John Doe",
    title: "the great art",
    url: "",
    verified: true,
    price: 3500,
    dateOfProduction: { year: 2020, month: 11, day: 8 },
    tags: ["Painting"],
    listed: true,
    dimensions: { width: 1920, height: 1080 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 3,
    artistId: 0,
    artist: "John Doe",
    title: "the great art",
    url: "",
    verified: true,
    price: 78000,
    dateOfProduction: { year: 2019, month: 7, day: 22 },
    tags: ["Painting"],
    listed: true,
    dimensions: { width: 640, height: 960 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 4,
    artistId: 0,
    artist: "John Doe",
    title: "the great art",
    url: "",
    verified: true,
    price: 15000,
    dateOfProduction: { year: 2022, month: 3, day: 3 },
    tags: ["Painting"],
    listed: true,
    dimensions: { width: 1200, height: 1200 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 5,
    artistId: 1,
    artist: 'Georgia Robinson',
    title: 'GR0301 House',
    url: 'text',
    verified: true,
    price: 90000,
    tags: ['Painting'],
    listed: true,
    width: 200,
    height: 2000,
    medium: 'Acrylic',
    dimensions: { width: 200, height: 600 },
    dateOfProduction: { year: 2023, month: 1, day: 1 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 6,
    artistId: 1,
    artist: 'Georgia Robinson',
    title: 'GR0302 House',
    url: 'text',
    verified: true,
    price: 90000,
    dateOfProduction: { year: 2023, month: 1, day: 1 },
    tags: ['Painting'],
    listed: false,
    medium: 'Acrylic',
    dimensions: { width: 800, height: 600 },
    dateOfProduction: { year: 2022, month: 5, day: 6 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 7,
    artistId: 1,
    artist: 'Georgia Robinson',
    title: 'GR0303 House',
    url: 'text',
    verified: true,
    price: 90000,
    dateOfProduction: { year: 2023, month: 1, day: 1 },
    tags: ['Painting'],
    listed: false,
    medium: 'Acrylic',
    dimensions: { width: 800, height: 600 },
    dateOfProduction: { year: 2022, month: 5, day: 6 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 8,
    artistId: 1,
    artist: 'Georgia Robinson',
    title: 'GR0304 House',
    url: 'text',
    verified: true,
    listed: true,
    tags: ['Painting'],
    price: 90000,
    dateOfProduction: { year: 2023, month: 1, day: 1 },
    medium: 'Acrylic',
    dimensions: { width: 800, height: 600 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 9,
    artistId: 2,
    artist: 'Simone Jones',
    title: 'An Autumn Meeting',
    url: 'https://example.com/artworks/sunset-over-yarra',
    verified: true,
    listed: true,
    tags: ['Landscape'],
    price: 90000,
    dateOfProduction: { year: 2023, month: 1, day: 1 },
    dimensions: { width: 800, height: 300 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 10,
    artistId: 2,
    artist: 'Simone Jones',
    title: 'House Of The Salamander',
    url: 'https://example.com/artworks/abstract-thoughts',
    verified: false,
    listed: true,
    tags: ['Abstract'],
    price: 90000,
    dateOfProduction: { year: 2023, month: 1, day: 1 },
    dimensions: { width: 100, height: 303 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 11,
    artistId: 2,
    artist: 'Simone Jones',
    title: 'Community',
    url: 'https://example.com/artworks/the-old-quad',
    verified: true,
    listed: true,
    tags: ['Architecture', 'Historic'],
    price: 90000,
    dateOfProduction: { year: 2019, month: 1, day: 1 },
    dimensions: { width: 80, height: 60 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 12,
    artistId: 2,
    artist: 'Simone Jones',
    title: 'Still Life with Flowers',
    url: 'https://example.com/artworks/still-life-flowers',
    verified: false,
    listed: true,
    tags: ['Painting'],
    price: 90000,
    dateOfProduction: { year: 2021, month: 1, day: 1 },
    dimensions: { width: 234, height: 44 },
    description: "lorem ipsum dolor amet"
  },
  {
    id: 13,
    artistId: 2,
    artist: 'Simone Jones',
    title: 'A Restful Winter',
    url: 'https://example.com/artworks/city-nights',
    verified: true,
    listed: true,
    tags: ['Cityscape', 'Night', 'Urban'],
    price: 90000,
    dateOfProduction: { year: 2020, month: 1, day: 1 },
    dimensions: { width: 832, height: 230 },
    description: "lorem ipsum dolor amet"
  }
]


export function fetchArtworks(artistId = null, listed = null, artId = null) {
  const artworks = marketplaceApi.list();
  console.log(artworks)
  return artworks;
}
