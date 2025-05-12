const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const AuthRouter = require('./routers/AuthRouters');
const ProductRouter = require('./routers/productRouter');
connectDB();


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', AuthRouter);
app.use('/api', ProductRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});