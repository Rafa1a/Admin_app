import { Avatar, FAB, Icon } from '@rneui/themed';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions
} from 'react-native';
import Number from './Number'
import { HeaderPedidoProps } from '../interface/inter';
import { createAndOpenPDF } from '../store/action/html_pdf';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

 class Header_pedido extends React.Component<HeaderPedidoProps> {
  state = {
    loading: false,
  };
  handlePress = async (pedido_itens,array_pdf) => {
    try {
      this.setState({ loading: true });

      // Sua lógica de impressão e compartilhamento aqui
      await createAndOpenPDF(pedido_itens, array_pdf);

      // Simulando uma operação assíncrona
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Após a conclusão bem-sucedida, você pode redefinir o estado de carregamento
      this.setState({ loading: false });
    } catch (error) {
      // Lida com erros, se houver
      this.setState({ loading: false });
    }
  };
  render() {
    // condicao para definir avatar ou numero da mesa para mostrar no header
    const userormesa = this.props.numero_mesa ? (
      <Number number={this.props.numero_mesa} pedido_tamanho />
    ) : (
      <Avatar
        size={250}
        rounded
        source={this.props.image_on ? { uri: this.props.image_on } : undefined}
        icon={
          !this.props.image_on
            ? { name: 'account-circle', type: 'material-icons', color: '#E8F0FE' }
            : undefined
        }
        containerStyle={{
          width: 150,
          height: 150,
          margin: 10,
        }}
      />
    );
    //funcao para retornar id e ids de pedidos 
    const id_pedido = () => {
      const itens:any = this.props.pedidos.find(item => item.id === this.props.id)
      return itens.itens
    }
    const ids_pedido = () => {
      const filteredPedidos = this.props.pedidos.filter((item:any) => {
        return this.props.ids?.includes(item.id);
      });
    
      // Mapear apenas os itens da lista filtrada
      const allItens = filteredPedidos.flatMap((item) => item.itens);
    
      return allItens;
    };
    //retorna lista de pedidos tanto de mesa com varios pedidos em um unico numero de mesa ou um pedido de outros ou online
    const pedido_itens:any = this.props.adicionar?null:this.props.numero_mesa?ids_pedido():id_pedido()
    //array para uso no pdf html
    const array_pdf = [this.props.numero_mesa,this.props.pegar_local,this.props.rua,this.props.numero,this.props.dinheiro,this.props.cartao,this.props.pix]
    // console.log(array_pdf)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerTop}>
          <Text style={styles.textuser}>User :</Text>
         {this.props.adicionar? null:<FAB
            loading={this.state.loading}
            onPress={()=>this.handlePress(pedido_itens,array_pdf)}
            visible={true}
            icon={{ name: 'print', color: '#d6cecd' }}
            size="large"
            color='#3C4043'
            style={{ borderColor: 'tomato', borderWidth: 1, elevation: 15, shadowColor: 'tomato' }}
          />}
        </View>
        {userormesa}
        <Text style={styles.text}>{this.props.name_on}</Text>
        <View style={styles.container_info}>

          {this.props.rua || this.props.numero || this.props.pegar_local?
          <>
            <Text style={styles.highlightText}>Entrega :</Text>
          </>
          :null} 
          {this.props.rua ? (
            <Text style={styles.text_pagamento}>Rua: {this.props.rua}</Text>
          ) : null}

          {this.props.numero ? (
            <Text style={styles.text_pagamento}>Numero: {this.props.numero}</Text>
          ) : null}

          {this.props.pegar_local ? (
            <Text style={styles.text_pagamento}>Pegar no Local</Text>
          ) : null}

          {/* forma de pagamento */}
          {this.props.dinheiro || this.props.cartao || this.props.pix?
          <>
            <View style={styles.divider} />
            <Text style={styles.highlightText}>Forma de Pagamento :</Text>
          </>
          :null}

          {/* dinheiro */}
          {this.props.dinheiro ? (
            <Text style={styles.text_pagamento}>Dinheiro: ${this.props.dinheiro}</Text>
          ) : null}

          {/* cartao */}
          {this.props.cartao ? 
            <>
              {this.props.cartao.visa?
              <Text style={styles.text_pagamento}>Cartão: Visa</Text>:null}
              {this.props.cartao.mastercard?<Text style={styles.text_pagamento}>Cartão: Mastercard</Text>:null}
              {this.props.cartao.elo?<Text style={styles.text_pagamento}>Cartão: Elo</Text>:null}
            </>
           : null}

          {/* PIX */}
          {this.props.pix ? (
            <Text style={styles.text_pagamento}>Pix</Text>
          ) : null}
        </View>
        
        <View style={styles.divider} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTop: {
    width:'100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:'space-between'
  },
  textuser: {
    fontFamily: 'OpenSans-Bold',
    color: '#F4F7FC',
    fontSize: 35,
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    color: '#F4F7FC',
    fontSize: 20,
  },
  text1: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    color: '#F4F7FC',
    fontSize: 20,
  },
  text2: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    color: '#F4F7FC',
    fontSize: 20,
    textAlign: 'right',
  },
  divider: {
    width: '100%',
    borderBottomColor: '#F4F7FC',
    borderBottomWidth: 2,
  },
  highlightText: {
    fontFamily: 'Roboto-Regular',
    color: '#F4F7FC', // ou qualquer outra cor de destaque desejada
    fontSize: 25,
  },
  text_pagamento: {
    fontFamily: 'OpenSans-Regular',
    color: '#F4F7FC', // ou qualquer outra cor de destaque desejada
    fontSize: 20,
  },
  container_info: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
const mapStateProps = ({ pedidos }: { pedidos: any}) => {
  return {
    pedidos: pedidos.pedidos
  };
};

export default connect(mapStateProps)(Header_pedido)