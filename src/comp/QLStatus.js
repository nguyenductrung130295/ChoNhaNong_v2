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
      modalMuahaybanIOS:false,//hiện ẩn modal menu
      modalLoaiSpIOS:false,//hiện ẩn modal menu
      modalTinhTpIOS:false,//hiện ẩn modal menu
      uid:'-1',//
      select_muaban:'Mua',//mặc định
      select_loaisp:'Trái cây',
      select_tinh:'Hồ Chí Minh',
      user:new Users(),//state là user mới có thể thay đổi dc
      txt_search:'',//input search
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
                  if(snap1.val().loaisp===this.state.select_loaisp)//chổ này để kiểm tra(trái cấy....)
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
                          postTam[i].loaitien=data.val().loaitien;
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
                      loaitien:data.val().loaitien,
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
              }
            }

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
            returnKeyType={'search'} placeholder="  search"
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
            <View style={{flexDirection:'row',backgroundColor:'#039BE5'}}>
        <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.props.propsNavigator.pop()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_arrow_back_white_24dp.png')} /></TouchableHighlight></View>
        <View style={{flex:7,paddingLeft:5}}>
{/* SEARCH INPUT */}
        <Text style={{fontSize:20,color:'white',marginTop:10}}>Quản lý bài đăng</Text>
        </View>

{/* ICON BUTTON options */}
        <View style={{flex:1}}></View>
      </View>
        <View style={{flexDirection:'row'}}>          
          <View style={{flex:8,paddingLeft:5}}>
{/* SEARCH INPUT */}
          <TextInput underlineColorAndroid="#29b6f6"
          onChangeText={(value)=>this.setState({txt_search:value})}
          style={{color:'white',borderColor:'#81D4FA',borderWidth:1,backgroundColor:'#29b6f6',borderRadius:5,height:38,fontSize:15,marginTop:5}}
          returnKeyType={'search'} placeholder="  search"
          onSubmitEditing={()=>this.btn_TimKiem_Click()}/>
          </View>
{/* ICON BUTTON SEARCH */}
          <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_TimKiem_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_search_white_24dp.png')} /></TouchableHighlight></View>
{/* ICON BUTTON RING */}          
        </View>
        {this.render3PickerChoose()}
        <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
        <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
        <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
        </View>

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

      <ListView
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        renderRow={(rowData)=><ItemListViewStatus uidSession={this.props.uidSession} propsNavigator={this.props.propsNavigator} obj={rowData}

        ></ItemListViewStatus>}
      />
      </View>

    );
  }

}
