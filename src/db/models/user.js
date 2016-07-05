import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    set: function hashEmail(email) {
      this.hash = crypto.createHash('md5').update(email).digest('hex');
      return email;
    },
  },

  password: {
    type: String,
    required: true,
    set: function hashPassword(password) {
      return password && password.length > 0 ? bcrypt.hashSync(password, 8) : null;
    },
  },

  isActive: {
    type: Boolean,
    default: false,
  },

  changePasswordDate: {
    type: Date,
    default: new Date(),
  },

  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin'],
    }],
    default: ['user'],
  },

});

userSchema.statics.getBy = (selectQuery) =>
  selectQuery ? this
  .findOne(selectQuery)
  .exec() : null;


userSchema.statics.removeById = (id) =>
  id ? this
  .findOne({ _id: id })
  .remove()
  .exec()
  : null;


// Compares hashed password
userSchema.methods.isPasswordCorrect = (password) =>
  bcrypt.compareSync(password, this.password);


userSchema.methods.createToken = (secret) => {
  const payload = {
    id: this.id,
    email: this.email,
    iat: new Date().getTime(),
  };
  return jwt.sign(payload, secret, {
    expiresIn: '365d',
  });
};

const transform = (_, { password, __v, ...user }) => user;

userSchema.set('toJSON', { transform });
userSchema.set('toObject', { transform });

export default mongoose.model('User', userSchema);
