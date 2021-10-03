// index.js
var os = require("os-utils");
var exec = require("child_process").exec;
import express from "express";
import { PrismaClient, UserCreateInput } from "@prisma/client";
// import test from "./routes/test";
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

/**
 * logic for our api will go here
 */
export default {
  path: "/api",
  handler: app
};
// The above code initializes Express and Prisma and exports two properties, path and handler, which will be registered in nuxt.config.js in Step 3. The path property specifies the route the middleware will be accessible, and handler specifies the function executed when invoked. For the rest of this step, you’ll be working in index.js setting up the endpoints and their respective handlers.

// Create a User
// The first feature you’ll be implementing is creating a user/ author. The database will be expecting an email and an optional name. It’s implementation is as follows:
// // index.js

app.post(`/user`, async (req, res) => {
  const result = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name
    }
  });
  res.json(result);
});
// Creating a Post
// Next, you’ll add the create post endpoint. The request body will expect a title, content and authorEmail. If an author doesn’t exist in the database, their user record will be created.
// // index.js
app.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } }
    }
  });
  res.json(result);
});
app.get("/usage", async (req, res) => {
  // var os = require("os-utils");

  os.cpuUsage(function(v) {
    res.json({ CPU_Usage: v });
  });
});
app.get("/cpu-free", async (req, res) => {
  os.cpuFree(function(v) {
    res.json({ CPU_Usage: v });
  });
});
app.post(`/post-many`, async (req, res) => {
  let { posts, authorEmail } = req.body;

  await Promise.all(
    posts.map(async p => {
      p.published = false;
      p.author = { connect: { email: authorEmail } };

      prisma.post.create({
        data: p
      });
    })
  );

  res.json(posts);
});

// Get drafts
// Once that is done, you’ll need to be able to view all unpublished posts. Prisma lets you specify all relations you’d like to be returned in the response with the include property. This is where you’ll add the author relation query to view the respective posts as well as their authors.
// // index.js
app.get("/drafts", async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: false },
    include: { author: true }
  });

  res.json(posts);
});
// Get Post by Id
// You can get a post by it’s id using findUnique as follows:
// // index.js
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id)
    },
    include: { author: true }
  });
  res.json(post);
});
// Publish a Post
// When a Post is ready to go live update the published field:
// // index.js
app.put("/publish/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: {
      id: Number(id)
    },
    data: { published: true }
  });
  res.json(post);
});
// Get Feed
// All your published posts can be made available on the /feed endpoint, filtering them by checking that the published property is set to true.
// // index.js
app.get("/feed", async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true }
  });
  res.json(posts);
});
// Deleting a Post
// The last CRUD feature is deleting a Post record in your database:
// // index.js
app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: {
      id: parseInt(id)
    }
  });
  res.json(post);
});
// The final feature in your application is filtering posts, checking if the searchString is found in either the title or content of your Posts.

// Search for a Post
// // index.js
app.get(`/test`, async (req, res) => {
  let reqQuery = JSON.stringify(req.query);

  var result = "";

  var fun = function() {
    let execute = __dirname + "/../assets/program " + reqQuery;
    //gcc -Wall -o program main.c && ./program hiii amir
    // var child = exec(execute, function(err, data, stderr) {
    //   // console.log(data, stderr);
    // });

    // child.stdout.on("data", function(data) {
    //   result += data;
    // });
    // child.on("close", function() {
    //   res.json({ result });
    // });
    return { city: "city", address: 33334546 };
  };

  await fun();
});
app.get("/filterPosts", async (req, res) => {
  const { searchString } = req.query;
  const draftPosts = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: searchString
          }
        },
        {
          content: {
            contains: searchString
          }
        }
      ]
    }
  });
  res.send(draftPosts);
});

app.get("/crypts", async (req, res) => {
  const posts = await prisma.crypt.findMany({ take: 12 });
  res.json(posts);
});

app.post(`/crypts`, async (req, res) => {
  let result = "";
  try {
    result = await prisma.crypt.create({
      data: {
        duration: req.body.duration,
        charts: req.body.chars,
        user: { connect: { email: "amir1004@gmail.com" } }
      }
    });
  } catch (error) {
    result = error;
  }
  console.log(`in ctryps result`, result);
  res.json(result);
});
