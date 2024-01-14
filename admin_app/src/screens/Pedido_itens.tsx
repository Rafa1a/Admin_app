import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header_pedido from '../components/Header_Pedido';
import Lista from '../components/Lista_Pedido'
import { connect } from 'react-redux';
import {fetchadicionar_list_ids, fetchatualizar_pedido, fetchatualizar_pedido_mesa} from '../store/action/pedidos' 
import { pedido_itens_comp } from '../interface/inter';
import { SafeAreaView } from 'react-native-safe-area-context';


 const Pedido_itens = (props:pedido_itens_comp) =>{


    const [loading, setLoading] = React.useState(false);
   
    const { numero_mesa, image_on, name_on, id, ids, rua, numero, pegar_local,dinheiro,pix,cartao } = props.route.params;
    const atualizar_pedido = async() => {
      await props.onAtualizarPedido(id)
      // props.navigation?.navigate('Pedidos')
    }
    const atualizar_pedido_mesa =async () =>{
      await props.onAtualizarPedido_Mesa(ids)
    }
    const atualizar_escolha = numero_mesa?atualizar_pedido_mesa:atualizar_pedido
    // list_ids mesa status === true
    const adicionar_list_ids = async() => {
      const numero_mesa__pedidos_mesa = props.pedidos_mesa.find((pedido) => pedido.numero_mesa === numero_mesa);
      // console.log(numero_mesa__pedidos_mesa.ids)
      numero_mesa__pedidos_mesa.ids.forEach(async(id) => {
          await props.onAdicionar_list_ids(numero_mesa__pedidos_mesa.ids, id);
        });
    }
    ///////////////////////////////////////////////////
    return(
    <SafeAreaView style={styles.container}>
     <ScrollView style={styles.scroll}>
      {/* header q recebe o numero se tiver image se tiver e name do user se tiver */}
      <Header_pedido 
      id={id}
      ids={ids}
      numero_mesa={numero_mesa} 
      image_on={image_on} 
      name_on={name_on} 
      rua={rua}
      numero={numero}
      pegar_local={pegar_local}
      dinheiro={dinheiro}
      pix={pix}
      cartao={cartao}
      />
      {/*recebe o id depois faz um find em pedidos qual id === id_pedidos*/}
      <Lista id={id} numero_mesa={numero_mesa} ids={ids}/> 
      {/* botao para atualizar o status_$ do PEDIDO */}
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalValue}>${props.total}</Text>
      </View>
      <View style={styles.divider} />
      <TouchableOpacity onPress={async() => {
        setLoading(true)
        await atualizar_escolha()
        if(numero_mesa){
          await adicionar_list_ids()
        }
        setLoading(false)
        props.navigation?.goBack()
        
      }}  style={styles.button}>
            {loading ? <Text style={styles.buttonText}>Carregando...</Text> : <Text style={styles.buttonText}>Atualizar</Text>}
      </TouchableOpacity>
      
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"#252A32",
    width: '100%',
  },
  scroll: {
    flex:1,
    width: '100%',
  },
  button: {
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'tomato',
    padding: 10,
    height:160,
    width:160,
    borderRadius: 100,
    margin: 5,
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#DE6F00',
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
        color: '#F4F7FC',
        fontSize: 30,
    textAlign: 'center',
  },
  divider: {
    borderBottomColor: '#F4F7FC',
    borderBottomWidth: 0.5,
    width: '100%',
    marginBottom:10
},
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-end',
    width: '90%',
    marginBottom: 10,
  },
  totalText: {
    fontFamily: 'RobotoMono-Bold',
    color: '#F4F7FC',
    fontSize: 30,
  },
  totalValue: {
    fontFamily: 'RobotoMono-Bold',
    color: '#F4F7FC',
    fontSize: 50,
  },
});
const mapStateProps = ({ pedidos }: { pedidos: any}) => {
  return {
    total: pedidos.total,
    pedidos: pedidos.pedidos,
    pedidos_mesa:pedidos.pedidos_mesa

  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAtualizarPedido: (id:any) => dispatch(fetchatualizar_pedido(id)),
    onAtualizarPedido_Mesa: (ids:any) => dispatch(fetchatualizar_pedido_mesa(ids)),
    onAdicionar_list_ids: (ids:string[],id:string) => dispatch(fetchadicionar_list_ids(ids,id)),
  };
};

export default connect(mapStateProps,mapDispatchProps)(Pedido_itens)