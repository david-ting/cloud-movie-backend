# :cloud: cloud-movie-backend

The project has been published to heroku. It serves as the backend for [**cloud-movie-frontend**](https://github.com/david-ting/cloud-movie-frontend).

It uses Node.js as a Web Server (with [**Express**](https://expressjs.com/) framework) for making requests to get data from the [**TMDb API**](https://developers.themoviedb.org/3/getting-started/introduction) and the [**Youtube API**](https://developers.google.com/youtube/v3/docs/). 

As the [**TMDb API**](https://developers.themoviedb.org/3/getting-started/introduction) may not supply enough data for the project, [**puppeteer**](https://www.npmjs.com/package/puppeteer) is also used to scrap the data from the TMDb websites. 

