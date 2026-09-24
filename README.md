# 🎬 MovieVerse

> **Discover your next favorite movie or TV series.**

MovieVerse is a modern movie and TV discovery platform built with **Next.js**, **TMDB**, **MongoDB**, and a cinematic dark UI. It lets users explore trending and highly-rated content, search and filter movies or TV series, view detailed information, watch trailers, discover recommendations, and manage their account.

<p align="center">
  <strong>🎥 Discover · 🔎 Search · ⭐ Explore · 🎲 Get Lucky</strong>
</p>

---

## ✨ Features

### 🎞️ Movie & TV Discovery
- Trending movies and TV series
- Top-rated movies and TV series
- Dedicated Movies and TV Series browsing pages
- Pagination for large result sets
- Rich media cards with posters, ratings, and trailers

### 🔍 Advanced Search & Filtering
- Search movies and TV series
- Filter by genre
- Filter by release year
- Filter by rating
- Filter by language
- Sort results by popularity, rating, release date, and more
- URL-based filters for shareable/searchable pages

### 🎬 Detailed Media Pages
Each movie or series has a dedicated details experience containing:
- Backdrop and poster
- Overview
- Genres
- Rating
- Release information
- Runtime / episode information
- Cast information
- Trailers
- Recommended movies or series

### 🍿 Trailer Experience
Watch available YouTube trailers directly inside MovieVerse using a reusable trailer modal.

### 🎲 Feeling Lucky
Can't decide what to watch?

Use **Feeling Lucky** to let MovieVerse randomly discover a movie or TV series for you.

### 👤 Authentication
MovieVerse includes a complete authentication flow:
- User registration
- Login / logout
- JWT-based authentication
- Access and refresh tokens
- HTTP-only cookies
- Password hashing with bcrypt
- Authentication state through React Context

### 🔐 Password Recovery
- Forgot password flow
- Email OTP verification
- OTP expiration
- Resend cooldown
- Password reset
- Email delivery through Resend

### 🛡️ Age-Aware Content
MovieVerse uses account information and TMDB data to handle adult-content visibility appropriately.

### 🎨 Cinematic UI
- Dark cinematic interface
- Yellow/gold accent color
- Responsive design
- Framer Motion animations
- Swiper-based carousels
- Responsive movie/TV grids
- Smooth hover and entrance effects

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js** | Full-stack React framework |
| **React** | User interface |
| **Tailwind CSS** | Styling and responsive layouts |
| **Framer Motion / Motion** | UI animations |
| **Swiper** | Hero sliders and carousels |
| **SWR** | Client-side data fetching and caching |
| **TMDB API** | Movie & TV data |
| **MongoDB** | User/application data |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **Resend** | Transactional emails |
| **Zod** | Validation |

---

## 🏗️ Project Structure

```text
movieverse/
│
├── app/
│   ├── api/                 # API routes
│   ├── details/             # Movie / TV details page
│   ├── movies/              # Movie discovery
│   ├── tv-series/           # TV series discovery
│   ├── login/               # Login
│   ├── signup/              # Registration
│   ├── forgot-password/     # Password recovery
│   └── ...
│
├── components/
│   ├── hero/                # Hero slider and header
│   ├── carousels/           # Trending / top-rated sections
│   ├── fetchingApi/         # Data-fetching components
│   ├── movieSeriesSection/  # Filters, media display, pagination
│   ├── Card.jsx             # Reusable media card
│   ├── TrailerModal.jsx     # Trailer player
│   └── footer/              # Footer components
│
├── context/
│   └── ...                  # Authentication / global state
│
├── lib/
│   └── ...                  # Shared utilities
│
├── models/
│   └── ...                  # Mongoose models
│
├── public/
│   └── ...                  # Static assets
│
├── proxy.js                 # Authentication / route middleware
├── next.config.mjs
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/movieverse.git
cd movieverse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
TMDB_API_KEY=your_tmdb_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
RESEND_API_KEY=your_resend_api_key
```

