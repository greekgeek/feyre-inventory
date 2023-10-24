exports = async function(product_id, productQuery){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  if (!productQueryValidation(productQuery)) {
    return { message: "Error product inventory payload", code: 500 }
  }
   const serviceName = "feyre";

  // Update these to reflect your db/collection
   const dbName = "rme-feyre";
   const inventoryColl = "inventory";
   const client = context.services.get("feyre");
  // Get a collection from the context
  const inventoryCollection = context.services.get(serviceName).db(dbName).collection(inventoryColl);
    const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };
try {
   await inventoryCollection.updateOne({product_id}, productQuery);
} catch (e) {
    return { message: "Transaction aborted due to error in catch", code: 500}
} finally {
      // Step 6: End the session when you complete the transaction
    return { message: "Successfully transaction completed", code: 200}
}
  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

};

function productQueryValidation(product) {
  if (product._id !== product.product_id) {
    return false;
  }
  return true;
}