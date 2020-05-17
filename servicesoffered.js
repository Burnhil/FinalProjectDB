// Represent a Person entity.
import mongoose from "mongoose";
import Entity from "./entity.js";

export default class ServicesOffered extends Entity {
    // define properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        AvaliableBeds: { type: "Number", required: true},
        TotalBeds: { type: "Number", required: true},
        VolunteerOpportunities: { type: "Number", required: true},
        VolunteersNeeded: { type: "Number", required: true},
        ServiceType: { type: "String", required: true},
        ServicesDescription: { type: "String", required: true},
        CriteriaForService: { type: "String", required: true},
        WarmingStation: { type: "String", required: true},
        ChangedBy: { type: "String", default: "The Admin" },
        ChangedDateTime: { type: "Date", default: new Date() },
        ProviderID: [{ type: mongoose.Schema.Types.ObjectId, ref: "Provider"}]
    
    });

    //set the defined schema as a model for Mongoose to use
    //static model = mongoose.model("User", User.schema, "Administration"); // "namd of model", schemaObject, "name of collection in DB"
    static model = mongoose.model("ServicesOffered", ServicesOffered.schema, "ServicesOffered");
}