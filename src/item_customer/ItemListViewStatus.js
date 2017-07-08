import React,{Component} from 'react';
import {AppRegistry,View,Text,TouchableHighlight,Picker,Button,Image} from 'react-native';
export default class ItemListViewStatus extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View>
      <View style={{marginLeft:8,marginRight:8,marginTop:5,backgroundColor:'white',borderRightWidth:2,borderRightColor:'#BDBDBD'}}>
        <TouchableHighlight underlayColor='#FAFAFA' onPress={()=>this.btn_ItemIsClick()}>
        <View style={{flexDirection:'row'}}>
        <View>
          <Image source={{uri:this.props.obj.linkhinh}} style={{width: 100, height: 101,borderTopLeftRadius:2,borderBottomLeftRadius:2}}>

          </Image>
        </View>
        <View style={{marginLeft:8,padding:5,flex:1}}>
        <View style={{flex:3}}>
          <Text style={{color:'blue',fontSize:16,fontWeight:'bold'}}>{this.props.obj.tieude}</Text>
        </View>
        <View style={{flex:1}}>
          <Text style={{color:'red',fontSize:20}}>{this.props.obj.giaban} </Text>
        </View>
        <View style={{flex:1}}>
        <View style={{flexDirection:'row'}}>
          <Text>{this.props.obj.thoigiandang}</Text>
          <Text>  |  </Text>
          <Text>{this.props.obj.diachi_t}</Text>
        </View>
        </View>
        </View>
        </View>
        </TouchableHighlight>
      </View>
      <View style={{marginLeft:8,marginRight:8,height:1,backgroundColor:'#9E9E9E'}}></View>
      <View style={{marginLeft:8,marginRight:8,height:2,backgroundColor:'#BDBDBD'}}></View>
      <View style={{marginLeft:8,marginRight:8,height:2,backgroundColor:'#E0E0E0'}}></View>
      </View>

);
  }
  btn_ItemIsClick(){
    this.props.propsNavigator.push({
      screen:'StatusDetail',
      uidSession:this.props.uidSession,
      idPost:this.props.obj.idpost
    });
  }

}
AppRegistry.registerComponent('ChoNhaNong_v1',()=>ItemListViewStatus);
