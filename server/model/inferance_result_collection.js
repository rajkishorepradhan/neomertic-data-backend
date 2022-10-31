const mongoose = require("mongoose")
require('mongoose-double')(mongoose);
const { Schema, model } = require("mongoose");

const SchemaTypes = mongoose.Schema.Types;
const inferanceSchema = new Schema(
  {
    class_name: {
      type: String,
      required: true,
    },
    img_url: {
      type: String,
      required: true,
    },
    l: {
      type: SchemaTypes.Double,
    },
    b: {
      type: SchemaTypes.Double,
    },
    h: {
      type: SchemaTypes.Double,
    },
    volume: {
      type: SchemaTypes.Double,
    },
    timestamps: {
      type: Date,
      default: new Date(),
    },
  },
  {
    collection: "inference_result",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

module.exports = model("inference_result", inferanceSchema);
