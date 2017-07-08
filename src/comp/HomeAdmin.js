import React,{Component} from 'react';
import {Platform,StatusBar,AsyncStorage,AppRegistry,View,
  Modal,Text,TextInput,Item,TouchableHighlight,Picker,PickerIOS,Button,Image,ListView} from 'react-native';
import ItemListViewStatus from '../item_customer/ItemListViewStatus';
import Users from '../entities/Users'
import firebase from '../entities/FirebaseAPI';
var PushNotification = require('react-native-push-notification');

import BackgroundJob from 'react-native-background-job';

function RunBackground(uid){
  var a="d";
  database=firebase.database();
  tb_cm=database.ref('db_marketsfarmers/table_notif/'+uid);
  tb_cm.orderByChild('state').equalTo('dagui').on('value',(datasnapshot)=>{
  //tb_cm.orderByKey().limitToLast(1).on('value',(datasnapshot)=>{
    datasnapshot.forEach((haha)=>{
      if(haha.key!==a){
        a=haha.key;
        PushNotification.localNotification({
          title: haha.val().title, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
        message:haha.val().content, // (required)
          });
        danhan=database.ref('db_marketsfarmers/table_notif/'+uid);
        danhan.child(haha.key).set({
          idpost:haha.val().idpost,
          content:haha.val().content,
          state:'danhan',
          time:haha.val().time,
          title:haha.val().title,
          type:haha.val().type

        });
      }
    });


  })

}
const ds=new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});

