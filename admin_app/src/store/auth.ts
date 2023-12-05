import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, initializeAuth } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
// foracar a chamada do getReactNativePersistence Pois não encontrava
import * as firebaseAuth from 'firebase/auth';
import { setMessage } from './action/message';
//capturando o reactinativePersistence     
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
        
            // initialize auth
      
 

const firebaseOptions = {
    apiKey: "AIzaSyCNOokyoPYIFTmjLyNNju0YNQ-VoSNagOI",
    authDomain: "madrugaotulio.firebaseapp.com", 
    databaseURL: "https://madrugaotulio-default-rtdb.firebaseio.com",
    projectId: "madrugaotulio",
    storageBucket: "madrugaotulio.appspot.com",
    messagingSenderId: "132031674201",
    appId: "1:132031674201:android:af64a34950974f87e7fe48",
    measurementId: "" 
  };

//auth de conta do firebase
  const app = initializeApp(firebaseOptions);
  const db = getFirestore(app);
  // const auth = getAuth(app);


//adicionando persistencia de Login
 const auth2 = initializeAuth(app, {
    persistence: reactNativePersistence(AsyncStorage),
  });




// const email = 'madrugao@com.br';
const email = 'admin@admin.com';
// const password = 'gynxeq4wIii61855TmpX';
const password = 'Nhyr7h_qFOVXgyEBPmU';
// funcao de autenticacao
export const auth_user = () => 
  
  signInWithEmailAndPassword(auth2, email, password)
    .then((userCredential:any) => {
      // Signed in 
      // const user = userCredential._tokenResponse.idToken;
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Authentication error: ', errorCode, errorMessage);
      setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao autenticar'
      })
    });

export { db };
