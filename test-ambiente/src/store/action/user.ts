
import axios from 'axios'
import {GET_USER} from './actionTypes'
import { Dispatch } from 'redux'
import { user_on } from '../../interface/inter'

import { collection, addDoc,setDoc,doc,onSnapshot,getDocs,query, where, updateDoc} from "firebase/firestore"; 
import { db } from '../auth';
import { setMessage } from './message';
// retornar users e Atualizar users redux [users]
export const fetchuser_get = () =>{
    return async(dispatch:Dispatch)=>{
        try {
            
            const usersCol = collection(db, 'user_on');
            const querySnapshot = await getDocs(usersCol);
            const users:any = querySnapshot.docs.map((doc) => {
              const rawUsers = doc.data();
              return {
                ...rawUsers,
                id: doc.id
              };
            }); 
            
            // console.log("users")
            dispatch(setUser(users))
            
          } catch (e) {
            dispatch(setMessage({
              title: 'Error',
              text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
            }))
          }

    /////////////ANTIGO database//////////////////
        // axios.get(`/user_on.json`)
        // .catch(err => console.log(err))
        // .then((res:any) => {
            
              
        //     const rawusers = res.data
        //     const users = []
        //     for (let key in rawusers) {
        //         users.push({
        //             ...rawusers[key],
        //             id: key
        //         })
        //     }
           
        //     dispatch(setUser(users))
        // })
    }
}

export const setUser =  (users:user_on[]) => {
    return { 
        type:GET_USER,
        payload:users
    }
    

}