> ⚠️ Never commit `.env.local` or expose your private API keys and secrets.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔑 Getting a TMDB API Key

MovieVerse uses **The Movie Database (TMDB)** for movie and TV metadata, images, genres, credits, videos, recommendations, and discovery.

Create a TMDB account and request an API key through the TMDB developer settings.

**TMDB:** https://www.themoviedb.org/

---

## 🔄 Application Flow

```text
                    ┌───────────────┐
                    │     TMDB      │
                    │      API      │
                    └───────┬───────┘
                            │
                            ▼
                 ┌───────────────────┐
                 │   MovieVerse UI   │
                 └─────────┬─────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
     Home Page        Movies / TV       Details Page
          │                │                │
          │                │                ├── Trailer
          │                │                ├── Cast
          │                │                └── Recommendations
          │                │
          └────────────────┴───────────────┐
                                           ▼
                                  Personalized Features
                                           │
                                           ▼
                                      MongoDB
                                           │
                                           ▼
                                   User / Auth Data
```

---

## 🔐 Authentication Flow

```text
Signup
  ↓
Validate user input
  ↓
Hash password with bcrypt
  ↓
Store user in MongoDB
  ↓
Send welcome email

Login
  ↓
Validate credentials
  ↓
Generate JWT access + refresh tokens
  ↓
Store tokens in HTTP-only cookies
  ↓
Authenticated session
```

### Password Reset

```text
Forgot Password
      ↓
Enter email
      ↓
Generate OTP
      ↓
Send OTP via Resend
      ↓
Verify OTP
      ↓
Create new password
```

---

## 📡 TMDB-Powered Features

MovieVerse uses TMDB for several parts of the discovery experience:

- Trending content
- Popular content
- Top-rated content
- Movie / TV search
- Genre information
- Cast and credits
- Videos and trailers
- Recommendations
- Release information
- Ratings
- Movie and TV metadata

---

## 🎯 Roadmap

MovieVerse is actively evolving. Planned and potential features include:

- [ ] ❤️ Favorites / Watchlist
- [ ] ⭐ User reviews and ratings
- [ ] 📺 Where to watch / streaming availability
- [ ] 🤖 AI-powered movie & TV recommendations
- [ ] 🔎 Natural-language movie discovery
- [ ] 👤 User profile page
- [ ] 📚 Personalized watch history
- [ ] 🔔 Personalized recommendations
- [ ] 🎬 More detailed cast pages
- [ ] 📱 Further mobile UI improvements

---

## 🤖 AI Movie Assistant

One of the planned features is an AI-powered discovery assistant that understands natural-language requests.

For example:

> **"I want a dark psychological thriller with a smart plot, preferably under 2 hours."**

Instead of requiring users to manually select several filters, MovieVerse can interpret the request and return relevant movies or series.

The goal is to make movie discovery feel more conversational and personalized.

---

## 📸 Screenshots

Add screenshots of the application here once the UI is finalized.

```text
Coming soon...
```

---

## ⚡ Performance & UX

MovieVerse focuses on a smooth discovery experience through:

- Client-side caching with SWR
- Reusable components
- Responsive layouts
- Lazy-loaded / optimized media where applicable
- Animated transitions
- URL-persistent filters
- Reusable API/data-fetching patterns

---

## 🧑‍💻 Development

Run the development server:
# 🎬 MovieVerse

> **Discover your next favorite movie or TV series.**

MovieVerse is a modern movie and TV discovery platform built with **Next.js**, **TMDB**, **MongoDB**, and a cinematic dark UI. It lets users explore trending and highly-rated content, search and filter movies or TV series, view detailed information, watch trailers, discover recommendations, and manage their account.

<p align="center">
  <strong>🎥 Discover · 🔎 Search · ⭐ Explore · 🎲 Get Lucky</strong>
