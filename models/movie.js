var mongoose = require('mongoose');
var mongo_url = process.env.MONGODB_URI || 'mongodb://localhost/mymdb_db';

mongoose.Promise = global.Promise; // to use mongoosre Promise in find()

mongoose.connect(mongo_url);

// set schema - step 6
// settin up how json structure would be like
var movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true  // predefine modifiers
  },
  publishedYear: Number,
  director: String,
  actors: String,
  published: {
    type: String,
    default: "MGM"   // default value
  },
  website: {
    type: String,
    trim: true,
    set: function(url) {
      if (!url) return url;

      if (url.indexOf('http://') !== 0 &&
          url.indexOf('https://') !== 0)
          {
      url = 'http://' + url;
    }
    return url;
    }
  }
  },
  {
    timestamps: {}
  }
  // create_at: {
  //   type: Date,
  //   default: Date.now
  // }
// }
);

//regisster the getter

movieSchema.set('toJSON', { getters: true});

// register the schema - step 7
var Movie = mongoose.model('Movie', movieSchema); // 'Movie' mongoose will look for movies with a "s"

// make i available to other files lika app,js - step 8
module.exports = Movie; // the var Movie under step 7 register
