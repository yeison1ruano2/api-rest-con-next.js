import mongoose, { connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;
  if (connectionState == 1) {
    console.log("Conexion éxitosa");
    return;
  }
  if (connectionState == 2) {
    console.log("Conectando a base de datos");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "next14restapi",
      bufferCommands: true,
    });
    console.log("Conectado");
  } catch (error: any) {
    console.log("Error: ", error);
    throw new Error("Error: ", error);
  }
};

export default connect;
