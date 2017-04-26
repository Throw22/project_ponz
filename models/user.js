const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
//const passportMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId
  },
  children: [
    {
      type: Schema.Types.ObjectId
    }
  ]
});

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(findOrCreate);

UserSchema.virtual('points').get(function(name) {
  //points!
  let points;
  return this.points;
});

UserSchema.virtual('password').set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

UserSchema.virtual('referralLink')
  .get(function() {
    let link = `register/${this.id}`;
    return link;
  })
  .set(function(value) {
    this.referralHash = bcrypt.hashSync(value, 8);
  });

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// UserSchema.methods.populateChildren = function() {
//   console.log('BEGINNING OF POPULATE CHILDREN');
//   //returns an array of promises
//   return Promise.all(
//     this.children.map(function(childId) {
//       console.log('childId of user is', childId);
//       return User.findById(childId).then(child => {
//         console.log('found child is', child);
//         if (child.children.length == 0) {
//           return child;
//         } else {
//           return Promise.all(child.populateChildren());
//         }
//       });
//     })
//   ).catch(function(err) {
//     console.log(err);
//   });
// };

UserSchema.methods.populateChildren = async function() {
  let children = [];

  this.children.forEach(function(childId) {

    User.findById(childId).then(child => {
      let newChild = await child.populateChildren();
      children.push(newChild);
    })
  })

  return Promise.all(children);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
