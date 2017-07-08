import React,{Component} from 'react';
import {AppRegistry,Platform,View,Text,TouchableHighlight,Picker,Button,Image} from 'react-native';
import firebase from '../entities/FirebaseAPI'
export default class ItemShop extends Component{
  constructor(props){
    super(props);
    
    
  }

  render(){
      if(this.props.obj.state==='đã xem'){        
        return(
      
        <TouchableHighlight underlayColor='#FAFAFA' onPress={()=>this.btn_ItemIsClick()}>
            <View style={{padding:5,borderBottomColor:'#E0E0E0',borderBottomWidth:1,paddingLeft:10}} >
                <View style={{flexDirection:'row'}} >                    
                    <View style={{flex:6,justifyContent:'center'}} >
                        <Text style={{color:'black',fontSize:18}} ><Text style={{color:'blue'}} >{this.props.obj.title}</Text> {this.props.obj.content}</Text>  
                        <Text style={{fontSize:12,color:'gray'}} >{this.props.obj.time}</Text>
                    </View>
                </View>                
            </View>
        </TouchableHighlight>
    );    
    }else
    return(
      
        <TouchableHighlight underlayColor='#FAFAFA' onPress={()=>this.btn_ItemIsClick()}>
            <View style={{padding:5,backgroundColor:'#E3F2FD',borderBottomColor:'#E0E0E0',borderBottomWidth:1,paddingLeft:10}} >
                <View style={{flexDirection:'row'}} >                    
                    <View style={{flex:6,justifyContent:'center'}} >
                        <Text style={{color:'black',fontSize:18}} ><Text style={{color:'blue'}} >{this.props.obj.title}</Text> {this.props.obj.content}</Text>  
                        <Text style={{fontSize:12,color:'gray'}} >{this.props.obj.time}</Text>
                    </View>
                </View>                
            </View>
        </TouchableHighlight>
      


);
    
  }
  btn_ItemIsClick(){
        database=firebase.database();
        //update thông báo thành đã xem
        database.ref('db_marketsfarmers/table_notif/'+this.props.uidSession)
        .child(this.props.obj.keyTb).set({            
                idpost:this.props.obj.id,
                content:this.props.obj.content,
                state:'đã xem',
                time:this.props.obj.time,
                title:this.props.obj.title,
                type:this.props.obj.type
        });

      switch(this.props.obj.type){          
          case 'follow':
            this.props.propsNavigator.push({
                screen:'StatusDetail',
                uidSession:this.props.uidSession,
                idPost:this.props.obj.id
            });
          break;
          case 'followshop':
            this.props.propsNavigator.push({
                screen:'ShopMain',
                uidSession:this.props.uidSession,
                sid:this.props.obj.id,
                uidadmin:this.props.uidSession
            });
          break;
          case 'command':
            this.props.propsNavigator.push({
                screen:'StatusDetail',
                uidSession:this.props.uidSession,
                idPost:this.props.obj.id
            });
          break;
      }
    
  }

}
