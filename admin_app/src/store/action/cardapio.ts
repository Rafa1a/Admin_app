import { collection,doc,onSnapshot,getDocs,query, where, updateDoc, deleteDoc, arrayRemove,addDoc, arrayUnion, getDoc} from "firebase/firestore"; 
import { db } from '../auth';

import { setMessage } from "./message";
import { SET_CARDAPIO } from "./actionTypes";

//onSnapshot para atualizar caso alguma informacao mude 

export const startCardapio = () => {
  return (dispatch: any) => {
    try{
      const q = query(collection(db, "cardapio"));
      onSnapshot(q, (snapshot) => {
        const cities: any[] = [];
        snapshot.forEach((doc) => {
            cities.push(doc.data());
        });
        // if(cities.length === 1) {
        //   onDisplayNotification()
        // }
        console.log("cardapio onsnap")
        dispatch(fetchcardapio())
      }); 
    }catch (error) {
        // console.error('Erro ao adicionar item ao pedido:', error);
        dispatch(setMessage({
            title: 'Error',
            text: 'Ocorreu um erro o servidor do Cardapio'
          }))
      }
    
  };
};
// get em cardapio 
export const fetchcardapio =  () =>{
    return async (dispatch:any)=>{
      try {
        const q = collection(db, "cardapio");
        const querySnapshot = await getDocs(q);
        const cardapio = querySnapshot.docs.map((doc) => {
          const rawPedidos = doc.data();
          return {
            ...rawPedidos,
            id: doc.id
          };
        }); 
        dispatch(setCardapio(cardapio))
      } catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao contatar o servidor dos Cardapios'
        }))
      }
      ///////////ANTIGO  data base///////////
        // axios.get('/pedidos.json')
        // .catch(err => console.log(err))
        // .then((res:any) => {
            
        //     const rawPedidos = res.data
        //     const pedidos = []
        //     for (let key in rawPedidos) {
        //         pedidos.push({
        //             ...rawPedidos[key],
        //             id: key
        //         })
        //     }
        //     dispatch(setPedidos(pedidos))
        // })
    }
  }

  export const fetchatualizar_cardapio_onoroff = (id:any,onorof:Boolean) => {
    return async (dispatch:any)=>{
      try{
        const pedidoRef = doc(db, 'cardapio', id);
        await updateDoc(pedidoRef, {
          onorof: onorof
        });
      }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualizar estado do cardapio'
        }))
      }
      
    }
  }
  export const fetchatualizar_cardapio_estoque = (id:any,estoque:number) => {
    return async (dispatch:any)=>{
      try{
        const pedidoRef = doc(db, 'cardapio', id);
        await updateDoc(pedidoRef, {
          estoque: estoque
        });
      }catch (e) {
        // console.error("Error fetching documents: ", e);
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualizar estado do estoque'
        }))
      }
      
    }
  }
  export const fetchatualizar_cardapio_estoque_auto = (id:string, estoque:number, id_pedido:string) => {
    return async (dispatch:any) => {
      try {
        // Buscar o documento no Firebase
        const pedidoRef = doc(db, 'cardapio', id);
        const pedidoSnapshot = await getDoc(pedidoRef);
        const dadosPedido:any = pedidoSnapshot.data();
  
        // Obter o array atual de id_pedido ou inicializar um array vazio
        const idPedidoArray = dadosPedido.id_pedido || [];
  
        // Adicionar o novo id_pedido ao array usando arrayUnion
        const novoIdPedidoArray = arrayUnion(id_pedido, ...idPedidoArray);
  
        // Atualizar o documento com o novo array de id_pedido e o estoque
        await updateDoc(pedidoRef, {
          estoque: estoque,
          id_pedido: novoIdPedidoArray,
        });
        
        console.log('Estoque atualizado com sucesso');
      } catch (error) {
        // console.error('Erro ao atualizar estoque:', error);
        // Adicione tratamento de erro conforme necessário
        dispatch(setMessage({
          title: 'Error',
          text: 'Ocorreu um erro ao atualizar estado do estoque automatico'
        }))
      }
    };
  };
  
  //set cardapio para toda a aplicacao
export const setCardapio = (cardapio:any) =>{
    return { 
        type:SET_CARDAPIO,
        payload:cardapio
    }
} 