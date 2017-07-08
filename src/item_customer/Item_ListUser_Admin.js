import React,{Component} from 'react';
import {AppRegistry,Platform,View,Text,TouchableHighlight,Picker,Button,Image} from 'react-native';

export default class Item_ListUser_Admin extends Component{
  constructor(props){
    super(props);
    i=100;
    if(Platform.OS==='ios')
      i=30;
    this.state={
      radius:i
    }
  }

  render(){
    return(
      <View style={{backgroundColor:'white'}}>
        <TouchableHighlight  underlayColor='#FAFAFA' onPress={()=>this.btn_ItemIsClick()}>
        <View style={{flexDirection:'row'}}>
        <View>
          <Image source={{uri:this.props.obj.anhdaidien}} style={{width: 60, height: 60,borderRadius:this.state.radius,marginLeft:10,marginTop:5,marginRight:5,marginBottom:5,borderColor:'white',borderWidth:1}}>
          </Image>
        </View>
        <View style={{padding:5,borderBottomWidth:1,borderBottomColor:'#E0E0E0',width:'100%'}}>
          <Text style={{color:'black',fontSize:18,marginTop:5}}>{this.props.obj.hovaten}</Text>
          <Text style={{fontSize:13}}>SDT: {this.props.obj.sdt}</Text>
        </View>
        </View>
        </TouchableHighlight>
      </View>


);
  }
  btn_ItemIsClick(){
    this.props.propsNavigator.push({
      screen:'InfoPersonal',
      uidSession:this.props.obj.uid,
      uidadmin:this.props.uidSession
    });
  }

}
