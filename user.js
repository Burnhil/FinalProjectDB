// Represent a Person entity.
import mongoose from "mongoose";
import Entity from "./entity.js";
import ProviderOrganization from "./providerorganization.js";
import bcrypt from "bcrypt";

export default class User extends Entity {
    // define 2 static properties pertaining to the schema and model of this entity type.
    static schema = new mongoose.Schema({

        FirstName: { type: "String", required: true},
        LastName: { type: "String", required: true},
        Oraganization: { type: "String", required: true},
        PhoneNumber: { type: "String", required: true},
        Email: { type: "String", required: true},
        UserType: { type: "String", required: true},
        UserId: { type: "String", required: true},
        UserPassword: { type: "String", required: true},
        LastLogin: { type: Date, required: true},
        Diabled: { type: Boolean, required: true},
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

    static async verifyLogin(theUserID, theUserPassword){

        //verify user is in DB
        let matchUser = theUserID.UserId;
        //console.log(matchUser);
        //console.log(UserPassword);

        //****************************************************************************************** 
        let userInDB = await this.read({ UserId: matchUser });
        console.log({message: "This is the user filtered from database", userInDB});
        let theUserPassDoc = userInDB.UserPassword;
        console.log({message: "This is the user passwrod from database pulled", theUserPassDoc});
/*
        let match = await bcrypt.compare(userInDB.UserPassword, theUserPassword);

        //if user in db pull password to check
        if(match){
            let theUserPassword = userName.UserPassword; 
            console.log(" this is the password = " + theUserPassword  );

            if(theUserPassword == theUserPassword){
                //execute log in procedure
            }else{
                console.log("Sorry current user or password not found!");
            }

        }else{
            console.log("Unable to find user");
        } 
*/
    }

    //untested until I can figure out await object?????????????????????????
    static async updateUserPassword(theUserId, currentPassword, updatedPassword){
        //check current password vs database
       
            //pull user password from DB
            let userInDB = await this.read({ UserId: theUserId });
            console.log({message: "This is the user filtered from database", userInDB});
            //assign password from DB to variable for comaparison
            let userPassword = userInDB.UserPassword;
            //compare passwords
            let match = await bcrypt.compare(currentPassword, userPassword);
         
            // if match convert new password to hash and store
            if(match) {
                bcrypt.hash(updatedPassword, saltRounds).then(function(hash) {
                    theUserId.UserPassword = hash;
                });
            }else{
                console.log("Current password does not match our records!");
            }
        
    }

    //code to reset password using a temp password by admin/input using userid(theUserToReset) and to password(tempPassword)
    static async resetPassword(theUserToRest, tempPassword){

        //create hash with bcrypt then store to user
        bcrypt.hash(tempPassword, saltRounds).then(function(hash) {
             let updatedPassword = hash;
             updatedPassword =  theUserToRest.UserPassword.save();
        });
    }

    //code to disable account per admin access
    static async disableAccount(theUserToDisable){
        let userInDB = theUserToDisable.Diabled;

        //this can be used as a toggle to reactivate
        if(!userInDB){
            let disableUpdate = true;
            disableUpdate = await theUserToDisable.Diabled.save();
        }else{
            let disableUpdate = false;
            disableUpdate = await theUserToDisable.Diabled.save();
        }
    }
}