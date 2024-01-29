import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchatualizar_cardapio_estoque, fetchatualizar_cardapio_onoroff } from '../store/action/cardapio';
import { Avatar, Icon, ListItem, Tab, TabView } from '@rneui/themed';
import Estoque_list from '../components/Estoque_list';
import { cardapio, estoque_screen } from '../interface/inter_cardapio';
import { SafeAreaView } from 'react-native-safe-area-context';


function Estoque(props: estoque_screen) {
  // index da tab 
  const [index, setIndex] = React.useState(0);
  // controle expansão do ListItem.Accordion
  const [expanded, setExpanded] = React.useState(false);
  const [expanded2, setExpanded2] = React.useState(false); 
  const [expanded3, setExpanded3] = React.useState(false); 

  useEffect(() => {
    const func_estoque =async()=>{
      const cardapio_bebidas = props.cardapio.filter((item:any)=> item.categoria === 'bebidas')
      // console.log(cardapio_bebidas[4].estoque)
      for (let i = 0; i < cardapio_bebidas.length; i++) {
        const item = cardapio_bebidas[i]; 
        // funcao caso o estoque seja 0 atualizar o onorof para false, retiraando o item do ar automaticamente  
        // console.log('nome',item.name)
        // console.log('estoque',item.estoque)
        if (item.estoque <= 0) {
          await props.onAtualizar_onorof(item.id, false);
          await props.onAtualizar_estoque(item.id,-1)
          console.log(item.estoque)
        } 
      } 
    }
    func_estoque() 
  
  }, [props.cardapio]);
   

  // retirar categoria repetidas
  const uniqueCategories = [...new Set(props.cardapio.map((item: any) => item.categoria))];
 
  //separar e filtrar
  const bebidas = props.cardapio.filter((item:any) =>item.categoria === 'bebidas')
  const comidas = props.cardapio.filter((item:any) =>item.categoria === 'comidas')
  const bar = props.cardapio.filter((item:any) =>item.categoria === 'bar')
  //categoria do flatlist do ListItem.Accordion
  const categoria_Bebidas = ['no-alcool','alcool']
  const categoria_comidas = ['lanches','hotdogs','porcoes']
  const categoria_bar = ['drinks','sucos']
  
  //return componente
  return (
    <SafeAreaView style={styles.container}>
      {/* tab para navegacao entre as 3 pricnipais categorias*/}
      <Tab 
        dense
        value={index} onChange={(e) => setIndex(e)} 
        variant="primary"
        indicatorStyle={{
          backgroundColor: '#E8F0FE',
          height: 3
        }}
        buttonStyle={{
          backgroundColor: '#2D2F31',
        }}
        titleStyle={{
          fontFamily:'OpenSans-Bold',
          color:'#F4F7FC'
        }}
      >
        {uniqueCategories.map((category: any, index: number) => {
          let categoryName = '';
          if (category === 'comidas') {
            categoryName = 'Comidas';
          } else if (category === 'bar') {
            categoryName = 'Bar';
          } else if (category === 'bebidas') {
            categoryName = 'Bebidas';
          }
          return (
            
            <Tab.Item key={index} title={categoryName}  />
          );
        })}
      </Tab>
      
      <TabView value={index} onChange={setIndex} animationType="spring" >
        {/*criacao da 1 tabview Bebidas */}
        <TabView.Item style={{width: '100%' }}>
          {/*flatlist do accordion Bebidas */}
          <FlatList
              data={categoria_Bebidas}
              keyExtractor={(item,index) => `${index}`}
              renderItem={({ item,index }) =>  {
                
                if(item === 'no-alcool'){
                  
                return (
                    
                <ListItem.Accordion 
                  content={
                    <ListItem.Content >
                      <ListItem.Title style={styles.title}>Alcoolicas</ListItem.Title>
                      <ListItem.Subtitle style={styles.subtittle}>Cervejas</ListItem.Subtitle >
                    </ListItem.Content>
                  }
                  isExpanded={expanded}
                  onPress={() => {
                    setExpanded(!expanded);
                    setExpanded2(false)
                    setExpanded3(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                  {/* flatlist dos itens do cardapio === alcool*/} 
                  <FlatList
                    data={bebidas.filter((item:any)=> item.categoria_2 === 'alcool')}
                    keyExtractor={(item,index) => `${index}`}
                    renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item} estoq/>}
                  />
                </ListItem.Accordion>)
                }else if(item === 'alcool'){
                  return (
                  <ListItem.Accordion
                    content={
                      <ListItem.Content>
                        <ListItem.Title style={styles.title}>No-Alcool</ListItem.Title>
                        <ListItem.Subtitle style={styles.subtittle}>Refrigerantes</ListItem.Subtitle>
                      </ListItem.Content>
                    }
                    isExpanded={expanded2}
                    onPress={() => {
                      setExpanded2(!expanded2);
                      setExpanded(false)
                      setExpanded3(false)
                    }}
                    containerStyle={styles.tabaccordion}
                  >
                  {/* flatlist dos itens do cardapio === no-alcool*/} 
                    <FlatList
                      data={bebidas.filter((item:any)=> item.categoria_2 === 'no-alcool')}
                      keyExtractor={(item,index) => `${index}`}
                      renderItem={({ item,index }) =>  (
                      <Estoque_list 
                        onAtualizar_onorof={props.onAtualizar_onorof}
                        onAtualizar_estoque={props.onAtualizar_estoque}
                        {...item} 
                        estoq
                      />)}
                    />
                  </ListItem.Accordion>
                  )
                }
                return  null
              }}
          />
        </TabView.Item>
        {/*criacao da 2 tabview comidas */}
        <TabView.Item style={{  width: '100%' }}>
          {/*flatlist do accordion comidas */}
          <FlatList
            data={categoria_comidas}
            keyExtractor={(item,index) => `${index}`}
            renderItem={({ item,index }) =>  {
              
              if(item === 'lanches'){
                
              return (
              <ListItem.Accordion
                content={
                  <ListItem.Content>
                    <ListItem.Title style={styles.title}>Lanches</ListItem.Title>
                  </ListItem.Content>
                }
                isExpanded={expanded}
                onPress={() => {
                  setExpanded(!expanded);
                  setExpanded2(false)
                  setExpanded3(false)
                }}
                containerStyle={styles.tabaccordion}
              >
                  {/* flatlist dos itens do cardapio === lanches*/} 

                <FlatList
                  data={comidas.filter((item:any)=> item.categoria_2 === 'lanches')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                />
              </ListItem.Accordion>)
              }else if(item === 'hotdogs'){
                return (
                <ListItem.Accordion
                  content={
                    <ListItem.Content>
                      <ListItem.Title style={styles.title}>Hot Dogs</ListItem.Title>
                    </ListItem.Content>
                  }
                  isExpanded={expanded2}
                  onPress={() => {
                    setExpanded2(!expanded2);
                    setExpanded(false)
                    setExpanded3(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                {/* flatlist dos itens do cardapio === hotdogs*/} 
                <FlatList
                  data={comidas.filter((item:any)=> item.categoria_2 === 'hotdogs')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                />
                </ListItem.Accordion>
                )
              }else if (item === 'porcoes'){
                return (
                <ListItem.Accordion
                  content={
                    <ListItem.Content>
                      <ListItem.Title style={styles.title}>Porções</ListItem.Title>
                    </ListItem.Content>
                  }
                  isExpanded={expanded3}
                  onPress={() => {
                    setExpanded3(!expanded3);
                    setExpanded(false)
                    setExpanded2(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                {/* flatlist dos itens do cardapio === porcoes*/} 
                <FlatList
                  data={comidas.filter((item:any)=> item.categoria_2 === 'porcoes')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                />
                </ListItem.Accordion>
                )
              }
              return  null
            }}
          />
        </TabView.Item>
        {/*criacao da 3 tabview bar */}
        <TabView.Item style={{width: '100%' }}>
          <FlatList
            data={categoria_bar}
            keyExtractor={(item,index) => `${index}`}
            renderItem={({ item,index }) =>  {
              
              if(item === 'drinks'){
                
              return (
              <ListItem.Accordion
                content={
                  <ListItem.Content>
                    <ListItem.Title style={styles.title}>Alcoolicas</ListItem.Title>
                    <ListItem.Subtitle style={styles.subtittle}>Drinks</ListItem.Subtitle>
                  </ListItem.Content>
                }
                isExpanded={expanded}
                onPress={() => {
                  setExpanded(!expanded);
                  setExpanded2(false)
                  setExpanded3(false)
                }}
                containerStyle={styles.tabaccordion}
              >
              {/* flatlist dos itens do cardapio === drinks*/} 
              <FlatList
                data={bar.filter((item:any)=> item.categoria_2 === 'drinks')}
                keyExtractor={(item,index) => `${index}`}
                renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
              />
              </ListItem.Accordion>)
              }else if(item === 'sucos'){
                return (
                <ListItem.Accordion
                  content={
                    <ListItem.Content>
                      <ListItem.Title style={styles.title}>No-Alcool</ListItem.Title>
                      <ListItem.Subtitle style={styles.subtittle}>Sucos</ListItem.Subtitle>
                    </ListItem.Content>
                  }
                  isExpanded={expanded2}
                  onPress={() => {
                    setExpanded2(!expanded2);
                    setExpanded(false)
                    setExpanded3(false)
                  }}
                  containerStyle={styles.tabaccordion}
                >
                {/* flatlist dos itens do cardapio === sucos*/} 

                <FlatList
                  data={bar.filter((item:any)=> item.categoria_2 === 'sucos')}
                  keyExtractor={(item,index) => `${index}`}
                  renderItem={({ item,index }) =>  <Estoque_list onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                />
                </ListItem.Accordion>
                )
              }
              return  null
            }}
          />
        </TabView.Item>
      </TabView>
      {/* button para levar ao Cardapio_add */}
      <TouchableOpacity
        style={{
          backgroundColor: '#E8F0FE',
          borderRadius: 50,
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => props.navigation.navigate('Cardapio_add')}
      >
        <Icon name="add" color="#2D2F31" size={30} />
      </TouchableOpacity>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#202124',
  },
  tabaccordion:{
    backgroundColor:'#F4F7FC',
    borderBottomWidth:1, 
    borderRadius:25,
    margin:5
  },
  title: {
    fontSize: 18,
    fontFamily:'OpenSans-Bold'
  },
  subtittle:{
    fontSize: 12,
    fontFamily:'Roboto-Regular'
  }
});

const mapStateProps = ({ cardapio }: { cardapio: any }) => {
  return {
    cardapio: cardapio.cardapio,
  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAtualizar_onorof: (id:any,onorof:any) => dispatch(fetchatualizar_cardapio_onoroff(id,onorof)),
    onAtualizar_estoque: (id:any,estoque:number) => dispatch(fetchatualizar_cardapio_estoque(id,estoque)),
  };
};

export default connect(mapStateProps,mapDispatchProps)(Estoque);
