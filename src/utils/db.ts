import mongoose from "mongoose";

const connect = async () => {
  if(mongoose.connections[0].readyState){
    return true;
  }
  try {
    await mongoose.connect(process.env.MONGO as string);
    console.log("Connected to MONGODB");
    return true;
  } catch (error) {
    console.log("Erro connecting to database: ", error);
  }
};

export default connect;
