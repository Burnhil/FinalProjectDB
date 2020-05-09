// Represent a Person entity.
import mongoose from "mongoose";
import Entity from "./entity.js";

export default class User extends Entity {
    // define 2 static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        FirstName: { type: "String", required: true},
        LastName: { type: "String", required: true},
        Oraganization: { type: "String", required: true},
        PhoneNumber: { type: "String", required: true},
        Email: { type: "String", required: true},
        UserType: { type: "String", required: true},
        UserPassword: { type: "String", required: true},
        LastLogin: { type: Date, required: true},
        Diabled: { type: Boolean, required: true},
        ProviderID: [{ type: mongoose.Schema.Types.ObjectId, ref: "Provider"}]
    
    });

    //set the defined schema as a model for Mongoose to use
    //static model = mongoose.model("User", User.schema, "Administration"); // "namd of model", schemaObject, "name of collection in DB"
    static model = mongoose.model("User", User.schema, "Administration");
}