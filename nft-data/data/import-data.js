//here we going to deploy our data to db
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const NFT = require("./../../models/nftModel");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then((con) => {
    // console.log(con.connection);
    console.log("DB Connection Successfully");
  });

const nfts = JSON.parse(
  fs.readFileSync(`${__dirname}/nft-simple.json`, "utf-8")
);

// //IMPORT DATA for uploading data
const importDate = async () => {
  try {
    await NFT.create(nfts);
     console.log("DATA successfully Loaded");
     //>>stop the server
     process.exit();
  } catch (error) {
    console.log(error);
  }
};

// //DELETE DATA for deleting entire data
const deleteData = async () => {
  try {
    await NFT.deleteMany();
    console.log("DATA successfully Deleted");
     process.exit();
  } catch (error) {
    console.log(error);
  }
};

//>>instead of calling above functions import and delete one by one we create variable for that we use arvg(shows us the location of the file)
console.log(process.argv);
if (process.argv[2] === "--import") {
  importDate();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
