import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { fetchatualizar_cardapio_estoque, fetchatualizar_cardapio_onoroff } from '../store/action/cardapio';
import { Avatar, Button, Icon, ListItem, Tab, TabView } from '@rneui/themed';
import Estoque_list from '../components/Estoque_list';
import { cardapio, estoque_screen } from '../interface/inter_cardapio';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Loja_up } from '../store/action/message_fechado_aberto';
import Estoque_list_pai from '../components/Estoque_list_pai';

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
  const bebidas = props.cardapio.filter((item:any) =>item.categoria === 'bebidas' && item.versao === undefined ||  item.versao === null )
  const comidas = props.cardapio.filter((item:any) =>item.categoria === 'comidas'  && item.versao === undefined ||  item.versao === null)
  const bar = props.cardapio.filter((item:any) =>item.categoria === 'bar'  && item.versao === undefined ||  item.versao === null)
  //categoria do flatlist do ListItem.Accordion
  const categoria_Bebidas = ['no-alcool','alcool']
  const categoria_comidas = ['lanches','hotdogs','porcoes']
  const categoria_bar = ['drinks','sucos']
  //return componente
  /////////////////////////Modal////////////////////////
  const data_fechado_aberto = new Date(props.fechado_aberto.data_fechado_aberto)

  const [modalVisible, setModalVisible] = useState(false);
  //fechadodata
  const data_hoje = new Date();
  const [data, setData] = useState(new Date());
  const [datavisible, setDatavisible] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [hour, setHour] = useState('');
  const [minutes, setMinutes] = useState('');
  useEffect(() => {
    const data_naw = new Date(`${data_hoje.getFullYear()}-${month}-${day}T${hour}:${minutes}:00.000Z`)
    setData(data_naw)
    console.log(data_hoje.getDate(), data.getDate())
    
  }, [day,month,hour,minutes]); 
  // 
  //atualizar para aberto automaticamente caso esteja fechadodata 
  useEffect(() => { 
    //console.log('fechado_aberto',data_hoje.getTime() , data.getTime())
    if (props.fechado_aberto.fechado_aberto === 'fechadodata'){
      if(data_hoje.getMonth() === data.getMonth() && data_hoje.getDate() === data.getDate() ){
        console.log('mes e dia')

        if(data_hoje.getHours() === data.getHours() && data_hoje.getMinutes() === data.getMinutes() ){
          props.onFechar_abrir(props.fechado_aberto.id,'aberto',data.getTime())
          console.log('hora e minutos iguais')

        }else if(data_hoje.getHours() > data.getHours() ){
          props.onFechar_abrir(props.fechado_aberto.id,'aberto',data.getTime())
          console.log('hora maior')

        }else if(data_hoje.getHours() === data.getHours() && data_hoje.getMinutes() > data.getMinutes() ){
          props.onFechar_abrir(props.fechado_aberto.id,'aberto',data.getTime())
          console.log('hora igual minutos maior')
        }
      } else if(data_hoje.getMonth() === data.getMonth() && data_hoje.getDate() > data.getDate()){
        props.onFechar_abrir(props.fechado_aberto.id,'aberto',data.getTime())
        console.log('mes igual dia maior')
      }
      //props.onFechar_abrir(props.fechado_aberto.id,'aberto',data.getTime())
    } 
},[data_hoje.getTime(),data,props.fechado_aberto.id,props.fechado_aberto.fechado_aberto]);
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
        {uniqueCategories.map((category: any, index: number) => {
          let data = [];
          let categoryName = '';
          if (category === 'comidas') {
            data = categoria_comidas;
            categoryName = 'Comidas';
          } else if (category === 'bar') {
            data = categoria_bar;
            categoryName = 'Bar';
          } else if (category === 'bebidas') {
            data = categoria_Bebidas;
            categoryName = 'Bebidas';
          }
          return (
            <TabView.Item key={index} style={{  width: '100%' }}>
              <FlatList
                data={data}
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
                      renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
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
                      renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
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
                      renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                    />
                    </ListItem.Accordion>
                    )
                  } else  if(item === 'no-alcool'){
                    return (
                      <ListItem.Accordion
                        content={
                          <ListItem.Content>
                            <ListItem.Title style={styles.title}>No-Alcool</ListItem.Title>
                            <ListItem.Subtitle style={styles.subtittle}>Refrigerantes</ListItem.Subtitle>
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
                      {/* flatlist dos itens do cardapio === no-alcool*/} 
                        <FlatList
                          data={bebidas.filter((item:any)=> item.categoria_2 === 'no-alcool')}
                          keyExtractor={(item,index) => `${index}`}
                          renderItem={({ item,index }) =>  (
                          <Estoque_list_pai 
                            onAtualizar_onorof={props.onAtualizar_onorof}
                            onAtualizar_estoque={props.onAtualizar_estoque}
                            {...item} 
                            estoq
                          />)}
                        />
                      </ListItem.Accordion>
                      )
                    
                  }else if(item === 'alcool'){
                    return (
                        
                      <ListItem.Accordion 
                        content={
                          <ListItem.Content >
                            <ListItem.Title style={styles.title}>Alcoolicas</ListItem.Title>
                            <ListItem.Subtitle style={styles.subtittle}>Cervejas</ListItem.Subtitle >
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
                        {/* flatlist dos itens do cardapio === alcool*/} 
                        <FlatList
                          data={bebidas.filter((item:any)=> item.categoria_2 === 'alcool')}
                          keyExtractor={(item,index) => `${index}`}
                          renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item} estoq  />}
                        />
                      </ListItem.Accordion>)
                  } else if(item === 'drinks'){
                
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
                        renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
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
                          renderItem={({ item,index }) =>  <Estoque_list_pai onAtualizar_onorof={props.onAtualizar_onorof} onAtualizar_estoque={props.onAtualizar_estoque}{...item}/>}
                        />
                        </ListItem.Accordion>
                        )
                  } else {
                    return  null
                  }
                }}
              />
            </TabView.Item>
          );
        })}
      </TabView>
      {/* versao antiga */}
      {/* <TabView value={index} onChange={setIndex} animationType="spring" >
        criacao da 1 tabview Bebidas
        <TabView.Item style={{  width: '100%' }}>
          flatlist do accordion comidas
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
                  flatlist dos itens do cardapio === lanches 

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
                flatlist dos itens do cardapio === hotdogs 
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
                flatlist dos itens do cardapio === porcoes 
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
        criacao da 2 tabview comidas
        <TabView.Item style={{width: '100%' }}>
          flatlist do accordion Bebidas
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
                  flatlist dos itens do cardapio === alcool 
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
                  flatlist dos itens do cardapio === no-alcool 
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
        criacao da 3 tabview bar
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
              flatlist dos itens do cardapio === drinks 
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
                flatlist dos itens do cardapio === sucos 

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
      </TabView> */}
      {/* botoes de adicionar e retirar */}
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
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
        {/* aberto fechado */}
        <TouchableOpacity
          style={{
            backgroundColor: props.fechado_aberto.fechado_aberto === 'fechado'? 'red' : props.fechado_aberto.fechado_aberto === 'fechadodata'?'#c26a05':'green',
            padding: 10,
            // Adicione outros estilos conforme necessário
          }}
          onPress={() => {
            setModalVisible(true)
            // Adicione a ação do botão aqui
          }}
        >
          {props.fechado_aberto.fechado_aberto === 'fechado' ? 
          <Text style={{color:'white'}}>Fechado</Text> 
          : props.fechado_aberto.fechado_aberto === 'fechadodata' ? 
          <Text style={{color:'white'}}>
            fechado abre :{'\n'} {data_fechado_aberto.getDate()}/{data_fechado_aberto.getMonth()+1} ás {data_fechado_aberto.getHours().toString().padStart(2, '0')}:{data_fechado_aberto.getMinutes().toString().padStart(2, '0')}
          </Text> 
          : <Text style={{color:'white'}}>Aberto</Text>}
        </TouchableOpacity>
        {/* button para levar ao Cardapio_retirar */}
        
        <TouchableOpacity
          style={{
            backgroundColor: '#E8F0FE',
            borderRadius: 50,
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('Cardapio_retirar')}
        > 
          {/* <Icon name="remove" color="#2D2F31" size={30} /> */}
          <Ionicons name="construct" size={24} color="#2D2F31" />
        </TouchableOpacity>
      </View>

      {/* Modal status fechado e aberto */}
      <Modal visible={modalVisible} animationType="fade" transparent={true} >
        <View style={{flex:1,backgroundColor:'#000000aa',justifyContent:'center',alignItems:'center'}}>
          <View style={{width:'80%',backgroundColor:'#fff',alignItems: 'center',justifyContent: 'center'}}>         
          <Text >Selecione o status:</Text>
            <TouchableOpacity
              style={{backgroundColor:'red',padding:10}}
              onPress={() => {
                setModalVisible(false);
                props.onFechar_abrir(props.fechado_aberto.id,'fechado',data.getTime())
              }}
            >
              <Text  style={{color:'white'}}>Fechado</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{backgroundColor:'#c26a05',padding:10}}
              onPress={() => {
                setDatavisible(true)
              }}
            >
              <Text style={{color:'white'}}>Fechado com data</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{backgroundColor:'green',padding:10}}
              onPress={() => {
                setModalVisible(false);
                props.onFechar_abrir(props.fechado_aberto.id,'aberto',data.getTime())
              }}
            >
              <Text style={{color:'white'}}>Aberto</Text>
            </TouchableOpacity>
              {/*fechado data escolher data hora*/ }
            {datavisible ? 
            <>
              <Text style={{color:'black'}}>Data:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  placeholder="Dia"
                  style={{ borderWidth: 1, borderColor: 'black', padding: 5, marginRight: 10 }}
                  onChangeText={(text) => setDay(text)}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Mês"
                  style={{ borderWidth: 1, borderColor: 'black', padding: 5, marginRight: 10 }}
                  onChangeText={(text) => setMonth(text)}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Hora"
                  style={{ borderWidth: 1, borderColor: 'black', padding: 5, marginRight: 10 }}
                  onChangeText={(text) => setHour(text)}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Minutos"
                  style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
                  onChangeText={(text) => setMinutes(text)}
                  keyboardType="numeric"
                />
              </View>
              <Button onPress={() => {
                setModalVisible(false);
                setDatavisible(false);
                props.onFechar_abrir(props.fechado_aberto.id,'fechadodata',data.getTime())
                }}>Salvar</Button>
            </>
            :null}
          </View>
        </View> 
      </Modal>

     
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

const mapStateProps = ({ cardapio,message }: { cardapio: any,message:any }) => {
  return {
    cardapio: cardapio.cardapio,
    fechado_aberto: message.fechado_aberto,
  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAtualizar_onorof: (id:any,onorof:any) => dispatch(fetchatualizar_cardapio_onoroff(id,onorof)),
    onAtualizar_estoque: (id:any,estoque:number) => dispatch(fetchatualizar_cardapio_estoque(id,estoque)),

    onFechar_abrir: (id:string,fechado_aberto:any,data_fechado_aberto:any) => dispatch(Loja_up(id,fechado_aberto,data_fechado_aberto)),
  };
};

export default connect(mapStateProps,mapDispatchProps)(Estoque);
