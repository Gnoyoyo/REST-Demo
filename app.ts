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

app.post("/movies", (request, response) => {
    switch (request.body.action) {
        case "viewList":
            db.movies.findAsync({})
                .then((results) => {
                    response.json(results);
                })
                .catch((error) => {
                    response.json({ error: error });
                });
            break;
        case "addNew":
            db.movies.insertAsync({
                title: request.body.title
            }).then((document) => {
                response.json(document);
            }).catch((error) => {
                response.json({ error: error });
            });
            break;
        default:
            response.json({ error: { message: "No action given" } });
    }
});

app.post("/movies/:id", (request, response) => {
    switch (request.body.action) {
        case "view":
            db.movies.findOneAsync({
                _id: request.params.id
            }).then((document) => {
                response.json(document);
            }).catch((error) => {
                response.json({ error: error });
            });
            break;
        case "rate":
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
            break;
        default:
            response.json({ error: { message: "No action given" } });
    }
});

app.listen(3000, () => {
    console.log("Server started on 3000");
});
