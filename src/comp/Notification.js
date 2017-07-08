import React,{Component} from 'react'
import {Text,ListView,AppRegistry,TouchableHighlight,Image,View,Modal,TextInput,Picker,Button} from 'react-native'
import ItemNotification from '../item_customer/ItemNotification'
import firebase from '../entities/FirebaseAPI'
const ds=new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});    
export default class Notification extends Component{

  constructor(props){
    super(props);

    this.state={
      dataSource:null,//datasource cho ListView      
    };
  }
  //hàm này chạy trước khi render ra màn hình
  componentWillMount(){
    arrayNOtification=[];
    database=firebase.database();
    database.ref('db_marketsfarmers/table_notif').child(this.props.uidSession)//.limitToLast(50)
    .orderByKey().on('value',(sn)=>{
      arrayNOtification=[];
        sn.forEach((data)=>{
          if(data.val().type!=='message')
            arrayNOtification.push({
                keyTb:data.key,
                id:data.val().idpost,
                content:data.val().content,
                state:data.val().state,
                time:data.val().time,
                title:data.val().title,
                type:data.val().type
            });
        });
        this.setState({dataSource:ds.cloneWithRows(arrayNOtification.reverse())});
    });
  }
  
  renderList(){
    if(this.state.dataSource!==null){
      return(
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={(rowData)=><ItemNotification uidSession={this.props.uidSession} sid={rowData.shopid} propsNavigator={this.props.propsNavigator} obj={rowData}
          ></ItemNotification>}
        />
      );
    }else if(this.state.dataSource===null){
      return(
        <View><Text>Waiting</Text></View>
      );
    }

  }
  render(){
    return(
      <View style={{flex:1}}>
      <View style={{backgroundColor:'#29B6F6'}}>
      <View style={{flexDirection:'row',backgroundColor:'#03A9F4'}}>
        <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_Back_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_arrow_back_white_24dp.png')} /></TouchableHighlight></View>
        <View style={{flex:7,paddingLeft:5}}>
{/* SEARCH INPUT */}
        <Text style={{fontSize:20,color:'white',marginTop:10}}>Thông báo</Text>
        </View>

{/* ICON BUTTON options */}
        <View style={{flex:1}}></View>
      </View>
      <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
      <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
      <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
      
      </View>
      {this.renderList()}

      </View>
    );
  }
  btn_Back_Click(){
    this.props.propsNavigator.pop();
  }
}
