import express from "express";
import bodyParser from "body-parser";
import {dirname, parse} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
app.use(express.static("public"));
var blog=[];

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req,res)=>{
res.render("index.ejs", {blog: blog});
});

app.post("/submit", (req,res)=>{
  const judul = req.body["judul"];
  const pesan = req.body["pesan"];
  
  blog.push({judul: judul, pesan: pesan});
  console.log(blog);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const postIndex = parseInt(req.body.postIndex);
  if (postIndex >-1 && postIndex < blog.length) {
    blog.splice(postIndex, 1);
  }
  res.redirect("/");
})

app.get("/edit/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < blog.length) {
    const post = blog[index];
    res.render("edit.ejs", { post: post, index: index });
  } else {
    res.redirect("/");
  }
});

app.post("/update", (req, res) => {
  const index = parseInt(req.body.postIndex);
  if (index >= 0 && index < blog.length) {
    const updatedJudul = req.body.judul;
    const updatedPesan = req.body.pesan;
    blog[index] = { judul: updatedJudul, pesan: updatedPesan };
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

