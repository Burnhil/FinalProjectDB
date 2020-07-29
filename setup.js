import './dbconnection.js'; 
import User from './user.js';


// To set up the Admin account run the following command node setup.js
// This will create the Admin account and will print to console the UserId and UserPassword
const setup = async() =>{

    //system date to be stored
    let today = Date();

    //first user info to be stored
    let adminUser = {
        FirstName: 'Admin',
        LastName: 'User',
        Organization: 'AmarilloCollege',  
        PhoneNumber: '806-371-5000',        
        Email: 'askac@actx.edu',       
        UserType: 'Admin',
        UserId: 'AcAdmin',
        UserPassword: "", 
        Salt: "",
        LastLogin: today,    
        Disabled: false 
    }

    try{
        //setting up password to be hashed to be stored with salt
        let adminPassword = "2020CodeAcademy";
        let hashPassword = await User.newUserPasswordHash(adminPassword);
        adminUser.UserPassword= hashPassword.encryptedString;
        adminUser.Salt = hashPassword.Salt;
        //console.log(hashPassword);

        //actually create the Admin account 
        let firstAdmin = await User.create(adminUser);
        //console.log(firstAdmin);
        //console log the Admin account UserId and Password to be used
        console.log(`The Admin account has been created with the following (UserId: ${firstAdmin.UserId}) and the following (password = ${adminPassword})`);
    }catch(err){
        console.log(err);
    }
}

setup();