export default class GuestMain extends Component{
  constructor(props){
    super(props);//
    muaban=['Mua','Bán'];
    loai=['Hoa, cây cảnh','Rau củ','Trái cây','Cây Tinh Bột','Thủy, hải sản','Gia súc, gia cầm','Cây công nghiệp','Cây Thuốc'];
    tinh=['Hà Nội','Tp.Hồ Chí Minh','Hải Phòng','Đà Nẵng','Cần Thơ','An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu','Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cao Bằng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang','Hà Nam','Hải Dương','Hậu Giang','Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai','Long An','Nam Định','Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Quảng Bình','Quảng Nam','Quãng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa','Thừa Thiên Huế','Tiền Giang','Trà Vinh','Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái','Phú Yên'];

    const ds=new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});
    this.state={
      dataSource:ds.cloneWithRows([]),
      modalVisible:false,
      uid:'-1',//  
      user:new Users(),//state là user mới có thể thay đổi dc      
    };


  }
  RunNotification(uid){
    //var a="d";
    database=firebase.database();
    tb_cm=database.ref('db_marketsfarmers/table_notif/'+uid);
    tb_cm.orderByChild('state').equalTo('dagui').on('value',(datasnapshot)=>{
    //tb_cm.orderByKey().limitToLast(1).on('value',(datasnapshot)=>{
      datasnapshot.forEach((haha)=>{

          //a=haha.key;
          danhan=database.ref('db_marketsfarmers/table_notif/'+uid);
          danhan.child(haha.key).set({
            idpost:haha.val().idpost,
            content:haha.val().content,
            state:'danhan',
            time:haha.val().time,
            title:haha.val().title,
            type:haha.val().type

          },()=>
            PushNotification.localNotification({
              title: haha.val().title, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            message:haha.val().content, // (required)
              })
          );



      });


    })

  }
  componentWillMount(){
    //kiểm tra uid session
    if(this.props.uidSession!=='0' && this.props.uidSession!=='-1'){//

      //khởi tạo firebase để lấy thông tin user từ uid đó
      database=firebase.database();
      tb_user=database.ref('db_marketsfarmers/table_users');
      //tạo user tạm us
      us=new Users();
      //orderByKey để chọn cột key,
      tb_user.orderByKey().equalTo(this.props.uidSession).on('value',(snap)=>{
          if(snap.exists()){//kiểm tra tồn tại user
            snap.forEach((data)=>{//data là 1 user lấy dc trong danh sách user trong list snap
              //lưu thông tin vào user tạm us
              us.uid=data.key;
              us.hovaten=data.val().hovaten;
              us.sdt=data.val().sdt;
              us.diachi=data.val().diachi;
              us.email=data.val().email;
              us.anhdaidien=data.val().anhdaidien;
              us.anhbia=data.val().anhbia;
            });
            //sau khi lấy thông tin user ở code trên lưu vào state.user
            this.setState({user:us});
            //BackgroundJob.cancelAll();
            const backgroundJob = {
              jobKey: "myJob",
              job: () => RunBackground(this.props.uidSession)
            };

            BackgroundJob.register(backgroundJob);
            BackgroundJob.getAll({callback: (jobs) =>{
              //console.log(jobs,"------------------->",jobs.length);
              if(typeof(jobs)!=='undefined'&& jobs.length===0){
                //console.log("------------------->",jobs.length);

                var backgroundSchedule = {
                  //alwaysRunning:true,
                  jobKey: "myJob",
                  timeout: 5000
                };

                BackgroundJob.schedule(backgroundSchedule);
              }

            }
            });



          }
          else{
            alert('firebase error');
          }
      });
     // this.RunNotification(this.props.uidSession);
    }
    //data
    this.RetriveDataPost();

  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  RetriveDataPost(){
    this.setState({dataSource:ds.cloneWithRows([])});
    tb_listposts=database.ref('db_marketsfarmers/table_posts/Bán');//trỏ đến chổ table_shops
  var postTam=[];//tạm lưu 1 post hiện tại
  var postKey=[];
        tb_listposts.orderByChild('statecheck')
        .equalTo('Chưa duyệt')
        .on('value',(snapshot)=>{
          postTam=[];
          postKey=[];
          snapshot.forEach((data)=>{
            flag=0;//chưa tồn tại post trong list            
            for(let i=0;i<postTam.length;i++){
              if(postTam[i].idpost===data.key){
                //có tồn tại rồi, update lại thôi
                postTam[i].idpost=data.key;
                postTam[i].diachi_t=data.val().diachi_t;
                postTam[i].giaban=data.val().giaban;
                postTam[i].loaitien=data.val().loaitien;
                postTam[i].thoigiandang=data.val().thoigiandang;
                postTam[i].tieude=data.val().tieude;
                postTam[i].muahayban=data.val().muahayban;
                //postTam[i].linkhinh=datahinh.val().linkpost;
                flag=1;//báo có tồn tại
                table_hinhs=database.ref('db_marketsfarmers/table_posts/Bán/'+data.key+'/images/');
                table_hinhs.limitToFirst(1).on('value',(snapHinh)=>{
                  snapHinh.forEach((datahinh)=>{
                    //alert(datahinh.val().linkpost);
                    postTam[i].linkhinh=datahinh.val().linkpost;
                  });
                });

              }
            }
            //console.log(datahinh.val().linkpost);
            if(flag===0){//không tồn tại, thêm mới post vào
              table_hinhs=database.ref('db_marketsfarmers/table_posts/Bán/'+data.key+'/images/');
              table_hinhs.limitToFirst(1).on('value',(snapHinh)=>{
                snapHinh.forEach((datahinh)=>{
                  //alert(datahinh.val().linkpost);
                  postKey.push(data.key);
                  postTam.push({
                    idpost:data.key,
                    diachi_t:data.val().diachi_t,
                    giaban:data.val().giaban,
                    loaitien:data.val().loaitien,
                    thoigiandang:data.val().thoigiandang,
                    tieude:data.val().tieude,
                    linkhinh:datahinh.val().linkpost,
                    muahayban:data.val().muahayban
                  });
                });
              });

            }
            
          });


//MUA
          tb_listpostsMUA=database.ref('db_marketsfarmers/table_posts/Mua');//trỏ đến chổ table_shops

          //var postTam=[];//tạm lưu 1 post hiện tại

                tb_listpostsMUA.orderByChild('statecheck')//xếp theo idpost_uid_own
                .equalTo('Chưa duyệt')//idpost_uid_own===idpostTam_uidsession
                .on('value',(snapshotMUA)=>{
                  posttam2=[];b=0;                  
                  for(let a=0;a<postTam.length;a++){
                    if(postTam[a].muahayban==='Bán'){
                      posttam2[b]=postTam[a];                      
                      b++;
                    }
                  }
                  postTam=[];
                  postTam=posttam2;
                  
                  snapshotMUA.forEach((dataMUA)=>{
                    flagMUA=0;//chưa tồn tại post trong list

                    for(let i=0;i<postTam.length;i++){
                      if(postTam[i].idpost===dataMUA.key){
                        //có tồn tại rồi, update lại thôi
                        postTam[i].idpost=dataMUA.key;
                        postTam[i].diachi_t=dataMUA.val().diachi_t;
                        postTam[i].giaban=dataMUA.val().giaban;
                        postTam[i].loaitien=dataMUA.val().loaitien;
                        postTam[i].thoigiandang=dataMUA.val().thoigiandang;
                        postTam[i].tieude=dataMUA.val().tieude;
                        postTam[i].muahayban=dataMUA.val().muahayban;
                        //postTam[i].linkhinh=datahinh.val().linkpost;
                        flagMUA=1;//báo có tồn tại
                        table_hinhsMUA=database.ref('db_marketsfarmers/table_posts/Mua/'+dataMUA.key+'/images/');
                        table_hinhsMUA.limitToFirst(1).on('value',(snapHinhMUA)=>{
                          snapHinhMUA.forEach((datahinhMUA)=>{
                            //alert(datahinh.val().linkpost);
                            postTam[i].linkhinh=datahinhMUA.val().linkpost;
                          });
                        });

                      }
                    }
                    //console.log(datahinh.val().linkpost);
                    if(flagMUA===0){//không tồn tại, thêm mới post vào
                      table_hinhsMUA=database.ref('db_marketsfarmers/table_posts/Mua/'+dataMUA.key+'/images/');
                      table_hinhsMUA.limitToFirst(1).on('value',(snapHinhMUA)=>{
                        snapHinhMUA.forEach((datahinhMUA)=>{
                          //alert(datahinh.val().linkpost);
                          postKey.push(dataMUA.key);
                          postTam.push({
                            idpost:dataMUA.key,
                            diachi_t:dataMUA.val().diachi_t,
                            giaban:dataMUA.val().giaban,
                            loaitien:dataMUA.val().loaitien,
                            thoigiandang:dataMUA.val().thoigiandang,
                            tieude:dataMUA.val().tieude,
                            linkhinh:datahinhMUA.val().linkpost,
                            muahayban:dataMUA.val().muahayban
                          });
                        });
                      });

                    }

                  });
                  
                  //thêm vào datasource cho listView in ra
                  postKey.sort(function(a, b){return a-b});
                  var postTamMain=[];
                  k=0;
                  for(let i=0;i<postKey.length;i++){
                    for(let j=0;j<postTam.length;j++){
                      if(postTam[j].idpost===postKey[i]){
                        postTamMain[k]=postTam[j];
                        k++;
                      }
                    }
                  }
                  
                  this.setState({dataSource:ds.cloneWithRows(postTamMain)});
                  //alert(this.state.dataSource.length);
                });



        });
    
    
  }
  
  Logined(){
   
//đã đăng nhập: render ra modal chứa menu
      return (
        <View>
        <View style={{backgroundColor:'#03A9F4'}}>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_Menu_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_reorder_white_24dp.png')} /></TouchableHighlight></View>
          <View style={{flex:8,paddingLeft:5}}><Text style={{fontSize:20,color:'white',marginTop:10}}>[HOME ADMIN] Bài chưa duyệt</Text>         
          </View>

{/* ICON BUTTON RING */}
          <View style={{flex:1}}></View>
        </View>        
        <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
        <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
        <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
        </View>

{/* modal menu nè */}
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{flex:1,flexDirection:'row'}}>
          <View style={{flex:2,backgroundColor:'white'}}>
          {/* load ảnh bìa, ảnh đại diện, tên người dùng vào menu  từ state.user đã lấy thông tin lúc nãy*/}
          <Image source={{uri:this.state.user.anhbia}} style={{width:'100%',height:150,borderBottomWidth:1,borderColor:'gray'}}>
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:80,height:80,marginTop:25,marginLeft:10,borderColor:'white',borderWidth:1,borderRadius:40}}/>
            <Text style={{color:'white',fontSize:20,marginTop:5,marginLeft:10}}>{this.state.user.hovaten}</Text>
