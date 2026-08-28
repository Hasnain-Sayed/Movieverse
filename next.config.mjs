const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"image.tmdb.org", //allow images from tmdb
        pathname:"/t/p/**" //All image paths under /t/p
      },
    ],
  },
};

export default nextConfig;
