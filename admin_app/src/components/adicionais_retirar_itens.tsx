/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { ListItem } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,TouchableOpacity
} from 'react-native';


import { CheckBox } from '@rneui/themed';

export default (props: any) => {
  const [checkbox2, setCheckbox2] = useState(false);
  const [objeto, setObjeto] = useState({})

  useEffect(() => {
    if(props.versoes && props.index_check === props.index){
      
        // console.log('aki')
        setObjeto({
          id:props.item.id,
          name_p: props.item.name,
          categoria: props.item.categoria || '',
          categoria_2: props.item.categoria_2 || '',
          quantidade: props.quantity || 1 ,
          valor_p: props.item.valor
        })
      
    }

    // console.log(objeto)
  }, [checkbox2,props.quantity])
  
  useEffect(() => {
    if(props.versoes){
      props.setInicial_state_custom(objeto)
    }
  }, [objeto])

  //retirar check box ou adicionar dependendo do index
  useEffect(() => {
    // console.log(props.index_check,props.index)
    if(props.versoes){
      if(props.index_check === props.index){
        setCheckbox2(true)
      } else {
        setCheckbox2(false)
      }
    }
  }, [props.index_check, props.index])

  return (
  <>
    <TouchableOpacity onPress={()=> {
          // console.log('item',props.item)
          setCheckbox2(!checkbox2)

          props.versoes?props.setIndex_check(props.index):null

          props.adicionais 
          ? props.handleItemToggleAdicionar(props.item)
          : props.versoes
            ? props.setInicial_state_custom(objeto)
            : props.handleItemToggle_retirar(props.item)
    }}>

      <ListItem 
        containerStyle={{
        backgroundColor: '#E8F0FE',    
        borderRadius:25,
        margin:10}} 
        bottomDivider
        
      >
        <ListItem.Content>
          <ListItem.Title >
            {`${props.adicionais || props.versoes? props.item.name : props.item} ${props.versoes?'':props.item.valor ? '+ '+props.item.valor : ''}`}
          </ListItem.Title>
        </ListItem.Content>
        
          <ListItem.CheckBox
            size={15}
            checked={checkbox2}
            onPress={() => setCheckbox2(!checkbox2)}
            iconType="material-icons"
            checkedIcon="check-box"
            uncheckedIcon='check-box-outline-blank'
            wrapperStyle={{backgroundColor:'#F4F7FC'}}
            containerStyle={{backgroundColor:'#E8F0FE'}}
          />

      </ListItem>
    </TouchableOpacity>
  </>
  );
}

const styles = StyleSheet.create({
  
  title: {
    fontSize: 18,
    fontFamily:'OpenSans-Bold',
    color:'#F4F7FC'

  },
  subtittle:{
    fontSize: 12,
    fontFamily:'Roboto-Regular',
    color:'#F4F7FC',
    textAlign:'center',

  },
  estoque:{
    fontSize: 11,
    fontFamily:'Roboto-Regular',
    color:'#F4F7FC'
  },tabaccordion:{
    backgroundColor:'#F4F7FC',
    borderBottomWidth:1, 
    borderRadius:25,
    margin:5
  },
});



