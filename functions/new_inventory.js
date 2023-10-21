exports = async function(productQuery){
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
  const returnCollection = context.services.get(serviceName).db(dbName).collection(returnColl);
  const inventoryCollection = context.services.get(serviceName).db(dbName).collection(inventoryColl);
  const orderCollection = context.services.get(serviceName).db(dbName).collection(orderColl);
  const session = client.startSession();
  // adding config in inventory object;
  const orderQuery = {...Order_ReturnCommonPaylaod(productQuery)}
  
  const returnQuery = {...orderQuery}
  // adding status attribute in product inventory
  productQuery.status = 0
    const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };
  try {
  session.withTransaction(async () => {
   await inventoryCollection.insertOne(productQuery);
   await orderCollection.insertOne(orderQuery);
   await returnCollection.insertOne(returnQuery);
  },transactionOptions);
} catch (e) {
    await session.abortTransaction();
    return { message: "Transaction aborted due to error in catch"}
} finally {
      // Step 6: End the session when you complete the transaction
    await session.endSession();
    return { message: "Successfully transaction completed"}
}
  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

};

function Order_ReturnCommonPaylaod(product) {
  const seller_sizes = {};
  const config = context.functions.execute("product_config");
  for (let i = 0; i < config.sellers.length; i += 1) {
      seller_sizes[config.sellers[i]] = {};
      for (let j = 0; j < config.sizes.length; j += 1) {
         seller_sizes[config.sellers[i]][config.sizes[j]] = 0;
      }
  }
  return {
    _id: product._id,
    product_id:product.product_id,
    ...seller_sizes
  }
}