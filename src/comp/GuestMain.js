import React,{Component} from 'react';
import {Platform,StatusBar,AsyncStorage,AppRegistry,View,
  Modal,Text,TextInput,Item,TouchableHighlight,Picker,PickerIOS,Button,Image,ListView} from 'react-native';
import ItemListViewStatus from '../item_customer/ItemListViewStatus';
import Users from '../entities/Users'
import firebase from '../entities/FirebaseAPI';
var PushNotification = require('react-native-push-notification');

import BackgroundJob from 'react-native-background-job';
  
  
  PushNotification.configure({
    
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
    }
});




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

        },()=>tb_cm.off('value'));
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
    
    this.state={
      dataSource:ds.cloneWithRows([]),
      dts:true,
      modalVisible:false,
      modalMuahaybanIOS:false,//hiện ẩn modal menu
      modalLoaiSpIOS:false,//hiện ẩn modal menu
      modalTinhTpIOS:false,//hiện ẩn modal menu
      uid:'-1',//
      select_muaban:'Bán',//mặc định
      select_loaisp:'Trái cây',
      select_tinh:'Tp.Hồ Chí Minh',
      user:new Users(),//state là user mới có thể thay đổi dc
      txt_search:'',//input search,
      notifiAnother:0,
      notifTinNhan:0
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

          },()=>{
PushNotification.localNotification({
              title: haha.val().title, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            message:haha.val().content, // (required)
              });
              //tb_cm.off('value');
          }            
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
            BackgroundJob.setGlobalWarnings(true);
  BackgroundJob.getAll({callback: (jobs) => {
    if(jobs.length===0)
    {
      var backgroundJob = {
              jobKey: "myJob",
              job: () => this.RunBackground(this.props.uidSession)
            };
      BackgroundJob.register(backgroundJob);
      var backgroundSchedule = {
                  alwaysRunning:true,
                  jobKey: "myJob",
                  timeout: 5000,
                  //warn:false
                };

      BackgroundJob.schedule(backgroundSchedule);
      console.log(jobs);
    }else{
      console.log(jobs);
    }
  }});
          }
          else{
            alert('firebase error');
          }
      });
      this.RunNotification(this.props.uidSession);
    }
    //data
    this.RetriveDataPost();

  }
  RetriveDataPost(){
    this.setState({dataSource:ds.cloneWithRows([])});
    //Sau khi mỗi lần lọc là làm rỗng lại chứ ko nó chồng cái mới
    //y chang cái cũ, gấp đôi lên á
    tb_listposts=database.ref('db_marketsfarmers/table_posts/'+this.state.select_muaban);//lọc theo bán/mua
    var postTam=[];//tạm lưu 1 post hiện tạis   s
    var tam=[];
    var xoa='';
    var post1=[];//sau khi search tiểu đề
          tb_listposts.orderByChild('tieude')//sắp xếp theo tiêu đề, cái chổ mình nhập zô search
          .startAt(this.state.txt_search)//bắt đầu bằng
          .endAt(this.state.txt_search+'\uf8ff')//kết thúc, uf8ff là lấy tất cả phía sau
          //.orderByChild('idpost')//xếp theo idpost_uid_own
          //.equalTo(idpostTam+"_"+this.props.uidSession)//idpost_uid_own===idpostTam_uidsession
          .on('value',(snapshot)=>{

            snapshot.forEach((data1)=>{
              console.log('1---->'+data1.val().tieude);
              postTam=[];
              post1.push(data1.key);//lấy id post sau lần  lọc bằng tiêu đề
              //console.log("1------------->"+data1.key);
            });


            post1.sort(function(a, b){return b-a});//sắp xếp
            tam=post1;
            //
            var post2=[];
            for(let i=0;i<post1.length;i++){
              //mỗi post lấy đc, giờ lọc theo loaisp
              lspost2=database.ref('db_marketsfarmers/table_posts/'+this.state.select_muaban+"/"+post1[i]);
              lspost2.once('value',(snap1)=>{

                if(snap1.exists()){
                  console.log('2---->'+snap1.val().tieude);
                  if(snap1.val().loaisp===this.state.select_loaisp && snap1.val().statecheck==='Bình thường')//chổ này để kiểm tra(trái cấy....)
                  {
                    post2.push(post1[i]);//post sau khi lọc lần 2,
                  }
                }else{
                  for(let a=0;a<post2.length;a++){
                    if(post2[a]===post1[i])
                      post2[a]='0';
                  }
                }
                  //console.log("2------------->"+snap1.val().loaisp);

              });
              if(i===post1.length-1){
                for(let j=0;j<post2.length;j++){
                  //lọc tiếp theo tỉnh
                  lspost3=database.ref('db_marketsfarmers/table_posts/'+this.state.select_muaban+"/"+post2[j]);
                  lspost3.once('value',(data)=>{
                    if(data.exists() && data.val().diachi_t===this.state.select_tinh){
                      console.log(this.state.select_loaisp+":"+this.state.select_tinh+"3------------->"+data.val().tieude);
                      flag=0;//chưa tồn tại post trong list

                      for(let i=0;i<postTam.length;i++){
                        if(postTam[i].idpost===data.key){
                          //có tồn tại rồi, update lại thôi
                          postTam[i].idpost=data.key;
                          postTam[i].diachi_t=data.val().diachi_t;
                          postTam[i].giaban=data.val().giaban;
                         // postTam[i].loaitien=data.val().loaitien;
                          postTam[i].thoigiandang=data.val().thoigiandang;
                          postTam[i].tieude=data.val().tieude;
                          //postTam[i].linkhinh=datahinh.val().linkpost;
                          flag=1;//báo có tồn tại
                          table_hinhs=database.ref('db_marketsfarmers/table_posts/'+this.state.select_muaban+"/"+data.key+'/images/');
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
                table_hinhs=database.ref('db_marketsfarmers/table_posts/'+this.state.select_muaban+"/"+data.key+'/images/');
                table_hinhs.limitToFirst(1).on('value',(snapHinh)=>{

                  snapHinh.forEach((datahinh)=>{
                    //alert(datahinh.val().linkpost);

                    postTam.push({
                      idpost:data.key,
                      diachi_t:data.val().diachi_t,
                      giaban:data.val().giaban,
                      //loaitien:data.val().loaitien,
                      thoigiandang:data.val().thoigiandang,
                      tieude:data.val().tieude,
                      linkhinh:datahinh.val().linkpost
                    });
                  });
                });

              }
                    }
                  });
                }

                //thêm vào datasource cho listView in ra
                this.setState({dataSource:ds.cloneWithRows(postTam)});
                if(postTam.length>0)
                  this.setState({dts:true});
                else
                  this.setState({dts:false});
              }
            }

          });
//ĐẾM SỐ THÔNG BÁO CHƯA XEM
      var demtinnhan=0;
      var demthongbao=0;
          database.ref('db_marketsfarmers/table_notif').child(this.props.uidSession)//.limitToLast(20)
    //.orderByKey()
    .on('value',(sn)=>{
      demtinnhan=0;
      demthongbao=0;
        sn.forEach((data)=>{
          if(data.val().state!=='đã xem'){
            if(data.val().type==='message')
              demtinnhan++;
            else
              demthongbao++;
          }
          
            
        });
        this.setState({notifTinNhan:demtinnhan,notifiAnother:demthongbao});
    });
  }
  renderItemBan(){
    items=[];
    for(let item of muaban){
      items.push(<Picker.Item key={item} label={item} value={item}/>)
    }
    return items;
  }
  renderItemLoai(){
    items=[];
    for(let item of loai){
      items.push(<Picker.Item key={item} label={item} value={item}/>)
    }
    return items;
  }
  renderItemTinh(){
    items=[];
    for(let item of tinh){
      items.push(<Picker.Item key={item} label={item} value={item}/>)
    }
    return items;
  }
  renderItemBanIOS(){
    items=[];
    for(let item of muaban){
      items.push(<PickerIOS.Item key={item} label={item} value={item}/>)
    }
    return items;
  }
  renderItemLoaiIOS(){
    items=[];
    for(let item of loai){
      items.push(<PickerIOS.Item key={item} label={item} value={item}/>)
    }
    return items;
  }
  renderItemTinhIOS(){
    items=[];
    for(let item of tinh){
      items.push(<PickerIOS.Item key={item} label={item} value={item}/>)
    }
    return items;
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  render3PickerChoose(){
    if(Platform.OS==='ios'){
      return(

        <View style={{flexDirection:'row',marginTop:5,marginBottom:5}}>
  {/* PICKER BÁN MUA */}
          <View style={{flex:3}}>
          <View style={{marginLeft:5,backgroundColor:'#29b6f6',borderRadius:3,borderColor:'#81D4FA',borderWidth:1}}>
          <Text onPress={()=>this.setState({modalMuahaybanIOS:!this.state.modalMuahaybanIOS})}
                style={{color:'white'}}>{this.state.select_muaban}</Text>
          <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.modalMuahaybanIOS}
            onRequestClose={() => alert("Modal has been closed.")}
            >
           <View style={{flex:1,backgroundColor:'#000000a0'}}>
            <View style={{flex:2}}></View>
            <View style={{flex:2}}>
            <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
            <View style={{flexDirection:'row',backgroundColor:'#0288D1'}}>
              <View style={{flex:7}}>
                <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Mua hay ban</Text>
              </View>
              <View style={{flex:1}}>
                <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                  this.setState({modalMuahaybanIOS:!this.state.modalMuahaybanIOS})
                }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
              </View>
            </View>
            <View>
              <PickerIOS selectedValue={this.state.select_muaban}
              onValueChange={(value)=>this.setState({select_muaban:value})}>
                {this.renderItemBanIOS()}
              </PickerIOS>
              </View>
                <View style={{padding: 10}}>
              <Button onPress={()=>this.btn_TaoCuaHangMoi_Click()} title={'Tạo cửa hàng'} color='#03A9F4'></Button>
        </View>
        </View>
            </View>
            <View style={{flex:2}}></View>
           </View>
          </Modal>
          </View>

          </View>
  {/* PICKER LOẠI */}
          <View style={{flex:4}}><View style={{marginLeft:5,backgroundColor:'#29b6f6',borderRadius:3,borderColor:'#81D4FA',borderWidth:1}}>
          <Text onPress={()=>this.setState({modalLoaiSpIOS:!this.state.modalLoaiSpIOS})}
                style={{color:'white'}}>{this.state.select_loaisp}</Text>
          <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.modalLoaiSpIOS}
            onRequestClose={() => alert("Modal has been closed.")}
            >
           <View style={{flex:1,backgroundColor:'#000000a0'}}>
            <View style={{flex:1}}></View>
            <View style={{flex:2}}>
            <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
            <View style={{flexDirection:'row',backgroundColor:'#0288D1'}}>
              <View style={{flex:7}}>
                <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Loai San Pham</Text>
              </View>
              <View style={{flex:1}}>
                <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                  this.setState({modalLoaiSpIOS:!this.state.modalLoaiSpIOS})
                }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
              </View>
            </View>

            <View>
            <PickerIOS selectedValue={this.state.select_loaisp} onValueChange={(value)=>this.setState({select_loaisp:value})}>
              {this.renderItemLoaiIOS()}
            </PickerIOS>
            </View>

                <View style={{padding: 10}}>

              <Button onPress={()=>this.btn_TaoCuaHangMoi_Click()} title={'Tạo cửa hàng'} color='#03A9F4'></Button>
          </View>
          </View>
            </View>
            <View style={{flex:1}}></View>
           </View>
          </Modal>
          </View>
          </View>
  {/* PICKER TỈNH THÀNH PHỐ */}
          <View style={{flex:5}}><View style={{marginLeft:5,backgroundColor:'#29b6f6',marginRight:5,borderRadius:3,borderColor:'#81D4FA',borderWidth:1}}>
          <Text onPress={()=>this.setState({modalTinhTpIOS:!this.state.modalTinhTpIOS})}
                style={{color:'white'}}>{this.state.select_tinh}</Text>
          <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.modalTinhTpIOS}
            onRequestClose={() => alert("Modal has been closed.")}
            >
           <View style={{flex:1,backgroundColor:'#000000a0'}}>
            <View style={{flex:1}}></View>
            <View style={{flex:2}}>
            <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
            <View style={{flexDirection:'row',backgroundColor:'#0288D1'}}>
              <View style={{flex:7}}>
                <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Tinh thanh pho</Text>
              </View>
              <View style={{flex:1}}>
                <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                  this.setState({modalTinhTpIOS:!this.state.modalTinhTpIOS})
                }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
              </View>
            </View>
            <View>
            <PickerIOS selectedValue={this.state.select_tinh} onValueChange={(value)=>this.setState({select_tinh:value})}>
              {this.renderItemTinhIOS()}
            </PickerIOS>
            </View>

                <View style={{padding: 10}}>

              <Button onPress={()=>this.btn_TaoCuaHangMoi_Click()} title={'Tạo cửa hàng'} color='#03A9F4'></Button>
          </View>
          </View>
            </View>
            <View style={{flex:1}}></View>
           </View>
          </Modal>
          </View>
          </View>
        </View>

      )
    }else{
      return(

        <View style={{flexDirection:'row',marginTop:5,marginBottom:5}}>
  {/* PICKER BÁN MUA */}
          <View style={{flex:3}}><View style={{marginLeft:5,backgroundColor:'#29b6f6',borderRadius:3,borderColor:'#81D4FA',borderWidth:1}}>
          <Picker style={{color:'white',height:30}} selectedValue={this.state.select_muaban}
          onValueChange={(value)=>this.setState({select_muaban:value},()=>{
            console.log('1'+this.state.select_muaban);
            this.RetriveDataPost();
          })}>
            {this.renderItemBan()}
          </Picker></View>
          </View>
  {/* PICKER LOẠI */}
          <View style={{flex:4}}><View style={{marginLeft:5,backgroundColor:'#29b6f6',borderRadius:3,borderColor:'#81D4FA',borderWidth:1}}>
          <Picker style={{color:'white',height:30}} mode='dropdown'
           selectedValue={this.state.select_loaisp}
          onValueChange={(value)=>
              this.setState({select_loaisp:value},()=>{
                console.log('2'+this.state.select_loaisp);
                this.RetriveDataPost();
              })
            }>
            {this.renderItemLoai()}
          </Picker></View>
          </View>
  {/* PICKER TỈNH THÀNH PHỐ */}
          <View style={{flex:5}}><View style={{marginLeft:5,backgroundColor:'#29b6f6',marginRight:5,borderRadius:3,borderColor:'#81D4FA',borderWidth:1}}>
          <Picker style={{color:'white',height:30}} selectedValue={this.state.select_tinh}
           onValueChange={(value)=>this.setState({select_tinh:value},()=>this.RetriveDataPost())}>
            {this.renderItemTinh()}
          </Picker></View>
          </View>
        </View>

      );
    }

  }
  Logined(){

//nếu uid =0 tức là chưa đăng nhập thì hiện ra ko có modal menu
//cái này dành cho người dùng tìm kiếm mà ko cần đăng nhập
    if(this.props.uidSession==='0'){
      return(
        <View style={{backgroundColor:'#03A9F4'}}>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:7,paddingLeft:5}}>
{/* SEARCH INPUT */}
          <TextInput underlineColorAndroid="#29b6f6"
           style={{color:'white',borderColor:'#81D4FA',borderWidth:1,backgroundColor:'#29b6f6',borderRadius:5,height:38,fontSize:15,marginTop:5}}
            returnKeyType={'search'}
            onChangeText={(value)=>this.setState({txt_search:value})}
           onSubmitEditing={()=>this.btn_TimKiem_Click()}/>
          </View>
{/* ICON BUTTON SEARCH */}
          <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_TimKiem_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_search_white_24dp.png')} /></TouchableHighlight></View>
{/* ICON BUTTON ACCOUNT */}
          <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_DangNhap_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_person_white_24dp.png')} /></TouchableHighlight></View>
        </View>
        {this.render3PickerChoose()}
        <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
        <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
        <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
        </View>

      );

    }
    else if(this.props.uidSession!==' ' && this.props.uidSession!=='-1' && this.props.uidSession!==null){
//đã đăng nhập: render ra modal chứa menu
      return (
        <View>
        <View style={{backgroundColor:'#03A9F4'}}>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1}}><TouchableHighlight underlayColor='#FAFAFA' onPress={()=>this.btn_Menu_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_reorder_white_24dp.png')} /></TouchableHighlight></View>
          <View style={{flex:7,paddingLeft:5}}>
{/* SEARCH INPUT */}
          <TextInput underlineColorAndroid="#29b6f6"
          onChangeText={(value)=>this.setState({txt_search:value})}
          style={{color:'white',borderColor:'#81D4FA',borderWidth:1,backgroundColor:'#29b6f6',borderRadius:5,height:38,fontSize:15,marginTop:5}}
          returnKeyType={'search'} placeholder="  search"
          onSubmitEditing={()=>this.btn_TimKiem_Click()}/>
          </View>
{/* ICON BUTTON SEARCH */}
          <View style={{flex:1}}><TouchableHighlight underlayColor='#FAFAFA' onPress={()=>this.btn_TimKiem_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_search_white_24dp.png')} /></TouchableHighlight></View>
{/* ICON BUTTON RING */}
          <View style={{flex:1}}><TouchableHighlight underlayColor='#FAFAFA' 
          onPress={()=>this.props.propsNavigator.push({
               screen:'Notification',
                uidSession:this.props.uidSession
            })} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_notifications_none_white_24dp.png')}>
            <Text style={{color:'red',fontWeight:'bold'}} >{this.state.notifiAnother>0?this.state.notifiAnother:null}</Text></Image></TouchableHighlight></View>
        </View>
        {this.render3PickerChoose()}
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
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:80,height:80,marginTop:35,marginLeft:10,borderColor:'white',borderWidth:1,borderRadius:40}}/>
            <Text style={{color:'white',fontSize:20,marginTop:5,marginLeft:10}}>{this.state.user.hovaten}</Text>
