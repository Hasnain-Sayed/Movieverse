# MovieVerse 🎬
 
A movie and TV series discovery app built with Next.js, letting users browse trending titles, search, filter, and explore details — all powered by the TMDB API.
 
## Features
 
- **Trending & Top Rated carousels** — Infinite auto-scrolling carousels (movies and TV series) built with Swiper.js, pausing on hover, with alternating scroll directions
- **Responsive design** — Carousel card counts adapt across mobile, tablet, and desktop breakpoints
- **Search** — Quick search with live suggestions from TMDB, covering both movies and TV series
- **Filtering** — Browse and filter movies/TV series by category
- **Movie/TV details page** — Full details view with a "You May Also Like" recommendations carousel
- **Trailer playback** — In-app trailer modal (rendered via React Portal for correct full-screen display)
## Tech Stack
 
- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Carousel:** Swiper.js
- **Data fetching:** SWR
- **Icons:** React Icons, Lucide React
- **API:** [TMDB (The Movie Database)](https://www.themoviedb.org/)
## Getting Started
 
1. Clone the repo:
```bash
   git clone https://github.com/Hasnain-Sayed/Movieverse.git
   cd movieverse
```
 
2. Install dependencies:
```bash
   npm install
```
 
3. Add your TMDB API key. Create a `.env.local` file in the root:
```
   NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```
 
4. Run the development server:
```bash
   npm run dev
```
 
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
## Roadmap
 
- [ ] User authentication (login/signup)
- [ ] Favorite/watchlist a movie or series
- [ ] Additional carousel styles across the app
## Acknowledgements
 
This product uses the TMDB API but is not endorsed or certified by [TMDB](https://www.themoviedb.org/).
