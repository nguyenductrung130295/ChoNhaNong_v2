import React ,{Component} from 'react';
import {Alert,AppRegistry,Picker,Modal,Button,Text,Image,View,ListView,TextInput,TouchableHighlight,ScrollView} from 'react-native';
import ItemCommand from '../item_customer/ItemCommand';
import firebase from '../entities/FirebaseAPI';
import Users from '../entities/Users';
import Posts from '../entities/Posts';
import Shops from '../entities/Shops'
import ImageViewer from 'react-native-image-zoom-viewer';
import DateTimePicker from 'react-native-modal-datetime-picker';
const ds=new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});
export default class StatusDetail extends Component{
  constructor(props){
    super(props);
//dinh đã tới đây
    this.state={
      shop:new Shops(),
      isDateTimePickerVisiblebd: false,//cho cái chọn ngày thời gian ẩn hiện
      isDateTimePickerVisiblekt: false,//cho cái chọn ngày thời gian ẩn hiện
      datedb:'bắt đầu',//ngày sự kiện bắt đầu
      datekt:'kết thúc',//ngày sự  kiện kết thúc
      modalVisible: false,//ẩn hiện modal tạo cửa hàng mới
      modalViPham:false,//modal vipham
      select_loaivipham:'Đồi trụy',//giá trị 
       modalXoa:false,//modal vipham  
       modalHopLe:false,    
      dataSource:ds.cloneWithRows([]),
      cur_img:-1,// thứ tự image dang hien trong cái xem hinh ở trên màn hình
      sum_img:0,//tổng image trong arrayImage
      arrayImage:[],//mảng chứa đường dẫn ảnh
      show:false,//false thì button expand more,ẩn nội dung
      //post_hinh:[],//array hình của post
      postState:new Posts(),//object Post
      txt_command:'',//noi dung command post
      key:'',//key post current
      user:new Users(),//state là user session có thể thay đổi dc
      user_own:new Users(),//state là user sở hữu bài đăng có thể thay đổi dc
      modalImage:false,//modal xem full image
      imagesModal:[],//mảng chứa hình cho ImageViewer
      Isfollow:'Theo dõi',//trạng thái đang theo dõi hay không
      txt_noidungsk:'',//
      txt_tensukien:'',//
      dataSourceEvent:ds.cloneWithRows([]),
    };
  }
  componentWillMount(){
    database=firebase.database();

    tb_listposts=database.ref('db_marketsfarmers/table_posts/Bán');//trỏ đến chổ table_shops
    var post_hinh=[];
    var imgArr=[];
    var cmtTam=[];//tạm lưu 1 list cmt hiện tại


      tb_listposts.orderByKey()//xếp theo idpost_uid_own
      .equalTo(this.props.idPost)//idpost_uid_own===idpostTam_uidsession
      .on('value',(snapshot)=>{
        if(snapshot.exists()){
        snapshot.forEach((data)=>{
                p=new Posts();
                p.idpost=data.key;
                p.tieude=data.val().tieude;
                p.noidung=data.val().noidung;
                p.loaisp=data.val().loaisp;
                p.diachi_txh=data.val().diachi_txh;
                p.diachi_t=data.val().diachi_t;
                p.giaban=data.val().giaban;
                //p.loaitien=data.val().loaitien;
                p.giaban=data.val().giaban;
                p.muahayban=data.val().muahayban;
                p.thoigiandang=data.val().thoigiandang;
                p.uid_own=data.val().uid_own;
                p.idshop_own=data.val().idshop_own;
                p.statecheck=data.val().statecheck;
                p.loaivipham=data.val().loaivipham;
                this.setState({postState:p,key:data.key});
                if(data.val().idshop_own!=='0'){
                  database.ref('db_marketsfarmers/table_shops/').orderByKey().equalTo(data.val().idshop_own)
                  .on('value',(sns)=>{
                    sns.forEach((dts)=>{
                      s= new Shops();
                    s.shopid=dts.key;
                    s.tencuahang=dts.val().tencuahang;
                    s.sdtcuahang=dts.val().sdtcuahang;
                    s.logoshop=dts.val().logoshop;
                  this.setState({shop:s});                      
                    });
                    
                  });
                  
                }
                //lấy hình
                table_hinhs=database.ref('db_marketsfarmers/table_posts/Bán/'+this.props.idPost+'/images/');
                table_hinhs.on('value',(snaps)=>{
                  snaps.forEach((datahinh)=>{
                      post_hinh.push(datahinh.val().linkpost);
                      imgArr.push({
                        url:datahinh.val().linkpost
                      });
                  });
                  this.setState({arrayImage:post_hinh,imagesModal:imgArr,cur_img:0,sum_img:post_hinh.length});
                });
                //lấy command
                table_commands=database.ref('db_marketsfarmers/table_posts/Bán/'+data.key+"/command");
                table_commands.orderByKey().on('value',(snapcmt)=>{
                  cmtTam=[];
                  dem=0;
                  snapcmt.forEach((datacmt)=>{
                    if(dem!==0){
                      cmtTam.push({
                            name_cmt:datacmt.val().name_cmt,
                            image_cmt:datacmt.val().image_cmt,
                            content_cmt:datacmt.val().content_cmt,
                            time:datacmt.val().time,
                            uid_cmt:datacmt.val().uid_cmt
                      });
                    }
                    dem++;
                  });

                  this.setState({dataSource:ds.cloneWithRows(cmtTam.reverse())});
                });

              tb_user=database.ref('db_marketsfarmers/table_users');
              //tạo user tạm us
              us=new Users();
              //orderByKey để chọn cột key,
              tb_user.orderByKey().equalTo(p.uid_own).on('value',(snap)=>{
                  if(snap.exists()){//kiểm tra tồn tại user
                    snap.forEach((data)=>{//data là 1 user lấy dc trong danh sách user trong list snap
                      //lưu thông tin vào user tạm us
                      us.uid=data.key;
                      console.log(us.uid);
                      us.hovaten=data.val().hovaten;
                      us.sdt=data.val().sdt;
                      //us.diachi=data.val().diachi;
                      //us.email=data.val().email;
                      us.anhdaidien=data.val().anhdaidien;
                      //us.anhbia=data.val().anhbia;
                    });
                    //sau khi lấy thông tin user ở code trên lưu vào state.user
                    console.log("us.uid"+us.uid);
                    this.setState({user_own:us});
                  }
                  else{
                    alert('firebase error');
                  }
              });
              //kiểm tra đang theo dõi chưa
              follow=database.ref('db_marketsfarmers/table_posts/Bán/'+data.key+'/follow');
              follow.child(this.props.uidSession)//tại user đang đang nhập
              .once('value',(sn)=>{
                if(sn.exists()){
                  //nếu tồn tại
                  this.setState({Isfollow:'Bỏ theo dõi'});
                }else{
                  this.setState({Isfollow:'Theo dõi'});
                }
              });
//listview danh sách sự kiện
              tb_sk=database.ref('db_marketsfarmers/table_posts/Bán/'+data.key+'/events');//data.key-->idpost
              var tam_event=[];
              tb_sk.on('value',(snap)=>{
                snap.forEach((dataevent)=>{
                  //alert(dataevent.val().tensk);
                  tam_event.push({
                    idsukien:dataevent.key,
                    tensukien:dataevent.val().tensk,
                    thoigianbatdau:dataevent.val().batdau,
                    thoigianketthuc:dataevent.val().ketthuc,
                    noidungsukien:dataevent.val().nodungsk,
                    trangthaisk:dataevent.val().trangthaisk
                  })
                });
                this.setState({dataSourceEvent:ds.cloneWithRows(tam_event)});
              });

        });
        }else{
          //MUA
          tb_listpostsMua=database.ref('db_marketsfarmers/table_posts/Mua');
          tb_listpostsMua.orderByKey()//xếp theo idpost_uid_own
          .equalTo(this.props.idPost)//idpost_uid_own===idpostTam_uidsession
          .on('value',(snapshotMua)=>{
            snapshotMua.forEach((dataMua)=>{
                    p=new Posts();
                    p.idpost=dataMua.key;
                    p.tieude=dataMua.val().tieude;
                    p.noidung=dataMua.val().noidung;
                    p.loaisp=dataMua.val().loaisp;
                    p.diachi_txh=dataMua.val().diachi_txh;
                    p.diachi_t=dataMua.val().diachi_t;
                    p.giaban=dataMua.val().giaban;
                    //p.loaitien=dataMua.val().loaitien;
                    p.giaban=dataMua.val().giaban;
                    p.muahayban=dataMua.val().muahayban;
                    p.thoigiandang=dataMua.val().thoigiandang;
                    p.uid_own=dataMua.val().uid_own;
                    p.idshop_own=dataMua.val().idshop_own;
                    p.statecheck=dataMua.val().statecheck;
                    p.loaivipham=dataMua.val().loaivipham;
                    this.setState({postState:p,key:dataMua.key});
                    //lấy hình
                    table_hinhsMua=database.ref('db_marketsfarmers/table_posts/Mua/'+this.props.idPost+'/images/');
                    table_hinhsMua.on('value',(snapsMua)=>{
                      snapsMua.forEach((datahinhMua)=>{
                          post_hinh.push(datahinhMua.val().linkpost);
                          imgArr.push({
                            url:datahinhMua.val().linkpost
                          });
                      });
                      this.setState({arrayImage:post_hinh,imagesModal:imgArr,cur_img:0,sum_img:post_hinh.length});
                    });
                    //lấy command
                    table_commandsMua=database.ref('db_marketsfarmers/table_posts/Mua/'+dataMua.key+"/command");
                    table_commandsMua.orderByKey().on('value',(snapcmtMua)=>{
                      cmtTam=[];
                      dem=0;
                      snapcmtMua.forEach((datacmtMua)=>{
                        if(dem!==0){
                          cmtTam.push({
                                name_cmt:datacmtMua.val().name_cmt,
                                image_cmt:datacmtMua.val().image_cmt,
                                content_cmt:datacmtMua.val().content_cmt,
                                time:datacmtMua.val().time,
                                uid_cmt:datacmtMua.val().uid_cmt
                          });
                        }
                        dem++;
                      });
                      this.setState({txt_command:''});
                      this.setState({dataSource:ds.cloneWithRows(cmtTam.reverse())});
                    });

                  tb_userMua=database.ref('db_marketsfarmers/table_users');
                  //tạo user tạm us
                  usMua=new Users();
                  //orderByKey để chọn cột key,
                  tb_userMua.orderByKey().equalTo(p.uid_own).on('value',(snapMua)=>{
                      if(snapMua.exists()){//kiểm tra tồn tại user
                        snapMua.forEach((dataMua)=>{//data là 1 user lấy dc trong danh sách user trong list snap
                          //lưu thông tin vào user tạm us
                          usMua.uid=dataMua.key;
                          console.log(usMua.uid);
                          usMua.hovaten=dataMua.val().hovaten;
                          usMua.sdt=dataMua.val().sdt;
                          //us.diachi=data.val().diachi;
                          //us.email=data.val().email;
                          usMua.anhdaidien=dataMua.val().anhdaidien;
                          //us.anhbia=data.val().anhbia;
                        });
                        //sau khi lấy thông tin user ở code trên lưu vào state.user
                        console.log("us.uid"+usMua.uid);
                        this.setState({user_own:usMua});
                      }
                      else{
                        alert('firebase error');
                      }
                  });
    //listview danh sách sự kiện
                  tb_skMua=database.ref('db_marketsfarmers/table_posts/Mua/'+dataMua.key+'/events');//data.key-->idpost
                  var tam_eventMua=[];
                  tb_skMua.on('value',(snapMua)=>{
                    snapMua.forEach((dataeventMua)=>{
                      //alert(dataevent.val().tensk);
                      tam_eventMua.push({
                        idsukien:dataeventMua.key,
                        tensukien:dataeventMua.val().tensk,
                        thoigianbatdau:dataeventMua.val().batdau,
                        thoigianketthuc:dataeventMua.val().ketthuc,
                        noidungsukien:dataeventMua.val().nodungsk,
                        trangthaisk:dataeventMua.val().trangthaisk
                      })
                    });
                    this.setState({dataSourceEvent:ds.cloneWithRows(tam_eventMua)});
                  });

            });
          });
        }
      });

      if(this.props.uidSession!=='-1'){
        tb_user=database.ref('db_marketsfarmers/table_users');
        //tạo user tạm us
        us_me=new Users();
        //orderByKey để chọn cột key,
        tb_user.orderByKey().equalTo(this.props.uidSession).on('value',(snap)=>{
            if(snap.exists()){//kiểm tra tồn tại user
              snap.forEach((data)=>{//data là 1 user lấy dc trong danh sách user trong list snap
                //lưu thông tin vào user tạm us
                us_me.uid=data.key;
                us_me.hovaten=data.val().hovaten;
                us_me.sdt=data.val().sdt;
                //us.diachi=data.val().diachi;
                //us.email=data.val().email;
                us_me.anhdaidien=data.val().anhdaidien;
                us_me.type=data.val().type;
                //us.anhbia=data.val().anhbia;
              });
              //sau khi lấy thông tin user ở code trên lưu vào state.user
              this.setState({user:us_me});
            }
            else{
              alert('firebase error');
            }
        });
      }      
  }
  btn_PreviousImage(){
    if(this.state.sum_img>0 && (this.state.cur_img > 0)){
      this.setState({
        cur_img:this.state.cur_img-1,
        imagePath:this.state.arrayImage[this.state.cur_img-1]
      });
    }

  }
  btn_NextImage(){
    if(this.state.sum_img>0 && (this.state.cur_img < this.state.sum_img-1)){
      this.setState({
        cur_img:this.state.cur_img+1,
        imagePath:this.state.arrayImage[this.state.cur_img+1]
      });
    }

  }
  btn_Back_Click(){
    this.props.propsNavigator.pop();
  }
  btn_CommandPost(){
    if(this.state.txt_command.trim()==='')
      return;
    var flag=-1;
    var d = new Date();//new time now
    var time = d.toString().slice(4,24);//cắt chuỗi thòi gian cần ngày thang năm giờ:phut:giay
    table_commands=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/'+this.state.key+"/command");
    table_commands.orderByKey().limitToLast(1).//once('value')
  //.then(function(snap) {
    on('value',(snap)=>{

      snap.forEach((data)=>{
        console.log(flag+":"+parseInt(data.key));
        if(flag!==parseInt(data.key)){
          var maxid=parseInt(data.key)+1;
          //dem++;
          flag=maxid;
          commands=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/'+this.state.key+"/command");
          commands.child(maxid).set({
            name_cmt:this.state.user.hovaten,
            image_cmt:this.state.user.anhdaidien,
            content_cmt:this.state.txt_command,
            time:time,
            uid_cmt:this.props.uidSession
          },()=>{
            //set thông báo
            this.setState({txt_command:''});
            var flag=0;
            if(this.state.user_own.uid!==this.props.uidSession){
            //    console.log(this.state.user_own.uid);
            notification=database.ref('db_marketsfarmers/table_notif/'+this.state.user_own.uid);

            notification.orderByKey().limitToLast(1).//once('value')
            //.then(function(snap) {
            on('value',(snap)=>{

              snap.forEach((data)=>{
                console.log(flag+":"+parseInt(data.key));
                if(flag!==parseInt(data.key)){
                  var maxid=parseInt(data.key)+1;
                  //dem++;
                  flag=maxid;
                  insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.state.user_own.uid);
                  insert_noti.child(maxid).set({
                    idpost:this.state.postState.idpost,
                    content:'đã bình luận trong một bài đăng của bạn',
                    state:'dagui',
                    time:time,
                    title:this.state.user.hovaten,
                    type:'command'
                  },()=>{                    
                    table_commands.off('value');
                    notification.off('value');
                    
                  });
                }
              });

            });
            }

          });
          
        }
      });

    });

