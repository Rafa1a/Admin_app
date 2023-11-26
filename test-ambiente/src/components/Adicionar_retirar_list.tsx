import { Button, ListItem, Switch } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  FlatList
} from 'react-native';
import Adicionais_itens from './adicionais_retirar_itens';
import { adicionais, adicionar_comp } from '../interface/inter_adicionar';
import { connect } from 'react-redux';
import { fetchMesas, setAdicionar_pedido } from '../store/action/adicionar_pedido';
import { Item } from '../interface/inter';

const adicionar_retirar = (props: adicionar_comp) => {
  /////////////////// controle modal/////////////////////////
  const [modalVisible, setModalVisible] = useState(false);
  //quantidade de itens no modal 
  const [quantity, setQuantity] = useState(1); 
  /////////////estado inicial de itens CUSTOM///////////////
  const inicial_itens_custom:any = undefined
 
  const [inicial_state_itens_custom, setInicial_state_custom] = useState<Item>(inicial_itens_custom); 
  
  const [itensSelecionados_retirar, setItensSelecionados_retirar] = useState<string[]>([]);
  const [itensSelecionados_adicionar, setItensSelecionados_adicionar] = useState<adicionais[]>([]);
  /////////controle flatlist/////////////////
  const [expanded, setExpanded] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  
  
  ////////////////controle checkbox////////////////////
  const [checkbox1, setCheckbox1] = useState(props.trueorfalse);
  // soma de adicionar item 
  const [add_retirar, setAdd_retirar,] = useState(1);

  ////////////estado inicial de itens COMUM////////////////////
  const inicial_itens:any = undefined
 
  const [inicial_state_itens, setInicial_state] = useState<Item>(inicial_itens); 
  // console.log(inicial_state_itens_custom); 
  // console.log(inicial_state_itens);
  // console.log(checkbox1)   

////////////////////////////////////COMUM/////////////////////////////////////////
////////////////////////////////////COMUM/////////////////////////////////////////
////////////////////////////////////COMUM/////////////////////////////////////////

  // definir estado do componente inicial_state_itens do pedido caso ja exista o item no array TODOS OS ITENS
  useEffect(() => {
    if (props.trueorfalse) {
      const newState = props.adicionar_pedido.find((item: any) => item.id === props.id &&  item.adicionar_p === undefined &&
      item.retirar_p === undefined );
      // const newState_custom = props.adicionar_pedido.find((item: any) => item.id === props.id && item.id_iten !== undefined);
      if (newState) {
        // console.log(props.adicionar_pedido);
        setAdd_retirar(newState.quantidade)
        setInicial_state(newState);
        // console.log(newState);
      } 
      // if(newState_custom) {
      //   // console.log(props.adicionar_pedido);
      //   setQuantity(newState_custom.quantidade)
      //   setInicial_state_custom(newState_custom);
      //   console.log(newState_custom); 
      // }
      return;
    } 
  }, []);
  
//criar estado inicial de item COMUM
  useEffect(() => {

    if (checkbox1 && props.trueorfalse===false && modalVisible===false) {
      // console.log('true')
      const objet:any = {
              id:props.id,
              name_p: props.name,
              categoria: props.categoria || undefined,
              categoria_2: props.categoria_2 || undefined,
              quantidade: add_retirar ,
              valor_p: props.valor,
            };
      setInicial_state(objet)      
      return
    } else if(props.trueorfalse===false){ 
      // console.log('false') 
      
      setInicial_state(inicial_itens)
      return   
    }  
    
  }, [checkbox1]);


  // ADICIONAR ITEM COMUM
  useEffect(()=>{
    if(checkbox1){
      if (inicial_state_itens !== undefined) {
        const newArray = [...props.adicionar_pedido, inicial_state_itens];
        // console.log( 'adicionar :', props.adicionar_pedido)
        // console.log( props.trueorfalse)

        //para nao repitir um item caso ja exista no array
        props.trueorfalse?null:props.onAdicionar_pedido(newArray);
      }
    }
  },[checkbox1,inicial_state_itens])

  

  //retirar item da propriedade [] itens do pedido ! TODOS OS ITENS DO ID !
  useEffect(() => {
      
    // Retirar item do array
    if (!checkbox1) {
      const filteritem = props.adicionar_pedido.filter(
        (item:any) =>
          item.id !== props.id  
      );
        //atualizar estado inicial
        const newArray = filteritem;
        setAdd_retirar(1)
        setInicial_state(inicial_itens);
        setQuantity(1)
        setInicial_state_custom(inicial_itens_custom);
        props.onAdicionar_pedido(newArray)
    }
  }, [checkbox1]);


  //defenir a quantidade do item especifico do array COMUM
  useEffect(()=>{
    
    if(props.trueorfalse===true){
      const findIndex = props.adicionar_pedido.findIndex(
      (item:any) =>
        item.id === props.id &&
        item.adicionar_p === undefined &&
        item.retirar_p === undefined 

      );
     
      //atualizar quantidade
      if (findIndex !== -1) {
        const newarray = [...props.adicionar_pedido];
  
        // Se a quantidade for igual a zero, exclua o item
        if (add_retirar === 0) {
          setCheckbox1(false)
          newarray.splice(findIndex, 1);
        } else {
          newarray[findIndex].quantidade = add_retirar;
          // newarray[findIndex].valor_p = props.valor
        } 
  
        props.onAdicionar_pedido(newarray);
      }  
      //adicionar item quando ja tem 1 item modal 
      if (add_retirar > 0 && findIndex === -1) {
        setAdd_retirar(1)
        const commonItem = {
          id:props.id,
          name_p: props.name,
          categoria: props.categoria || undefined,
          categoria_2: props.categoria_2 || undefined,
          quantidade: add_retirar ,
          valor_p: props.valor,
        };
        props.onAdicionar_pedido([...props.adicionar_pedido, commonItem]);
      }
      
    }
    // console.log(inicial_state_itens)
    // console.log(props.adicionar_pedido)


  },[add_retirar])

  //funcao soma quantidade de TODOS
  const Soma = () => {

    // reduce para calcular a soma total das quantidades dos itens
    const somaTotal = props.adicionar_pedido.reduce((soma, item:any) => {
      // Verifique se o item atende às condições desejadas
      if (item.id === props.id) {
        soma += item.quantidade;
      }
      return soma;
    }, 0); // 0 é o valor inicial da soma

  
    return <>{`x${somaTotal || 0}`}</>;
  }
 ///////////////////////////////////CUSTOM//////////////////////////////////////////////
 ///////////////////////////////////CUSTOM//////////////////////////////////////////////
 ///////////////////////////////////CUSTOM//////////////////////////////////////////////
  // modal adicionar item personalizado
  useEffect(()=>{

    if(modalVisible){
      const objet:any = {
        id:props.id,
        name_p: props.name,
        categoria: props.categoria || undefined,
        categoria_2: props.categoria_2 || undefined,
        quantidade: quantity ,
        valor_p: props.valor,
        adicionar_p:[],
        retirar_p:[]
      };
      setInicial_state_custom(objet)    
      return
 
    }
  },[modalVisible])

  // adicionar ITEM CUSTOM ao SALVAR
  const adicionar_custom_salvar = () => {
    if (inicial_state_itens_custom !== undefined) {
      const valorTotalAdicionais = itensSelecionados_adicionar.reduce(
        (total, item) => total + item.valor,
        0
      );
      // console.log(itensSelecionados_adicionar.map((item) => item.name))
      // Adicione os itens adicionais e retirados selecionados ao estado inicial_state_itens_custom
      
      const newCustom = {
        ...inicial_state_itens_custom,
        valor_p:parseFloat(((inicial_state_itens_custom.valor_p + valorTotalAdicionais)).toFixed(2)), 
        adicionar_p: itensSelecionados_adicionar.map((item) => item.name),
        retirar_p: itensSelecionados_retirar,
      };
      const newArray = [...props.adicionar_pedido, newCustom];
      props.onAdicionar_pedido(newArray);
      setInicial_state_custom(inicial_itens_custom);
      setItensSelecionados_retirar([]); // Limpe os itens selecionados após salvar
      setItensSelecionados_adicionar([]); // Limpe os itens selecionados após salvar
    }
    
  };

  
  // adicionar e retirar quantity de CUSTOM MODAL
  const handleIncrement = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      setInicial_state_custom((prevCustom) => ({
        ...prevCustom,
        quantidade: newQuantity,
      }));
      return newQuantity;
    });
  };

  // adicionar e retirar quantity de CUSTOM MODAL
  const handleDecrement = () => {
    setQuantity((prevQuantity) => {
      // Garante que a quantidade não seja negativa
      const newQuantity = Math.max(0, prevQuantity - 1); 
      setInicial_state_custom((prevCustom) => ({
        ...prevCustom,
        quantidade: newQuantity,
      }));
      return newQuantity;
    });
  };
  
  // Função para manipular o clique em um item retirado
  const handleItemToggle_retirar = (item:any) => {
    // Verifique se o item já está na lista de itens selecionados
    if (itensSelecionados_retirar.includes(item)) {
      // Se estiver, remova-o
      setItensSelecionados_retirar((prev) => prev.filter((selectedItem) => selectedItem !== item));
    } else {
      // Se não estiver, adicione-o
      setItensSelecionados_retirar((prev:any) => [...prev, item]);
    }
    // console.log(itensSelecionados_retirar)
  }; 

  // Função para manipular o clique em um item adicional

  const handleItemToggleAdicionar = (item: any) => {
    // Verifique se o item já está na lista de itens selecionados

    if (itensSelecionados_adicionar.includes(item)) {
      setItensSelecionados_adicionar((prev) =>
        prev.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setItensSelecionados_adicionar((prev: any) => [...prev, item]);
    }
    // console.log(itensSelecionados_adicionar);
  };

// console.log(props.adicionar_pedido); 

  
  return (
     
    <>
      <ListItem 
        containerStyle={{ 
        backgroundColor: '#28292a',    
        borderRadius:25,
        margin:10}} 
        bottomDivider
      >
        <Button  
          size='md'	
          radius='lg' 
          type='outline'
          icon={{
            name: 'remove',
            type: 'ionicons',
            size: 15,
            color: 'white',
          }}
          buttonStyle={{backgroundColor:'#3c4043'}}
              
          onPress={()=>{add_retirar <= 0? setAdd_retirar(0):setAdd_retirar(add_retirar - 1)}} 
        />

        <ListItem.Content style={{alignItems:'center'}}>
          <ListItem.CheckBox
                checked={checkbox1}
                onPress={() => {
                  setCheckbox1(prevCheckbox => !prevCheckbox);
                }}
                iconType="material-icons"
                checkedIcon="check-box"
                uncheckedIcon='check-box-outline-blank'
                wrapperStyle={{backgroundColor:'#28292a'}}
                containerStyle={{backgroundColor:'#28292a'}}
              />
          <TouchableOpacity 
          style={styles.button} 
          onPress={() => setCheckbox1(prevCheckbox => !prevCheckbox)}
          onLongPress={()=> {props.adicionar_retirar?
            (
              (() => {
                setModalVisible(true);
                checkbox1?null:setCheckbox1(prevCheckbox => !prevCheckbox)
              })()
            ):null}}
          >
            <ListItem.Title style={styles.title}>
              {props.name}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subtittle}>
              {Soma()}
            </ListItem.Subtitle>
          </TouchableOpacity>
        </ListItem.Content>
        <Button  
          size='md'	 
          radius='lg' 
          type='outline'
          icon={{
            name: 'add',
            type: 'ionicons',
            size: 15,
            color: 'white',
          }}
          buttonStyle={{borderColor:'tomato',backgroundColor:'#3c4043'}}
          onPress={()=>  {

            const estoque_cardapio:any = props.cardapio.find(item => item.id === props.id)
            if(checkbox1){
              if(estoque_cardapio.estoque){
                // console.log(estoque_cardapio.estoque)
                
                if(add_retirar < estoque_cardapio.estoque){
                  setAdd_retirar(add_retirar + 1)
                  // console.log(add_retirar)
                }
              }else{
                setAdd_retirar(add_retirar + 1)
              }
            }else{
              setCheckbox1(true)
            }
            
            }}
        />

      </ListItem>


 


      {/*modal para mudar o valor do estoque*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.text}>{props.name}</Text>
            <ScrollView style={{ flex: 1, width:'95%'}}>
              {/* ListItem de adicionar e retirar */}
              <ListItem.Accordion
                content={<Text style={styles.text2}>Adicionar</Text>}
                isExpanded={expanded}
                onPress={() => {
                  setExpanded(!expanded);
                  setExpanded2(false);
                }}
                containerStyle={styles.tabaccordion}
              >
                <FlatList
                  scrollEnabled={false}
                  data={props.adicionais}
                  keyExtractor={(item, index) => `${index}`}
                  renderItem={({ item, index }) => <Adicionais_itens handleItemToggleAdicionar={handleItemToggleAdicionar} item={item} adicionais/>}
                />
              </ListItem.Accordion>
              <ListItem.Accordion
                content={<Text style={styles.text2}>Retirar</Text>}
                isExpanded={expanded2}
                onPress={() => {
                  setExpanded2(!expanded2);
                  setExpanded(false);
                }}
                containerStyle={styles.tabaccordion}
              >
                <FlatList
                  scrollEnabled={false}
                  data={props.ingredientes?.filter((item:any)=> item === 'pão'?null:item)}
                  keyExtractor={(item, index) => `${index}`}
                  renderItem={({ item, index }) => <Adicionais_itens handleItemToggle_retirar={handleItemToggle_retirar} item={item}  />}
                />
              </ListItem.Accordion>
            </ScrollView>
            {/* Controle de quantidade */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecrement}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                value={quantity.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setQuantity(Number(text))}
              />
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrement}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            {/* Botões de adicionar e cancelar */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => {
                setModalVisible(false)
                setInicial_state_custom(inicial_itens_custom)
                add_retirar === 0 ? setCheckbox1(false):null
              }}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {
                setModalVisible(false)
                adicionar_custom_salvar()
                }}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex:1,
    maxHeight:'85%',
    width:'85%',
    backgroundColor: '#F4F7FC',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 10,
    shadowColor:"#F4F7FC"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#3C4043',
    borderRadius: 10,
    padding: 18,
    margin: 10,
    elevation:4,
    shadowColor:'#F4F7FC'
  },
  buttonText: {
    color: 'white',
    fontFamily:'Roboto-Regular'
  },
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
  },
  tabaccordion:{
    backgroundColor:'#F4F7FC',
    borderBottomWidth:1, 
    borderRadius:25,
    margin:5
  },
  text: {
    fontSize: 18,
    fontFamily:'OpenSans-Bold',
    color:'#3C4043'
  },
  text2: {
    fontSize: 13,
    fontFamily:'Roboto-Regular',
    color:'#3C4043'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom:10
  },
  quantityInput: {
    width: "75%",
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'OpenSans-Bold',
    color: '#3C4043',
    backgroundColor: '#F4F7FC',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  quantityButton: {
    backgroundColor: '#3C4043',
    borderRadius: 10,
    padding: 12,
    margin: 5,
    elevation: 4,
  },
});
const mapStateProps = ({ pedidos,cardapio }: { pedidos: any,cardapio:any }) => {
  return {
    adicionar_pedido: pedidos.adicionar_pedido,
    cardapio:cardapio.cardapio
  };
};
const mapDispatchProps = (dispatch: any) => {
  return {
    onAdicionar_pedido: (pedido:[]) => dispatch(setAdicionar_pedido(pedido)),
  };
};
export default connect(mapStateProps,mapDispatchProps)(adicionar_retirar)