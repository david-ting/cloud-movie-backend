require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = process.env.PORT || 8000;

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

function standardFetch(res, path) {
  fetch(path)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      const regex = /^Error: ([0-9]{3})$/;
      const match = err.toString().match(regex);
      const statusFound = match ? parseInt(match[1]) : null;
      const status = statusFound ? statusFound : 500;
      res.status(status).end();
    });
}

app.get("/searchOneType/:type/:name/:page", (req, res) => {
  const { type, name, page } = req.params;
  const path = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&language=en-US&query=${name}&page=${page}&include_adult=false`;
  standardFetch(res, path);
});

app.get("/fetchDetail/:type/:id", (req, res) => {
  const { type, id } = req.params;
  const path = `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&language=en-US`;
  standardFetch(res, path);
});

app.get("/fetchVideos/:type/:id", (req, res) => {
  const { type, id } = req.params;
  const path = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`;
  standardFetch(res, path);
});

app.get("/fetchReviews/:type/:id/:page", (req, res) => {
  const { type, id, page } = req.params;
  const path = `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
  standardFetch(res, path);
});

app.get("/fetchRecommendations/:type/:id/:page", (req, res) => {
  const { type, id, page } = req.params;
  const path = `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
  standardFetch(res, path);
});

app.get("/fetchTrending/:type/:timeWindow", (req, res) => {
  const { type, timeWindow } = req.params;
  const path = `https://api.themoviedb.org/3/trending/${type}/${timeWindow}?api_key=${TMDB_API_KEY}`;
  standardFetch(res, path);
});

app.get("/fetchSingleReview/:reviewID", (req, res) => {
  const { reviewID } = req.params;
  const path = `https://api.themoviedb.org/3/review/${reviewID}?api_key=${TMDB_API_KEY}`;
  standardFetch(res, path);
});

app.get("/fetchYoutubeVidoDetail/:videoID", (req, res) => {
  const { videoID } = req.params;
  const path = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${YOUTUBE_API_KEY}
  &part=snippet,contentDetails,statistics`;
  standardFetch(res, path);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
