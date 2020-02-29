const Sequelize = require("sequelize");
const express = require("express");
const bodyparser = require("body-parser");

const databaseUrl = "postgres://postgres:secret@localhost:5432/postgres";
const db = new Sequelize(databaseUrl);

const Movie = db.define("movie", {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
});

db.sync()
  // console.log("Synchronized")
  .then(createInitialData())
  .catch(console.error);

function createInitialData() {
  Movie.findAll()
    .then(data => {
      data.length === 0 &&
        Promise.all([
          Movie.create({
            title: "The Matrix",
            yearOfRelease: "1999",
            synopsis: "Synopsis 1"
          }),
          Movie.create({
            title: "The Matrix Reloaded",
            yearOfRelease: "2003",
            synopsis: "Synopsis 2"
          }),
          Movie.create({
            title: "The Matrix Revolutions",
            yearOfRelease: "2003",
            synopsis: "Synopsis 3"
          })
        ]);
    })
    .catch(err);
}

const app = express();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on ${port}`));

const bodyparserMiddleware = bodyparser.json();
app.use(bodyparserMiddleware);

// Post a new movie
app.post("/movie", (req, res, next) => {
  Movie.create(req.body)
    .then(movie => res.send(movie))
    .catch(error => next(error));
});

// Read all movies
app.get("/movie", (req, res, next) => {
  const limit = Math.min(req.query.limit || 25, 500);
  const offset = req.query.offset || 0;
  Movie.findAndCountAll({ limit, offset })
    .then(result => res.send({ data: result.rows, total: result.count }))
    .catch(next);
});

// Get a single movie
app.get("/movie/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      movie
        ? res.send(movie)
        : res.status(404).send({ message: "id not found" });
    })
    .catch(next);
});
// Update a single movie
app.patch("/movie/:id", (req, res, next) => {
  const upd = req.body;
  Movie.update(upd, { where: { id: req.params.id } })
    .then(number => {
      number[0]
        ? res.send({ message: `movie ${req.params.id} updated` })
        : res.status(404).send({ message: "id not found" });
    })
    .catch(next);
});
// Delete a single movie
app.delete("/movie/:id", (req, res, next) => {
  Movie.destroy({ where: { id: req.params.id } })
    .then(number => {
      number
        ? res.send({ message: `movie ${req.params.id} deleted` })
        : res.status(404).send({ message: "id not found" });
    })
    .catch(next);
});
