const { MongoClient, ObjectId } = require("mongodb");

class DataStore {

  constructor(dbUrl, database, collection) {
    this.url = dbUrl
    this.dbName = database
    this.collName = collection
    this.isConnected = false
  }
  
  async openConnect() {
    if(!this.isConnected) {
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

  //return all documents in collection
  async getAll() {
    const collection = await this.openConnect()
    //find all documents in collection, and assign the cursor
    let cursor = await collection.find({});

    //iterate over the cursor to store all documents
    let resultArr = []
    
    await cursor.forEach((document) => {
      resultArr.push(document)
    });

    return resultArr

  }

  async searchByKey(searchType, value) {//Search by specific parameters
    const collection = await this.openConnect()

    //square brackets allow variable values to be used as keys
    let cursor = await collection.find({ [searchType]: value });
    //iterate over cursor to store all matching results
    let resultArr = []

    await cursor.forEach((document) => {
      resultArr.push(document)
    });

    return resultArr
  }

  async addEntry(data) { //create entry for database
    const collection = await this.openConnect()

    await collection.insertOne(data);

  }

  async updateEntry(targetId, update) {
    const collection = await this.openConnect()
    //update methods take two arguments
    await collection.updateOne(
      { _id: ObjectId(targetId) },//look for a doc that matches this criteria
      { $set: update }//update to be applied, marked by atomic operator $set
    );
  } 

  async removeEntry(targetId) {//delete a document
    const collection = await this.openConnect()
    //delete the doc that matches the query
    await collection.deleteOne({_id: ObjectId(targetId)})
  }

  async closeConnect() {
    if(this.isConnected) {
      await this.isConnected.close()
    } else {
      console.log('no currently active connection')
    }
  }
}

module.exports = DataStore
