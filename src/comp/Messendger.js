import React,{Component} from 'react';
import {AppRegistry,View,Image,TextInput,TouchableHighlight,ListView,Text} from 'react-native';
import ItemInbox from '../item_customer/ItemInbox';
import firebase from '../entities/FirebaseAPI';
import Users from '../entities/Users';
const ds=new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});
const list_inbox=[];

export default class Messendger extends Component{
  constructor(props){
    super(props);
    //alert(this.props.uidGetMessage);
    list_inbox=[];
      this.state={
        dataSource:ds.cloneWithRows(list_inbox),textip:'',
        txt_noidungtinnhan:'',
        user_me:new Users(),
        user_you:new Users(),
        leng:0
      };

  }
  componentWillMount(){
    list_inbox=[];
    this.setState({dataSource:ds.cloneWithRows(list_inbox)});
    database=firebase.database();
    tb_user=database.ref('db_marketsfarmers/table_users');
    //tạo user tạm us
    us=new Users();
    us2=new Users();
    us.hovaten=' ';
    this.setState({user_you:us});
    //orderByKey để chọn cột key,
    tb_user.orderByKey().equalTo(this.props.uidGetMessage).on('value',(snap)=>{
        if(snap.exists()){//kiểm tra tồn tại user
          snap.forEach((data)=>{//data là 1 user lấy dc trong danh sách user trong list snap
            //lưu thông tin vào user tạm us
            us.uid=data.key;
            us.hovaten=data.val().hovaten;
            us.anhdaidien=data.val().anhdaidien;
          });
          //sau khi lấy thông tin user ở code trên lưu vào state.user
          this.setState({user_you:us});
          ///////---------------------------------------------
              tb_user.orderByKey().equalTo(this.props.uidSession).on('value',(snap)=>{
                  if(snap.exists()){//kiểm tra tồn tại user
                    snap.forEach((data)=>{//data là 1 user lấy dc trong danh sách user trong list snap
                      //lưu thông tin vào user tạm us
                      us2.hovaten=data.val().hovaten;
                      us2.anhdaidien=data.val().anhdaidien;
                      //alert(data.val().anhdaidien);
                    });
                    //sau khi lấy thông tin user ở code trên lưu vào state.user
                    this.setState({user_me:us2});
                    ///////---------------------------------------------


                    tb_detaiInbox=database.ref('db_marketsfarmers/table_messendgers/'+this.props.uidSession)
                    .child(this.props.uidGetMessage).limitToLast(5);//uid2, user 2,ng nhận
                    tb_detaiInbox.on('value',(snapshot_detai)=>{
                        list_inbox=[];
                      snapshot_detai.forEach((data_mess)=>{//
                          let own=true;
                          flag=true;//cờ không trùng
                          let tinhtrang='đã gửi';//
                          let linkavartar=this.state.user_me.anhdaidien;//gán đại diện tôi
                          if(data_mess.val().sender===2){//nếu là nội dung của ng nhận
                            own=false;//cờ sở hữu la ng nhận
                            linkavartar=this.state.user_you.anhdaidien;//ảnh đại diện ng nhận
                            if(data_mess.val().seen_1===true)//tôi đã xem?
                              tinhtrang='đã xem';
                          }else{
                            if(data_mess.val().seen_2===true)//ng nhận đã xem?
                              tinhtrang='đã xem';
                          }
                          for(let i=0;i<list_inbox.length;i++){
                            if(data_mess.key===list_inbox[i].key){
                              flag=false;
                              break;
                            }
                          }
                          if(flag){
                            list_inbox.push({
                              key:data_mess.val().key,
                              noidungtinnhan:data_mess.val().noidungtinnhan,
                              thoigiangui:data_mess.val().thoigiangui,
                              own:own,//cờ người sở hữu tin nhắn
                              linkavartar:linkavartar,
                              tinhtrang:tinhtrang,
                            });
                          }else{
                            list_inbox[i].key=data_mess.val().key;
                            list_inbox[i].noidungtinnhan=data_mess.val().noidungtinnhan;
                            list_inbox[i].thoigiangui=data_mess.val().thoigiangui;
                            list_inbox[i].own=own;//cờ người sở hữu tin nhắn
                            list_inbox[i].linkavartar=linkavartar;
                            list_inbox[i].tinhtrang=tinhtrang;
                          }



                      });
                this.setState({dataSource:ds.cloneWithRows(list_inbox),leng:list_inbox.length});
                
              });
                  }
                  else{
                    alert('firebase error');
                  }
              });
        }
        else{
          alert('firebase error');
        }
    });
    countmes=database.ref('db_marketsfarmers/table_notif/'+this.props.uidSession);
    countmes.orderByChild('idpost').equalTo(this.props.uidGetMessage).on('value',(sn2)=>{                                    
        sn2.forEach((dt2)=>{
            if(dt2.val().state!=='đã xem'){
               database.ref('db_marketsfarmers/table_notif/'+this.props.uidSession)
               .child(dt2.key).update({
                 state:'đã xem'
               });
            }                     
        });                              
    });

  }
  btn_GuiTinNhanDi_Click(){
    
    if(this.state.txt_noidungtinnhan.trim()==='')
      return;
    database=firebase.database();
    insert_message=database.ref('db_marketsfarmers/table_messendgers');
    var d = new Date();//new time now
    var time = d.toString().slice(4,24);//cắt chuỗi thòi gian cần ngày thang năm giờ:phut:giay
    //người gửi
    insert_message.child(this.props.uidSession)//uid 1
    .child(this.props.uidGetMessage)//uid 2
    .push({
      noidungtinnhan:this.state.txt_noidungtinnhan,//nội ding tin nhắn
      thoigiangui:time,//thời gian gửi tin nhắn
      seen_1:true,//user 1 đã xem gửi
      seen_2:false,//user 2 đã xem nhận
      sender:1// người gửi 1:uid_1, 2: là uid_2
    });//sau khi gửi
    //người nhận
    //set thông báo
    var flag=0;
    notification=database.ref('db_marketsfarmers/table_notif/'+this.props.uidGetMessage);

    notification.orderByKey().limitToLast(1).//once('value')
  //.then(function(snap) {
    on('value',(snap)=>{

      snap.forEach((data)=>{
        //console.log(flag+":"+parseInt(data.key));
        if(flag!==parseInt(data.key)){
          var maxid=parseInt(data.key)+1;
          //dem++;
          flag=maxid;
          insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.props.uidGetMessage);
          insert_noti.child(maxid).set({
            idpost:this.props.uidSession,
            content:this.state.txt_noidungtinnhan,
            state:'dagui',
            time:time,
            title:this.state.user_me.hovaten,
            type:'message'
          },()=>{
            notification.off('value');
          });
        }
      });

    });
    insert_message.child(this.props.uidGetMessage)//uid 1 nhận
    .child(this.props.uidSession)//uid 2 gửi
    .push({
      noidungtinnhan:this.state.txt_noidungtinnhan,//nội ding tin nhắn
      thoigiangui:time,//thời gian gửi tin nhắn
      seen_1:false,//user 1 đã xem
      seen_2:true,//user 2 đã xem
      sender:2// người gửi 1:uid_1, 2: là uid_2
    },()=>{
      notification.off('value');
      this.AfterSendMessage()
    });//sau khi gửi

  }
  AfterSendMessage(){

    this.setState({
      txt_noidungtinnhan:'',//sét về mặc định cho inputtext rỗng
    });
  }
  render(){

    return(
      <View style={{flex:1,backgroundColor:'white'}}>
        <View style={{flex:1}}>
        <View style={{backgroundColor:'#03A9F4'}}>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_Back_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_arrow_back_white_24dp.png')} /></TouchableHighlight></View>
          <View style={{flex:7,paddingLeft:5}}>
{/* SEARCH INPUT */}
          <Text style={{fontSize:20,color:'white',marginTop:10}}>{this.state.user_you.hovaten}</Text>
          </View>

{/* ICON BUTTON options */}
          <View style={{flex:1}}>
            <TouchableHighlight underlayColor='#E0F7FA' 
            onPress={()=> this.props.propsNavigator.push({
                  screen:'InfoPersonal',
                  //làm đi, gửi uidSession qua, thôi để tui làm mẫu, chưa có chổ nào làm đâu mà tìm
                  uidSession:this.state.user_you.uid,
                  uidadmin:'guest',
                  uidguest:this.props.uidSession
                })} 
                style={{width:40,height:40,marginTop:3}}>
            <Image source={{uri:this.state.user_you.anhdaidien}} style={{height:37,width:37,borderRadius:100,borderWidth:1,borderColor:'white'}} /></TouchableHighlight></View>
        </View>
        <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
        <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
        <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
        </View>
        </View>
        <View style={{flex:12}}>
        <ListView
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        renderRow={(rowData)=><ItemInbox propsNavigator={this.props.propsNavigator} inbox={rowData} uidSession={this.props.uidSession} uidGetMessage={this.props.uidGetMessage}/>}
        />
      </View>
      <View style={{flex:1,flexDirection:'row'}}>
        <View style={{flex:8,paddingLeft:5,marginTop:5}}>
        <TextInput style={{backgroundColor:'white',borderColor:'#0277BD',borderWidth:1,borderRadius:3,height:38,fontSize:15}} underlineColorAndroid="white" returnKeyType="send"
        value={this.state.txt_noidungtinnhan}
        onChangeText={(value)=>this.setState({txt_noidungtinnhan:value})}
        onSubmitEditing={()=>this.btn_GuiTinNhanDi_Click()}/>
        </View>
        <View style={{flex:1,marginTop:5,paddingLeft:2}}>
        <TouchableHighlight underlayColor='#FAFAFA'  onPress={()=>this.btn_GuiTinNhanDi_Click()}><Image source={require('../img/sent.png')} style={{height:55,width:55}}/>
        </TouchableHighlight>
        </View>
        </View>

      </View>
    );
  }
  btn_Back_Click(){
    this.props.propsNavigator.pop();
  }
}
AppRegistry.registerComponent('Component_API_Demo',()=>Messendger);
