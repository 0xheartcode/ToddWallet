import {config} from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {getErc20KpiController} from "./controllers";
import {jojo} from "./services";

config();

const PORT = process.env.PORT;

const app = express();

// https://earthly.dev/blog/mongodb-docker/
app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());

app.get('/erc20/:address/kpi', getErc20KpiController)

mongoose.connect(`mongodb://${process.env.MONGO_URL}`).then(() => {
    console.log(`listening on port ${PORT}`);
    app.listen(PORT);
});