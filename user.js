// Represent a Person entity.
import mongoose from "mongoose";
import Entity from "./entity.js";
import ProviderOrganization from "./provideruser.js";
import bcrypt from "bcrypt";

export default class User extends Entity {
    // define 2 static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        FirstName: { type: "String", required: true},
        LastName: { type: "String", required: true},
        Organization: { type: "String", required: true},
        PhoneNumber: { type: "String", required: true},
        Email: { type: "String", required: true},
        UserType: { type: "String", required: true},
        UserId: { type: "String", required: true},
        UserPassword: { type: "String", required: true},
        salt: {type: "String"},
        LastLogin: { type: Date, required: true},
        Disabled: { type: Boolean, required: true},
        changedBy: { type: "String", default: "The Admin" },
        changedDateTime: { type: "Date", default: new Date() },
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
        userId = theUserInfo._id;
    

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

    // method to check UserId and Password match
    static async authenticate(thePersonDoc, givenPassword) {
        //pulling user password to compare
        let encryptedPassword = thePersonDoc.UserPassword;

        //compare UserId's password to inputed password return true or false
        const match = await bcrypt.compare(givenPassword, encryptedPassword);
        return match;   
    }


    //code to reset password using a temp password by admin/input using userid(theUserToReset) and to password(tempPassword)
    static async resetPassword(theUserToReset, tempPassword){
        let saltRounds = theUserToReset[0].salt;
        //create hash with bcrypt then store to user
        
             //hash password to be stored
             let updatedPassword = await bcrypt.hash(tempPassword, saltRounds)
             
             //update password and store in database
             theUserToReset[0].UserPassword = updatedPassword;
             let updatedUserDoc = await theUserToReset[0].save();
             return updatedUserDoc;
     
    }

    //code to disable account per admin access
    static async disableAccount(theUserToDisable){
        //set variables to be checked
        let userInDB = theUserToDisable.Disabled;
        let disableUpdate = false

        //this can be used as a toggle to reactivate
        if(userInDB === true){
            //set disable to false/store/save to database
            disableUpdate = false;
            theUserToDisable.Disabled = disableUpdate;
            let updatedUserDoc = await theUserToDisable.save();
            return updatedUserDoc;
        }

        if(userInDB === false){
            //set disable to true/store/save to database
            disableUpdate = true;
            theUserToDisable.Disabled = disableUpdate;
            let updatedUserDoc = await theUserToDisable.save();
            return updatedUserDoc;
        }
        //return value
        return disableUpdate;
    }

    //method used to create password hash to store into system.
    //this method called for all new user creates before creation
    static async newUserPasswordHash(newUserPasswordToStore){
        //generate salt for user
        const saltRounds = 10;
        let salt = await bcrypt.genSalt(saltRounds);
        //generate hash to be stored
        let userHashPassword = await bcrypt.hash(newUserPasswordToStore, salt)  
        //return both values to be added to new user create json 
        return {encryptedString: userHashPassword, salt: salt};  
    }

}