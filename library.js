const { MongoClient, ObjectId } = require("mongodb");

class DataStore {

  constructor(dbUrl, database, collection) {
    this.url = dbUrl
    this.dbName = database
    this.collName = collection
    this.isConnected = false
  }
  
  async openConnect() {
    if(!isConnected) {
      const client = new MongoClient(this.url, { useUnifiedTopology: true });
      await client.connect();
      const dataBase = client.db(this.dbName);
      const collection = dataBase.collection(this.collName);
      this.isConnected = client

      return collection
    } else {
      const dataBase = this.isConnected.db(this.dbName);
      const collection = dataBase.collection(this.collName);
      return collection
    }
  }

  //Print all books in collection
  async getAll() {
    const collection = await this.openConnect()
    //find all documents in collection, and assign the cursor
    let cursor = await collection.find({});

    //iterate over the cursor to display all books
    let resultArr = await cursor.map((book) => {
      return book
    });

    return resultArr

  } 


  async searchByKey(searchType, value) {//Search by specific parameters
    const collection = this.openConnect()
    //square brackets allow variable values to be used as keys
    let cursor = await collection.find({ [searchType]: value });
    //iterate over cursor to display all matching results
    let resultArr = await cursor.map((book) => {
      return book
    });

    return resultArr
  }


  else if (answer === "add book") { //create entry for database

    let resOne = await ask("What is the title of the book? ");
    let resTwo = await ask("Who is the author? ");

    //get user input, and format for DB entry, implicit scheme
    await collection.insertOne({ title: resOne, author: resTwo });

  } 
  else if (answer === "update book") {

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
  } 
  else if (answer === "remove book") {//delete a document
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
}

// start();
