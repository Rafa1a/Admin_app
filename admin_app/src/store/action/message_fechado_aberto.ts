import { db } from '../auth';
import {  collection,doc,onSnapshot, query, updateDoc,  } from 'firebase/firestore';
import { setFechado_aberto, setMessage } from './message';


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
              text: 'Ocorreu um erro o servidor da loja'
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
            text: 'Ocorreu um erro o servidor da loja'
          }))
      }
    }
  };