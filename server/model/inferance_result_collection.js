const mongoose = require("mongoose");
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
      type: SchemaTypes.Decimal128,
    },
    b: {
      type: SchemaTypes.Decimal128,
    },
    h: {
      type: SchemaTypes.Decimal128,
    },
    volume: {
      type: SchemaTypes.Decimal128,
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
