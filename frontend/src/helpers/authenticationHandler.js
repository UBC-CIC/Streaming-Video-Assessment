import {signUp, signIn, autoSignIn ,signOut, getCurrentUser, confirmSignUp, fetchAuthSession} from 'aws-amplify/auth';

export async function handleSignUp({email, password}){
    try{
        const {isSignUpComplete, userId, nextStep} = await signUp({
            username: email,
            password,
            // optional
            // autoSignIn: true, // auto sign-in after sign-up
        });
        return {isSignUpComplete, userId, nextStep}; 
    } catch (error){
        if(error.name == "UsernameExistsException"){
            alert("A user already exists associated with that email.");
        }
        else alert(error.message);
        return {isSignUpComplete: false, userId: null, nextStep: null};
    }
}

export async function handleConfirmSignUp({email, confirmationCode}){
    try{
        const {isSignUpComplete, nextStep} = await confirmSignUp({
            username: email,
            confirmationCode
        });
        return {isSignUpComplete, nextStep};
    }catch (error){
        console.log('error confirming sign up', error);
        if(error.name == "EmptyConfirmSignUpCode"){
            alert("Please enter a confirmation code.");
        } else if(error.name == "CodeMismatchException"){
            alert("The confirmation code is incorrect.");
        
        }
        return {isSignUpComplete: false, nextStep: null};
    }
}

export async function handleSignIn({email, password}){
    try{
        const {isSignedIn, nextStep} = await signIn({username: email, password});
        return {isSignedIn, nextStep}
    } catch (error){
        // console.log('error signing in', error);
        if(error.name == "UserNotFoundException"){
            return {isSignedIn: false, nextStep:{signInStep:"CREATE_ACCOUNT"}};
        } else if(error.name == "NotAuthorizedException"){
            alert("Invalid email or password");
            return {isSignedIn: false, nextStep:null};
        }
    }
}

export async function handleAutoSignIn(){
    try{
        const signInOutput = await autoSignIn();
        // handle sign-in steps
    } catch (error){
        console.log(error);
    }
}

export async function handleSignOut(){
    try{
        await signOut();

        // can also sign out users from all devices by performing a global 
        // sign-out. This will also invalidate all refresh tokens issued 
        // to a user. The user's current access and ID tokens will remain 
        // valid on other devices until the refresh token expires 
        // (access and ID tokens expire one hour after they are issued).

        // await signout({global:true});
    } catch (error){
        console.log('error signing out', error);
    }
}

export async function checkUserSignInStatus(){
    try{
        const user = await getCurrentUser();
        console.log(user);
        return user;
    } catch (error){
        return null;
    }
}

export async function getJwtTokens(){
    try {
        const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
        return { accessToken, idToken };
      } catch (err) {
        console.log(err);
      }
}