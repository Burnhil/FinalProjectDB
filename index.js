// bring in the MongoDB Connection import
import './dbconnection.js'; // Since we don't need to refer back to this particular import, there's no need for a name or the "from" keyword
// Import the entity to test
import User from './user.js';
import Provider from './provider.js';
import ServicesOffered from './servicesoffered.js';
import BedTransaction from './bedtransaction.js';
import ProviderUser from './provideruser.js';
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// bring in Express and body-parser
import express from 'express';
import bodyParser from 'body-parser';

const app = express(); // the actual web server
const port = 3000;

// Now apply (or use) the bodyParser middleware in Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));   // this allows us to work with x-www-url-encoded data (used primarily in JSON Web Token authentication processes)

// Make Express now listen for HTTP traffic
app.listen(port, () => {
    console.log(`Express is now listening for HTTP traffic on port ${port}`);
});

//***************************USER Code**************************************************************

//Make endpoint that returns all users
app.get("/users", async(req, res) =>{

    try{
        //call function to read user database info
        let allUserDocs = await User.read();
        res.send(allUserDocs);

    }catch(err){
        //send error if unable to execute
        console.log(err);
        res.send(err);
    }
})

//get user by id
app.get("/users/:userId", async(req, res) =>{
    try{
        //get variable passed in
        let id = req.params.userId;
        //call read method with variable
        let userDocs = await User.read({ _id: id});
        let userDoc = userDocs[0];
        //send back to request
        res.send(userDoc);

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//make endpoint to create a User Doc
app.post("/users", async(req, res) => {
    try{ 
        //check to see if user info came through POST
        let todayDate = Date();

    if( req.body.FirstName
        && req.body.LastName
        && req.body.Organization
        && req.body.PhoneNumber
        && req.body.Email
        && req.body.UserType
        && req.body.UserId
        && req.body.UserPassword
        ){
            //get encrypted password and salt
            console.log("WE are trying to salt");
            let encryptedPasswordAndSalt = await User.newUserPasswordHash(req.body.UserPassword);
            let encryptedPassword = encryptedPasswordAndSalt.encryptedString;
            let salt = encryptedPasswordAndSalt.salt;

            let newUserInfo = {
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Organization: req.body.Organization,
                PhoneNumber: req.body.PhoneNumber,
                Email: req.body.Email,
                UserType: req.body.UserType,
                UserId: req.body.UserId,
                UserPassword: encryptedPassword,
                salt: salt,
                LastLogin: todayDate,  //this date represents initial creation at this point
                Disabled: false
            }

            //now we create user doc and store in database
            let newUser = await User.create(newUserInfo);
            res.send({message: "User created successfully", newUser});

        };

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//make endpoint to update user
app.put("/users/:userId", async(req, res) =>{
    try{
        //get the id to use
        let id = req.params.userId;
        //now find the user doc
        let userDocs = await User.read({ _id: id });
        let userDoc = userDocs[0];

        if(userDoc){

             //look at the Post req.body for the data used to update this user document
            let updateInfo = {};
            if(req.body.FirstName){
                updateInfo["FirstName"] = req.body.FirstName;
            }
            if(req.body.LastName){
                updateInfo["LastName"] = req.body.LastName;
            }
            if(req.body.Organization){
                updateInfo["Organization"] = req.body.Organization;
            }
            if(req.body.PhoneNumber){
                updateInfo["PhoneNumber"] = req.body.PhoneNumber;
            }
            if(req.body.Email){
                updateInfo["Email"] = req.body.Email;
            }
            if(req.body.UserType){
                updateInfo["UserType"] = req.body.UserType;
            }
            //add changedBy and changedDateTime to updateInfo
            updateInfo["changedBy"] = "Admin" //*************update to user who is authenticate */
            updateInfo["changedDateTime"] = Date();

            //update database for user
            let updatedUserDoc = await User.update(userDoc, updateInfo);
            res.send({ message: "Update User doc a success.", updatedUserDoc});

        }else{
            res.send({ message: "Could not find user to be updated."});
        }

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//make endpoint to delete one user by id
app.delete("/users/:userId", async(req, res) => {
    try{

        //get user id
        let id = req.params.userId;
        
        //first find the one user doc
        let userDocs = await User.read({ _id: id });
        let userDoc = userDocs[0];

        //verify we have both userId and userDoc 
        if(id && userDoc){
        //now delete the one doc
        let deletedUserDoc = await User.delete(userDoc);
        res.send({ message: "Delete was a success.", deletedUserDoc});
        }else{
            res.send({ message: "Could not find user"});
        }

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//make endpoint to link user and provider by userId and JSON object conataining providerId
app.put("/users/link/:userId", async(req, res) =>{
    //get userId from url
    let userId = req.params.userId;
    //get providerId from JSON
    let providerId = req.body._id;

    //read user and provider from database
    let userDoc = await User.read({ _id: userId });
    let providerDoc = await Provider.read({ _id: providerId });

    try{
        //if in database send update each with the other id
        if(userId && providerId.length > 0){
            let updateUserProvider = await User.linkUserProvider(userDoc[0],[providerDoc[0]]);
            res.send({ message: "Updated user with provider info successful.", updateUserProvider});
        }else{
            res.send({ message: "Could not find user or provider info"});
        }
    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//make endpoint to reset password with userId and JSON object containing temporary password
app.put("/users/resetpassword/:userId", async(req, res) => {
    //get userId from url
    let userId = req.params.userId;
    //get tempory password
    let tempPassword = req.body.UserPassword;

    try{
        //checking if userId and tempPassword is valid
        if(userId && tempPassword){
            //pull user from database and call method to reset password
            let userInfo = await User.read({ _id: userId });
            let resetPasswordDoc = await User.resetPassword(userInfo, tempPassword);
            res.send({ message: "User password has been reset.", resetPasswordDoc});

        }else{
            res.send({ message: "Could not find user info"});
        }

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//make endpoint to disable user account by userId.  This can also be used to reactivate a account.
app.put("/users/disableuser/:userId", async(req, res) => {
   
    //pulling the vairable from the url for userId
    let userId = req.params.userId;
    
    try{
        //check if userId is valid
        if(userId){
            let disableUser = await User.read({ _id: userId });
            let disableUserDoc = await User.disableAccount(disableUser[0]);

            //This toggles to show the output if the account has been disabled(true) or reactivate(false)
            if(disableUserDoc.Disabled){
                res.send({ message: "This user account has been disabled.", disableUserDoc});
            }else{
                res.send({ message: "This user account has been reactivated.", disableUserDoc});
            }
        }else{
            res.send({ message: "Could not find user info"});
        }
    }catch(err){
        console.log(err);
        res.send(err);
    }

});

//########################################################Provider Code##################################################################################

//Make endpoint that returns all providers
app.get("/providers", async(req, res) =>{

    try{
        //call function to read user database info
        let allProviderDocs = await Provider.read();
        res.send(allProviderDocs);

    }catch(err){
        //send error if unable to execute
        console.log(err);
        res.send(err);
    }
})

//Make endpoint that returns  providers by id
app.get("/providers/:providerId", async(req, res) =>{

    try{
        let id = req.params.providerId;
        //call function to read user database info
        let ProviderDocs = await Provider.read({ _id: id});
        let ProviderDoc = ProviderDocs[0];
        res.send(ProviderDoc);

    }catch(err){
        //send error if unable to execute
        console.log(err);
        res.send(err);
    }
})

//make endpoint to create a provider doc
app.post("/providers", async(req, res) => {

    try{ 
        //check to see if Provider info came through POST

    if( req.body.OrganizationName
        && req.body.Email
        && req.body.WebsiteInfo
        && req.body.PhoneNumber
        && req.body.Address
        && req.body.City
        && req.body.State
        && req.body.County
        ){
            let newProviderInfo = {
                OrganizationName: req.body.OrganizationName,
                Email: req.body.Email,
                WebsiteInfo: req.body.WebsiteInfo,
                PhoneNumber: req.body.PhoneNumber,
                Address: req.body.Address,
                City: req.body.City,
                State: req.body.State,
                County: req.body.County,
            }

            //now we create Provider doc and store in database
            let newProvider = await Provider.create(newProviderInfo);
            res.send({message: "Provider created successfully", newProvider});

        };
    }catch(err){
        console.log(err);
        res.send(err);
    }
});


//create a endpoint to update provider
app.put("/providers/:providerId", async(req, res) =>{
    try{
        //get the id to use
        let id = req.params.providerId;
        //now find the user doc
        let providerDocs = await Provider.read({ _id: id });
        let providerDoc = providerDocs[0];

        if(providerDoc){

             //look at the Post req.body for the data used to update this provider document
            let updateInfo = {};
            if(req.body.OrganizationName){
                updateInfo["OrganizationName"] = req.body.OrganizationName;
            }
            if(req.body.Email){
                updateInfo["Email"] = req.body.Email;
            }
            if(req.body.WebsiteInfo){
                updateInfo["WebsiteInfo"] = req.body.WebsiteInfo;
            }
            if(req.body.PhoneNumber){
                updateInfo["PhoneNumber"] = req.body.PhoneNumber;
            }
            if(req.body.Address){
                updateInfo["Address"] = req.body.Address;
            }
            if(req.body.City){
                updateInfo["City"] = req.body.City;
            }
            if(req.body.State){
                updateInfo["State"] = req.body.State;
            }
            if(req.body.County){
                updateInfo["County"] = req.body.County;
            }
            //add changedBy and changedDateTime to updateInfo
            updateInfo["changedBy"] = "Admin" //*************update to user who is authenticate */
            updateInfo["changedDateTime"] = Date();

            //update database for user
            let updatedProviderDoc = await Provider.update(providerDoc, updateInfo);
            res.send({ message: "Update User doc a success.", updatedProviderDoc});

        }else{
            res.send({ message: "Could not find user to be updated."});
        }

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//make endpoint to delete one provider by id
app.delete("/providers/:providerId", async(req, res) => {
    try{

        //get user id
        let id = req.params.providerId;
        
        //first find the one Provider doc
        let providerDocs = await Provider.read({ _id: id });
        let providerDoc = providerDocs[0];

        //verify we have both providerId and providerDoc 
        if(id && providerDoc){
        //now delete the one doc
        let deletedProviderDoc = await Provider.delete(providerDoc);
        res.send({ message: "Delete was a success.", deletedProviderDoc});
        }else{
            res.send({ message: "Could not find user"});
        }

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//make endpoint to link provider and user by providerId and JSON object conataining userId
app.put("/providers/link/:providerId", async(req, res) =>{
    //get providerId from url
    let providerId = req.params.providerId;
    //get userId from JSON
    let userId = req.body._id;

    //read provider and user from database
    let providerDoc = await Provider.read({ _id: providerId});
    let userDoc = await User.read({ _id: userId });

    try{
        //if in database send update each with the other id
        if(providerId && userId.length > 0){
            let updateProviderUser = await Provider.linkProviderUser(providerDoc[0],[userDoc[0]]);
            res.send({ message: "Updated provider with user info successful.", updateProviderUser});
        }else{
            res.send({ message: "Could not find user or provider info"});
        }
    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//make endpoint to link provider and servicesoffered by providerId and JSON object conataining servicesofferedId
app.put("/providers/linkservices/:providerId", async(req, res) =>{
    //get providerId from url
    let providerId = req.params.providerId;
    //get userId from JSON
    let servicesOfferedId = req.body._id;


    console.log(providerId);
    console.log(servicesOfferedId);

    //read provider and user from database
    let providerDoc = await Provider.read({ _id: providerId});
    let servicesOfferedDoc = await ServicesOffered.read({ _id: servicesOfferedId });

    try{
        //if in database send update each with the other id
        if(providerId && servicesOfferedDoc.length > 0){
            let updateProviderServicesOffered = await Provider.linkProviderServicesOffered(providerDoc[0],servicesOfferedDoc[0]);
            res.send({ message: "Updated provider with servicesoffered successful.", updateProviderServicesOffered});
        }else{
            res.send({ message: "Could not find provider or servicesoffered info"});
        }
    }catch(err){
        console.log(err);
        res.send(err);
    }
});



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~servicesoffered code~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Make endpoint that will create servicesoffered
app.post("/servicesoffered", async(req, res) => {

    try{ 
        //check to see if Servicesoffered info came through POST

    if( req.body.AvaliableBeds
        && req.body.TotalBeds
        && req.body.VolunteerOpportunities
        && req.body.VolunteersNeeded
        && req.body.ServiceType
        && req.body.ServicesDescription
        && req.body.CriteriaForService
        && req.body.WarmingStation
        ){
            let newServicesOfferedInfo = {
                AvaliableBeds:  req.body.AvaliableBeds,
                TotalBeds: req.body.TotalBeds,
                VolunteerOpportunities: req.body.VolunteerOpportunities,
                VolunteersNeeded: req.body.VolunteersNeeded,
                ServiceType: req.body.ServiceType,
                ServicesDescription: req.body.ServicesDescription,
                CriteriaForService: req.body.CriteriaForService,
                WarmingStation: req.body.WarmingStation,
            }

            //now we create ServicesOffered doc and store in database
            let newServicesOffered = await ServicesOffered.create(newServicesOfferedInfo);
            res.send({message: "ServicesOffered created successfully", newServicesOffered});

        };
    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//Make endpoint that returns all servicesoffered
app.get("/servicesoffered", async(req, res) =>{

    try{
        //call function to read user database info
        let allservicesofferedDocs = await ServicesOffered.read();
        res.send(allservicesofferedDocs);

    }catch(err){
        //send error if unable to execute
        console.log(err);
        res.send(err);
    }
})

//Make endpoint that returns servicesoffered by id
app.get("/servicesoffered/:servicesofferedId", async(req, res) =>{

    try{
        let id = req.params.servicesofferedId;
        //call function to read user database info
        let servicesOfferedDocs = await ServicesOffered.read({ _id: id});
        let servicesOfferedDoc = servicesOfferedDocs[0];
        res.send(servicesOfferedDoc);

    }catch(err){
        //send error if unable to execute
        console.log(err);
        res.send(err);
    }
})

//create a endpoint to update servicesoffered
app.put("/servicesoffered/:servicesofferedId", async(req, res) =>{
    try{
        //get the id to use
        let id = req.params.servicesofferedId;
        //now find the servicesoffered doc
        let servicesOfferedDocs = await ServicesOffered.read({ _id: id });
        let servicesOfferedDoc = servicesOfferedDocs[0];

        if(servicesOfferedDoc){

             //look at the Post req.body for the data used to update this provider document
            let updateInfo = {};
            if(req.body.AvaliableBeds){
                updateInfo["AvaliableBeds"] = req.body.AvaliableBeds;
            }
            if(req.body.TotalBeds){
                updateInfo["TotalBeds"] = req.body.TotalBeds;
            }
            if(req.body.VolunteerOpportunities){
                updateInfo["VolunteerOpportunities"] = req.body.VolunteerOpportunities;
            }
            if(req.body.VolunteersNeeded){
                updateInfo["VolunteersNeeded"] = req.body.VolunteersNeeded;
            }
            if(req.body.ServiceType){
                updateInfo["ServiceType"] = req.body.ServiceType;
            }
            if(req.body.ServicesDescription){
                updateInfo["ServicesDescription"] = req.body.ServicesDescription;
            }
            if(req.body.CriteriaForService){
                updateInfo["CriteriaForService"] = req.body.CriteriaForService;
            }
            if(req.body.WarmingStation){
                updateInfo["WarmingStation"] = req.body.WarmingStation;
            }
            //add changedBy and changedDateTime to updateInfo
            updateInfo["changedBy"] = "Admin" //*************update to user who is authenticate */
            updateInfo["changedDateTime"] = Date();

            //update database for user
            let updatedServicesOfferedDoc = await ServicesOffered.update(servicesOfferedDoc, updateInfo);
            res.send({ message: "Update ServicesOffered doc a success.", updatedServicesOfferedDoc});

        }else{
            res.send({ message: "Could not find user to be updated."});
        }

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//make endpoint to delete one servicesoffered by id
app.delete("/servicesoffered/:servicesofferedId", async(req, res) => {
    try{

        //get user id
        let id = req.params.servicesofferedId;
        
        //first find the one Provider doc
        let servicesOfferedDocs = await ServicesOffered.read({ _id: id });
        let servicesOfferedDoc = servicesOfferedDocs[0];

        //verify we have both providerId and providerDoc 
        if(id && servicesOfferedDoc){
        //now delete the one doc
        let deletedServicesOfferedDoc = await ServicesOffered.delete(servicesOfferedDoc);
        res.send({ message: "Delete was a success.", deletedServicesOfferedDoc});
        }else{
            res.send({ message: "Could not find user"});
        }

    }catch(err){
        console.log(err);
        res.send(err);
    }
})

////%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%bedtransaction code%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//Make endpoint that will create bedtransaction
app.post("/bedtransaction", async(req, res) => {

    try{ 

    if( req.body.UpdatedBedCount
        && req.body.UpdatingUserID
        && req.body.UpdatingProviderID
        && req.body.UpdatingServiceID
        ){
            
            for(let [key, value] of Object.entries(req.body)) {
            console.log(`req.body[${key}] = ${value}`);
            }

            let theUser = req.body.UpdatingUserID;
            let theProvider = req.body.UpdatingProviderID;
            let theServicesOffered = req.body.UpdatingServiceID;

            let userDoc = await User.read({ _id: theUser});
            let providerDoc = await Provider.read({ _id: theProvider});
            let servicesOfferedDoc = await ServicesOffered.read({ _id: theServicesOffered});
       
            console.log(userDoc[0]);
            console.log(providerDoc[0]);
            console.log(servicesOfferedDoc[0]);
            //now we create BedTransaction doc and store in database
            let newBedTransaction = await ServicesOffered.create(userDoc[0], providerDoc[0], servicesOfferedDoc[0], req.body.UpdatedBedCount);
            //res.send({message: "BedTransaction created successfully", newBedTransaction});

        };
    }catch(err){
        console.log(err);
        res.send(err);
    }
});

//Make endpoint that returns all bedtransaction
app.get("/bedtransaction", async(req, res) =>{

    try{
        //call function to read user database info
        let allbedtransactionDocs = await BedTransaction.read();
        res.send(allbedtransactionDocs);

    }catch(err){
        //send error if unable to execute
        console.log(err);
        res.send(err);
    }
})

//Make endpoint that returns bedtransactions by id
app.get("/bedtransactions/:bedtransactionId", async(req, res) =>{

    try{
        let id = req.params.bedtransactionId;
        //call function to read user database info
        let servicesBedtransactionIdDocs = await BedTransaction.read({ _id: id});
        let servicesBedtransactionIdDoc = servicesBedtransactionIdDocs[0];
        res.send(servicesBedtransactionIdDoc);

    }catch(err){
        //send error if unable to execute
        console.log(err);
        res.send(err);
    }
})



//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$provideruser code$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

//Make endpoint that returns all provideruser
app.get("/providerusers", async(req, res) =>{

    try{
        //call function to read provideruser database info
        let allprovideruserDocs = await ProviderUser.read();
        res.send(allprovideruserDocs);

    }catch(err){
        //send error if unable to execute
        console.log(err);
        res.send(err);
    }
})

//Make endpoint that returns bedtransactions by id
app.get("/providerusers/:provideruserId", async(req, res) =>{

    try{
        let id = req.params.provideruserId;
        //call function to read provideruser database info
        let provideruserIdDocs = await ProviderUser.read({ _id: id});
        let provideruserIdDoc = provideruserIdDocs[0];
        res.send(provideruserIdDoc);

    }catch(err){
        //send error if unable to execute
        console.log(err);
        res.send(err);
    }
})

app.post("/providerusers", async(req, res) =>{

    try{

        //check provideruser info
        if(req.body.UserId && req.body.ProviderId){
        //pull provider user info to be stored
        let userIdDoc = await User.read( {_id: req.body.UserId});
        let providerIdDoc = await Provider.read({ _id: req.body.ProviderId});

        //create provider user and store in provideruser table
        let linkProviderUser = await ProviderUser.create({UserId: userIdDoc[0]._id, ProviderId: providerIdDoc[0]._id});
        res.send(linkProviderUser);

        }else{
            res.send({message: "unable to add provideruser to database"});
        }


    }catch(err){
        //send error if unable to execute
        console.log(err);
        res.send(err);
    }
});
