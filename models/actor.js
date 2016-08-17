var mongoose = require('mongoose');
var mongo_url = 'mongodb://localhost/mymdb_db';

mongoose.Promise = global.Promise; // to use mongoosre Promise in find()

// mongoose.connect(mongo_url);

// set schema - step 6
// settin up how json structure would be like
var actorSchema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    index: true,  // not necessary if unique already true. This is to improve the searching
    require: true
  },
  age: Number,
  website: {
    type: String,
    trim: true,
    get: function(url) {
      if (!url) return url;

      if (url.indexOf('http://') !== 0 &&
          url.indexOf('https://') !== 0)
          {
      url = 'http://' + url;
    }
    return url;
    }
  },
  create_at: {
    type: Date,
    default: Date.now
  }

});



//register vitual attributes
actorSchema.virtual('fullname').get(function() {
  return this.firstname + ' ' + this.lastname;
})
  .set(function(fullname){
    var splitName = fullname.split(" ");
    this.firstname = splitName[0];
    this.lastname = splitName[1];
  });

// query helpers
  actorSchema.query = {
    byName: function(name) {
      return this.find( {
        $or: [
          { firstname: new RegExp(name, 'i') },
          { lastname: new RegExp(name, 'i') }
        ]
      });
    }
  }

// register the modifiers
//regisster the getter

actorSchema.set('toJSON', { getters: true});

// register the schema - step 7
var Actor = mongoose.model('Actor', actorSchema); // 'Movie' mongoose will look for movies with a "s"

// make i available to other files lika app,js - step 8
module.exports = Actor; // the var Movie under step 7 register