    //table_commands.off('value')
    //notification.off('value')
  }
  btn_NhanTin(){
    this.props.propsNavigator.push({
      screen:'Messendger',
      uidSession:this.props.uidSession,
      uidGetMessage:this.state.user_own.uid
    });
  }
  btn_ZoomImage(){
    this.setState({modalImage:!this.state.modalImage});
  }
  btn_TheoDoiPost(){
    
      //theo dõi post
    //var flag=-1;
    var d = new Date();//new time now
    var time = d.toString().slice(4,24);//cắt chuỗi thòi gian cần ngày thang năm giờ:phut:giay
    table_follows=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/'+this.state.key+"/follow");
    table_follows.child('uid').once('value',(data)=>{
      if(this.state.Isfollow==='Theo dõi' && data.exists()){
          var maxid=parseInt(data.val().maxid)+1;//số lượng theo dõi
          //dem++;          
          addfollow=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/'+this.state.key+"/follow");
          addfollow.child(this.props.uidSession).set({//sét user theo dõi            
            name:this.state.user.hovaten,//tên
            time:time//thời gian theo dõi
          },()=>{

            //set lại số lượng
            updateMaxFollow=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/'+this.state.key+'/follow');
            updateMaxFollow.child('uid').update({
              maxid:maxid
            });
            
            //set thông báo
            var flag=0;
            //    console.log(this.state.user_own.uid);
            notification=database.ref('db_marketsfarmers/table_notif/'+this.state.user_own.uid);

            notification.orderByKey().limitToLast(1).//once('value')
            //.then(function(snap) {
            on('value',(snap)=>{

              snap.forEach((data)=>{
                console.log(flag+":"+parseInt(data.key));
                if(flag!==parseInt(data.key)){
                  var maxid=parseInt(data.key)+1;
                  //dem++;
                  flag=maxid;
                  insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.state.user_own.uid);
                  insert_noti.child(maxid).set({
                    idpost:this.state.postState.idpost,
                    content:'đã theo dõi một bài đăng của bạn',
                    state:'dagui',
                    time:time,
                    title:this.state.user.hovaten,
                    type:'follow'
                  },()=>{
                    table_follows.off('value');
                    notification.off('value');
                    Alert.alert('Thông báo','Đã theo dõi bài đăng này');
                    this.setState({Isfollow:'Bỏ theo dõi'});
                  });
                }
              });

            });

          });
        }
    else{
      //bỏ theo dõi-xóa user
      deleteFollow=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/'+this.state.key+'/follow');
      deleteFollow.child(this.props.uidSession).remove();
      Alert.alert('Thông báo', 'đã bỏ theo dõi');
      //update lại số lượng
      //set lại số lượng
            updateMaxFollow=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/'+this.state.key+'/follow');
            updateMaxFollow.child('uid').update({
              maxid:data.val().maxid-1
            });
      Alert.alert('Thông báo', 'Bạn đã bỏ theo dõi bài đăng này.');
      this.setState({Isfollow:'Theo dõi'});
    }
     
    });
    

  }
  btn_XoaPost_Click(){
    this.setState({modalXoa:!this.state.modalXoa});
    database=firebase.database();
    deletePost=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/')
    .child(this.state.postState.idpost).remove();
    Alert.alert('Thông báo', 'Đã xóa '+this.state.postState.tieude);
    if(this.state.user.type==='user'){
      this.props.propsNavigator.pop();
      return;      
    }
    notification=database.ref('db_marketsfarmers/table_notif/'+this.state.postState.uid_own);

            notification.orderByKey().limitToLast(1).//once('value')
            //.then(function(snap) {
            on('value',(snap)=>{

              snap.forEach((data)=>{
                console.log(flag+":"+parseInt(data.key));
                if(flag!==parseInt(data.key)){
                  var d = new Date();//new time now
                  var time = d.toString().slice(4,24);  
                  var maxid=parseInt(data.key)+1;
                  //dem++;
                  flag=maxid;
                  insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.state.postState.uid_own);
                  insert_noti.child(maxid).set({
                    idpost:this.state.postState.idpost,
                    content:' của bạn đã bị ban quản trị xóa.',
                    state:'dagui',
                    time:time,
                    title:'Bài đăng '+this.state.postState.tieude,
                    type:'system'
                  },()=>{                                        
                    notification.off('value');
                    
                  });
                }
              });

            });

    this.props.propsNavigator.pop();
  }
 
  btn_DuyetPost_Click(){
    this.setState({modalHopLe:!this.state.modalHopLe});    
    database=firebase.database();
    updatePostAdmin=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/'+this.state.postState.idpost)
    .update({
      statecheck:'Bình thường',
        loaivipham:this.state.select_loaivipham
    });
    notification=database.ref('db_marketsfarmers/table_notif/'+this.state.postState.uid_own);

            notification.orderByKey().limitToLast(1).//once('value')
            //.then(function(snap) {
            on('value',(snap)=>{

              snap.forEach((data)=>{
                console.log(flag+":"+parseInt(data.key));
                if(flag!==parseInt(data.key)){
                  var d = new Date();//new time now
                  var time = d.toString().slice(4,24);
                  var maxid=parseInt(data.key)+1;
                  //dem++;
                  flag=maxid;
                  insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.state.postState.uid_own);
                  insert_noti.child(maxid).set({
                    idpost:this.state.postState.idpost,
                    content:' của bạn đã được duyệt.',
                    state:'dagui',
                    time:time,
                    title:'Bài đăng '+this.state.postState.tieude,
                    type:'system'
                  },()=>{                                        
                    notification.off('value');
                    
                  });
                }
              });

            });
    Alert.alert('Thông báo', this.state.postState.tieude+' đã được duyệt.');
  }
  btn_ViPhamOK_Click(){
    this.setState({modalViPham:!this.state.modalViPham});
    database=firebase.database();
    updatePostAdmin=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/'+this.state.postState.idpost);
    if(this.state.postState.statecheck==='Bình thường' || this.state.postState.statecheck==='Chưa duyệt'){
      updatePostAdmin.update({
        statecheck:'Vi phạm',
        loaivipham:this.state.select_loaivipham
      });
      notification=database.ref('db_marketsfarmers/table_notif/'+this.state.postState.uid_own);

            notification.orderByKey().limitToLast(1).//once('value')
            //.then(function(snap) {
            on('value',(snap)=>{

              snap.forEach((data)=>{
                console.log(flag+":"+parseInt(data.key));
                if(flag!==parseInt(data.key)){
                  var d = new Date();//new time now
    var time = d.toString().slice(4,24);
                  var maxid=parseInt(data.key)+1;
                  //dem++;
                  flag=maxid;
                  insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.state.postState.uid_own);
                  insert_noti.child(maxid).set({
                    idpost:this.state.postState.idpost,
                    content:' của bạn đã bị ban quản trị khóa do vi phạm '+this.state.select_loaivipham,
                    state:'dagui',
                    time:time,
                    title:'Bài đăng '+this.state.postState.tieude,
                    type:'system'
                  },()=>{                                        
                    notification.off('value');
                    
                  });
                }
              });

            });
      Alert.alert('Thông báo', this.state.postState.tieude+' đã vi phạm');
    }else{
      updatePostAdmin.update({
        statecheck:'Bình thường',
        loaivipham:''
      });
      notification=database.ref('db_marketsfarmers/table_notif/'+this.state.postState.uid_own);

            notification.orderByKey().limitToLast(1).//once('value')
            //.then(function(snap) {
            on('value',(snap)=>{

              snap.forEach((data)=>{
                console.log(flag+":"+parseInt(data.key));
                if(flag!==parseInt(data.key)){
                  var d = new Date();//new time now
    var time = d.toString().slice(4,24);
                  var maxid=parseInt(data.key)+1;
                  //dem++;
                  flag=maxid;
                  insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.state.postState.uid_own);
                  insert_noti.child(maxid).set({
                    idpost:this.state.postState.idpost,
                    content:' của bạn đã được mở khóa.',
                    state:'dagui',
                    time:time,
                    title:'Bài đăng '+this.state.postState.tieude,
                    type:'system'
                  },()=>{                                       
                    notification.off('value');
                    
                  });
                }
              });

            });
      Alert.alert('Thông báo', this.state.postState.tieude+' đã hợp lệ');
    }

  }
  btn_TaoSuKienMoi(){
    this.setState({modalVisible:!this.state.modalVisible});
    addfollow=database.ref('db_marketsfarmers/table_posts/'+this.state.postState.muahayban+'/'+this.state.key+"/events");

    addfollow.push({
      batdau:this.state.datebd,
      ketthuc:this.state.datekt,
      noidungsk:this.state.txt_noidungsk,
      tensk:this.state.txt_tensukien,
      trangthaisk:'',
    });
  }

  render(){
    return(
      <View style={{flex:1}}>

{/* Listview trượt nằm ngang
    <ListView
      horizontal={true}
    dataSource={this.state.dataSource}
      renderRow={(rowData)=><Image source={require('../img/icondefault.jpg')} style={{width:200,height:100}}/>}
    />

    */}
    <View style={{flexDirection:'row',backgroundColor:'#03A9F4',justifyContent:'center'}}>
    <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_Back_Click()}>
    <Image source={require('../img/ic_arrow_back_white_24dp.png')} style={{width:40,height:40}}/></TouchableHighlight></View>
    <View style={{flex:6,justifyContent:'center'}}><Text style={{color:'white',fontSize:20}}>Bài đăng {this.state.postState.muahayban}</Text>
    </View>
    <View style={{flex:2}}>{this.state.user.uid===this.state.user_own.uid?
      <TouchableHighlight style={{margin:5,height:30,justifyContent:'center',alignItems:'center',backgroundColor:'#4FC3F7',borderRadius:2,borderColor:'white',borderWidth:1}} onPress={()=>this.setState({modalXoa:!this.modalXoa})}><Text style={{color:'#ffffff'}}>Xóa bài</Text></TouchableHighlight>
      :
      this.props.uidSession!==this.state.user_own.uid && this.state.user.type!=='admin'&& this.props.uidSession!=='-1'?      
      <TouchableHighlight style={{margin:5,height:30,justifyContent:'center',alignItems:'center',backgroundColor:'#29B6F6',borderRadius:2,borderColor:'white',borderWidth:1}} onPress={()=>this.btn_TheoDoiPost()}><Text style={{color:'#ffffff'}}>{this.state.Isfollow}</Text></TouchableHighlight>
      : null            
      }
      </View>
    </View>
    <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
    <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
    <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
    {this.state.user.uid===this.state.user_own.uid || this.state.user.sdt==='admin'?
    <View style={{backgroundColor:'#CCFF90',height:30,width:'100%',justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:'#64DD17',fontSize:18,fontStyle:'italic'}}>{this.state.postState.statecheck}{
        this.state.postState.statecheck==='Vi phạm'? ' ('+this.state.postState.loaivipham+')':null
        }</Text>
    </View>
    :null
    }    
    

<ScrollView>

    <Image style={{width:"100%",height:200,borderWidth:1,borderColor:'#BDBDBD'}}
    source={{uri:this.state.arrayImage[this.state.cur_img]}}>
    <View style={{flex:1,flexDirection:'row'}}>
      <View style={{flex:1,backgroundColor:'#00000010',justifyContent:'center'}}>
        <TouchableHighlight onPress={()=>this.btn_PreviousImage()}>
         <Image source={require('../img/ic_keyboard_arrow_left_white_24dp.png')}></Image>
        </TouchableHighlight>
      </View>
      <View style={{flex:7,justifyContent:'flex-end'}}>
      <View style={{justifyContent:'center',flexDirection:'row'}}>
        <View style={{alignItems:'center',backgroundColor:'#00000010'}}>
          <Text style={{color:'white',fontSize:18}}> {this.state.cur_img+1}/{this.state.sum_img} ảnh </Text>
        </View>
        <View style={{backgroundColor:'#00000010',width:30,height:30}}>
          <TouchableHighlight onPress={()=>this.btn_ZoomImage()}>
          <Image style={{width:30,height:30}} source={require('../img/ic_zoom_out_map_white_24dp.png')}></Image>
          </TouchableHighlight>
        </View>
        </View>
      </View>
      <View style={{flex:1,backgroundColor:'#00000010',justifyContent:'center'}}>
        <TouchableHighlight onPress={()=>this.btn_NextImage()}>
        <Image source={require('../img/ic_keyboard_arrow_right_white_24dp.png')}></Image>
        </TouchableHighlight>
      </View>
    </View>
    </Image>
    <View style={{backgroundColor:'white',padding:10,borderBottomWidth:1,borderColor:'gray'}}>
            <Text style={{color:'blue',fontSize:25}}>{this.state.postState.tieude}</Text>
            <Text style={{color:'gray',marginLeft:5}}>{this.state.postState.thoigiandang}</Text>
            {this.renderHide()}                        
            
      </View>
      <View style={{backgroundColor:'white',padding:10,borderBottomColor:'gray',borderBottomWidth:1}}>
        <Text  style={{color:'red',fontWeight:'bold',fontSize:20}}>{this.state.postState.giaban}</Text>
              <Text style={{color:'black',fontSize:18}}>{this.state.postState.noidung}</Text>
            </View>
<View style={{padding:10,backgroundColor:'white'}}>        
      <ListView
      dataSource={this.state.dataSource}
      enableEmptySections={true}
      renderRow={(rowData)=><ItemCommand obj={rowData}></ItemCommand>}
      />
      <Text>{"\n\n\n\n"}</Text>
      </View>
</ScrollView>

<Modal visible={this.state.modalImage}
transparent={true}
onRequestClose={() => this.setState({modalImage:!this.state.modalImage})}>
                <ImageViewer imageUrls={this.state.imagesModal}
                onDoubleClick={()=>this.setState({modalImage:!this.state.modalImage})}/>
            </Modal>
            <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() =>{
               if(this.state.modalVisible===false)
                this.setState({modalImage:!this.state.modalImage});
               else
                this.setState({modalVisible:!this.state.modalVisible});
               }}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1',borderTopLeftRadius:4,borderTopRightRadius:4}}>
                <View style={{flex:7}}>
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Tạo Sự kiện mới</Text>
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setState({modalVisible:!this.state.modalVisible})
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                </View>
              </View>

                  <View style={{padding: 10}}>
            <TextInput
              style={{color:'black',height: 40,marginBottom:10,borderColor:'#BDBDBD',borderWidth:1,borderRadius:2}}
              underlineColorAndroid="white"
              placeholder="Tên sự kiện"
              onChangeText={(value)=>this.setState({txt_tensukien:value})}
              />
              <TextInput
                style={{color:'black',height: 40,marginBottom:10,borderColor:'#BDBDBD',borderWidth:1,borderRadius:2}}
                underlineColorAndroid="white"
                placeholder="nội dung"
                onChangeText={(value)=>this.setState({txt_noidungsk:value})}
                />
                <View style={{flexDirection:'row',marginBottom:10}}>
                  <View style={{flex:1,paddingRight:5}}>
                    <Button onPress={()=>this.setState({ isDateTimePickerVisiblebd: true })}
                    title={this.state.datebd+" "} color='#BDBDBD'></Button>
                  </View>
                  <View style={{flex:1,paddingLeft:5}}>
                  {/* picker loại sp cúả cửa hàng*/}
                    <Button onPress={()=>this.setState({ isDateTimePickerVisiblekt: true })}
                    title={this.state.datekt+" "} color='#BDBDBD'></Button>
                  </View>
                </View>
                <Button onPress={()=>this.btn_TaoSuKienMoi()} title={'Tạo'} color='#03A9F4'></Button>
          </View>
          </View>
              </View>
              <View style={{flex:1}}></View>
             </View>
             <DateTimePicker
                       isVisible={this.state.isDateTimePickerVisiblebd}
                       onConfirm={(date_bd)=>this.setState({datebd:date_bd.toString().slice(4,21),isDateTimePickerVisiblebd:!this.state.isDateTimePickerVisiblebd})}
                       onCancel={()=>this.setState({isDateTimePickerVisiblebd:!this.state.isDateTimePickerVisiblebd})}
                       mode={'datetime'}
                     />
                     <DateTimePicker
                               isVisible={this.state.isDateTimePickerVisiblekt}
                               onConfirm={(date_kt)=>this.setState({datekt:date_kt.toString().slice(4,21),isDateTimePickerVisiblekt:!this.state.isDateTimePickerVisiblekt})}
                               onCancel={()=>this.setState({isDateTimePickerVisiblekt:!this.state.isDateTimePickerVisiblekt})}
                               mode={'datetime'}
                             />
            </Modal>            

<Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalViPham}
              onRequestClose={() => console.log('close modal')}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1',borderTopLeftRadius:4,borderTopRightRadius:4}}>
                <View style={{flex:7}}>
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Vi phạm</Text>
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setState({modalViPham:!this.state.modalViPham})
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                </View>
              </View>
              {this.state.postState.statecheck==='Bình thường' || this.state.postState.statecheck==='Chưa duyệt'?
              <View style={{flexDirection:'row'}}>                
                <View style={{flex:3,borderColor:'#BDBDBD'}}>
                {/* picker loại sp cúả cửa hàng*/}
                <Text style={{marginTop:10,marginLeft:10}}>Loại vi phạm</Text>
                </View>
                <View style={{flex:4}}>
                {/* picker tỉnh thành phố sp cúả cửa hàng*/}
                <Picker
          selectedValue={this.state.select_loaivipham}
          onValueChange={(value) => this.setState({select_loaivipham: value})}>
          <Picker.Item label="Mang tính khiêu gợi" value="Mang tính khiêu gợi" />
          <Picker.Item label="Ma Túy, thuốc phiện" value="Ma Túy, thuốc phiện" />
          <Picker.Item label="Vũ khí cấm sử dụng" value="Vũ khí cấm sử dụng" />
          <Picker.Item label="Động vật hoang dã,quý hiếm" value="Động vật hoang dã,quý hiếm" />
          <Picker.Item label="Hóa chất cấm, độc hại" value="Hóa chất cấm, độc hại" />
          <Picker.Item label="Gây ô nhiễm môi trường" value="Gây ô nhiễm môi trường" />
          <Picker.Item label="Không đảm bảo vệ sinh, an toàn" value="Không đảm bảo vệ sinh, an toàn" />          
            </Picker>
                </View>
              </View>
              :null            
              }
              

                  <View style={{flexDirection:'row',padding: 10}}>
                    <View style={{flex:1}}></View>
                  <View style={{flex:1}}><Button color={'red'} title={'Hủy'} onPress={()=>this.setState({modalViPham:!this.state.modalViPham})}/></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}><Button onPress={()=>this.btn_ViPhamOK_Click()} title={'OK'} color='blue'></Button></View>
                   <View style={{flex:1}}></View>
                
          </View>
          </View>
              </View>
              <View style={{flex:1}}></View>
             </View>
            </Modal>

<Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalXoa}
              onRequestClose={() => console.log('close modal')}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1',borderTopLeftRadius:4,borderTopRightRadius:4}}>
                <View style={{flex:7}}>
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Xóa bài đăng</Text>
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setState({modalXoa:!this.state.modalXoa})
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                </View>
              </View>
              
                
                {/* picker loại sp cúả cửa hàng*/}
                <Text style={{marginLeft:10}}>Bạn có chắc muốn xóa {this.state.postState.tieude} không?</Text>
                              

                  <View style={{flexDirection:'row',padding: 10}}>
                    <View style={{flex:1}}></View>
                  <View style={{flex:1}}><Button color={'red'} title={'Hủy'} onPress={()=>this.setState({modalXoa:!this.state.modalXoa})}/></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}><Button onPress={()=>this.btn_XoaPost_Click()} title={'Xóa'} color='blue'></Button></View>
                   <View style={{flex:1}}></View>
                
          </View>
          </View>
              </View>
              <View style={{flex:1}}></View>
             </View>
            </Modal>


<Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalHopLe}
              onRequestClose={() => console.log('close modal')}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1',borderTopLeftRadius:4,borderTopRightRadius:4}}>
                <View style={{flex:7}}>
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Duyệt bài</Text>
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setState({modalHopLe:!this.state.modalHopLe})
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                </View>
              </View>
              
                
                {/* picker loại sp cúả cửa hàng*/}
                <Text style={{marginLeft:10}}>Bài đăng đã hợp lệ?</Text>
                              

                  <View style={{flexDirection:'row',padding: 10}}>
                    <View style={{flex:1}}></View>
                  <View style={{flex:1}}><Button color={'red'} title={'Hủy'} onPress={()=>this.setState({modalHopLe:!this.state.modalHopLe})}/></View>
                  <View style={{flex:1}}></View>
                  
                  <View style={{flex:1}}><Button onPress={()=>this.btn_DuyetPost_Click()} title={'Duyệt'} color='blue'></Button></View>
                   <View style={{flex:1}}></View>
                
          </View>
          </View>
              </View>
              <View style={{flex:1}}></View>
             </View>
            </Modal>

            {this.state.user.type==='admin'? 
            <View style={{height:43,width:'100%',backgroundColor:'#BDBDBDA0',position: 'absolute',
                bottom: 0,
                right:0,flexDirection:'row'}}>
                
                  {this.state.postState.statecheck==='Bình thường'?null:
                  <View style={{flex:1,padding:5}}>
                  <Button color={'green'} title={'Hợp lệ'} onPress={()=>this.setState({modalHopLe:!this.state.modalHopLe})}/>  
                  </View>
                  }
                  
                <View style={{flex:1,padding:5}}>
                  { this.state.postState.statecheck==='Vi phạm'?
                    <Button color={'orange'} title={'Bỏ vi phạm'} onPress={()=>this.setState({modalViPham:!this.state.modalViPham})}/>
:<Button color={'orange'} title={'Vi phạm'} onPress={()=>this.setState({modalViPham:!this.state.modalViPham})}/>    }                
                  </View>
                <View style={{flex:1,padding:5}}><Button color={'red'} title={'Xóa'} onPress={()=>this.setState({modalXoa:!this.state.modalXoa})}/></View>
                
                
                      </View>
            :
            this.props.uidSession!=='-1'?
            <View style={{height:47,width:'100%',backgroundColor:'#03A9F4',position: 'absolute',
                bottom: 0,
                right:0}}>                
    <View style={{flex:1,flexDirection:'row'}}>
      <View style={{flex:8,paddingLeft:5,marginTop:5}}>
      <TextInput
      placeholder='bình luận..' 
      style={{backgroundColor:'white',borderColor:'#0277BD',borderWidth:1,borderRadius:3,height:38,fontSize:15}} underlineColorAndroid="white" returnKeyType="send"
      onChangeText={(value)=>this.setState({txt_command:value})}
      value={this.state.txt_command}
      onSubmitEditing={()=>this.btn_CommandPost()}/>
      </View>
      <View style={{flex:1,marginTop:5,paddingLeft:5}}>
      <TouchableHighlight underlayColor="#E0F7FA" onPress={()=>this.btn_CommandPost()}><Image source={require('../img/ic_send_white_24dp.png')} style={{height:35,width:35}}/>
      </TouchableHighlight>
      </View>
      </View>  
  </View>:null
            }

        
      </View>
    );
  }
  renderHide(){
    if(this.state.show===true){
    return(
      <View >
        <Text style={{color:'gray',marginLeft:5}}>Sản phẩm: <Text style={{fontStyle:'italic'}} >{this.state.postState.loaisp}</Text></Text>
        <Text style={{color:'gray',marginLeft:5}}>Số điện thoại: <Text style={{fontStyle:'italic'}} >{this.state.user_own.sdt}</Text></Text>
        <Text style={{color:'gray',marginLeft:5}}>Địa chỉ: <Text style={{fontStyle:'italic'}} >{this.state.postState.diachi_txh} {this.state.postState.diachi_t}</Text></Text>
        <View style={{height:1,backgroundColor:'#9E9E9Ed4',margin:10}}></View>
      {this.state.postState.idshop_own==='0'?<View style={{flexDirection:'row',marginTop:5,marginLeft:10,marginRight:10}}>
        <View style={{flex:1}} >
      <Image source={{uri:this.state.user_own.anhdaidien}} style={{width:40,height:40,borderRadius:100}}/>
      </View>
      <View style={{flex:6}} >
        <Text style={{color:'gray',marginLeft:5}}>{this.state.user_own.hovaten}</Text>
      <Text  style={{color:'gray',marginLeft:5}}>{this.state.user_own.sdt}</Text>
      </View>
      <View style={{flex:2}} >
      {this.props.uidSession!==this.state.user_own.uid && this.state.user.sdt!=='admin' && this.props.uidSession!=='-1'?<Button title="Nhắn tin" color="#40C4FF" onPress={()=>this.btn_NhanTin()}></Button>:null}
      </View>
      </View>
      :<View style={{flexDirection:'row',marginTop:5,marginLeft:10,marginRight:10}}>
        <View style={{flex:1}} >
      <Image source={{uri:this.state.shop.logoshop}} style={{width:40,height:40,borderRadius:100}}/>
      </View>
      <View style={{flex:6}} >
        <Text style={{color:'gray',marginLeft:5}}>Cửa hàng {this.state.shop.tencuahang}</Text>
      <Text  style={{color:'gray',marginLeft:5}}>{this.state.shop.sdtcuahang}</Text>
      </View>
      <View style={{flex:2}} >      
      </View>
      </View>}
      
      <View style={{height:1,backgroundColor:'#9E9E9Ed4',margin:10}}></View>
      {this.state.dataSourceEvent!==ds.cloneWithRows([])?<Text style={{color:'black'}} >Danh sách sự kiện:</Text>:null}
      <ListView
      dataSource={this.state.dataSourceEvent}
      enableEmptySections={true}
      renderRow={(rowData)=>
      <View style={{flexDirection:'row'}}>
      <View style={{flex:1,paddingLeft:10  }}>
        <Text style={{color:'black'}} >{rowData.thoigianbatdau.slice(0,17)}</Text>
      </View>
        <View style={{flex:2,paddingLeft:10}}>
          <Text  style={{color:'black'}}>{rowData.tensukien}</Text>
        </View></View>}
      />


      {this.props.uidSession===this.state.user_own.uid?
      <View style={{flexDirection:'row',justifyContent:'center',marginTop:5}}>
        <Button title="Tạo sự kiện mới" color="green" onPress={()=>this.setState({datebd:'bắt đầu',datekt:'kết thúc',modalVisible:true})}></Button>
        </View>
        :null}      
      
      {/* button expand */}      
       <Text style={{color:'green',fontStyle:'italic',textDecorationLine:'underline'}}
             onPress={()=>this.setState({show:false})}>Thu gọn</Text> 
       </View>
    );
  }
    else {
      return(        
            <Text style={{color:'green',fontStyle:'italic',textDecorationLine:'underline'}}
             onPress={()=>this.setState({show:true})}>Xem thêm thông tin</Text>         
      );
    }
  }
  

}
AppRegistry.registerComponent('ChoNhaNong_v1',()=>StatusDetail);
