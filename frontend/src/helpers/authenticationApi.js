import {signUp, signIn, autoSignIn ,signOut} from 'aws-amplify/auth';

export async function handleSignUp({username, password, phone_number}){
    try{
        const {isSignUpComplete, userId, nextStep} = await signUp({
            username,
            password,
            // options:{
            //     userAttributes:{
            //         email,
            //         phone_number // E.164 number convention
            //     }
            // },
            // optional
            // autoSignIn: true, // auto sign-in after sign-up
        });
        console.log(userId);
        return {isSignUpComplete, userId, nextStep}; 
    } catch (error){
        console.log('error signing up:', error);
    }
}

export async function handleConfirmSignUp({username, confirmationCode}){
    try{
        const {isSignUpComplete, nextStep} = await confirmSignUp({
            username,
            confirmationCode
        });
        return {isSignUpComplete, nextStep};
    }catch (error){
        console.log('error confirming sign up', error);
    }
}

export async function handleSignIn({username, password}){
    console.log({username, password});
    try{
        const {isSignedIn, nextStep} = await signIn({username, password});
        return {isSignedIn, nextStep}
    } catch (error){
        console.log('error signing in', error);
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