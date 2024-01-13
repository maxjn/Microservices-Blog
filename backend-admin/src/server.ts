import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

// Modules
import { start as startAMQP } from "./config/amqp/amqpConnection";

// Config
import sequelize from "./config/database";

// Routes
import postRoutes from "./routes/postRoutes";

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URI, // frontend URI (ReactJS)
};

// Middlewares
// - CORS
app.use(cors(corsOptions));
// - Get Body
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);

// Connection

sequelize
  .sync()
  .then(async () => {
    try {
      await sequelize.authenticate();

      // Start RabbitMQ connection
      startAMQP(process.env.RABBITMQ_URL);

      // Start Server
      app.listen(process.env.PORT, () => {
        console.log("Server Is Listening ON Port: ", process.env.PORT);
      });
    } catch (error) {
      console.log("Server Error:", error);
    }
  })
  .catch((err) => console.log("Connection Error: ", err));