</p>

---

## ✨ Features

### 🎞️ Movie & TV Discovery
- Trending movies and TV series
- Top-rated movies and TV series
- Dedicated Movies and TV Series browsing pages
- Pagination for large result sets
- Rich media cards with posters, ratings, and trailers

### 🔍 Advanced Search & Filtering
- Search movies and TV series
- Filter by genre
- Filter by release year
- Filter by rating
- Filter by language
- Sort results by popularity, rating, release date, and more
- URL-based filters for shareable/searchable pages

### 🎬 Detailed Media Pages
Each movie or series has a dedicated details experience containing:
- Backdrop and poster
- Overview
- Genres
- Rating
- Release information
- Runtime / episode information
- Cast information
- Trailers
- Recommended movies or series

### 🍿 Trailer Experience
Watch available YouTube trailers directly inside MovieVerse using a reusable trailer modal.

### 🎲 Feeling Lucky
Can't decide what to watch?

Use **Feeling Lucky** to let MovieVerse randomly discover a movie or TV series for you.

### 👤 Authentication
MovieVerse includes a complete authentication flow:
- User registration
- Login / logout
- JWT-based authentication
- Access and refresh tokens
- HTTP-only cookies
- Password hashing with bcrypt
- Authentication state through React Context

### 🔐 Password Recovery
- Forgot password flow
- Email OTP verification
- OTP expiration
- Resend cooldown
- Password reset
- Email delivery through Resend

### 🛡️ Age-Aware Content
MovieVerse uses account information and TMDB data to handle adult-content visibility appropriately.

### 🎨 Cinematic UI
- Dark cinematic interface
- Yellow/gold accent color
- Responsive design
- Framer Motion animations
- Swiper-based carousels
- Responsive movie/TV grids
- Smooth hover and entrance effects

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js** | Full-stack React framework |
| **React** | User interface |
| **Tailwind CSS** | Styling and responsive layouts |
| **Framer Motion / Motion** | UI animations |
| **Swiper** | Hero sliders and carousels |
| **SWR** | Client-side data fetching and caching |
| **TMDB API** | Movie & TV data |
| **MongoDB** | User/application data |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **Resend** | Transactional emails |
| **Zod** | Validation |

---

## 🏗️ Project Structure

```text
movieverse/
│
├── app/
│   ├── api/                 # API routes
│   ├── details/             # Movie / TV details page
│   ├── movies/              # Movie discovery
│   ├── tv-series/           # TV series discovery
│   ├── login/               # Login
│   ├── signup/              # Registration
│   ├── forgot-password/     # Password recovery
│   └── ...
│
├── components/
│   ├── hero/                # Hero slider and header
│   ├── carousels/           # Trending / top-rated sections
│   ├── fetchingApi/         # Data-fetching components
│   ├── movieSeriesSection/  # Filters, media display, pagination
│   ├── Card.jsx             # Reusable media card
│   ├── TrailerModal.jsx     # Trailer player
│   └── footer/              # Footer components
│
├── context/
│   └── ...                  # Authentication / global state
│
├── lib/
│   └── ...                  # Shared utilities
│
├── models/
│   └── ...                  # Mongoose models
│
├── public/
│   └── ...                  # Static assets
│
├── proxy.js                 # Authentication / route middleware
├── next.config.mjs
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/movieverse.git
cd movieverse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
TMDB_API_KEY=your_tmdb_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
RESEND_API_KEY=your_resend_api_key
```

> ⚠️ Never commit `.env.local` or expose your private API keys and secrets.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔑 Getting a TMDB API Key

MovieVerse uses **The Movie Database (TMDB)** for movie and TV metadata, images, genres, credits, videos, recommendations, and discovery.

Create a TMDB account and request an API key through the TMDB developer settings.

**TMDB:** https://www.themoviedb.org/

---

## 🔄 Application Flow

