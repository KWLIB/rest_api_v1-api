let express = require('express');
let app = express();
let restaurantRepos = require('./repos/restaurantRepo')
let errorHelper = require('./helper/errorHelper')
//cross-origin resource sharing: allow anyone access the server
let cors = require('cors')

//express router object
let router = express.Router();

//Configure cors
app.use(cors());

// Configure middleware to support JSON data parsing in request object
app.use(express.json());

//create array object
//const restaurants = restaurantRepos.get();

//Create GET to fetch data
// router.get('/',function(req,res,next){
//     res.status(200).send(restaurants)
// })

//Create GET to fetch data
router.get('/',function(req,res,next){
    // res.status(200).json({
    //     "status":200,
    //     "statusText":"OK",
    //     "message":"All restaurants are fetched",
    //     "data":restaurants
    // })
    restaurantRepos.get(function(data){
        res.status(200).json({
            "status":200,
            "statusText":"OK",
            "message":"All restaurants are fetched",
            "data":data
        })
    },function(err){
        //next is responsible for handling errors
        next(err);
    })
});

//Get/search？id=n&name=str to search by id/name (http://localhost:5000/api/search?id=1&name=a)
router.get('/search',function(req,res,next){
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
      };
    restaurantRepos.search(searchObject,function(data){
            res.status(200).json({
                "status":200,
                "statusText":"OK",
                "message":"selected restaurant is fetched",
                "data":data
            })
    },function(err){
        //next is responsible for handling errors
        next(err);
    })
});

router.get('/:id',function(req,res,next){
    restaurantRepos.getById(req.params.id,function(data){
        if(data){
            res.status(200).json({
                "status":200,
                "statusText":"OK",
                "message":"selected restaurant is fetched",
                "data":data
            })
        }
        else{
            res.status(404).json({
                "status":404,
                "statusText":"Not found",
                "message":"'the restaurant'"+req.params.id+"'could not be found'",
                "error":{
                    "code":"NOT_FOUND",
                    "message":"'the restaurant'"+req.params.id+"'could not be found'"
                }
            })
        }
        
    },function(err){
        //next is responsible for handling errors
        next(err);
    })
});


//insert new one
router.post('/',function(req,res,next){
    restaurantRepos.insert(req.body,function(data){
        res.status(201).json({
            "status":201,
            "statusText":"Created",
            "message":"new restaurant is added",
            "data":data
        });   
    },function(err){
        //next is responsible for handling errors
        next(err);
    })
});

//main diff between put and patch: the way the server processes the enclosed entity to modify the resource identified by the Request-URI.

//update 
router.put('/:id',function(req,res,next){
    restaurantRepos.getById(req.params.id,function(data){
        if(data){
            restaurantRepos.update(req.body,req.params.id,function(data){
                res.status(200).json({
                    "status":200,
                    "statusText":"OK",
                    "message":"restaurant "+req.params.id+" has been updated",
                    "data":data
                })
            })
        }
        else{
            res.status(404).json({
                "status":404,
                "statusText":"Not found",
                "message":"'the restaurant'"+req.params.id+"'could not be found'",
                "error":{
                    "code":"NOT_FOUND",
                    "message":"'the restaurant'"+req.params.id+"'could not be found'"
                }
            })
        }
        
    },function(err){
        //next is responsible for handling errors
        next(err);
    })
});

//update with partial data (need to input id first)
router.patch('/:id',function(req,res,next){
    restaurantRepos.getById(req.params.id,function(data){
        if(data){
            restaurantRepos.update(req.body,req.params.id,function(data){
                res.status(200).json({
                    "status":200,
                    "statusText":"OK",
                    "message":"restaurant "+req.params.id+" has been updated",
                    "data":data
                })
            })
        }
        else{
            res.status(404).json({
                "status":404,
                "statusText":"Not found",
                "message":"'the restaurant'"+req.params.id+"'could not be found'",
                "error":{
                    "code":"NOT_FOUND",
                    "message":"'the restaurant'"+req.params.id+"'could not be found'"
                }
            })
        }
        
    },function(err){
        //next is responsible for handling errors
        next(err);
    })
});

router.delete('/:id',function(req,res,next){
    restaurantRepos.getById(req.params.id,function(data){
        if(data){
            restaurantRepos.delete(req.params.id,function(data){
                    res.status(200).json({
                    "status":200,
                    "statusText":"OK",
                    "message":"'restaurant'"+req.params.id+"'has been deleted'",
                    "data":data
                })
            })
        }
        else{
            res.status(404).json({
                "status":404,
                "statusText":"Not found",
                "message":"'the restaurant'"+req.params.id+"'could not be found'",
                "error":{
                    "code":"NOT_FOUND",
                    "message":"'the restaurant'"+req.params.id+"'could not be found'"
                }
            })
        }
        
    },function(err){
        //next is responsible for handling errors
        next(err);
    })
});


//Configure router => all routes are prefixed with /api/v1
app.use('/api/',router);

//Error handler with errorHelper
//configure exception logger to console
app.use(errorHelper.logErrorsToConsole);
//configure client error handler
app.use(errorHelper.clientErrorHandler);
//configure catch-all exception middleware last
app.use(errorHelper.errorHandler);

//Create server to listen on port 5000 (app.listen(port))
var server = app.listen(5000,function(){
    console.log('Node server is running on http://localhost:5000..');
});