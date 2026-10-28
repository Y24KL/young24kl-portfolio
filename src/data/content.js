// Studio content for the public site. Featured projects, statistics and
// testimonials are carried over unchanged from the previous site; CMS projects
// are merged in at runtime (see lib/projects.js).
import { photo } from '../lib/media';

export const heroSlides = [
  photo('IMG_9204', 'Basketball player driving to the hoop on an outdoor court'),
  photo('IMG_3599', 'Players contesting a rebound in front of a crowd'),
  photo('IMG_9217', 'Basketball players mid-game on a blue court'),
];

// Foreground print layered over the hero plate.
export const heroPrint = photo('IMG_8716', 'Low-key studio portrait in a black and green jersey');

export const featuredProjects = [
  {
    id: 'featured-csc-hod-games',
    source: 'featured',
    title: 'CSC HOD GAMES',
    category: 'Sports',
    description: '',
    media: [
      photo('IMG_9210', 'Player dribbling a basketball at the CSC HOD Games'),
      photo('IMG_9204', 'Player attacking the basket at the CSC HOD Games'),
      photo('IMG_9185', 'Player handling the ball on court at the CSC HOD Games'),
    ],
  },
  {
    id: 'featured-shodeinde-hall-week',
    source: 'featured',
    title: 'SHODEINDE HALL WEEK',
    category: 'Events',
    description: '',
    media: [
      photo('IMG_3904', 'Black and white portrait from Shodeinde Hall Week'),
      photo('IMG_3903', 'Portrait under neon light at Shodeinde Hall Week'),
      photo('IMG_4349', 'Guest smiling at the camera during Shodeinde Hall Week'),
    ],
  },
  {
    id: 'featured-nacos-jersey-launch',
    source: 'featured',
    title: 'NACOS JERSEY LAUNCH',
    category: 'Brand',
    description: '',
    media: [
      photo('IMG_8716', 'Model in the NACOS jersey under low-key studio light'),
      photo('IMG_8719', 'Two models back to back in the NACOS jersey'),
      photo('IMG_8526', 'Model showing the back of a number 20 jersey'),
      photo('IMG_8577', 'Two models posing with a basketball in team jerseys'),
      photo('IMG_8648', 'Model in a cap wearing the NACOS jersey'),
      photo('IMG_8654', 'Two models holding a volleyball in the NACOS jersey'),
    ],
  },
];

// Frames not assigned to a featured project, shown in the scroll-linked film strip.
export const archiveFrames = [
  photo('IMG_3832', 'Portrait in tinted glasses and a red football shirt'),
  photo('IMG_4341', 'Performer singing into a microphone on stage'),
  photo('studio-shot', 'Guest checking her phone at an evening event'),
  photo('IMG_8727', 'Seated portrait in the NACOS jersey'),
  photo('IMG_9252', 'Player resting on a blue basketball court'),
  photo('IMG_4295', 'Friends celebrating with light sticks at a night event'),
  photo('IMG_9217', 'Basketball players mid-game on a blue court'),
];

export const behindTheScenes = photo('IMG_9252', 'Player sitting on the court between games');
export const founderPortrait = photo('ceo-pic', 'Portrait of Gamaliel Godfrey Balanku');

export const services = [
  {
    num: '01',
    title: 'Photography',
    desc: 'High-resolution, stylized portraiture and commercial photography designed to elevate your visual identity.',
    image: photo('IMG_8716', 'Studio portrait example'),
  },
  {
    num: '02',
    title: 'Videography',
    desc: 'Events, launches and campaigns captured on video with the same cinematic eye we bring to every still.',
    image: photo('IMG_4341', 'Performer on stage example'),
  },
  {
    num: '03',
    title: 'Video Editing',
    desc: 'Cinematic cuts, color grading, and narrative pacing that turn raw footage into compelling stories.',
    image: photo('IMG_4295', 'Night event example'),
  },
  {
    num: '04',
    title: 'Motion Graphics',
    desc: 'Dynamic 2D and 3D animations that bring static concepts to life with industry-standard fluid motion.',
    image: null, // no motion work in the bundled assets; the card shows the brand mark
  },
];

export const stats = [
  { value: 3, suffix: '+', label: 'Years behind the lens' },
  { value: 30, suffix: '+', label: 'Events covered' },
  { value: 1000, suffix: '+', label: 'Photos delivered' },
];

export const testimonials = [
  {
    quote: 'Young24KL turned our HOD games into something that looked straight out of a sports network broadcast. Every frame had energy.',
    name: 'Event Committee',
    role: 'CSC HOD Games',
  },
  {
    quote: "They didn't just document Shodeinde Hall Week, they made it feel cinematic. The turnaround time was just as impressive as the quality.",
    name: 'Hall Committee',
    role: 'Shodeinde Hall Week',
  },
  {
    quote: 'The jersey launch photos gave our brand an identity. Sharp, stylish, and exactly the premium look we were going for.',
    name: 'NACOS Executives',
    role: 'NACOS Jersey Launch',
  },
];

export const INSTAGRAM_URL = 'https://instagram.com/24klvisuals';
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xykaaqnn';