```text
                    ┌───────────────┐
                    │     TMDB      │
                    │      API      │
                    └───────┬───────┘
                            │
                            ▼
                 ┌───────────────────┐
                 │   MovieVerse UI   │
                 └─────────┬─────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
     Home Page        Movies / TV       Details Page
          │                │                │
          │                │                ├── Trailer
          │                │                ├── Cast
          │                │                └── Recommendations
          │                │
          └────────────────┴───────────────┐
                                           ▼
                                  Personalized Features
                                           │
                                           ▼
                                      MongoDB
                                           │
                                           ▼
                                   User / Auth Data
```

---

## 🔐 Authentication Flow

```text
Signup
  ↓
Validate user input
  ↓
Hash password with bcrypt
  ↓
Store user in MongoDB
  ↓
Send welcome email

Login
  ↓
Validate credentials
  ↓
Generate JWT access + refresh tokens
  ↓
Store tokens in HTTP-only cookies
  ↓
Authenticated session
```

### Password Reset

```text
Forgot Password
      ↓
Enter email
      ↓
Generate OTP
      ↓
Send OTP via Resend
      ↓
Verify OTP
      ↓
Create new password
```

---

## 📡 TMDB-Powered Features

MovieVerse uses TMDB for several parts of the discovery experience:

- Trending content
- Popular content
- Top-rated content
- Movie / TV search
- Genre information
- Cast and credits
- Videos and trailers
- Recommendations
- Release information
- Ratings
- Movie and TV metadata

---

## 🎯 Roadmap

MovieVerse is actively evolving. Planned and potential features include:

- [ ] ❤️ Favorites / Watchlist
- [ ] ⭐ User reviews and ratings
- [ ] 📺 Where to watch / streaming availability
- [ ] 🤖 AI-powered movie & TV recommendations
- [ ] 🔎 Natural-language movie discovery
- [ ] 👤 User profile page
- [ ] 📚 Personalized watch history
- [ ] 🔔 Personalized recommendations
- [ ] 🎬 More detailed cast pages
- [ ] 📱 Further mobile UI improvements

---

## 🤖 AI Movie Assistant

One of the planned features is an AI-powered discovery assistant that understands natural-language requests.

For example:

> **"I want a dark psychological thriller with a smart plot, preferably under 2 hours."**

Instead of requiring users to manually select several filters, MovieVerse can interpret the request and return relevant movies or series.

The goal is to make movie discovery feel more conversational and personalized.

---

## 📸 Screenshots

Add screenshots of the application here once the UI is finalized.

```text
Coming soon...
```

---

## ⚡ Performance & UX

MovieVerse focuses on a smooth discovery experience through:

- Client-side caching with SWR
- Reusable components
- Responsive layouts
- Lazy-loaded / optimized media where applicable
- Animated transitions
- URL-persistent filters
- Reusable API/data-fetching patterns

---

## 🧑‍💻 Development

Run the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Run linting:

```bash
npm run lint
```

---

## 📄 License

This project is currently intended as a personal / portfolio project.

Movie and TV metadata, images, and related information are provided through **TMDB** and remain subject to their respective terms and policies.

MovieVerse is not affiliated with or endorsed by TMDB.

---

## 👨‍💻 Developer

Built with ❤️ while learning, experimenting, breaking things, fixing them, and building MovieVerse one feature at a time.

**MovieVerse — Find something worth watching. 🎬**
```

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Run linting:

```bash
npm run lint
```

---

## 📄 License

This project is currently intended as a personal / portfolio project.

Movie and TV metadata, images, and related information are provided through **TMDB** and remain subject to their respective terms and policies.

MovieVerse is not affiliated with or endorsed by TMDB.

---

## 👨‍💻 Developer

Built with ❤️ while learning, experimenting, breaking things, fixing them, and building MovieVerse one feature at a time.

**MovieVerse — Find something worth watching. 🎬**