</Image>

<TouchableHighlight underlayColor='#FFF9C4' onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
              this.props.propsNavigator.push({
                screen:'Notification',
                uidSession:this.props.uidSession
              })
            }}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/Bell-icon.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text  style={{color:'black',fontSize:18,marginLeft:10,marginTop:15}}>Thông báo</Text>
              {this.state.notifiAnother>0?<View  style={{backgroundColor:'red',borderRadius:50,marginTop:15,marginLeft:10,height:25}} >
              <Text style={{color:'white',fontSize:20}}>  {this.state.notifiAnother}  </Text>
              </View>:null}
              </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor='#FFF9C4' onPress={()=>this.btn_TinNhan_Click()}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/messendger.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text style={{color:'black',fontSize:20,marginLeft:10,marginTop:15}}>Tin nhắn</Text>
              {this.state.notifTinNhan>0?<View  style={{backgroundColor:'red',borderRadius:50,marginTop:15,marginLeft:10,height:25}} >             
              <Text style={{color:'white',fontSize:20}}>  {this.state.notifTinNhan}  </Text>
              </View>:null}                 
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='#FFF9C4' onPress={() => this.btn_CuaHang_Click()}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/shops.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text style={{color:'black',fontSize:18,marginLeft:10,marginTop:15}}>Cửa hàng</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='#FFF9C4' onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
              this.props.propsNavigator.push({
                screen:'FollowUser',
                uidSession:this.props.uidSession
              })
            }}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/favorite.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text  style={{color:'black',fontSize:18,marginLeft:10,marginTop:15}}>Theo dõi</Text>
              </View>
            </TouchableHighlight>

            
            <TouchableHighlight underlayColor='#FFF9C4' onPress={() => this.btn_CaNhan_Click()}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/user.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text  style={{color:'black',fontSize:18,marginLeft:10,marginTop:15}}>Cá nhân</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor='#FFF9C4' onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
              this.props.propsNavigator.push({
                screen:'Help'                
              });
            }}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/support.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text  style={{color:'black',fontSize:18,marginLeft:10,marginTop:15}}>Hướng dẫn và trợ giúp</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor='#FFF9C4' onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
              this.props.propsNavigator.push({
                screen:'AboutApp'                
              });
            }}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/aboutapp.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text style={{color:'black',fontSize:18,marginLeft:10,marginTop:15}}>Thông tin ứng dụng</Text>
              </View>
            </TouchableHighlight>


            <TouchableHighlight underlayColor='#FFF9C4' onPress={() => this.btn_DangXuat_Click()}>
              <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#BDBDBD',height:55}}>
              <Image source={require('../img/logout.png')} style={{width:35,height:35,marginTop:10,marginLeft:10}}/>
              <Text style={{color:'black',fontSize:18,marginLeft:10,marginTop:15}}>Đăng xuất</Text>
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
    };

  }
  render(){

    return(
      <View style={{backgroundColor:'#E0E0E0',flex:1}}>
      <StatusBar
     backgroundColor="#0288D1"
     barStyle="light-content"
   />
{this.Logined(this)}
  {this.state.dts===true?
      <ListView
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        renderRow={(rowData)=><ItemListViewStatus uidSession={this.props.uidSession} propsNavigator={this.props.propsNavigator} obj={rowData}

        ></ItemListViewStatus>}
      />
      :
      <Text style={{color:'gray',margin:20,fontSize:20}}>Không tìm thấy bài đăng nào</Text>}
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
  btn_CuaHang_Click(){
    this.setModalVisible(!this.state.modalVisible);
    this.props.propsNavigator.push({
      screen:'ListShops',//chạy tới màn hình tiếp
      uidSession:this.state.user.uid      
    });
  }
  btn_CaNhan_Click(){
    this.setModalVisible(!this.state.modalVisible);
    this.props.propsNavigator.push({
      screen:'InfoPersonal',
      //làm đi, gửi uidSession qua, thôi để tui làm mẫu, chưa có chổ nào làm đâu mà tìm
      uidSession:this.state.user.uid,
      uidadmin:'0',
      uidguest:''
    });
  }

}
