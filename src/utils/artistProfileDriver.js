// import georgiaRobinson from '../images/Georgia_Ann_Robinson.jpg'

/**************************************************************************************************/

/**
 * @file        artistProfileDriver.js
 * @description -- tbd
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     10/09/2025
 * @license     -- tbd
 */


const mockArtists = [
  {
    id: 0,
    name: 'John Doe',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    avatar: '',
    artworkCount: 10,
  },
  {
    id: 1,
    name: 'Georgia Robinson',
    bio: 'Georgia Robinson is an artist, but that photo probably isn\'t actually her. This is *the* first black policewomen in LAPD from the early 1900s.',
    avatar: 'text',
    artworkCount: 10,
    },
{
    id: 2,
    name: 'Simone Jones',
    artworkCount: 10,
    bio: 'Incidunt possimus sunt aliquid corporis facilis, atque modi, ut obcaecati consectetur quasi voluptatibus nesciunt aspernatur similique et porro delectus autem quibusdam voluptatem fugiat? Deleniti quasi iusto architecto tempore adipisci eaque.',
    avatar: 'https://example.com/avatar.jpg'
  }
];

export function fetchArtistProfile(artistId) {
  return new Promise(resolve => {
    setTimeout(() => {
      const artist = mockArtists.find(a => a.id == artistId); // Use == to handle string/number comparison
      resolve(artist || null);
    }, 500); // Simulate network delay
  });
}
