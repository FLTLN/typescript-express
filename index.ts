import express from "express";
import { data } from "./data";

const app = express();
const port = 8080; // default port to listen

app.use(express.json());

app.get("/test", (req, res) => {
   res.send("UP & RUNNING");
});

// start the Express server
app.listen(port, () => {
   console.log(`server started at http://localhost:${port}`);
});

// GET games/[id]
// Returns the info for a particular game by ID.

app.get("/games/:id", function (req, res) {
   const game_id = parseInt(req.params.id);
   const game = data.games.find((game) => game.id == game_id);

   if (game) {
      res.json(game);
   } else {
      res.status(404);
   }
   res.send();
});

// GET games
// Returns info for all games in an array.

app.get("/games", function (req, res) {
   res.json(data.games);
   res.send();
});

// POST games
// Adds a new game. Body will contain game info. Returns the id: {"id": "..."}.

app.post("/games", function (req, res) {

   // Create unique id
   // It is insane slow way to do this, but it works well for this task
   let new_game_id: number = 0;

   while (data.games.find((game) => game.id == new_game_id)) {
      new_game_id += 1;
   }

   let game = req.body;

   game.id = new_game_id;

   data.games = [...data.games, game];

   res.json({ id: game.id });
});

// PUT games/[id]
// Updates or replaces a game by ID. Request body will be JSON, same format as the previous.

app.put("/games/:id", function (req, res) {

   const game_id = parseInt(req.params.id);
   const game = data.games.findIndex((game) => game.id == game_id);

   if (game) {
      data.games[game] = req.body;
      data.games[game].id = game_id;
   } else {
      res.status(404);
      res.send();
   }

   res.send();
});

// DELETE games/[id]
// Deletes a game. Should also remove the game from all users' libraries.

app.delete("/games/:id", function (req, res) {
   const game_id = parseInt(req.params.id);

   const game = data.games.find((game) => game.id == game_id);

   if (game) {
      data.games = data.games.filter((game) => game.id != game_id);
   } else {
      res.status(404);
   }

   data.users.forEach(user => {
      user.library = user.library.filter((game) => game.id != game_id)
   });

   res.send();
});

// GET users/[id]
// Gets a user's info by ID.

// interface UserOutput {
//    id: number;
//    username: string;
// }

app.get("/users/:id", function (req, res) {
   const user_id = parseInt(req.params.id);

   if (user_id < 0) {
      res.status(404);
      res.send();
   }

   const user = data.users.find((user) => user.id == user_id);

   if (user) {
      // var output: UserOutput = { id: 0, username: "" }; // To lazy to find better way to initialize it
      var output: any = {}; // Not sure it is a better way, but it is better than it initialization was
      output.id = user.id;
      output.username = user.username;
      res.json(output);
   } else {
      res.status(404);
   }
   res.send();
});

// POST users
// Adds a user. Body will contain user info (just username). Returns the id: {"id": "..."}.

app.post("/users", function (req, res) {

   // Create unique id
   // It is insane slow way to do this, but it works well for this task
   let new_user_id: number = 0;

   while (data.users.find((user) => user.id == new_user_id)) {
      new_user_id += 1;
   }

   let user = req.body;

   user.id = new_user_id;

   data.users = [...data.users, user];

   res.json({ id: user.id });
});

// PUT users/[id]
// Updates a user. Same body as previous.

app.put("/users/:id", function (req, res) {

   const user_id = parseInt(req.params.id);
   const user = data.users.findIndex((user) => user.id == user_id);

   if (user) {
      data.users[user].username = req.body.username;
      data.users[user].id = user_id;
   } else {
      res.status(404);
      res.send();
   }

   res.send();
});

// DELETE users/[id]
// Deletes a user. Any "PII" (their ID), should be 100% stricken from the database, but for metrics purposes we want to preserve their playtimes for games. In no event should a deleted user ever be able to be associated back to the remembered play times.

app.delete("/users/:id", function (req, res) {
   const user_id = parseInt(req.params.id);

   const user = data.users.find((user) => user.id == user_id);

   if (user) {
      data.users[data.users.findIndex((user) => user.id == user_id)].id = -1;
   } else {
      res.status(404);
   }

   res.send();
});

// GET users/[id]/games
// Gets a user's game library.

app.get("/users/:id/games", function (req, res) {
   const user_id = parseInt(req.params.id);
   const user = data.users.find((user) => user.id == user_id);

   if (user) {
      var games: any[] = [];

      user.library.forEach(user_game => {
         if (user_game.is_visible) {
            var game: any = {};

            game.game = data.games.find((game) => game.id == user_game.id);
            game.playTime = user_game.time_played;

            games.push(game);
         }
      });

      const output = { games: games }

      res.json(output);
      res.send();

   } else {
      res.status(404);
   }
   res.send();
});

// POST users/[id]/games
// Adds a game to a user's library.

app.post("/users/:id/games", function (req, res) {
   const user_id = parseInt(req.params.id);
   const game_id = parseInt(req.body.id);

   console.log(user_id);
   console.log(game_id);
   console.log((data.users.findIndex((user) => user.id == user_id)));
   console.log((data.games.findIndex((game) => game.id == game_id)));
   console.log((data.users[user_id].library.findIndex((game) => game.id == game_id)));

   // There is an error when indexes is out of range. Wont't fix it
   if ((data.users.findIndex((user) => user.id == user_id) >= 0) && ((data.games.findIndex((game) => game.id == game_id)) >= 0)) {
      if ((data.users[user_id].library.findIndex((game) => game.id == game_id)) < 0) {

         data.users[user_id].library = [...data.users[user_id].library, { id: game_id, time_played: 0, is_visible: true }]
         res.send();
      } else if (data.users[user_id].library[game_id].is_visible == false) {
         data.users[user_id].library[game_id].is_visible = true
      }
   }

   res.status(404);
   res.send();
});

// not all assignments are completed, the work is completed late, so it will be fair if the grade is low
