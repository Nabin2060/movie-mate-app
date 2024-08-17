

// const { required } = require("joi");
const { required } = require("joi");
const { Schema, model } = require("mongoose");
const {ObjectId}=Schema.Types;

const movieSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        slug: { type: String, required: true },
        duration: { type: String, required: true },
        synopsis: { type: String },
        poster: { type: String, required: true },
        releaseDate: { type: Date, required: true, default: Date.now },
        endDate: { type: Date, required: true },
        rating:{type:Number,default:0},
        Seats: { type: Number, required: true, default: 0 },
        price:{type:Number,required:true,default:0},
        createdBy:{type:ObjectId,ref:"User"},
        updateBy:{type:ObjectId,ref:"User"},

        //todo
        //createdBy:{}
    },
    {
        timestamps: true,
    }
);

module.exports = model("movie", movieSchema);