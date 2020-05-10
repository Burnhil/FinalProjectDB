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
        TheUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        TheServicesOfferedId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    
    });

    //set the defined schema as a model for Mongoose to use
    //static model = mongoose.model("User", User.schema, "Administration"); // "namd of model", schemaObject, "name of collection in DB"
    static model = mongoose.model("Provider", Provider.schema, "Provider");

    static async linkProviderServicesOffered(providerInfo, servicesOfferedInfo){
        //************************************************************************************
        try{

        //get info
        let providerId = '';
        let servicesOfferedId = "";

        providerId = providerInfo.id;
        servicesOfferedId = servicesOfferedInfo.id;

        providerInfo.TheServicesOfferedId = servicesOfferedId;
        servicesOfferedInfo.ProviderID = providerId;

        let updatedProviderDoc = await providerInfo.save();
        let updatedServicesOfferedDoc = await servicesOfferedInfo.save();

        if(updatedProviderDoc && updatedServicesOfferedDoc){
            console.log(`The services offered id = ${updatedServicesOfferedDoc} has been added to the following Provider ${updatedProviderDoc}`);
        }

        /*
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

        */
    }catch(err){
            console.log(err);
        }

    }

}