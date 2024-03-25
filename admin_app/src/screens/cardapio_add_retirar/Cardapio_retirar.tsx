/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button } from '@rneui/themed';
import React from 'react';
import {
    FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { fetchretirar_cardapio } from '../../store/action/cardapio';


const Cardapio_retirar = (props: any) => {
    // Ordena o array cardapio em ordem alfabética
    const cardapioOrdenado = [...props.cardapio].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <SafeAreaView style={styles.container}>
                <Text style={{color:'#fff', fontSize: 20, textAlign:'center', margin: 10}}>Cuidado! retirar é permanente</Text>
            <FlatList
                data={cardapioOrdenado}
                renderItem={({item}) => (
                    <View style={{flexDirection:'row', justifyContent:'space-evenly',backgroundColor:'#3C4043'}}> 
                        <Text style={{width:'50%',color:'#fff'}}>{item.name}</Text>
                        <TouchableOpacity style={{backgroundColor:'#E81000', width:'15%',padding:7}} onPress={() => props.onRetirar_item(item.id)}>
                            <Text style={{textAlign:'center', color:'#fff'}}>Retirar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{backgroundColor:'#DE6F00', width:'15%',padding:7}} onPress={()=>props.navigation.navigate('Cardapio_add',{editar:true,id:item.id})}>
                            <Text style={{textAlign:'center', color:'#fff'}}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{backgroundColor:'#0E00E3', width:'16%',padding:7}} onPress={()=>props.navigation.navigate('Versao',{editar:true,id:item.id})}>
                            <Text style={{textAlign:'center', color:'#fff'}}>Versão</Text>
                        </TouchableOpacity>

                    </View>
                )}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={{height:1, backgroundColor:'#fff'}}></View>}
                />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor: '#202124',
      },
});
const mapStateToProps = ({cardapio }: {cardapio:any }) => {
  return {
    cardapio: cardapio.cardapio
  }
}
const mapDispatchToProps = (dispatch: any) => {
    return {
        onRetirar_item: (id: any) => dispatch(fetchretirar_cardapio(id)),
    }
    }
export default connect(mapStateToProps,mapDispatchToProps)(Cardapio_retirar)