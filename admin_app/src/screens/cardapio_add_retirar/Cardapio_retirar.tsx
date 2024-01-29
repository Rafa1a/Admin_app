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
                        <Text style={{width:'70%',color:'#fff'}}>{item.name}</Text>
                        <Button title='Retirar' onPress={() => props.onRetirar_item(item.id)}/>
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