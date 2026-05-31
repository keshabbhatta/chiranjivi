const mongoose = require("mongoose");
const User = require("./src/models/User.model");

async function fixDuplicateKeyError() {
  try {
    await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/healthcare");
    
    console.log("Connected to MongoDB...");
    
    // Drop the existing unique index on doctorUsername
    console.log("Dropping existing doctorUsername index...");
    await User.collection.dropIndex("doctorUsername_1").catch(() => {
      console.log("Index doesn't exist or already dropped");
    });
    
    // Create the correct sparse unique index
    console.log("Creating new sparse unique index on doctorUsername...");
    await User.collection.createIndex(
      { doctorUsername: 1 },
      { unique: true, sparse: true }
    );
    
    console.log("✅ Successfully fixed the duplicate key error!");
    console.log("The doctorUsername field now allows multiple null values.");
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error fixing duplicate key:", error.message);
    process.exit(1);
  }
}

fixDuplicateKeyError();
