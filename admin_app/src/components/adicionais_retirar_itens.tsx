/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { ListItem } from '@rneui/themed';
import React, { useState } from 'react';
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

  return (
  <>
    <TouchableOpacity onPress={()=> {
      setCheckbox2(!checkbox2)
      
      props.adicionais?props.handleItemToggleAdicionar(props.item):props.handleItemToggle_retirar(props.item)
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
            {`${props.adicionais? props.item.name : props.item} ${props.item.valor ? '+ '+props.item.valor : ''}`}
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



