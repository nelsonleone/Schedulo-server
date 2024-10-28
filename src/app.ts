import 'dotenv/config';
import express from "express";
import { errorHandler } from './middlewares/errorHandler.middleware';
import router from './routes';

const port = process.env.PORT || 3000;
const app = express()
app.use(express.json())


app.use("/api",router)

app.listen(port, () => {
    console.log(`Schedulo Server Running on Port ${port}`)
})

app.use(errorHandler)