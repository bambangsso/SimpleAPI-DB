var express = require("express");
var mysql = require('mysql');
var redis = require('redis');
var mongoose = require('mongoose');
var app = express();
var myArgs = process.argv.slice(2);

var pool = null;
var redisClient = null;
var mongoDB = null;
var PUser = null;

function init_mysql(conlimit, host, port, user, password, database, debug) {
    pool = mysql.createPool({
        connectionLimit : conlimit, //important, if traffic more than 100, it will be queued, no broken connections
        host : host,
        port : port, 
        user : user,
        password : password,
        database : database,
        debug : debug
    });
}

function init_redis(host, port) {
    redisClient = redis.createClient(port, host);
}

function init_mongo(host, port, user, password, database) {
    var mongo = 'mongodb://' + host + ':' + port + '/' + database;
    mongoose.connect(mongo, {useNewUrlParser: true});
    mongoose.Promise = global.Promise;
    mongoDB = mongoose.connection;

    mongoDB.on('error', console.error.bind(console, 'MongoDB connection error:'));    

    var userSchema = new mongoose.Schema({
      name: {
        first: String,
        last: { type: String, trim: true }
      },
      age: { type: Number, min: 0 }
    });

    PUser = mongoose.model('PowerUsers', userSchema);
    
}

function handle_mysql(req,res) {
    pool.getConnection(function(err,connection) {
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }  

        console.log('connected as id ' + connection.threadId);
       
        connection.query("select * from post", function(err,rows) {
            connection.release();
            if (err) {
                res.json({"code" : 101, "status" : "Error querying table, possibly table does not exists"});
                return;                
            }    
            res.json(rows);      
        });

        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;    
        });
    });
}


function handle_redis(req,res) {
    redisClient.set('my test key', 'my test value', redis.print);
    redisClient.get('my test key', function (error, result) {
    if (error) {
        res.json({"code" : 101, "status" : error});
        return;                
    }
    res.json(result);
    
});

}


function handle_mongo_save(req,res) {
    var newUser = new PUser ({
      name: { first: 'Bambang', last: 'Susilo' },
      age: 25
    });

    // Saving it to the database.
    newUser.save(function (err) {
        if (err) {
            console.log ('Error on save!')
            res.json({"status": "save on mongoDB failed"});
        } 
        res.json({"status": "save success"});
    });    

}

function handle_mongo_read(req,res) {
    PUser.find({}).exec(function(err, result) {
      if (err) {
        res.json({"status": "read on mongoDB failed"});
      }
      res.json(result);
    });
}




app.get("/mysql", function(req,res) {
    handle_mysql(req,res);
});

app.get("/redis", function(req,res) {
    handle_redis(req,res);
});

app.get("/mongoSave",function(req,res) {
    handle_mongo_save(req,res);
});

app.get("/mongoRead",function(req,res) {
    handle_mongo_read(req,res);
});


if (myArgs.length == 0) {
    console.log("Usage: node index.js (dev|staging|prod)");
} else {
    switch (myArgs[0]) {
        case 'dev':
            var fileConfig = "./Conf.Development.json";
            break;
        case 'staging':
            var fileConfig = "./Conf.Staging.json";
            break;
        case 'prod':
            var fileConfig = "./Conf.Production.json";
            break; 
        default:
            console.log("Usage: node index.js (dev|staging|prod)");                   
            process.exit(1);
    }    
    var appConfig = require(fileConfig);
    //console.log(JSON.stringify(appConfig));
    init_mysql(appConfig.MySQL_ConLimit, appConfig.MySQL_Host, appConfig.MySQL_Port, appConfig.MySQL_User, appConfig.MySQL_Password, appConfig.MySQL_Database, appConfig.MySQL_Debug);
    init_redis(appConfig.Redis_Host, appConfig.Redis_Port);
    init_mongo(appConfig.MongoDB_Host, appConfig.MongoDB_Port, appConfig.MongoDB_User, appConfig.MongoDB_Password, appConfig.MongoDB_Database);
    app.listen(appConfig.App_Port);
}