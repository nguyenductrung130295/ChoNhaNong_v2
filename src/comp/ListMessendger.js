import React,{Component} from 'react'
import {Alert,Text,ListView,AppRegistry,TouchableHighlight,Image,View,Modal,TextInput,Picker,Button} from 'react-native'
import ItemListMessendger from '../item_customer/ItemListMessendger'
import firebase from '../entities/FirebaseAPI'
export default class ListMessendger extends Component{

  constructor(props){
    super(props);

    this.state={
      dataSource:null,//datasource cho ListView
      modalVisible: false,//ẩn hiện modal tạo cửa hàng mới
      txt_sdt_user:'',//input tìm kiếm user qua số điện thoại
      ten_user_found:'',//tên user tìm được,
      uid_user_found:'-1',//uid user tìm được,nếu bằng trừ 1 thì ko render,0 thì render tìm ko thấy,khác cả 2 thì tìm thấy
      anhdaidien_user_found:'',
      anhbia_user_found:'',
      modalSearchUser:false,
      clickSearch:true,
  };
  }
  //hàm này chạy trước khi render ra màn hình
  componentWillMount(){
    //list shops: danh sách shops rỗng, là mảng các đối tượng shops
    list_inbox=[];
    const ds=new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});
    //alert(this.props.us_uid);
    //khởi tạo dữ liệu firebase lấy danh sách shops
    database=firebase.database();
    tb_listshop=database.ref('db_marketsfarmers/table_messendgers');//trỏ đến chổ table_shops
    tb_listshop.child(this.props.uidSession)//this.props.uidSession
    .on('value',(snapshot)=>{

      list_inbox=[];//cứ mỗi lần thây đổi là phải set nó rỗng chứ ko nó sẽ lặp lại danh sách
      snapshot.forEach((data1)=>{

        tb_detaiInbox=database.ref('db_marketsfarmers/table_messendgers/'+this.props.uidSession)
        .child(data1.key).limitToLast(1);//uid2, user 2,ng nhận
        tb_detaiInbox.on('value',(snapshot_detai)=>{
          snapshot_detai.forEach((data_mess)=>{//

            tb_user=database.ref('db_marketsfarmers/table_users');
            tb_user.orderByKey().equalTo(data1.key).limitToLast(1)//uid2
            .on('value',(snap)=>{
              snap.forEach((data2)=>{//infor user 2                
                //đếm số tin nhắn chưa đọc của user này đối vs ng gửi               
                  list_inbox.push({//push đối tượng thông tin shops vào list_shop
                  uid_send:this.props.uidSession,
                  hovaten_send:data2.val().hovaten,
                  anhdaidien_send:data2.val().anhdaidien,
                  noidung_last:data_mess.val().noidungtinnhan,
                  seen_1:data_mess.val().seend_1,
                  seen_2:data_mess.val().seend_2,
                  sender:data_mess.val().sender,
                  thoigiangui:data_mess.val().thoigiangui,
                  uid_get:data1.key,
                  
                });                                  
                

              });
              this.setState({clickSearch:false});
            this.setState({dataSource:ds.cloneWithRows(list_inbox)});
          });
        });
        });


      });
      //khi push xong hết rồi set nó vào dataSource của listview
      //this.setState({dataSource:ds.cloneWithRows(list_inbox)})
    });


  }
  btn_TaoCuaHangMoi_Click(){
    //khởi tạo dữ liệu kết nối tới fireabase
    database=firebase.database();
    //trỏ tới bảng table_shops
    tb_shops=database.ref('db_marketsfarmers/table_shops');
    //insert
    tb_shops.push({
      tencuahang:this.state.txt_tencuahangmoi,//ten cửa hàng mới
      loaisp:this.state.loaisp,//loại sản phẩm( picker )
      sdtcuahang:'',//so dien thoại cửa hàng
      diachi_txh:'',//thôn xã huyện
      diachi_t:this.state.diachi_t,//tỉnh/tp (picker)
      score_star:'0',//số sao đánh giá
      anhbiashop:'https://firebasestorage.googleapis.com/v0/b/nodejsdemo-d89c7.appspot.com/o/photos%2Fbanner_users%2Fthiennhiendep201633.jpg?alt=media&token=43daf4e8-8d4c-4203-a355-5b121223095c',
      logoshop:'https://firebasestorage.googleapis.com/v0/b/nodejsdemo-d89c7.appspot.com/o/photos%2Flogo_shops%2Fshops.png?alt=media&token=53c1c3ca-bab4-4a05-94f5-5fbe38972131',
      user_own:this.props.us_uid,//user chủ sở hữu cửa hàng
    },()=>alert('thành công'));// hiện thông báo sau khi làm push xong
  }
  setModalVisible(visible) {
    this.setState({modalVisible:visible});
  }
  renderList(){
    if(this.state.dataSource!==null){
      return(
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={(rowData)=><ItemListMessendger propsNavigator={this.props.propsNavigator} obj={rowData}
          ></ItemListMessendger>}
        />
      );
    }else if(this.state.dataSource===null){
      //this.setState({clickSearch:true});
      return(
        <View style={{padding:10}}><Text >Tìm kiếm người khác bằng số điện thoại để bắt đầu nhắn tin.</Text></View>
      );
    }

  }
  btn_GuiTinNhan_Search(){
    this.props.propsNavigator.push({
      screen:'Messendger',
      uidSession:this.props.uidSession,
      uidGetMessage:this.state.uid_user_found
    });
  }
  renderResultSearch(){
    if(this.state.uid_user_found==='0'){
      return(
        <Text style={{color:'black'}}>Không tìm thấy</Text>
      );
    }else if(this.state.uid_user_found==='-1')
    return null;
    else if(this.state.uid_user_found!=='-1' &&this.state.uid_user_found!=='0' &&this.state.uid_user_found!==null){
      return(
        <View>
          
          <Image style={{width:'100%',height:250,justifyContent:'center'}}  source={{uri:this.state.anhbia_user_found}}>     
            <Image style={{width:140,height:140,borderRadius:100,borderWidth:1,borderColor:'white',marginLeft:15,marginTop:30}} source={{uri:this.state.anhdaidien_user_found}}/>            
            </Image>
            <Text style={{fontSize:20,marginBottom:5,color:'blue',marginLeft:10}} >{this.state.ten_user_found}</Text>
            <View style={{flexDirection:'row',marginBottom:5,justifyContent:'center'}} >
              <Button title={'Chi tiết'} onPress={()=>{
                this.setState({clickSearch:!this.state.clickSearch,modalSearchUser:!this.state.modalSearchUser});
                this.props.propsNavigator.push({
                  screen:'InfoPersonal',
                  //làm đi, gửi uidSession qua, thôi để tui làm mẫu, chưa có chổ nào làm đâu mà tìm
                  uidSession:this.state.uid_user_found,
                  uidadmin:'guest',
                  uidguest:this.props.uidSession
                });
                }}/>
                <Text>        </Text>
                <Button title={'Nhắn tin'} onPress={()=>{
                  this.setState({clickSearch:!this.state.clickSearch,modalSearchUser:!this.state.modalSearchUser});
                  this.props.propsNavigator.push({
                    screen:'Messendger',
                    uidSession:this.props.uidSession,
                    uidGetMessage:this.state.uid_user_found
                  });
                }}/>
            </View>            
            
        </View>
      );
    }
  }
  render(){
    return(
      <View style={{flex:1}}>
      <View style={{backgroundColor:'#03A9F4'}}>
      <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}><TouchableHighlight underlayColor='#FAFAFA' onPress={()=>this.btn_Back_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_arrow_back_white_24dp.png')} /></TouchableHighlight></View>
        <View style={{flex:7,paddingLeft:5}}>
{/* SEARCH INPUT */}
        <Text style={{fontSize:20,color:'white',marginTop:10}}>Nhắn tin</Text>
        </View>

{/* ICON BUTTON options */}
        <View style={{flex:1}}>
          <TouchableHighlight underlayColor='#FAFAFA' 
          onPress={()=>this.setState({clickSearch:!this.state.clickSearch})} style={{width:40,height:40,marginTop:5,borderRadius:20}}>
          <Image source={require('../img/ic_search_white_24dp.png')} />
          </TouchableHighlight></View>
      </View>
      {this.state.clickSearch?
      <View style={{flexDirection:'row',marginTop:5,marginBottom:5}}>
        <View style={{flex:5,paddingLeft:10}}>
          <TextInput placeholder="  Số điện thoại"
          style={{backgroundColor:'white',borderRadius:4,borderWidth:1,borderColor:'#BDBDBD',height:38,color:'black'}}
          onChangeText={(value)=>this.setState({txt_sdt_user:value})}
          />
        </View>        
        <View style={{flex:1,paddingLeft:10,paddingRight:10}}>          
            <TouchableHighlight style={{height:35,justifyContent:'center',alignItems:'center',backgroundColor:'#4FC3F7',borderRadius:2,borderColor:'white',borderWidth:1}} 
            onPress={()=>this.btn_TimKiemUserBySdt()}><Text style={{color:'#ffffff'}}>OK</Text></TouchableHighlight>
        </View>
      </View>
      :null}
      <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
      <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
      <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
      </View>
            
      {this.renderList()}

<Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalSearchUser}
              onRequestClose={() => alert("Modal has been closed.")}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1',borderTopLeftRadius:5,borderTopRightRadius:5}}>
                <View style={{flex:7}}>
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Kết quả tìm kiếm</Text>
                </View>
                <View style={{flex:1}}>
               <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setState({modalSearchUser:!this.state.modalSearchUser,clickSearch:!this.state.clickSearch})
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>   
                </View>
              </View>
              <View style={{padding:10}}>
                {this.renderResultSearch()}
              </View>                          
          </View>
              </View>
              <View style={{flex:1}}></View>
             </View>
            </Modal>
      </View>
    );
  }
   checkSDT(ip){
    if(isNaN(ip)===false){//toàn số
      if(ip.charAt(0)==='0')
        return true;
      return false;
    }else
      return false;    
  }
  btn_TimKiemUserBySdt(){
    if(this.checkSDT(this.state.txt_sdt_user.trim())===false){
      Alert.alert('Thông báo','Số điện thoại không hợp lệ !!!');
      return;
    }
    this.setState({modalSearchUser:!this.state.modalSearchUser});
    tb_user=database.ref('db_marketsfarmers/table_users');
    tb_user.orderByChild('sdt').equalTo(this.state.txt_sdt_user).limitToLast(1)//uid2
    .on('value',(snap)=>{
      if(snap.exists()){
        snap.forEach((data)=>{//infor user 2
            this.setState({
              uid_user_found:data.key,
              anhbia_user_found:data.val().anhbia,
              anhdaidien_user_found:data.val().anhdaidien,
              ten_user_found:data.val().hovaten,
            });
        });
      }else{
        this.setState({uid_user_found:'0'});
      }

    });
  }
  btn_Back_Click(){
    this.props.propsNavigator.pop();
  }
}
