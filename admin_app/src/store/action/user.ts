
import axios from 'axios'
import {GET_USER} from './actionTypes'
import { Dispatch } from 'redux'
import { user_on } from '../../interface/inter'

import { collection, addDoc,setDoc,doc,onSnapshot,getDocs,query, where, updateDoc} from "firebase/firestore"; 
import { db } from '../auth';
import { setMessage } from './message';


//onSnapshot para atualizar caso alguma informacao mude 
export const startUsers = () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "user_on"));
      onSnapshot(q, (snapshot) => {
        const users: any[] = [];
          snapshot.forEach((doc) => {
              const rawUsers = doc.data();
              users.push({...rawUsers,
                id: doc.id}) 
            }); 
        // console.log(pedidos)
        dispatch(setUser(users))
        console.log("users onsnap")
      }); 
    }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao contatar o servidor'
        }))
      }
   
  };
};
// // retornar users e Atualizar users redux [users]
// export const fetchuser_get = () =>{
//     return async(dispatch:Dispatch)=>{
//         try {
            
//             const usersCol = collection(db, 'user_on');
//             const querySnapshot = await getDocs(usersCol);
//             const users:any = querySnapshot.docs.map((doc) => {
//               const rawUsers = doc.data();
//               return {
//                 ...rawUsers,
//                 id: doc.id
//               };
//             }); 
            
//             // console.log("users")
//             dispatch(setUser(users))
            
//           } catch (e) {
//             dispatch(setMessage({
//               title: 'Error',
//               text: 'Ocorreu um erro ao contatar o servidor dos usuarios'
//             }))
//           }

   
//     }
// }
// limpeza
export const fetchAtualizarUserLimpeza = () => {
  return async (dispatch: any) => {
    try {
      // Buscar todos os documentos do user_func
      const usersQuerySnapshot = await getDocs(collection(db, 'user_func'));
      
      // Buscar todos os documentos do pedido
      const pedidoQuerySnapshot = await getDocs(collection(db, 'pedidos'));
      // Obter os IDs de pedidos existentes em todos os documentos do pedido
      const idsPedidoArray = pedidoQuerySnapshot.docs.map(doc => doc.id);

      // Iterar sobre cada documento do cardapio
      usersQuerySnapshot.forEach(async (userDoc) => {
        const userId = userDoc.id;

        // Buscar os IDs de pedidos existentes no documento do cardapio
        const idsChapeiroArray = userDoc.data()?.chapeiro || [];
        const idsBarArray = userDoc.data()?.bar || [];
        const idsPorcoesArray = userDoc.data()?.porcoes || [];

        // console.log(idsChapeiroArray)
        // console.log(idsBarArray)
        // console.log(idsPorcoesArray)
 
        // Filtrar os IDs de pedidos atuais para incluir apenas aqueles que existem no cardápio
        const idsExistentesNochapeiro = idsPedidoArray.filter((idPedido: string) =>
        idsChapeiroArray.includes(idPedido) 
        );
        const idsExistentesNobar = idsPedidoArray.filter((idPedido: string) =>
        idsBarArray.includes(idPedido) 
        );
        const idsExistentesNoporcoes = idsPedidoArray.filter((idPedido: string) =>
        idsPorcoesArray.includes(idPedido) 
        );
        // console.log(idsExistentesNochapeiro)
        // Atualizar o documento do user com o novo array de id_pedido
        await updateDoc(doc(db, 'user_func', userId), {
          chapeiro: idsExistentesNochapeiro,
          bar :idsExistentesNobar,
          porcoes :idsExistentesNoporcoes
        }); 

        // console.log(`Ids de Pedidos atualizado com sucesso para o users :  ${userId}`);
      });

      console.log('Atualização concluída para todos os users');
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      // Adicione tratamento de erro conforme necessário
      dispatch(
        setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualizar o estoque automaticamente',
        })
      );
    }
  };
};

//funcao para deslogar todos os users q estiver na mesa 
export const fetchAtualizarUser_status_mesa = (user_id:string) => {
  return async (dispatch: any) => {
    try {
      await updateDoc(doc(db, 'user_on', user_id), {
        status_mesa: false,
        mesa: 0
      }); 
    } catch (error) {
      // Adicione tratamento de erro conforme necessário
      dispatch(
        setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualziar user online',
        })
      );
    }
  }
}
export const setUser =  (users:user_on[]) => {
    return { 
        type:GET_USER,
        payload:users
    }
    

}