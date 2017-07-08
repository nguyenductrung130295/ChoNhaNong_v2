import React,{Component} from 'react';
import {Platform,AppRegistry,Image,Text,TouchableHighlight,View} from 'react-native';

export default class ItemInbox extends Component{
  constructor(props){
    super(props);
    i=100;
    if(Platform.OS==='ios')
      i=20;
    this.state={
      flag:false,
      radius:i,
    }
  }
  accessUser(){
    this.props.propsNavigator.push({
                  screen:'InfoPersonal',
                  //làm đi, gửi uidSession qua, thôi để tui làm mẫu, chưa có chổ nào làm đâu mà tìm
                  uidSession:this.props.uidGetMessage,
                  uidadmin:'guest',
                  uidguest:this.props.uidSession
                });
  }
  xemTime(){
    this.setState({flag:!this.state.flag});

  }
  renderhaha1(){
    if(this.state.flag){
      return(
        <View style={{width:'100%',justifyContent:'center',alignItems:'center'}} >
        <Text style={{color:'gray',fontSize:12,marginLeft:40}}>{this.props.inbox.thoigiangui+"    "+this.props.inbox.tinhtrang}</Text>
        </View>
      );
    }else{
      return null;
    }
  }
  render(){
    if(this.props.inbox.own){
      return(
        <View>
          <View style={{flexDirection:'row',marginTop:5,marginRight:5}}>
          <View style={{flex:2}}>
          </View>
          <View style={{flex:5}}>
            <View style={{backgroundColor:'#4FC3F7',borderRadius:5,padding:5}}>
            <TouchableHighlight onPress={()=>this.xemTime()}>
            <Text style={{fontSize:17,color:'white'}}>{this.props.inbox.noidungtinnhan}            
            </Text>
            </TouchableHighlight>            
            </View>
            {this.renderhaha1()}
            </View>
            {/*<View style={{flex:1,marginLeft:5}}>
            <TouchableHighlight onPress={()=>this.accessUser()}>
            <Image source={{uri:this.props.inbox.linkavartar}}
            style={{height:40,width:40,borderRadius:this.state.radius}}/>
            </TouchableHighlight>
            </View>*/}
          </View>          
        </View>
      );
    }else{
      return(
        <View>
          <View style={{flexDirection:'row',marginTop:5}}>
            <View style={{flex:1}}>
            <TouchableHighlight onPress={()=>this.accessUser()}>
            <Image source={{uri:this.props.inbox.linkavartar}}
            style={{height:40,width:40,borderRadius:this.state.radius,marginLeft:5}}/>
            </TouchableHighlight>
            </View>
            <View style={{flex:5}}>
            <View style={{backgroundColor:'#EEEEEE',borderRadius:5,padding:5}}>
            <TouchableHighlight onPress={()=>this.xemTime()}>
            <Text style={{fontSize:17,color:'black'}}> {this.props.inbox.noidungtinnhan}</Text>
            </TouchableHighlight>
            </View>
              {this.renderhaha1()}
            </View>
            <View style={{flex:2}}>
            </View>
          </View>
            
          </View>
      );
    }

  }
}
AppRegistry.registerComponent('Component_API_Demo',()=>ItemInbox);
