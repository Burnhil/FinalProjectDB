// Represent a Person entity.
import mongoose from "mongoose";
import Entity from "./entity.js";
import ProviderOrganization from "./providerorganization.js";

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
    static model = mongoose.model("User", User.schema, "User");

    static async linkUserProvider(theUserInfo, theProviderInfo){
        //************************************************************************************
        try{

        //get info
        let providerIds = [];
        let userId = "";

        for(let i = 0; i < theProviderInfo.length; i++){
            providerIds.push(theProviderInfo[i].id);
        }        
        userId = theUserInfo.id;

        //add
        theUserInfo.ProviderID = providerIds;
        for(let i =0; i < providerIds.length; i++){
            theProviderInfo[i].TheUserId.push(userId);
        }

        //save
        let updatedUserProviderDoc = await theUserInfo.save();
        let updatedProviderDoc = [];
        for(let i = 0; i < providerIds.length; i++){
            updatedProviderDoc.push(await theProviderInfo[i].save());
        }

        //print info out to console to verify
        if(updatedUserProviderDoc.id && updatedProviderDoc.length > 0){ 
            console.log(`User ${updatedUserProviderDoc.id} has been added to the following providers`);
            for(let i =0; i < theProviderInfo.length; i++){
                console.log(`providers ${updatedProviderDoc[i].id}`);
            }

        } 
    }catch(err){
            console.log(err);
        }

    }
}