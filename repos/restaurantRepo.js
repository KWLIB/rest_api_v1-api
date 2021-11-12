//built-in node that knows how to read or writing files
let fs=require('fs');
const FILE_NAME='./assets/restaurants.json';

let restaurantRepos={
    get:function(resolve,reject){
        fs.readFile(FILE_NAME,function(err,data){
            if(err){
                reject(err);
            }
            else{
                resolve(JSON.parse(data));
            }
        });
    },
    getById: function(id,resolve,reject){
        fs.readFile(FILE_NAME,function(err,data){
            if(err){
                reject(err);
            }
            else{
                let restaurant=JSON.parse(data).find(p=>p.id==id);
                resolve(restaurant);
            }
        })
    },
    search:function(searchObject,resolve,reject){
        fs.readFile(FILE_NAME,function(err,data){
            if(err){
                reject(err);
            }
            else{
                let restaurant=JSON.parse(data);
                if(searchObject){
                    restaurant = restaurant.filter(
                        p=>(searchObject.id?p.id==searchObject.id:true)&&
                        (searchObject.name?p.name.toLowerCase().indexOf(searchObject.name)>=0:true)
                    )
                }
                resolve(restaurant);
            }
        })
    },
    insert:function(newData,resolve,reject){
        fs.readFile(FILE_NAME,function(err,data){
            if(err){
                reject(err);
            }
            else{
                let restaurant=JSON.parse(data);
                restaurant.push(newData);
                fs.writeFile(FILE_NAME,JSON.stringify(restaurant),function(err){
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(newData);
                    }
                });
            }
        });
    },
    update:function(newData,id,resolve,reject){
        fs.readFile(FILE_NAME,function(err,data){
            if(err){
                reject(err)
            }
            else{
                let restaurants=JSON.parse(data);
                let restaurant=restaurants.find(p=>p.id==id);
                if(restaurant){
                    //any value that are in the new data properties that match, it'll change the data
                    Object.assign(restaurant,newData);
                    fs.writeFile(FILE_NAME,JSON.stringify(restaurants),function(err,data){
                        if(err){
                            reject(err);
                        }
                        else{
                            resolve(newData);
                        }
                    })
                }
            }
        })
    },
    delete:function(id,resolve,reject){
        fs.readFile(FILE_NAME,function(err,data){
            if(err){
                reject(err);
            }
            else{
                let restaurants= JSON.parse(data);
                let index=restaurants.findIndex(p=>p.id==id);
                if(index!=-1){
                    //splice:add new elements, splice(para1,para2,new1...):para1:start index,para2:num of removed elems
                    restaurants.splice(index,1);
                    fs.writeFile(FILE_NAME,JSON.stringify(restaurants),function(err){
                        if(err){
                            reject(err);
                        }
                        else{
                            resolve(index);
                        }
                    })
                }
            }
        })
    }
}

module.exports = restaurantRepos;