</Image>{/*
            <TouchableHighlight  onPress={()=>this.btn_TinNhan_Click()}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/home_admin.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text style={{color:'black',fontSize:20,marginLeft:10,marginTop:15}}>Home - Duyệt bài</Text>
              </View>
            </TouchableHighlight>
            */}
            <TouchableHighlight onPress={() => this.btn_QuanLyNguoiDung()}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/lock.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text style={{color:'black',fontSize:20,marginLeft:10,marginTop:15}}>Quản lý người dùng</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => 
              this.btn_QuanLyShop()
            }>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/shops.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text  style={{color:'black',fontSize:20,marginLeft:10,marginTop:15}}>Quản lý shop</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.btn_QuanLyBaiDang()}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/paper_admin.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text  style={{color:'black',fontSize:20,marginLeft:10,marginTop:15}}>Quản lý bài đăng</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.btn_CaNhan_Click()}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/user.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text  style={{color:'black',fontSize:20,marginLeft:10,marginTop:15}}>Cá nhân</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
              this.props.propsNavigator.push({
                screen:'Help'                
              });
            }}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/support.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text  style={{color:'black',fontSize:20,marginLeft:10,marginTop:15}}>Hướng dẫn và trợ giúp</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
              this.props.propsNavigator.push({
                screen:'AboutApp'
              });
            }}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/aboutapp.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text style={{color:'black',fontSize:20,marginLeft:10,marginTop:15}}>Thông tin ứng dụng</Text>
              </View>
            </TouchableHighlight>


            <TouchableHighlight onPress={() => this.btn_DangXuat_Click()}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/logout.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text style={{color:'black',fontSize:20,marginLeft:10,marginTop:15}}>Đăng xuất</Text>
              </View>
            </TouchableHighlight>

          </View>
          <TouchableHighlight underlayColor='#ffffff00' style={{flex:1,backgroundColor:'#212121a0'}} onPress={() => {
            this.setModalVisible(!this.state.modalVisible)
          }}><View></View></TouchableHighlight>
         </View>

        </Modal>
        </View>

      );
    

  }
  render(){

    return(
      <View style={{backgroundColor:'#E0E0E0',flex:1}}>
      <StatusBar
     backgroundColor="#0288D1"
     barStyle="light-content"
   />
{this.Logined(this)}

      <ListView
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        renderRow={(rowData)=><ItemListViewStatus uidSession={this.props.uidSession} propsNavigator={this.props.propsNavigator} obj={rowData}

        ></ItemListViewStatus>}
      />
      </View>

    );
  }
  btn_DangXuat_Click(){
    this.setModalVisible(false);
    AsyncStorage.setItem('uid_store','0');//đăng xuất , lưu uid_store chứa uid user thành 0
    this.props.propsNavigator.push({
      screen:'Login'
    });
    BackgroundJob.cancel({jobKey: 'myJob'});
  }
  btn_DangNhap_Click(){
    this.props.propsNavigator.push({
      screen:'Login'
    });
  }
  btn_TimKiem_Click(){
    this.RetriveDataPost();
    //alert('button Tim Kiem is clicked');
    /*
    PushNotification.localNotification({
      title: "My Notification Title", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
    message: "My Notification Message", // (required)
  });*/
}
btn_QuanLyBaiDang(){
  this.setModalVisible(!this.state.modalVisible);
  this.props.propsNavigator.push({
    screen:'QLStatus',
    uidSession:this.state.user.uid    
  });
}
btn_QuanLyShop(){
  this.setModalVisible(!this.state.modalVisible);
  this.props.propsNavigator.push({
      screen:'QLShops',//chạy tới màn hình tiếp
      uidSession:this.state.user.uid
  });
}
  btn_Menu_Click(){
    this.setModalVisible(true);
  }
  btn_TinNhan_Click(){
    this.setModalVisible(!this.state.modalVisible);
    this.props.propsNavigator.push({
      screen:'ListMessendger',
      uidSession:this.state.user.uid
    });
  }
  btn_Caidat_Click(){
    this.setModalVisible(!this.state.modalVisible);
    this.props.propsNavigator.push({
      screen:'ListUser_Admin'
    });
  }
  btn_QuanLyNguoiDung(){
    this.setModalVisible(!this.state.modalVisible);
    this.props.propsNavigator.push({
      screen:'ListUsers',//chạy tới màn hình tiếp
      uidSession:this.state.user.uid
    });
  }
  btn_CaNhan_Click(){
    this.setModalVisible(!this.state.modalVisible);
    this.props.propsNavigator.push({
      screen:'InfoPersonal',
      //làm đi, gửi uidSession qua, thôi để tui làm mẫu, chưa có chổ nào làm đâu mà tìm
      uidSession:this.state.user.uid,
      uidadmin:'0'
    });
  }

}
