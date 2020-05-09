// Represent a Person entity.
import mongoose from "mongoose";
import Entity from "./entity.js";

export default class BedTransaction extends Entity {
    // define 2 static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        CurrentBedCount: { type: "Number", required: true},
        UpdatedBedCount: { type: "Number", required: true},
        DateTime: { type: "String", required: true}
    
    });

    //set the defined schema as a model for Mongoose to use
    //static model = mongoose.model("User", User.schema, "Administration"); // "namd of model", schemaObject, "name of collection in DB"
    static model = mongoose.model("BedTransaction", BedTransaction.schema, "BedTransaction");
}