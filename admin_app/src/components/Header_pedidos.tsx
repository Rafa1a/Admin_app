import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert
} from 'react-native';
import { Button } from '@rneui/themed';
import { HeaderPedidosProps, pedido_inter } from '../interface/inter';
import { fetchMesas } from '../store/action/adicionar_pedido';
import { connect } from 'react-redux';
import List_mesas from './List_mesas';
import { deletePedidos } from '../store/action/pedidos';
import { fetchAtualizarCardapioIdPedidosLimpeza } from '../store/action/cardapio';
import { fetchAtualizarUserLimpeza } from '../store/action/user';
import { SafeAreaView } from 'react-native-safe-area-context';

// Header de Pedidos simples
const Header = ({ outros, online, mesa, navigation, onFetchMesas, mesas,onDelete_all, onAtualizar_is_pedidos_cardapio,onAtualizar_user_Limpeza }: HeaderPedidosProps) => {
  
  // busacar mesas no banco de dados
  useEffect(()=>{
    onFetchMesas();
    
  },[])
  // console.log(mesas)
  const [visible, setVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const toggleModal = () => {
    setVisible(!visible);
  };

  const handleSelectTable = (table:any) => {
    setSelectedTable(table);
  };
  const numero_mesa = mesas.sort((a:any, b:any) =>  a.numero_mesa - b.numero_mesa)
  //confirma caso tenha seleciona oo numero da mesa ou nao
  const confirmarSelecao = () => {
    if (selectedTable === null) {
      // Mostrar um alerta pedindo para escolher uma mesa
      Alert.alert('Escolha uma mesa', 'Por favor, escolha uma mesa antes de confirmar.');
    } else {
      // Salvar a mesa selecionada
      navigation?.navigate('Adicionar', { numero_mesa: selectedTable,mesa:mesa });
      setSelectedTable(null)
      toggleModal();
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        {outros ? 'Outros' : null}
        {online ? 'Online' : null}
        {mesa ? 'Mesa' : null}
      </Text>
      <Button
        size='md'
        radius='lg'
        type='outline'
        icon={{
          name: 'broom',
          type: 'font-awesome-5',
          size: 25,
          color: 'white',
        }}
        buttonStyle={{ borderColor: '#0E00E3', backgroundColor: '#2d2f31' }}
        onPress={async() => {
         await onDelete_all();
         await onAtualizar_is_pedidos_cardapio();
         await onAtualizar_user_Limpeza();
        }}
      />
      {outros ? (
        <Button
        size='md'
        radius='lg'
        type='outline'
        icon={{
          name: 'add',
          type: 'ionicons',
          size: 25,
          color: 'white',
        }}
        buttonStyle={{ borderColor: 'tomato', backgroundColor: '#2d2f31' }}
        onPress={() => {
          navigation?.navigate('Adicionar');
        }}
      />
      ) :null}

      {mesa? 
      <Button
        size='md'
        radius='lg'
        type='outline'
        icon={{
          name: 'add',
          type: 'ionicons',
          size: 25,
          color: 'white',
        }}
        buttonStyle={{ borderColor: 'tomato', backgroundColor: '#2d2f31' }}
          onPress={toggleModal}
      />:null}

      
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={toggleModal}
      >
        <SafeAreaView style={styles.container2}>
          <View style={styles.modalView}>
          <Text style={styles.title}>Selecione uma mesa</Text>
          <View style={styles.test}>
          <FlatList
            data={numero_mesa}
            keyExtractor={(item:any )=> `${item.id}`}
            renderItem={({ item,index })=> <List_mesas {...item} handleSelectTable={handleSelectTable} selectedTable={selectedTable}/>}
          />
          </View>
           <View style={styles.divider} /> 
          <View style={styles.buttons}>
            <Button
              title="Cancelar"
              onPress={() => {
                setSelectedTable(null)
                toggleModal();
              }}
            />
            <Button
              title="Confirmar"
              onPress={() => {
                // Salvar a mesa selecionada
                confirmarSelecao()

              }}
            />
          </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    height: '15%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'OpenSans-Bold',
    color: '#F4F7FC',
    fontSize: 50, // Defina o tamanho da fonte aqui
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex:1,
    maxHeight:'75%',
    width:'85%',
    backgroundColor: '#F4F7FC',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 10,
    shadowColor:"#F4F7FC"
  },
  title: {
    fontSize: 18,
    fontFamily:'OpenSans-Bold',
    marginBottom: 20,
  },
  scrollView: {
    marginBottom: 20,
  },
  tableButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    margin:10
  },
  tableText: {
    fontSize: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  buttons: {
    width:'100%',
    flexDirection:'row',
    justifyContent: 'space-between',
  },
test:{
  flex:1,
  width:'50%'
}
});
const mapStateProps = ({ pedidos }: { pedidos: any }) => {
  return {
    mesas:pedidos.mesas
  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onFetchMesas : () => dispatch(fetchMesas()),
    onDelete_all:() => dispatch(deletePedidos()),
    onAtualizar_is_pedidos_cardapio:()=>dispatch(fetchAtualizarCardapioIdPedidosLimpeza()),
    onAtualizar_user_Limpeza:()=>dispatch(fetchAtualizarUserLimpeza())
  };
};
export default connect(mapStateProps,mapDispatchProps)(Header)
