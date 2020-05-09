// Represent a Person entity.
import mongoose from "mongoose";
import Entity from "./entity.js";

export default class Provider extends Entity {
    // define 2 static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        OrganizationName: { type: "String", required: true},
        Email: { type: "String", required: true},
        WebsiteInfo: { type: "String", required: true},
        PhoneNumber: { type: "String", required: true},
        Address: { type: "String", required: true},
        City: { type: "String", required: true},
        State: { type: "String", required: true},
        County: { type: "String", required: true},
        TheUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    
    });

    //set the defined schema as a model for Mongoose to use
    //static model = mongoose.model("User", User.schema, "Administration"); // "namd of model", schemaObject, "name of collection in DB"
    static model = mongoose.model("Provider", Provider.schema, "Provider");
}