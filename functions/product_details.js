exports = async function(product_id){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/

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
  let response = null;
  try {
   let inventoryProducts = await inventoryCollection.findOne({product_id}, { status: 0 })
   let orderProducts = await orderCollection.findOne({product_id}, { _id: 0, product_id: 0 })
   let  returnProducts = await returnCollection.findOne({product_id}, { _id: 0, product_id: 0 })
   response = {
     ...inventoryProducts,
     order: {
       ...orderProducts
     },
     returns: {
       ...returnProducts
     }
   }
} catch (e) {
    return { message: "Transaction aborted due to error in catch", code: 500}
} finally {
      // Step 6: End the session when you complete the transaction
    return { message: "Successfully transaction completed", code: 200, response}
}
  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

};
