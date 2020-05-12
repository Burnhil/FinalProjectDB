// bring in the MongoDB Connection import
import './dbconnection.js'; // Since we don't need to refer back to this particular import, there's no need for a name or the "from" keyword
// Import the entity to test
import User from './user.js';
import Provider from './provider.js';
import ServicesOffered from './servicesoffered.js';
import BedTransaction from './bedtransaction.js';
import ProviderOrganization from './providerorganization.js';
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const main = async() => {

    let aNewUser = {
        FirstName: 'Elisha',
        LastName: 'Watt',
        Oraganization: 'Sleep on the Floor',  
        PhoneNumber: '806-258-9874',        
        Email: 'sleepytime@gmail.com',       
        UserType: 'Provider',
        UserId: 'eewatt',
        UserPassword: '1234Fun',        
        LastLogin: "02/02/2020",
        Diabled: false 
    }

    let userPassword = "april";
    
    let aNewProvider = {
  
        OrganizationName: "Sleep Anywhere",
        Email: "sleepAnywhere@yahoo.com",
        WebsiteInfo: "sleepanywhere.com",
        PhoneNumber: "806-258-2587",
        Address: "1800 no where drive",
        City: "Amarillo",
        State: "Texas",
        County: "Potter"
    }

    let aNewSericesOffered = {
        AvaliableBeds: 47,
        TotalBeds: 87,
        VolunteerOpportunities: 5,
        VolunteersNeeded: 3,
        ServiceType: "something awesome goes here",
        ServicesDescription: "lets help people",
        CriteriaForService: "shirt shoes sox",
        WarmingStation: "no"

    }

    let aNewProOr = {
    
        ProviderId: "5eb85918ed99bd73e4b97935",
        UserId: "5eb85918ed99bd73e4b97934"
          
    }

    try {

        // //test code for bcrypt
         let saltRounds = 10;
         let tempPass = "5821487";
        let tempPass2 = "111111111";
        

        bcrypt.hash(tempPass, saltRounds).then(function(hash) {

        console.log(`temp pass is now stored as hashTemp ${hash}`);
        });
        //     let hashTempPass = hash;


        //     async function checkUser(username, password) {
                
             
        //         const match = await bcrypt.compare(tempPass, hashTempPass);
        //         console.log(match);
        //         if(match) {
        //             console.log("Yes they do!");
        //         }
             
         
        //    }

        //     let yes = 12;
        //     let no = 11;
        //     checkUser(yes,no);
        // });


        //let addUserDoc = await User.create(aNewUser);
        //let addProviderDoc = await Provider.create(aNewProvider);

        //console.log(addUserDoc);
        //let checkPassword = await User.verifyLogin(addUserDoc, userPassword);

        //let updatedProviderUser = await Provider.linkProviderUser(addProviderDoc, [addUserDoc]);
        //let addServicesOfferedDoc = await ServicesOffered.create(aNewSericesOffered);

        //let proservDoc = await Provider.linkProviderServicesOffered(addProviderDoc,addServicesOfferedDoc);
        


        /*
        // Make a new Person
        let newServicesOfferedDoc = await BedTransaction.create(aNewBedTransaction);
        // For the above line, assuming that awaiy works on a successful Promise returned from Person.create(), it will store the actual newly created Person document in newPersonDoc
        //console.log({ message: "New servicesoffered doc created", newServicesOfferedDoc });

        // read all Person docs
        let allServicesDoc = await BedTransaction.read();
        console.log({ message: "All servicesDoc", allServicesDoc });

        // do an update on the first return Person doc
        let firstUserDoc = allServicesDoc[0];  // the first Person doc
        let updatedProviderDoc = await BedTransaction.update(firstUserDoc, { CurrentBedCount: 7 });
        console.log({ message: "Updated service  doc successful.", updatedProviderDoc });

        // read on a filter.  NOTE: to filter by id, use { _id: yourId }
        let userDocs = await BedTransaction.read({ UpdatedBedCount: 11 });
        console.log({ message: "Reading all User docs successful.", userDocs });

        // Now delete the John Smith created up above (in newPersonDoc)
        let deletedDoc = await BedTransaction.delete(newServicesOfferedDoc);
        console.log({ message: "Service doc successfully deleted.", deletedDoc });
        */

    } catch (err) {
        console.log(err);
    }
    
}; 

main();