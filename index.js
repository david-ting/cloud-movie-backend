require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

app.use(cors());

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
      console.error(err);
      res.status(status).end();
    });
}

app.get("/searchOneType/:type/:name/:page", (req, res) => {
  const { type, name, page } = req.params;
  const path = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
    name
  )}&page=${page}&include_adult=false`;
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

app.get("/scrapeSingleReview/:reviewID", (req, res) => {
  const { reviewID } = req.params;
  (async () => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(`https://www.themoviedb.org/review/${reviewID}`);

    const review = await page.evaluate(() => {
      const content = [];

      const paragraphs = document
        .querySelectorAll(".content")[1]
        .querySelectorAll("p");
      paragraphs.forEach((p) => {
        content.push(p.textContent);
      });
      const author = document
        .querySelectorAll(".content")[1]
        .querySelector(".sub-heading")
        .querySelector("a").textContent;
      return { author, content };
    });

    review.id = reviewID;
    res.status(200).json(review);

    await browser.close();
  })().catch((err) => {
    console.error(err);
    res.status(500).end();
  });
});

app.get("/fetchYoutubeVidoDetail/:videoID", (req, res) => {
  const { videoID } = req.params;
  const path = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${YOUTUBE_API_KEY}
  &part=snippet,contentDetails,statistics`;
  standardFetch(res, path);
});

app.listen(port, () => {
  console.log(`listening at port: ${port}`);
});
