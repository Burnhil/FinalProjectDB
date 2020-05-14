// Represent a Person entity.
import mongoose from "mongoose";
import Entity from "./entity.js";

export default class Provider extends Entity {
    // define static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        OrganizationName: { type: "String", required: true},
        Email: { type: "String", required: true},
        WebsiteInfo: { type: "String", required: true},
        PhoneNumber: { type: "String", required: true},
        Address: { type: "String", required: true},
        City: { type: "String", required: true},
        State: { type: "String", required: true},
        County: { type: "String", required: true},
        changedBy: { type: "String", default: "The Admin" },
        changedDateTime: { type: "Date", default: new Date() },
        TheUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        TheServicesOfferedId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    
    });

    //set the defined schema as a model for Mongoose to use
    //static model = mongoose.model("User", User.schema, "Administration"); // "namd of model", schemaObject, "name of collection in DB"
    static model = mongoose.model("Provider", Provider.schema, "Provider");

    //link provider to servicesoffered method
    static async linkProviderServicesOffered(providerInfo, servicesOfferedInfo){
    
        try{

        //get info
        let providerId = '';
        let servicesOfferedId = "";

        providerId = providerInfo.id;
        servicesOfferedId = servicesOfferedInfo.id;

        //add entities
        providerInfo.TheServicesOfferedId = servicesOfferedId;
        servicesOfferedInfo.ProviderID = providerId;

        //save to entities table
        let updatedProviderDoc = await providerInfo.save();
        let updatedServicesOfferedDoc = await servicesOfferedInfo.save();

        //print console verification of completion
        if(updatedProviderDoc && updatedServicesOfferedDoc){
            console.log(`The services offered id = ${updatedServicesOfferedDoc} has been added to the following Provider ${updatedProviderDoc}`);
        }

    }catch(err){
            console.log(err);
        }

    }


    //link provider to user 
    static async linkProviderUser(theProviderInfo, theUserInfo){
        //get info
        let userIds = [];
        let providerId = "";
        
        for(let i = 0; i < theUserInfo.length; i++){
            userIds.push(theUserInfo[i].id);
        }
        providerId = theProviderInfo.id;

        //add entity info
        theProviderInfo.TheUserId = userIds;
        for(let i =0; i < userIds.length; i++){
            theUserInfo[i].ProviderID.push(providerId);
        }

        //save entity info
        let updatedProviderUserDoc = await theProviderInfo.save();
        let updatedUserIdDoc = [];
        for(let i =0; i < userIds.length; i++){
            updatedUserIdDoc.push(await theUserInfo[i].save());
        }

        //print console verification of completion
        if(updatedProviderUserDoc.id && updatedUserIdDoc.length > 0){
            console.log(`Provider ${updatedProviderUserDoc.id} has been added to the following users`);
            for(let i = 0; i < theUserInfo.length; i++){
                console.log(`users ${updatedUserIdDoc[i]}.id`);
            }
        }

    }



}