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

app.post("/rpc", (request, response) => {
    switch (request.body.action) {
        case "getMovies":
            db.movies.findAsync({})
                .then((results) => {
                    response.json(results);
                })
                .catch((error) => {
                    response.json({ error: error });
                });
            break;
        case "addMovie":
            db.movies.insertAsync({
                title: request.body.title
            }).then((document) => {
                response.json(document);
            }).catch((error) => {
                response.json({ error: error });
            });
            break;
        case "rateMovie":
            db.movies.updateAsync(
                { title: request.body.title },
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
            response.send("No action given");
    }
});

app.listen(3000, () => {
    console.log("Server started on 3000");
});
