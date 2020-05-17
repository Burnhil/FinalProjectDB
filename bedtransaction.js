// Represent a Person entity.
import mongoose from "mongoose";
import Entity from "./entity.js";

export default class BedTransaction extends Entity {
    // define static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        CurrentBedCount: { type: "Number", required: true},
        UpdatedBedCount: { type: "Number", required: true},
        UpdatingUserID: { type: "String", required: true},
        UpdatingProviderID: { type: "String", required: true},
        UpdatingServiceID: { type: "String", required: true},
        ChangedDateTime: { type: "Date", default: new Date() }
    
    });

    //set the defined schema as a model for Mongoose to use
    //static model = mongoose.model("User", User.schema, "Administration"); // "namd of model", schemaObject, "name of collection in DB"
    static model = mongoose.model("BedTransaction", BedTransaction.schema, "BedTransaction");

    static async updateBedCountTable(User, Provider, ServiceOffered, BedCount) {
        //set current date/time to variable to store as reference
        let currentDate = Date();
        //set up json object to pass into insertion into database

        let theProperties = {

            CurrentBedCount: ServiceOffered.AvaliableBeds,
            UpdatedBedCount: BedCount,
            UpdatingUserID: User._id,
            UpdatingProviderID: Provider._id,
            UpdatingServiceID: ServiceOffered._id,
            ChangedDateTime: currentDate
        }

        //console.log({ message: "theProperties to update = ", theProperties});

        try {
            //update the bed count and store in database
            ServiceOffered.AvaliableBeds = BedCount;
            let updateServiceOfferedBedCount = await ServiceOffered.save();
            //console.log(updateServiceOfferedBedCount);

            // instantiate a new model of whatever the child class is representing
            let newModel = new this.model();
            // Get all of the properties in theProperties parameter and assign them to the new model object.
            for(let [key, value] of Object.entries(theProperties)) {
                newModel[key] = value;
            }
            // Now save the Mongoose model.

            console.log({ message: "this is the newModel being created", newModel});
            return newModel.save();
        } catch (err) {
            console.log(err);
        }
    }
   
}