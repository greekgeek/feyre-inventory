exports = async function(product_id, inventoryQuery, orderQuery, returnQuery){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
   const serviceName = "feyre";


  // Update these to reflect your db/collection
   const dbName = "rme-feyre";
   const inventoryColl = "inventory";
   const orderColl = "order";
   const returnColl = "returns";
   const client = context.services.get("feyre");
  // Get a collection from the context
  const inventoryCollection = context.services.get(serviceName).db(dbName).collection(inventoryColl);
  const orderCollection = context.services.get(serviceName).db(dbName).collection(orderColl);
  const returnCollection = context.services.get(serviceName).db(dbName).collection(returnColl);
  const session = client.startSession();
    const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };
  try {
  session.withTransaction(async () => {
   await inventoryCollection.updateOne({ product_id}, { $inc: inventoryQuery})
   await orderCollection.updateOne({ product_id}, { $inc: orderQuery})
   await returnCollection.updateOne({ product_id}, { $inc: returnQuery})
  },transactionOptions);
} catch (e) {
    await session.abortTransaction();
    return "Transaction aborted due to error in catch";
} finally {
      // Step 6: End the session when you complete the transaction
    await session.endSession();
    return "Successfully transaction completed";
}
  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

};