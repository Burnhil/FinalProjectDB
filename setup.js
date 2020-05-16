import './dbconnection.js'; 
import User from './user.js';


// To set up the Admin account run the following command node setup.js
// This will create the Admin account and will print to console the UserId and UserPassword
const setup = async() =>{

    let today = Date();

    let adminUser = {
        FirstName: 'Admin',
        LastName: 'User',
        Organization: 'AmarilloCollege',  
        PhoneNumber: '806-371-5000',        
        Email: 'askacWactx.edu',       
        UserType: 'Admin',
        UserId: 'AcAdmin',
        UserPassword: "", 
        salt: "",
        LastLogin: today,    
        Disabled: false 
    }

    try{
        let adminPassword = "2020CodeAcademy";
        let hashPassword = await User.newUserPasswordHash(adminPassword);
        adminUser.UserPassword= hashPassword.encryptedString;
        adminUser.salt = hashPassword.salt;
        //console.log(hashPassword);

        let firstAdmin = await User.create(adminUser);
        //console.log(firstAdmin);
        console.log(`The Admin account has been created with the following (UserId: ${firstAdmin.UserId}) and the following (password = ${adminPassword})`);
    }catch(err){
        console.log(err);
    }
}

setup();