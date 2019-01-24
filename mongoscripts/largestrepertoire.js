var db = db.getSiblingDB('studyopenings');
var maxObj = null;
var maxSize = 0;
db.repertoires.find().forEach(function(obj) { var size = Object.bsonsize(obj); if (size > maxSize) { maxSize = size; maxObj = obj; } } );

printjson(maxObj._id);