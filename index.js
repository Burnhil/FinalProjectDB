// bring in the MongoDB Connection import
import './dbconnection.js'; // Since we don't need to refer back to this particular import, there's no need for a name or the "from" keyword
// Import the entity to test
import User from './administration.js';
import Provider from './provider.js';
import ServicesOffered from './servicesoffered.js';
import BedTransaction from './bedtransaction.js';

const main = async() => {

    let aNewUser = {
        FirstName: 'Mike',
        LastName: 'Sanders',
        Oraganization: 'Bed and Blankets',  
        PhoneNumber: '806-214-9852',        
        Email: 'something@gmail.com',       
        UserType: 'Provider',
        UserPassword: '***********',        
        LastLogin: "02/02/2020",
        Diabled: true 
    }
    
    let aNewProvider = {
  
        OrganizationName: "Happy Times",
        Email: "wellhome@yahoo.com",
        WebsiteInfo: "safeharbor.com",
        PhoneNumber: "806-258-9632",
        Address: "2547 Maple",
        City: "Amarillo",
        State: "Texas",
        County: "Potter"
    }

    try {

        let addUserDoc = await User.create(aNewUser);
        let addProviderDoc = await Provider.create(aNewProvider);

        let updateUserProviderInfo = await User.linkUserProvider(addUserDoc,[addProviderDoc]);


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