import express from 'express';
import mongoose from 'mongoose'; 
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv'; 
const app = express();


// import routes
import testRoutes from "./routes/routetest.js";
import taskRoutes from "./routes/task.js";


dotenv.config()

var MIDDLEWEAR_TO_MOUNT = [
    express.json(), helmet({contentSecurityPolicy: false}), 
    morgan('combined'), 'this should not work' 
];
var MIDDLEWEAR_TO_SET = [['views', './views'], ['view engine', 'pug'], 'error']; // not currently used





function middlewearCreation(){
    function addMiddlewear(input){
        if (typeof(input) == 'function'){
            return app.use(input)
        } 
        console.log('error with middlewear');
        return false;
    }
    return addMiddlewear
};

function middlewearMounting() {
    function setMiddlewear(input) {
        if (typeof(input) === 'object'){
            return app.set(input[0], input[1]);
        } else{
            console.log(`Error with: ${input}`);
        }
    }
    return setMiddlewear
};

function addRoutes(){
// app.use('/<route>', <importedRouteVariable>);
// import routes here
    app.get('/', (req, res) => { res.send("<h1> Hello World </h1>");
    });
    app.get('/check', (req, res) => {
        res.send(true);
    });
    app.use('/api', taskRoutes);
    app.use('test', testRoutes);
};

function middleWearHandler(to_set, to_mount) { // takes two arrays, first objects to set, second functions to mount. 
    var mounter = middlewearCreation();
    var setter = middlewearMounting();
    to_mount.map(x => mounter(x));
    to_set.map(x => setter(x));
}

async function connectDb(uri){
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri). then(() => {
        console.log('connected');
    }, err => {
        console.log('Error.', err);
})};

function main(){
    middleWearHandler(MIDDLEWEAR_TO_SET, MIDDLEWEAR_TO_MOUNT)
    addRoutes();
    if (process.env.NODE_ENV !== 'test') {
        app.listen(process.env.API_PORT, () => {
            console.log(`Server listening at http://localhost:${process.env.API_PORT}`)
            connectDb(process.env.API_KEY);
        })
        console.log(new Date(this.end_time).getTime());
   };
    return app;
};

export default main();


