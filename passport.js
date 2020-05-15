import User from './user.js'
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';

//expose various aspects of the passport in order to make use of its code
const JWTStrategy = passportJWT.Strategy;
const LocalStrategy = passportLocal.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

//first configure passport to use the local strategy for authentication (i.e the userId and password know to this system)

passport.use(new LocalStrategy({
    usernameField: "_id",
    passwordField: "UserPassword"
},
// in addition to providning the above JSON object telling which fields are for authentication,
//you must provide a function that will actually handle the authentication process.
async function(_id, UserPassword, callback){
    //actually check the Pesron's password and username
    try{                                    //first value is name of field second value is being passed in(Parameter)
        let theUserDocs = await User.read({_id: _id});
        let theUserDoc = theUserDocs[0];
        let authresult = await User.authenticate(theUserDoc, UserPassword);
        //authresult will be true or false: true if username and password if good false otherwise
        if(authresult){
            //login's good
            //call the next middlewear callback adn pass it the object representing the logged in Person
            return callback(null, theUserDoc, { message: "The User logged in successfully."});
        }else{
            //login attemp failed
            return callback(null, false, {message: "Incorrect username or password."})
        }
    }catch(err){
        console.log(err);
        (err) => callback(err);
    }
}
));

// now config passport to verify any generated JWTs
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'ThisNeedsToBeAStrongPasswordPleaseChange',  // I recommend taht ou use a key insted of a password.
},
    //provide a function that will verify any JWT
function (JWT, callback){
    //do any additional checking here in this function if needed
    // in this casen no other checks are being performed, but you might eant to consider other possible checks.
    return callback(null, JWT);
}
));