require("dotenv").config({ path: "./env/.env" });
const Mongoose = require('mongoose');

module.exports= {
    init: () => {
        const MONGOOSE_OPTIONS = {
            maxPoolSize: 100,
            minPoolSize: 10,
        };

        Mongoose.connect(process.env.MONGO_APP_URL, MONGOOSE_OPTIONS)
                    .then(() => console.log("Database Connected"))
                    .catch((err) => console.log("could not connect to database ", err))
    },
    connection: Mongoose.connection.readyState !== 1 ? Mongoose.connection : null,
    Mongoose,

    close:  () => (Mongoose.connection.readyState !==1 ? Mongoose.connection.close(false) : true),
}