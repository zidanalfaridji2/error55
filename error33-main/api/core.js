const express = require("express");
const cors = require('cors');
const {
  Pagination,
  Homepage,
  Robots,
  Ads,
  PlaceHolder,
  PostApi,
  Post,
  err404,
  Contact,
  Copyright,
  Dmca,
  Privacy,
  Feed,
  Rss,
  SitemapXML,
} = require("./controllers");
const app = express();
app.use(express.static("assets"));
app.disable("x-powered-by");

app.use(cors());
app.get("/", Homepage);
app.get("/ping", (req, res) => {
  res.header("Content-Type", "text/plain");
  res.write("ok");
  res.send();
});
app.get("/p/contact", Contact);
app.get("/p/copyright", Copyright);
app.get("/p/dmca", Dmca);
app.get("/p/privacy", Privacy);
app.get("/robots.txt", Robots);
app.get("/ads.txt", Ads);
app.get("/feed.xml", Feed);
app.get("/feed", Rss);
app.get("/sitemap.xml", SitemapXML);
app.get("/page/:id(\\d+)", Pagination);
app.get("/img/placeholder.svg", PlaceHolder);
app.post("/api/:query", PostApi);
app.get("/:query", Post);
app.all("*", err404);

module.exports = app;
