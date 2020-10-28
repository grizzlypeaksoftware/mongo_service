var DataAccess = function () {
	this.MongoClient = require('mongodb').MongoClient
		, assert = require('assert');
    this.Mongo = require('mongodb');
	this.DBConnectionString = process.env.MONGO_CONNECTION.replace(/\\/g, "");

	this.Database = process.env.DATABASE;
	//this.Collection = process.env.COLLECTION

};

DataAccess.prototype.MakeMongoId = function(id){
	return this.Mongo.ObjectID(id);
};

DataAccess.prototype.ObjectID = function(id){
	return this.Mongo.ObjectID(id);
};

DataAccess.prototype.Get = function(coll, id){
    var that = this;
    return this.GetEntities(coll, {_id: that.ObjectID(id)});
}

DataAccess.prototype.GetEntities = function(coll, query, sort){
	var that = this; 
	
	if(!query){
		query = {};
	}

	if(!sort){
		sort = {"_id":1};
	}

	return new Promise( function(fulfill, reject){	
		that.MongoClient.connect(that.DBConnectionString)
		.then(function(db){
			var database = db.db(that.Database);
			var collection = database.collection(coll);
			collection.find(query).sort(sort).toArray(function (err, docs) {	
				db.close();
				if(err){
					reject(err);
				} else {
					fulfill(docs);
				}
			});
		}).catch(function(err){
			reject(err);
		});
	});	
};

DataAccess.prototype.InsertEntity = function(coll, entity){
	var that = this;
	return new Promise( function(fulfill, reject){
		that.MongoClient.connect(that.DBConnectionString)
		.then(function(db){
			var database = db.db(that.Database);
			var collection = database.collection(coll);
			var toInsert = []; 
			toInsert.push(entity);
			collection.insertMany(toInsert, function (err, result) {
				db.close();
				if(err){
					reject(err);
				} else {
					fulfill(result);
				}
			});
		}).catch(function(err){
			reject(err);
		});
	});
};

DataAccess.prototype.DeleteById = function(coll,id){
	var that = this;
	return new Promise(function(fulfill, reject){
		that.MongoClient.connect(that.DBConnectionString)
		.then(function(db){
			var database = db.db(that.Database);
			var collection = database.collection(coll);
			collection.deleteOne({_id: new that.Mongo.ObjectID(id)}, function (err, result) {
				db.close();
				if(err){
					reject(err);
				} else {
					fulfill(result);
				}
			});
		}).catch(function(err){
			reject(err);
		});
	});
}

DataAccess.prototype.DeleteEntity = function(coll, id, res){
	
	var that = this;	
	this.MongoClient.connect(this.DBConnectionString, function (err, db) {
		assert.equal(null, err);	
		
		var database = db.db(that.Database);
		var collection = database.collection(coll);
		
 		collection.deleteOne({_id: new that.Mongo.ObjectID(id)}, function(err, results) {
			if (err){				
				res.send("error", err);	
			}

			if(res){
				res.send(results);
			}		
		});
		db.close();
	});
};

DataAccess.prototype.Update = function(coll, query, entity){
	var that = this;
    
	return new Promise(function(fulfill, reject){
		that.MongoClient.connect(that.DBConnectionString)
		.then(function(db){
			var database = db.db(that.Database);
            var collection = database.collection(coll);
			collection.updateOne(query, entity, function (err, result) {
				db.close();
				if(err){
					console.log(err);
					reject(err);
				} else {
					fulfill(result);
				}
			});
		}).catch(function(err){
			reject(err);
		});
	});
};

module.exports = new DataAccess();
