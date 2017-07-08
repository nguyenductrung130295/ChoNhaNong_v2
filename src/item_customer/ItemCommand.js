import React,{Component} from 'react';
import {AppRegistry,View,Text,Image} from 'react-native';
export default class ItemCommand extends Component{
  render(){
    return(
      <View style={{marginTop:10}}>
        <View style={{flexDirection:'row'}}>
          <Image source={{uri:this.props.obj.image_cmt}} style={{width:40,height:40}}/>
          <View>
            <Text style={{color:'black',fontSize:16,marginLeft:10}} onPress={()=>alert('link tới trang cá nhân'+this.props.obj.uid_cmt)}>
              <Text style={{color:'blue'}}>{this.props.obj.name_cmt}</Text> {this.props.obj.content_cmt}</Text>
            <Text style={{color:'gray',marginLeft:10}}>{this.props.obj.time}</Text>
          </View>
        </View>
      </View>
    );
  }
}
AppRegistry.registerComponent('ChoNhaNong_v1',()=>ItemCommand);
