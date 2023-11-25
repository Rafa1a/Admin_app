import { NavigationProp } from "@react-navigation/native";
export interface HeaderPedidoProps {
  numero_mesa?: number;
  image_on?: string;
  name_on?: string;
  rua?:string;
  numero?:string,
  pegar_local?:boolean
  dinheiro?:number;
  pix?:boolean;
  cartao?:cartao;
  pedidos:pedido_inter[]
  id?:string
  ids?:string[]
  adicionar?:boolean
}
export interface HeaderPedidosProps {
  outros?: boolean;
  online?: boolean;
  mesa?: boolean;
  navigation ?: NavigationProp<any,any>;
  mesas:[],
  onFetchMesas:()=>void
  onDelete_all:()=>void

}
export interface ItemProps {
  categoria?: string;
  categoria_2?: string;
  adicionar_p?: any[];
  retirar_p?: any[];
  name_p?: string;
  quantidade?:number,
  valor_p?:number,
  mesa?:boolean
  objeto_lista_ids?:(a:any)=>void
  deleteitem:boolean
  adicionar_pedido:Item[]
  id?:string
  onAdicionar_pedido:(a:any)=>void
}

export interface NumeroProps {
    styles ?: boolean
    number: number;
    pedido_tamanho ?: boolean
  }
export interface pedido_props {
    styles ?: boolean
    id      : string;
    ids      ?:string[]
    numero_mesa   ?: number;
    image_on      ?: string;
    name_on       ?: string;
    navigation ?: NavigationProp<any,any>;
    ordem       ?:number
    rua?:string,
    numero?:string,
    pegar_local?: boolean;
    dinheiro?:number;
    pix?:boolean;
    cartao?:cartao;
    status?:boolean
    status_chapeiro?:boolean
    status_porcoes?:boolean
    status_bar?:boolean
    onFetchPedidos_Excluir:(id:string)=>void
    onFetchPedidos_Excluir_Mesa:(id:string[])=>void

  }
export interface user_on{
  id            : string
  image_on      : string
  name_on       : string,
  rua_on         : string,
  numero_on        : number
 
}
 export interface Item {
    id:string
    name_p: string;
    categoria: "comidas" | "bebidas" | "bar";
    categoria_2?: string;
    retirar_p: string[];
    adicionar_p: string[];
    quantidade:number;
    valor_p : number;
  }
  export interface pedido_inter {
    id?:string,
    localidade: "MESA" | "ONLINE" | "OUTROS";
    status: boolean;
    numero_mesa?: number;
    id_user?: string;
    itens: Item[];
    ordem:number
    status_chapeiro?:boolean
    status_porcoes?:boolean
    status_bar?:boolean
    pegar_local?: boolean;
    rua?: string;
    numero?: string;
    dinheiro:number;
    cartao:cartao;
    pix:boolean;
  }
 export interface cartao{
    visa:boolean;
    mastercard:boolean;
    elo:boolean
  }
  export interface pedidos_mesa{
    status:false,
    id:string,
    numero_mesa:number,
    itens_all: pedido_inter[]
  }

  export interface lista_pedido {
    pedidos_mesa:pedidos_mesa[]
    pedidos:pedido_inter[]
    id:string
    ids?:string[]
    numero_mesa:number
    onFitchTotal_valor:(total:number)=>void
    onFitchExcluir_Item:(id:string,item:ItemProps)=>void
  }
 
  export interface pedido_itens_comp{
    pedidos:pedido_inter[]
    route: any;
    navigation ?: NavigationProp<any,any>;
    onAtualizarPedido: (id: any) => void;
    onAtualizar_pedido: (id: any) => void;
    onAdicionar_pedido: (id: any) => void;
    onAdicionarPedido: (id: any) => void;
    onAtualizarPedido_Mesa:(ids:string[])=>void
    total:number
    adicionar_pedido:Item[]
    inicial_state_outros:pedido_inter
    inicial_state_mesas:pedido_inter
  }