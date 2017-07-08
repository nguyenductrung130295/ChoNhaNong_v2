import React,{Component} from 'react';
import {Platform,AppRegistry,View,Text,TouchableHighlight,Image} from 'react-native';
import firebase from '../entities/FirebaseAPI'
export default class ItemListMessendger extends Component{
  constructor(props){
    super(props);
    i=100;
    if(Platform.OS==='ios')
      i=30;
    this.state={
      radius:i,
      sotinchuadoc:0
    }
  }
  componentWillMount(){
    database=firebase.database();
    let mes_once;
    countmes=database.ref('db_marketsfarmers/table_notif/'+this.props.obj.uid_send);
    countmes.orderByChild('idpost').equalTo(this.props.obj.uid_get).on('value',(sn2)=>{                  
        mes_once=0;
        sn2.forEach((dt2)=>{
            if(dt2.val().state!=='đã xem'){
                  mes_once++;                      
            }                     
        });
        this.setState({sotinchuadoc:mes_once});
     });
  }
  render(){
    return(
      <View style={{backgroundColor:'white'}}>
        <TouchableHighlight underlayColor='#FAFAFA' onPress={()=>this.btn_ItemIsClick()}>
        <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#E0E0E0'}}>
        <View>
          <Image source={{uri:this.props.obj.anhdaidien_send}} 
          style={{width: 60, height: 60,borderRadius:30,marginLeft:10,marginTop:5,marginRight:5,marginBottom:5,borderWidth:1,borderColor:'gray'}}>
          </Image>
        </View>
        <View style={{padding:5,width:'100%'}}>
          <Text style={{color:'blue',fontSize:18,marginTop:5}}>{this.props.obj.hovaten_send} {this.state.sotinchuadoc>0?<Text style={{fontSize:20,color:'red'}} >({this.state.sotinchuadoc})</Text>:null}</Text>          
          <Text style={{fontSize:13,color:'black'}}>{this.props.obj.noidung_last}</Text>
          <Text style={{fontSize:13,color:'gray'}}>{this.props.obj.thoigiangui}</Text>
        </View>
        </View>
        </TouchableHighlight>
      </View>


);
  }
  btn_ItemIsClick(){
    this.props.propsNavigator.push({
      screen:'Messendger',
      uidSession:this.props.obj.uid_send,
      uidGetMessage:this.props.obj.uid_get
    });
  }

}
