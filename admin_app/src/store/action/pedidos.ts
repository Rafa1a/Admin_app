
import {SET_PEDIDOS,SET_PEDIDOS_MESA, SET_PEDIDOS_MESA_TRUE, SET_TOTALVALOR} from './actionTypes'
//auth
import { db } from '../auth';
import { collection,doc,onSnapshot,getDocs,query, where, updateDoc, deleteDoc, arrayRemove} from "firebase/firestore"; 
import { setMessage } from './message';
import { ItemProps } from '../../interface/inter';

//onSnapshot para atualizar caso alguma informacao mude 
export const startPedidosListener = () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "pedidos"));
      onSnapshot(q, (snapshot) => {
        const pedidos: any[] = [];
          snapshot.forEach((doc) => {
              const rawPedidos = doc.data();
              pedidos.push({...rawPedidos,
                id: doc.id}) 
            }); 
        // console.log(pedidos)
        // onDisplayNotification()
        pedidos.sort((a:any, b:any) => a.ordem - b.ordem)
        dispatch(setPedidos(pedidos));
        console.log("pedidos onsnap")
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


//chamada assyncrona com o firebase get () com QUERY e WHERE retornando uma consulta especifica

// export const fetchpedidos =  () =>{
//   return async (dispatch:any)=>{
//     try {
//       const q = query(collection(db, "pedidos"));
//       // const pedidosCol = collection(db, 'pedidos');
//       const querySnapshot = await getDocs(q);
//       const pedidos = querySnapshot.docs.map((doc) => {
//         const rawPedidos = doc.data();
//         return {
//           ...rawPedidos,
//           id: doc.id
//         };
//       }); 
//       pedidos.sort((a:any, b:any) => b.ordem - a.ordem)
//       // console.log("pedidossssssss")
      
//        dispatch(setPedidos(pedidos))
      
//     } catch (e) {
//       // console.error("Error fetching documents: ", e);
//       dispatch(setMessage({
//         title: 'Error',
//         text: 'Ocorreu um erro ao contatar o servidor dos Pedidos'
//       }))
//     }
//     ///////////ANTIGO  data base///////////
//       // axios.get('/pedidos.json')
//       // .catch(err => console.log(err))
//       // .then((res:any) => {
          
//       //     const rawPedidos = res.data
//       //     const pedidos = []
//       //     for (let key in rawPedidos) {
//       //         pedidos.push({
//       //             ...rawPedidos[key],
//       //             id: key
//       //         })
//       //     }
//       //     dispatch(setPedidos(pedidos))
//       // })
//   }
// }
// chamda apra atualizar o status_chapeiro
export const fetchatualizar_pedido = (id:any) => {
  return async (dispatch:any)=>{
    try{
      const pedidoRef = doc(db, 'pedidos', id);
      await updateDoc(pedidoRef, {
        status: true
      });
    }catch (e) {
      // console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar status do pedido'
      }))
    }
  }
}
// Excluir Pedido :
export const fetchExcluirPedido = (id:string) =>{
  return async (dispatch:any) => {
    try{
      const pedidoRef = doc(db, 'pedidos', id)
      await deleteDoc(pedidoRef)
    }catch (e) {
      // console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao excluir pedido'
      }))
    }
    
  }

}
/////////////////////////////MESA////////////////////////////////////
//Ecluir pedido Mesa :
export const fetchExcluirPedido_Mesa = (ids: string[]) => {
  return async (dispatch: any) => {
    // console.log(ids)
    try{
      for (const item of ids) {
        const pedidoRef = doc(db, 'pedidos', item);
        await deleteDoc(pedidoRef);
      }
    }catch (e) {
      // console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao excluir pedidos da Mesa'
      }))
    }
  };
};
// funcao excluir 1 item mesa
export const fetchExcluir_item = (id:any,item:ItemProps) =>{
  return async (dispatch: any) => {
    try{
      const pedidoRef = doc(db, 'pedidos', id);
      await updateDoc(pedidoRef, {
        itens: arrayRemove(item)
      });
    }catch (e) {
      // console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao excluir item'
      }))
    }
   
  }
}
// Atualizar pedidos ids MESA :
export const fetchatualizar_pedido_mesa = (ids:string[]) => {
  return async (dispatch:any)=>{
    try{
      for(const id of ids){
        const pedidoRef = doc(db, 'pedidos', id);
        await updateDoc(pedidoRef, {
        status: true
      });
      }
    }catch (e) {
      // console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao atualizar status do pedido'
      }))
    }
   
  }
} 
////////////////////////EXCLUIR TODOS OS PEDIDOS status===true////////////////////////////////////
// Ação assíncrona usando redux-thunk
export const deletePedidos = () => {
  return async (dispatch:any) => {
    try {
      const q = query(collection(db, 'pedidos'), 
        where('status', '==', true),
        where('status_chapeiro', '==', false),
        where('status_bar', '==', false),
        where('status_porcoes', '==', false)
      );

      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });

      await Promise.all(deletePromises);

      // console.log('Pedidos excluídos com sucesso');
      dispatch(setMessage({
        title: 'Sucesso',
        text: 'Limpeza Feita com sucesso'
      }))
    } catch (error) {
      // console.error('Erro ao excluir pedidos:', error);
      dispatch(setMessage({
        title: 'Error',
        text: 'Error ao tentar excluir itens,contate o suporte'
      }))
    }
  };
};

//adicionar list_ids pedidos numero mesa === numero mesa 
export const fetchadicionar_list_ids = (ids:string[],id:string) => {
  return async (dispatch:any)=>{
    try{
      const pedidoRef = doc(db, 'pedidos', id);
      await updateDoc(pedidoRef, {
        list_ids: ids
      });
    }catch (e) {
      // console.error("Error fetching documents: ", e);
      dispatch(setMessage({
        title: 'Error',
        text: 'Ocorreu um erro ao adicionar ids dos pedidos'
      }))
    }
   
  }
}
// definir no redux os pedidos ACTION
export const setPedidos =  (pedidos:any) => {
  return { 
      type:SET_PEDIDOS,
      payload:pedidos
  }

}
export const setPedidos_MESA = (pedidos_mesa:any) => {
  return { 
      type:SET_PEDIDOS_MESA,
      payload:pedidos_mesa
  }
}
export const setPedidos_MESA_status_true = (pedidos_mesa:any) => {
  return { 
      type:SET_PEDIDOS_MESA_TRUE,
      payload:pedidos_mesa
  }
}
export const setTotal_Valor = (total:number) => {
  return { 
    type:SET_TOTALVALOR,
    payload:total
}
}
/////////////////notificacao ///////////////////////////////////
import * as Notifications from 'expo-notifications';

async function onDisplayNotification() {
  try {
    // Solicitar permissões (necessário para iOS)
    await Notifications.requestPermissionsAsync();

    // Criar um canal (necessário para Android)
    const channelId = 'default';
    await Notifications.setNotificationChannelAsync(channelId, {
      name: 'Default Channel',
      importance: Notifications.AndroidImportance.HIGH,
    });

    // Exibir uma notificação
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Novo Pedido',
        body: 'Vamos começar!',
      },
      trigger: null, // para exibir imediatamente, ou você pode definir um gatilho específico
    });

    console.log('Notificação enviada com sucesso.');
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
  }
}


/////////////////////////////////////////////////////////////r
  


