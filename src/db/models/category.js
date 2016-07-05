import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const categorySchema = new Schema({

  name: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },

  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },

});

categorySchema.statics.getBy = (selectQuery) =>
  selectQuery ? this
    .findOne(selectQuery)
    .exec() : null;


const transform = (_, { ...category }) => category;

categorySchema.set('toJSON', { transform });
categorySchema.set('toObject', { transform });

export default mongoose.model('Category', categorySchema);
