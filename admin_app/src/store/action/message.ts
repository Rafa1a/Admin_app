import { message } from './../../interface/inter_actions';
import { SET_DATA_FECHADO_ABERTO, SET_FECHADO_ABERTO, SET_MESSAGE, SET_MODAL_FECHADO_ABERTO } from './actionTypes';
import { db } from '../auth';
import { arrayUnion, collection,doc,onSnapshot, query, updateDoc,  } from 'firebase/firestore';

export const setMessage = (message:message) => {
    return {
        type: SET_MESSAGE,
        payload: message
    }
}
export const setFechado_aberto = (fechado_aberto:any) => {
    return {
        type: SET_FECHADO_ABERTO,
        payload: fechado_aberto
    }
}

export const startfechado_aberto = () => {
    return (dispatch: any) => {
      try{
        const q = query(collection(db, "loja"));
        onSnapshot(q, (snapshot) => {
          const item: any[] = [];
          snapshot.forEach((doc) => {
              // console.log(doc.id)
              const rawitem = doc.data();
              item.push({...rawitem,
                id: doc.id}) 
            }); 
            
            dispatch(setFechado_aberto(item[0]))
            console.log("fechado_aberto onsnap")
  
          });
          
      }catch (error) {
          // console.error('Erro ao adicionar item ao pedido:', error);
          dispatch(setMessage({
              title: 'Error',
              text: 'Ocorreu um erro o servidor do loja'
            }))
        }
      
    };
  };

  //alterar fechado_aberto
  export const Loja_up = (id:string,fechado_aberto:any,data_fechado_aberto:any) => {
    return async(dispatch: any) => {
      try{
        const lojaRef = doc(db, "loja", id);
        await updateDoc(lojaRef, {
            fechado_aberto: fechado_aberto,
            data_fechado_aberto:data_fechado_aberto
        });
      }catch (error) {
        console.error('Erro ao adicionar item ao pedido:', error);
        dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro o servidor do loja'
          }))
      }
    }
  };