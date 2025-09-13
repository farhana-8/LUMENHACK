const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://suraiahkhaisar_db_user:suraiah2412@cluster0.02bnupq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Atlas Connected...");
  } catch (err) {
    console.error("MongoDB Atlas Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
