const { MongoClient, ObjectId } = require("mongodb");
const readline = require("readline");

//readline set up to allow interaction w/ terminal
const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function ask(question) {
  return new Promise((resolve, reject) => {
    interface.question(question, resolve);
  });
}

//set connection object for mongoDB database server
let dbUrl = "mongodb://localhost:27017";
const client = new MongoClient(dbUrl, { useUnifiedTopology: true });

async function populateDb() {
  //Connect to MongoDB
  await client.connect();
  //Find specific database named "library"
  const libraryDB = client.db("library");
  //look for collection "books" inside DB named "library"
  const bookStore = libraryDB.collection("books");
  //use reference to collection to perform read/write methods
  let num = 1;

  while (num < 100) {
    await bookStore.insertOne({ title: num, author: "Bob Stauss" });
    num++;
  }

  //close the connection
  await client.close();
}

async function start() {
  await client.connect();
  const dataBase = client.db("library");
  const collection = dataBase.collection("books");

  console.log("Welcome to the library!");
  let answer = await ask(
    "What would you like to do? (see all, find book, add book, update book, remove book) "
  );

  //Print all books in collection
  if (answer === "see all") {
    //find all documents in collection, and assign the cursor
    let cursor = await collection.find({});

    //iterate over the cursor to display all books
    cursor.forEach((book) => {
      console.log(book);
    });
  } else if (answer === "find book") {//Search by specific parameters

    let searchType = await ask("are you searching by author, or title? ");
    let titleAuthor = await ask("what are you looking for? ");
    //square brackets allow variable values to be used as keys
    let cursor = collection.find({ [searchType]: titleAuthor });
    //iterate over cursor to display all matching results
    cursor.forEach((book) => console.log(book));
  } else if (answer === "add book") { //create entry for database

    let resOne = await ask("What is the title of the book? ");
    let resTwo = await ask("Who is the author? ");

    //get user input, and format for DB entry, implicit scheme
    await collection.insertOne({ title: resOne, author: resTwo });

  } else if (answer === "update book") {

    //show the user all available options
    let cursor = await collection.find({});
    console.log("all available books:\n");

    await cursor.forEach((book) => {
      console.log(`title: ${book.title}; ID: ${book._id}`);
    });

    let bookToUpdate = await ask(
      "Please enter the ID of the book you want to update: "
    );
    //set values to be updated
    let newAuthor = await ask("Who is the author? ");
    let newTitle = await ask("What is the title? ");

    //update methods take two arguments
    await collection.updateOne(
      { _id: ObjectId(bookToUpdate) },//look for a doc that matches this criteria
      { $set: { author: newAuthor, title: newTitle } }//update to be applied, marked by atomic operator $set
    );
  } else if (answer === "remove book") {//delete a document
    //tell the user the operations that are available
    let cursor = await collection.find({});
    console.log("all available books:\n");

    await cursor.forEach((book) => {
      console.log(`title: ${book.title}; ID: ${book._id}`);
    });

    let remove = await ask("Please enter the ID of the book to be removed: ")
    //delete the doc that matches the query
    collection.deleteOne({_id: ObjectId(remove)})
  }

  // await client.close();
  // console.log("Goodbye!");
  // process.exit();
}

// start();
