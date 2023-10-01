exports = async function(product_id, inventoryQuery, orderQuery){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "feyre";


  // Update these to reflect your db/collection
  var dbName = "rme-feyre";
  var inventoryColl = "inventory";
  var orderColl = "order";
   const client = context.services.get("inventory");
  // Get a collection from the context
  var inventoryCollection = context.services.get(serviceName).db(dbName).collection(inventoryColl);
  
  
  var orderCollection = context.services.get(serviceName).db(dbName).collection(orderColl);

  const session = client.startSession();
    const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };
  try {
    await session.withTransaction(async () => {
      // Step 4: Execute the queries you would like to include in one atomic transaction
      // Important:: You must pass the session to the operations
      // await orderCollection.updateOne({ product_id}, { $inc: orderQuery},  { session })
       const tt = await inventoryCollection.insertOne({"_id":"PRODUCT-44","product_id":"PRODUCT-44",
"image":"",
"description":"ASDSADAS",
"xl":12,"l":31,"s":11,"m":1,
"flipkart":{"m":1,"xl":1,"s":1,"l":1
},"meesho":{"m":0,"xl":0,"s":0,"l":0},
"ajio":{"m":0,"xl":0,"s":0,"l":0}},  { session })
    }, transactionOptions);
  } catch (err) {
    // Step 5: Handle errors with a transaction abort
    await session.abortTransaction();
    return err;
  } finally {
    // Step 6: End the session when you complete the transaction
    await session.endSession();
  }
  

  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

  return { code: 200  };
};