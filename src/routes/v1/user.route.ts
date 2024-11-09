import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { responseJson } from '../../utils/responseJson';
const UserRoute = express.Router();

// Connection URL
export const uri = 'mongodb+srv://mahendrakumara:OWBwvJMulburUhtN@cluster0.gqgye.mongodb.net/';
UserRoute.get('/list', async (req, res) => {
  const client = new MongoClient(uri);
  const { firstName, lastName } = req.query;

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the specific database and collection
    const database = client.db('big_one'); // Replace with your database name
    const collection = database.collection<any>('users'); // Replace with your collection name

    // Build the query object
    const query: any = { role: 'user' }; // Assuming you're only looking for users

    // Add search conditions if firstName or lastName are provided
    if (firstName) {
      query.firstName = { $regex: new RegExp(firstName as string, 'i') }; // Case-insensitive regex search
    }
    if (lastName) {
      query.lastName = { $regex: new RegExp(lastName as string, 'i') }; // Case-insensitive regex search
    }

    // Fetch documents in the collection based on the query
    const data = await collection.find(query).toArray();

    console.log(data, 'data');

    return responseJson(res, 200, 'Users retrieved successfully', data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return responseJson(res, 500, 'Error fetching data', null);
  } finally {
    // Close the connection
    await client.close();
  }
});

// find by id user
UserRoute.get('/:id', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the specific database and collection
    const database = client.db('big_one'); // replace with your database name
    const collection = database.collection('users'); // replace with your collection name
    const role = 'user';
    const data = await collection.findOne({ _id: new ObjectId(req.params.id), role });

    return responseJson(res, 201, 'Coupon created successfully', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // Close the connection
    await client.close();
  }
});

// find all user id in list of array
UserRoute.get('/', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const role = 'user';
    // Access the specific database and collection
    const database = client.db('big_one'); // replace with your database name
    const collection = database.collection('users'); // replace with your collection name
    const data = await collection.find({ role }).toArray();

    const final = data.map((item) => {
      return item._id;
    });

    return responseJson(res, 201, 'Coupon created successfully', final);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // Close the connection
    await client.close();
  }
});

export default UserRoute;
