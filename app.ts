import * as express from "express";
import * as bodyParser from "body-parser";
import Datastore from "./async-nedb";

let app = express();
app.use(bodyParser.json());
let db = {
    movies: new Datastore<{
        title: string;
        rating?: number;
    }>({
        filename: "db/movies",
        autoload: true
    })
};

app.get("/", (request, response) => {
    response.send("API is working.");
});

app.get("/movies", (request, response) => {
    db.movies.findAsync({})
        .then((results) => {
            response.json(results);
        })
        .catch((error) => {
            response.json({ error: error });
        });
});

app.post("/movies", (request, response) => {
    db.movies.insertAsync({
        title: request.body.title
    }).then((document) => {
        response.json(document);
    }).catch((error) => {
        response.json({ error: error });
    });
});

app.get("/movies/:id", (request, response) => {
    db.movies.findOneAsync({
        _id: request.params.id
    }).then((document) => {
        response.json(document);
    }).catch((error) => {
        response.json({ error: error });
    });
});

app.put("/movies/:id", (request, response) => {
    db.movies.updateAsync(
        { title: request.params.id },
        { $set: { rating: request.body.rating } }
    ).then((result) => {
        response.json({
            success: {
                message: `${ result.numberOfUpdated } records updated`
            }
        });
    }).catch((error) => {
        response.json({ error: error });
    });
});

app.delete("/movies/:id", (request, response) => {
    db.movies.removeAsync(
        { _id: request.params.id }
    ).then((numberOfDeleted) => {
        response.json({
            success: {
                message: `${ numberOfDeleted } records updated`
            }
        });
    }).catch((error) => {
        response.json({ error: error });
    });
});

app.listen(3000, () => {
    console.log("Server started on 3000");
});
