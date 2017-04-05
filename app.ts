import * as express from "express";
import * as bodyParser from "body-parser";
import Datastore from "./async-nedb";

let port = 3000;
let root = `http://localhost:${ port }`;

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
            response.json(200, results);
        })
        .catch((error) => {
            response.json(500, { error: error });
        });
});

app.post("/movies", (request, response) => {
    if (!request.body.title) {
        response.json(400, {
            error: {
                message: "A title is required to create a new movie."
            }
        });
        return;
    }
    db.movies.insertAsync({
        title: request.body.title
    }).then((document) => {
        response.set("location", `${ root }/movies/${ document._id }`);
        response.json(201, document);
    }).catch((error) => {
        response.json(500, { error: error });
    });
});

app.get("/movies/:id", (request, response) => {
    db.movies.findOneAsync({
        _id: request.params.id
    }).then((document) => {
        if (!document) {
            response.json(404, {
                error: {
                    message: `We did not find a movie with id: ${
                        request.params.id
                    }`
                }
            });
            return;
        }
        response.json(200, document);
    }).catch((error) => {
        response.json(500, { error: error });
    });
});

app.put("/movies/:id", (request, response) => {
    db.movies.updateAsync(
        { title: request.params.id },
        { $set: { rating: request.body.rating } }
    ).then((result) => {
        if (result.numberOfUpdated === 0) {
            response.json(400, {
                error: {
                    message: "No records were updated"
                }
            })
            return;
        }
        response.json(204, {
            success: {
                message: `Successfully updated movie with ID ${
                    request.params.id
                }`
            }
        });
    }).catch((error) => {
        response.json(500, { error: error });
    });
});

app.delete("/movies/:id", (request, response) => {
    db.movies.removeAsync(
        { _id: request.params.id }
    ).then((numberOfDeleted) => {
        if (numberOfDeleted === 0) {
            response.json(404, {
                error: {
                    message: `We did not find a movie with id: ${
                        request.params.id
                    }`
                }
            });
            return;
        }
        response.set("link", `${ root }/movies; rel="collection"`);
        response.send(204);
    }).catch((error) => {
        response.json(500, { error: error });
    });
});

app.listen(3000, () => {
    console.log("Server started on 3000");
});
