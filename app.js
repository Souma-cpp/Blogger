import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

// view engine
app.set("view engine", "ejs");

// in-memory datastore
let posts = [];

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));

// enable method-override (so we can use ?_method=PATCH)
app.use(methodOverride("_method"));

app.use(express.static("public"));

// routes
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

// home - show all posts
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

// form to create new post
app.get("/create", (req, res) => {
  res.render("create.ejs");
});

// create a new post
app.post("/create", (req, res) => {
  const title = req.body.title.trim();
  const author = req.body.author.trim();
  const content = req.body.content.trim();

  posts.push({ title, author, content });
  res.redirect("/");
});

// show all posts
app.get("/all", (req, res) => {
  res.render("all.ejs", { posts });
});

// form to edit a post
app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || !posts[id]) {
    return res.status(404).send("Post not found.");
  }

  res.render("edit.ejs", { id, post: posts[id] });
});

// patch (update) a post
app.patch("/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || !posts[id]) {
    return res.status(404).json({ error: "Post not found" });
  }

  const { title, author, content } = req.body;

  if (title) posts[id].title = title.trim();
  if (author) posts[id].author = author.trim();
  if (content) posts[id].content = content.trim();

  res.redirect("/all"); // or res.json({ message: "Post updated.", post: posts[id] });
});
