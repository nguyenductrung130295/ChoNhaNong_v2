import React,{Component} from 'react';
import {Alert,ScrollView,AppRegistry,Platform,TextInput,View,Image,Text,TouchableHighlight,ListView,Button,Modal,Picker,PickerItem} from 'react-native';
import ItemListViewStatus from '../item_customer/ItemListViewStatus';
import ItemShowAllImage from '../item_customer/ItemShowAllImage'
import AddPostNew from './AddPostNew'
import firebase from '../entities/FirebaseAPI'
import Shops from '../entities/Shops'
import Users from '../entities/Users'
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import ImageViewer from 'react-native-image-zoom-viewer';
const ds=new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});
//cái khỉ gì vậy?
const Blob=RNFetchBlob.polyfill.Blob;
const fs=RNFetchBlob.fs;
window.XMLHttpRequest=RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob=Blob;
// hàm uploadImage vào firebase uri là đường dẫn file ảnh
//ko cần hiểu biết xài là dc,
const uploadImageAvatar=(uri,imageName,mime='image/jpg')=>{
  return new Promise((resolve,reject)=>{
    //nếu là IOS thì uri.replace() không thì sau : uri
    const uploadUri=Platform.OS==='ios'? uri.replace('file://',''):uri;
    let uploadBlob=null;
    //lưu vào storage trên firebase
    const imageRef=firebase.storage().ref('photos/logo_shops').child(imageName);
    //chổ này ko cần quan tâm
    fs.readFile(uploadUri,'base64').then((data)=>{
      return Blob.build(data,{type:'${mime};BASE64'});
    }).then((blob)=>{
      uploadBlob=blob;
      return imageRef.put(blob,{contentType:mime});
    }).then(()=>{
      uploadBlob.close();
      return imageRef.getDownloadURL();
    }).then((url)=>{
      resolve(url);
    }).catch((error)=>{
      reject(error);
    })
  })
}
const uploadImageBanner=(uri,imageName,mime='image/jpg')=>{
  return new Promise((resolve,reject)=>{
    //nếu là IOS thì uri.replace() không thì sau : uri
    const uploadUri=Platform.OS==='ios'? uri.replace('file://',''):uri;
    let uploadBlob=null;
    //lưu vào storage trên firebase
    const imageRef=firebase.storage().ref('photos/banner_shops').child(imageName);
    //chổ này ko cần quan tâm
    fs.readFile(uploadUri,'base64').then((data)=>{
      return Blob.build(data,{type:'${mime};BASE64'});
    }).then((blob)=>{
      uploadBlob=blob;
      return imageRef.put(blob,{contentType:mime});
    }).then(()=>{
      uploadBlob.close();
      return imageRef.getDownloadURL();
    }).then((url)=>{
      resolve(url);
    }).catch((error)=>{
      reject(error);
    })
  })
}

const database=firebase.database();

export default class ShopMain extends Component{

  constructor(props){
    super(props);
    this.state={
      dataSource:ds.cloneWithRows([]),
      dataSourceChuaDuyet:ds.cloneWithRows([]),
      imgyes:false,
      options:1,//1:bài đăng,2:thông tin,3:ảnh
      mysefl:false,//false: là khách xem ,true: là ban than ca nhan ho xem minh
      modalVisible1: false,
      modalVisible2: false,
      modalKhoa:false,
      modalXoa:false,
      modalEdit:false,
      typeuser:'',
      shop:new Shops(),
      user_sohuu:new Users(),
      user_guest:new Users(),
      select_loaivipham:'Vũ khí cấm sử dụng',
      isEdit:false,
      backgrTab1:'#0288D150',
      backgrTab2:'#0288D1',
      backgrTab3:"#0288D1",    
      loaiThTin:'',
      txt_thongtin:'',
      valueTinhTPPicker:'Hồ Chí Minh',
      valueLoaiPicker:'Trái cây',
      modalImage:false,//modal xem full image
      imagesModal:[],//mảng chứa hình cho ImageViewer
      imageName:'',//tên file
      imagePath:'',//đường dẫn ảnh
      imageHeight:'',//chiều cao ảnh
      imageWidth:'',//rộng ảnh
      arrayImage:[],//mảng chứa đường dẫn ảnh
      isGuest:false,
      Isfollow:'Theo dõi',//trạng thái đang theo dõi hay không
      soluongfollow:'',
      listbd:false,//bài đăng rỗng
      listcd:false,//đợi duyệt rỗng
    };
    loai=['Hoa, cây cảnh','Rau củ','Trái cây','Cây Tinh Bột','Thủy, hải sản','Gia súc, gia cầm','Cây công nghiệp','Cây Thuốc'];
    tinh=['Hà Nội','Tp.Hồ Chí Minh','Hải Phòng','Đà Nẵng','Cần Thơ','An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu','Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cao Bằng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang','Hà Nam','Hải Dương','Hậu Giang','Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai','Long An','Nam Định','Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Quảng Bình','Quảng Nam','Quãng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa','Thừa Thiên Huế','Tiền Giang','Trà Vinh','Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái','Phú Yên'];// picker chứa tỉnh thành phố
  }
   renderItemLoai(){
    items=[];
    for(let item of loai){
      items.push(<Picker.Item key={item} label={item} value={item}/>)
    }
    return items;
  }
  renderItemTinh(){
    //render picker Tỉnh thành phố ra màn hình
    items=[];
    //lây mỗi item trong mảng tỉnh push "PICKEr.item" vào
    for(let item of tinh){
      items.push(<Picker.Item key={item} label={item} value={item}/>)
    }
    //trả về danh sách trong picker cho PICKER
    return items;
  }
  componentWillMount(){

    tb_shop=database.ref('db_marketsfarmers/table_shops');
    sh=new Shops();

    tb_shop.orderByKey().equalTo(this.props.sid).on('value',(snap)=>{
      if(snap.exists()){
        snap.forEach((data)=>{
          sh.shopid=data.key;
          sh.gioithieu=data.val().gioithieu;
          sh.tencuahang=data.val().tencuahang;
          sh.loaisp=data.val().loaisp;
          sh.diachi_txh=data.val().diachi_txh;
          sh.diachi_t=data.val().diachi_t;
          sh.sdtcuahang=data.val().sdtcuahang;
          sh.score_star=data.val().score_star;
          sh.logoshop=data.val().logoshop;
          sh.anhbiashop=data.val().anhbiashop;
          sh.user_own=data.val().user_own;
          sh.state=data.val().state;//lấy tình trạng
          sh.loaivipham=data.val().loaivipham;//loại vi phạm
        });
        this.setState({shop:sh});
        tb_user=database.ref('db_marketsfarmers/table_users');
        us=new Users();
        tb_user.orderByKey().equalTo(sh.user_own).on('value',(snap)=>{
          if(snap.exists()){
            snap.forEach((data)=>{
              us.uid=data.key;
              us.hovaten=data.val().hovaten;
              us.sdt=data.val().sdt;
              //us.diachi=data.val().diachi;
              //us.email=data.val().email;
              us.anhdaidien=data.val().anhdaidien;
              //us.anhbia=data.val().anhbia;
            });
            this.setState({user:us});
            if(this.props.uidSession!==us.uid)//là user sở hữu
              {this.setState({isGuest:true});
              userguest=database.ref('db_marketsfarmers/table_users').child(this.props.uidSession);
              userguest.once('value',(sn)=>{
                ug=new Users();
                if(sn.exists()){
                  ug.hovaten=sn.val().hovaten;
                 this.setState({user_guest:ug}); 
                }
                 
              });

              }

          }
          else{
            Alert.alert('Thông tin','firebase get user error');
          }
        });
      }
      else{
        //alert('firebase error');
      }
  });
   //kiểm tra đang theo dõi chưa
              follow=database.ref('db_marketsfarmers/table_shops/'+this.props.sid+'/follow');
              follow.child(this.props.uidSession)//tại user đang đang nhập
              .once('value',(sn)=>{
                if(sn.exists()){
                  //nếu tồn tại
                  this.setState({Isfollow:'Bỏ theo dõi'});
                }else{
                  this.setState({Isfollow:'Theo dõi'});
                }
              });
              table_follows=database.ref('db_marketsfarmers/table_shops/'+this.props.sid+"/follow");
    table_follows.child('uid').once('value',(data)=>{
      if(this.state.Isfollow==='Theo dõi' && data.exists()){
        this.setState({soluongfollow:data.val().maxid});
      }});
//LẤY DỮ lIỆU CỦA SHOP
  tb_listposts=database.ref('db_marketsfarmers/table_posts/Bán');//trỏ đến chổ table_shops
  var postTam=[];//lưu post
  var postKey=[];//lưu key id của post 123456
  var postTamChuaDuyet=[];//lưu post
  var postKeyChuaDuyet=[];//lưu key id của post 123456
        tb_listposts.orderByChild('idshop_own')// lấy những post của shop
        .equalTo(this.props.sid)// sid là id của shop
        .on('value',(snapshot)=>{
          postTam=[];
          postKey=[];
          postTamChuaDuyet=[];
          postKeyChuaDuyet=[];
          snapshot.forEach((data)=>{
              table_hinhs=database.ref('db_marketsfarmers/table_posts/Bán/'+data.key+'/images/');
              table_hinhs.limitToFirst(1).on('value',(snapHinh)=>{
                snapHinh.forEach((datahinh)=>{
                  if(data.val().statecheck==='Bình thường'){
                      //alert(datahinh.val().linkpost);
                    postKey.push(data.key);//chổ này để thêm idpost zô rồi lát sắp xếp ok
                    postTam.push({
                      idpost:data.key,
                      diachi_t:data.val().diachi_t,
                      giaban:data.val().giaban,
                      //loaitien:data.val().loaitien,
                      thoigiandang:data.val().thoigiandang,
                      tieude:data.val().tieude,
                      linkhinh:datahinh.val().linkpost
                    });
                  }else{
                      //alert(datahinh.val().linkpost);
                    postKeyChuaDuyet.push(data.key);//chổ này để thêm idpost zô rồi lát sắp xếp ok
                    postTamChuaDuyet.push({
                      idpost:data.key,
                      diachi_t:data.val().diachi_t,
                      giaban:data.val().giaban,
                      //loaitien:data.val().loaitien,
                      thoigiandang:data.val().thoigiandang,
                      tieude:data.val().tieude,
                      linkhinh:datahinh.val().linkpost
                    });
                  }
                  
                });
              });



          });
          //sau khi lấy post của bên bán thì lấy của bên mua, tương tự

          tb_listpostsMUA=database.ref('db_marketsfarmers/table_posts/Mua');//trỏ đến chổ table_shops

                tb_listpostsMUA.orderByChild('idshop_own')//xếp theo idpost_uid_own
                .equalTo(this.props.sid)//idpost_uid_own===idpostTam_uidsession
                .on('value',(snapshotMUA)=>{
                  snapshotMUA.forEach((dataMUA)=>{
                    flagMUA=0;//chưa tồn tại post trong list
                  if(dataMUA.val().statecheck==='Bình thường'){
                    for(let i=0;i<postTam.length;i++){
                      if(postTam[i].idpost===dataMUA.key){
                        //có tồn tại rồi, update lại thôi
                        postTam[i].idpost=dataMUA.key;
                        postTam[i].diachi_t=dataMUA.val().diachi_t;
                        postTam[i].giaban=dataMUA.val().giaban;
                        //postTam[i].loaitien=dataMUA.val().loaitien;
                        postTam[i].thoigiandang=dataMUA.val().thoigiandang;
                        postTam[i].tieude=dataMUA.val().tieude;
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
                  }else{
                    for(let i=0;i<postTamChuaDuyet.length;i++){
                      if(postTamChuaDuyet[i].idpost===dataMUA.key){
                        //có tồn tại rồi, update lại thôi
                        postTamChuaDuyet[i].idpost=dataMUA.key;
                        postTamChuaDuyet[i].diachi_t=dataMUA.val().diachi_t;
                        postTamChuaDuyet[i].giaban=dataMUA.val().giaban;
                        //postTamChuaDuyet[i].loaitien=dataMUA.val().loaitien;
                        postTamChuaDuyet[i].thoigiandang=dataMUA.val().thoigiandang;
                        postTamChuaDuyet[i].tieude=dataMUA.val().tieude;
                        //postTam[i].linkhinh=datahinh.val().linkpost;
                        flagMUA=1;//báo có tồn tại
                        table_hinhsMUA=database.ref('db_marketsfarmers/table_posts/Mua/'+dataMUA.key+'/images/');
                        table_hinhsMUA.limitToFirst(1).on('value',(snapHinhMUA)=>{
                          snapHinhMUA.forEach((datahinhMUA)=>{
                            //alert(datahinh.val().linkpost);
                            postTamChuaDuyet[i].linkhinh=datahinhMUA.val().linkpost;
                          });
                        });

                      }
                    }
                  }                  
                    //console.log(datahinh.val().linkpost);
                    if(flagMUA===0){//không tồn tại, thêm mới post vào
                      table_hinhsMUA=database.ref('db_marketsfarmers/table_posts/Mua/'+dataMUA.key+'/images/');
                      table_hinhsMUA.limitToFirst(1).on('value',(snapHinhMUA)=>{
                        snapHinhMUA.forEach((datahinhMUA)=>{
                          //alert(datahinh.val().linkpost);

                          if(dataMUA.val().statecheck==='Bình thường'){
                            postKey.push(dataMUA.key);
                            //alert("-------------->"+dataMUA.key);
                            postTam.push({
                              idpost:dataMUA.key,
                              diachi_t:dataMUA.val().diachi_t,
                              giaban:dataMUA.val().giaban,
                              //loaitien:dataMUA.val().loaitien,
                              thoigiandang:dataMUA.val().thoigiandang,
                              tieude:dataMUA.val().tieude,
                              linkhinh:datahinhMUA.val().linkpost
                            });
                          }else{
                            postKeyChuaDuyet.push(dataMUA.key);
                            //alert("-------------->"+dataMUA.key);
                            postTamChuaDuyet.push({
                              idpost:dataMUA.key,
                              diachi_t:dataMUA.val().diachi_t,
                              giaban:dataMUA.val().giaban,
                              //loaitien:dataMUA.val().loaitien,
                              thoigiandang:dataMUA.val().thoigiandang,
                              tieude:dataMUA.val().tieude,
                              linkhinh:datahinhMUA.val().linkpost
                            });
                          }
                         
                        });
                      });

                    }

                  });

                  //hàm nãy đẽ sắp xếp thời gian trễ dần ok
                  //sort để xếp tăng dần hoặc giảm dần
                  // return a-b thì tăng dần
                  //return b-a thì giảm dần
                  postKey.sort(function(a, b){return b-a});
                  var postTamMain=[];
                  k=0;
                  //ánh xạ 2 mảng, xếp mảng postTam[] theo thứ tự của postKey[ư]
                  for(let i=0;i<postKey.length;i++){
                    for(let j=0;j<postTam.length;j++){
                      if(postTam[j].idpost===postKey[i]){
                        postTamMain[k]=postTam[j];
                        k++;
                      }
                    }
                  }
                  //thêm vào datasource cho listView in ra
                  this.setState({dataSource:ds.cloneWithRows(postTamMain)});
                  if(postTamMain.length===0){
                    this.setState({listbd:false});                    
                  }else{
                    this.setState({listbd:true});
                  }
                  //alert(this.state.dataSource.length);
                  postKeyChuaDuyet.sort(function(a, b){return b-a});
                  var postTamMainChuaDuyet=[];
                  k=0;
                  //ánh xạ 2 mảng, xếp mảng postTam[] theo thứ tự của postKey[ư]
                  for(let i=0;i<postKeyChuaDuyet.length;i++){
                    for(let j=0;j<postTamChuaDuyet.length;j++){
                      if(postTamChuaDuyet[j].idpost===postKeyChuaDuyet[i]){
                        postTamMainChuaDuyet[k]=postTamChuaDuyet[j];
                        k++;
                      }
                    }
                  }
                  //thêm vào datasource cho listView in ra
                  this.setState({dataSourceChuaDuyet:ds.cloneWithRows(postTamMainChuaDuyet)});
                  if(postTamMainChuaDuyet.length===0){
                    this.setState({listcd:false});                    
                  }else{
                    this.setState({listcd:true});
                  }
                });
        });
if(this.props.uidadmin!=='0'){
tb_userad=database.ref('db_marketsfarmers/table_users');
    //usad=new Users();

    tb_userad.orderByKey().equalTo(this.props.uidadmin).on('value',(snap)=>{
      if(snap.exists()){
        snap.forEach((data)=>{
          this.setState({typeuser:data.val().type});
          //usad.uid=data.key;
          //usad.hovaten=data.val().hovaten;
          //usad.sdt=data.val().sdt;
          //usad.diachi=data.val().diachi;
          //usad.email=data.val().email;
          //usad.anhdaidien=data.val().anhdaidien;
          //usad.anhbia=data.val().anhbia;
          //usad.state=data.val().state;
        });
        
      }
      else{
        Alert.alert('Thông tin','firebase error');
      }
  });
  }


  }
  setModalVisible1(visible) {
    this.setState({modalVisible1:visible});
  }
  setModalVisible2(visible) {
    this.setState({modalVisible2:visible});
  }
  btn_KhoaCuaHang_Click(){
    this.setState({modalKhoa:!this.state.modalKhoa});
    database=firebase.database();
    updateShop=database.ref('db_marketsfarmers/table_shops')
    .child(this.state.shop.shopid);
    if(this.state.shop.state==='Bình thường'){
      updateShop.update({
        state:'Đang bị khóa',
        loaivipham:this.state.select_loaivipham
      });
      notification=database.ref('db_marketsfarmers/table_notif/'+this.state.shop.user_own);

            notification.orderByKey().limitToLast(1).//once('value')
            //.then(function(snap) {
            on('value',(snap)=>{

              snap.forEach((data)=>{
                console.log(flag+":"+parseInt(data.key));
                if(flag!==parseInt(data.key)){
                  var maxid=parseInt(data.key)+1;
                  var d = new Date();//new time now
    var time = d.toString().slice(4,24);
                  //dem++;
                  flag=maxid;
                  insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.state.shop.user_own);
                  insert_noti.child(maxid).set({
                    idpost:this.props.sid,
                    content:' của bạn đã bị khóa do vi phạm '+this.state.select_loaivipham,
                    state:'dagui',
                    time:time,
                    title:'Cửa hàng '+this.state.shop.tencuahang,
                    type:'follow'
                  },()=>{                                        
                    notification.off('value');
                    
                  });
                }
              });

            });
      Alert.alert('Thông tin','Đã khóa '+ this.state.shop.tencuahang);
    }else{
      updateShop.update({
        state:'Bình thường',
        loaivipham:''
      });
      Alert.alert('Thông tin',this.state.shop.tencuahang+' đã hoạt động bình thường');
      notification=database.ref('db_marketsfarmers/table_notif/'+this.state.shop.user_own);

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
                  insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.state.shop.user_own);
                  insert_noti.child(maxid).set({
                    idpost:this.props.sid,
                    content:' của bạn đã được mở khóa và hoạt động bình thường.',
                    state:'dagui',
                    time:time,
                    title:'Cửa hàng '+this.state.shop.tencuahang,
                    type:'follow'
                  },()=>{                                        
                    notification.off('value');
                    
                  });
                }
              });

            });
    }
  }
  btn_XoaCuaHang_Click(){
    this.setState({modalXoa:!this.state.modalXoa});
    database=firebase.database();
    
    findlistshop=database.ref('db_marketsfarmers/table_posts').orderByChild('idshop_own')
    .equalTo(this.props.sid).on('value',(sn)=>{
      sn.forEach((data)=>{
        deletepost=database.ref('db_marketsfarmers/table_posts/'+data.key).remove();
      });
      deleteShop=database.ref('db_marketsfarmers/table_shops')
    .child(this.state.shop.shopid).remove();
    });
    Alert.alert('Thông tin','Đã xóa '+this.state.shop.tencuahang);
    if(this.state.user.type==='user')
    {
      this.props.propsNavigator.pop();
      return;
    }
    notification=database.ref('db_marketsfarmers/table_notif/'+this.state.shop.user_own);

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
                  insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.state.shop.user_own);
                  insert_noti.child(maxid).set({
                    idpost:this.props.sid,
                    content:' và các bài đăng trong cửa hàng của bạn đã bị xóa do vi phạm các điều lệ.',
                    state:'dagui',
                    time:time,
                    title:this.state.shop.tencuahang,
                    type:'system'
                  },()=>{                    
                    table_commands.off('value');
                    notification.off('value');
                    
                  });
                }
              });

            });


    this.props.propsNavigator.pop();
  }
  yesImg(){
    if(this.state.imgyes){
      return(
        <Text onPress={()=>Alert.alert('Thông tin','doi anh')} style={{color:'red'}}>Đổi ảnh</Text>
      );
    }else{
      return(
        <Text onPress={()=>Alert.alert('Thông tin','thêm anh')} style={{color:'red'}}>Thêm ảnh</Text>
      );
    }
  }

  openImagePicker(){
    const  options={
      title:'select avatar',
      storageOption:{
        skipBackup:true,
        path:'images'
      },
    };
    ImagePicker.showImagePicker(options,(response)=>{
      if(response.didCancel){
        console.log('User cancelled image picker');
      }else if(response.error){
        console.log('Error'+response.error);
      }else if(response.customButton){
        console.log('User tapped custom button '+response.customButton);
      }
      else{
        data=this.state.arrayImage;
        data.push(response.uri);//thêm image vào cuối mảng
        //i=this.state.cur_img+1;
        this.setState({
          imagePath:response.uri,
          imageHeight:response.height,
          imageWidth:response.width,
          arrayImage:data,
          cur_img:this.state.cur_img+1,//cur_img:i,
          sum_img:this.state.sum_img+1,
        });
      }
    });

  }
   checkSDT(ip){
    if(isNaN(ip)===false){//toàn số
      if(ip.charAt(0)==='0')
        return true;
      return false;
    }else
      return false;    
  }
btn_LuuThongTinEdit(){
    this.setState({modalEdit:!this.state.modalEdit});
    database=firebase.database();    
    switch(this.state.loaiThTin){
        case 'loigioithieu':
          updatehovatenuser=database.ref('db_marketsfarmers/table_shops').child(this.props.sid)
          .update({gioithieu:this.state.txt_thongtin});
          break;
        case 'tencuahang':
          updatehovatenuser=database.ref('db_marketsfarmers/table_shops').child(this.props.sid)
          .update({tencuahang:this.state.txt_thongtin});
          break;
        case 'loaisp':
          updateloaispuser=database.ref('db_marketsfarmers/table_shops').child(this.props.sid)
          .update({loaisp:this.state.valueLoaiPicker});
          break;
        case 'sdt':
          if(this.state.txt_thongtin.trim()===this.state.shop.sdtcuahang){
            Alert.alert('Thông tin','Trùng với số đang dùng hiện tại.');
          }else{
            if(this.checkSDT(this.state.txt_thongtin.trim())===false){
              Alert.alert('Thông báo','Số điện thoại không hợp lệ.');
              return;
            }
           /* sdttrung=database.ref('db_marketsfarmers/table_shops')
            .orderByChild('sdt').equalTo(this.state.txt_thongtin.trim())
            .on('value',(sn)=>{
              if(sn.exists()){
                alert('Số điện thoại đã được đăng ký');
              }else{*/
                updatehovatenuser=database.ref('db_marketsfarmers/table_shops').child(this.props.sid)
                .update({sdtcuahang:this.state.txt_thongtin});
               // sdttrung.off('value');
              /*}
            });*/
          }
          
          break;
        case 'diachi':
          updatehovatenuser=database.ref('db_marketsfarmers/table_shops').child(this.props.sid)
          .update({
            diachi_txh:this.state.txt_thongtin,
            diachi_t:this.state.valueTinhTPPicker
          });
          break;
       // case 'email':
       // updatehovatenuser=database.ref('db_marketsfarmers/table_users').child(this.props.uidSession)
       //   .update({email:this.state.txt_thongtin});
       //   break;
        case 'anhdaidien':

        var str=this.state.shop.logoshop;
          var n = str.indexOf("logo_shops%2F");
    var m=str.indexOf("?");
    str=str.slice(n+13,m);
    if(str!=='shops.jpg'){
      var storage = firebase.storage();//khởi tạo nơi lưu trữ file trong storeage firebase
                // Create a storage reference from our storage service
          var storageRef = storage.ref('photos/logo_shops/');// tại gốc
          //xóa hình cũ
      var desertRef = storageRef.child(str);
          // Delete the file
          desertRef.delete().then(function() {
           }).catch(function(error) {
            // Uh-oh, an error occurred!
          });

    }
          //tạo tên mới theo thời gian quá haya
                var d = new Date();
                var n = d.toISOString();
                var a,b,c,d1;
                a=n.slice(0,12);
                b=n.slice(14,16);
                c=n.slice(17,19);
                d1=n.slice(20,24);
                n=a+b+c+d1;//tên file mới
                
                  //cái hàm uploadImage này là nó upload cái hình tại đường dẫn Path tên
                uploadImageAvatar(this.state.arrayImage[0],n+".jpg").then((responseData)=>{
                  updateanhdaidien=database.ref('db_marketsfarmers/table_shops').child(this.props.sid)
                  .update({logoshop:responseData});
                  this.setState({arrayImage:[],imagePath:''});
                }).done();
          break;
        case 'anhbia':
         var str=this.state.shop.anhbiashop;
          var n = str.indexOf("banner_shops%2F");
    var m=str.indexOf("?");
    str=str.slice(n+15,m);
    if(str!=='bannershopdefault.png'){
      var storage = firebase.storage();//khởi tạo nơi lưu trữ file trong storeage firebase
                // Create a storage reference from our storage service
          var storageRef = storage.ref('photos/banner_shops/');// tại gốc
          //xóa hình cũ
      var desertRef = storageRef.child(str);
          // Delete the file
          desertRef.delete().then(function() {
           }).catch(function(error) {
            // Uh-oh, an error occurred!
          });

    }
        //tạo tên mới theo thời gian quá haya
                var d = new Date();
                var n = d.toISOString();
                var a,b,c,d1;
                a=n.slice(0,12);
                b=n.slice(14,16);
                c=n.slice(17,19);
                d1=n.slice(20,24);
                n=a+b+c+d1;//tên file mới
                
                  //cái hàm uploadImage này là nó upload cái hình tại đường dẫn Path tên
                uploadImageBanner(this.state.arrayImage[0],n+".jpg").then((responseData)=>{
                  updateanhdaidien=database.ref('db_marketsfarmers/table_shops').child(this.props.sid)
                  .update({anhbiashop:responseData});
                  this.setState({arrayImage:[],imagePath:''});
                }).done();
/*
          var storage = firebase.storage();//khởi tạo nơi lưu trữ file trong storeage firebase
          // Create a storage reference from our storage service
          var storageRef = storage.ref('photos/banner_users/');// tại gốc
          //xóa hình cũ
          var str=this.state.user.anhbia;
          var n = str.indexOf("avatar_users%2F");
    var m=str.indexOf("?");
    str=str.slice(n+15,m);
          var desertRef = storageRef.child(str);

          // Delete the file
          desertRef.delete().then(function() {
            




          }).catch(function(error) {
            // Uh-oh, an error occurred!
          });
*/
          break;
        
    };
    alert('Lưu chỉnh sửa thành công.');
    this.setState({loaiThTin:''});
  }
  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flex:1}}>
          <Image style={{width:'100%',height:'100%'}}
            resizeMode='stretch'
            source={{uri:this.state.shop.anhbiashop}}>
          <View style={{flexDirection:'row',backgroundColor:'#00000000'}}>
            <View style={{flex:1}}>
              
              <TouchableHighlight underlayColor='#FAFAFA' onPress={()=>this.btn_Back_Click()}>
                <Image source={require('../img/ic_arrow_back_white_24dp.png')} style={{width:40,height:40,marginTop:5}}/>
              </TouchableHighlight></View>
            <View style={{flex:6}}>
              <Text style={{fontSize:20,color:'white',marginTop:10}}>Cửa hàng</Text>
            </View> 
            <View style={{flex:3}}>{this.state.isGuest===false && this.state.isEdit===true?
      <TouchableHighlight style={{margin:5,height:30,justifyContent:'center',alignItems:'center',backgroundColor:'#00000060',borderRadius:2,borderColor:'white',borderWidth:1}} onPress={()=>this.setState({modalXoa:!this.modalXoa})}><Text style={{color:'#ffffff'}}>Xóa cửa hàng</Text></TouchableHighlight>
      :this.state.isGuest===true && this.state.typeuser!=='admin'?        
          <TouchableHighlight style={{margin:5,height:30,justifyContent:'center',alignItems:'center',backgroundColor:'#00000060',borderRadius:2,borderColor:'white',borderWidth:1}} onPress={()=>this.btn_TheoDoiShop()}><Text style={{color:'#ffffff'}}>{this.state.Isfollow}</Text></TouchableHighlight>                
        :null
      }
      </View>                
          </View>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:3}}>
                <Image style={{width:100,height:100,borderRadius:5,borderWidth:2,borderColor:'white',marginLeft:15,marginTop:40}}
                source={{uri:this.state.shop.logoshop}}/>
              </View>
              <View style={{flex:1}}></View>
            </View>

            <View style={{flexDirection:'row',height:40,backgroundColor:'#00000030'}}>
            <View style={{flex:6}}>
            {this.state.isEdit===false?<Text style={{marginLeft:10,marginTop:5,color:'white',fontSize:20}}>{this.state.shop.tencuahang}
            </Text>
            :
            <View style={{marginLeft:5,flexDirection:'row'}}>
             
               <View style={{backgroundColor:'#2121215a',padding:5,flexDirection:'row',borderRadius:3}} >
                             <Image source={require('../img/ic_edit_white_24dp.png')} style={{ width:17,height:17,marginTop:3}}/>
               <Text  onPress={()=>this.setState({loaiThTin:'anhdaidien',modalEdit:!this.state.modalEdit})}
                 style={{fontSize:15,marginLeft:5,fontWeight:'bold',color:'white',textDecorationLine:'underline'}} >Sửa ảnh đại diện</Text>
                 </View>
               
               </View>
            }
              </View>
              {this.state.isEdit===false? this.state.soluongfollow>0?
              <View style={{flex:2,paddingRight:10,paddingBottom:3,flexDirection:'row'}}>
                  <Image source={require('../img/ic_people_white_24dp.png')} style={{width:30,height:30,marginTop:5}}/>
                  <Text style={{color:'white'}}>{this.state.soluongfollow} {"\n"} theo dõi</Text>
              </View>
              :null
              :
              
                <View style={{backgroundColor:'#2121215a',padding:5,flexDirection:'row',borderRadius:3}} >
                             <Image source={require('../img/ic_edit_white_24dp.png')} style={{ width:17,height:17,marginTop:3}}/>
               <Text  onPress={()=>this.setState({loaiThTin:'anhbia',modalEdit:!this.state.modalEdit})}
                 style={{fontSize:15,marginLeft:5,fontWeight:'bold',color:'white',textDecorationLine:'underline'}} >Sửa ảnh bìa</Text>
                 </View>
              }
              
            </View>
            </Image>

        </View>

        <View style={{flex:2,backgroundColor:'#E0E0E0'}}>
        <View style={{flexDirection:'row',height:40}}>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:this.state.backgrTab1}}><Text style={{color:'white',fontSize:18}} onPress={()=>this.btn_ShowTabBaiDang()}>Bài Đăng</Text></View>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:this.state.backgrTab2}}><Text style={{color:'white',fontSize:18}} onPress={()=>this.btn_ShowTabThongTin()}>Thông Tin</Text></View>
          {this.state.isGuest===true? null:
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:this.state.backgrTab3}}><Text style={{color:'white',fontSize:18}} onPress={()=>this.btn_ShowTabAnh()}>Đợi duyệt</Text></View>
          }
          
        </View>
        <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
        <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
        <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
        {this._renderOptions()}



<Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalXoa}
              onRequestClose={() => Alert.alert('Thông tin',"Modal has been closed.")}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1',borderTopLeftRadius:4,borderTopRightRadius:4}}>
                <View style={{flex:7}}>
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Xóa Cửa hàng</Text>
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setState({modalXoa:!this.state.modalXoa})
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                </View>
              </View>
              
                
                {/* picker loại sp cúả cửa hàng*/}
                <Text style={{marginLeft:10}}>Bạn có chắc muốn xóa {this.state.shop.tencuahang} không?</Text>
                              

                  <View style={{flexDirection:'row',padding: 10}}>
                    <View style={{flex:1}}></View>
                  <View style={{flex:1}}><Button color={'red'} title={'Hủy'} onPress={()=>this.setState({modalXoa:!this.state.modalXoa})}/></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}><Button onPress={()=>this.btn_XoaCuaHang_Click()} title={'Xóa'} color='blue'></Button></View>
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
              visible={this.state.modalEdit}
              onRequestClose={() => Alert.alert('Thông tin',"Modal has been closed.")}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1',borderTopLeftRadius:5,borderTopRightRadius:5}}>
                <View style={{flex:7}}>
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Chỉnh sửa thông tin</Text>
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setState({modalEdit:!this.state.modalEdit})
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                </View>
              </View>
              <View style={{padding:10}}>
              {this.renderLoaiThongTin()}
                {this.state.loaiThTin!=='anhbia'&&this.state.loaiThTin!=='anhdaidien'&& this.state.loaiThTin!=='loaisp'?
              <TextInput style={{borderRadius:4,borderWidth:1,borderColor:'#BDBDBD',height:38,color:'black'}}
          onChangeText={(value)=>this.setState({txt_thongtin:value})}/>
          :null}</View>
          {(this.state.loaiThTin==='anhbia'||this.state.loaiThTin==='anhdaidien')  && !this.state.imagePath ?
          null:
          <View style={{flexDirection:'row',padding: 10}}>
                    <View style={{flex:1}}></View>
                  <View style={{flex:2}}><Button color={'red'} title={'Hủy'} onPress={()=>this.setState({modalEdit:!this.state.modalEdit,imagePath:'',arrayImage:[]})}/></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:2}}><Button onPress={()=>this.btn_LuuThongTinEdit()} title={'Lưu'} color='blue'></Button></View>
                   <View style={{flex:1}}></View>                
          </View>
          
           }
                
          </View>
              </View>
              <View style={{flex:1}}></View>
             </View>
            </Modal>
            <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalKhoa}
              onRequestClose={() =>Alert.alert('Thông tin',"Modal has been closed.")}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1',borderTopLeftRadius:4,borderTopRightRadius:4}}>
                <View style={{flex:7}}>
                  {this.state.shop.state==='Bình thường'?// chổ này là đang khóa thì hiển thị nút hủy khóa, ngược lại
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Khóa Cửa hàng</Text>
                  :
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Mở khóa</Text> 
                  }
                  
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setState({modalKhoa:!this.state.modalKhoa})
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                </View>
              </View>
              
                
                {/* picker loại sp cúả cửa hàng*/}
                {this.state.shop.state==='Bình thường'?
                <View style={{flexDirection:'row'}}>                
                <View style={{flex:3,borderColor:'#BDBDBD'}}>
                {/* picker loại sp cúả cửa hàng*/}
                <Text>Vi phạm</Text>
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
                  <View style={{flex:1}}><Button color={'red'} title={'Hủy'} onPress={()=>this.setState({modalKhoa:!this.state.modalKhoa})}/></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}>
                    {this.state.shop.state==='Bình thường'?
                    <Button onPress={()=>this.btn_KhoaCuaHang_Click()} title={'Khóa'} color='blue'></Button>
                    :<Button onPress={()=>this.btn_KhoaCuaHang_Click()} title={'Mở Khóa'} color='blue'></Button>
                    }
                    </View>
                   <View style={{flex:1}}></View>
                
          </View>
          </View>
              </View>
              <View style={{flex:1}}></View>
             </View>
            </Modal>

                
        </View>
{this.state.typeuser==='admin'? 
            <View style={{height:73,width:'100%',backgroundColor:'#BDBDBDA0',position: 'absolute',
                bottom: 0,
                right:0}}>
                <View style={{backgroundColor:'#CCFF90',height:30,width:'100%',justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:'#64DD17',fontSize:18,fontStyle:'italic'}}>{this.state.shop.state}{this.state.shop.loaivipham!==''? ' ('+this.state.shop.loaivipham+')':''}</Text>
    </View><View style={{flexDirection:'row'}}>
      {this.state.shop.state==='Bình thường'?
<View style={{flex:1,padding:5}}><Button color={'orange'} title={'Khóa cửa hàng'} onPress={()=>this.setState({modalKhoa:!this.state.modalKhoa})}/></View>
:
<View style={{flex:1,padding:5}}><Button color={'orange'} title={'Mở khóa'} onPress={()=>this.setState({modalKhoa:!this.state.modalKhoa})}/></View>
        
      }
                
                <View style={{flex:1,padding:5}}><Button color={'red'} title={'Xóa cửa hàng'} onPress={()=>this.setState({modalXoa:!this.state.modalXoa})}/></View>
                </View>
                
                      </View>
            : this.renderButton()
            }

                
                      <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.modalVisible1}
                        onRequestClose={() => Alert.alert('Thông tin',"Modal has been closed.")}
                        >
                       <View style={{flex:1,backgroundColor:'#000000a0'}}>
                        <View style={{flex:1}}></View>
                        <View style={{flex:2}}>
                        <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
                        <View style={{flexDirection:'row',backgroundColor:'#0288D1'}}>
                          <View style={{flex:7}}>
                            <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Sự kiện của Cửa hàng</Text>
                          </View>
                          <View style={{flex:1}}>
                            <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                              this.setModalVisible1(!this.state.modalVisible1)
                            }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                          </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                          <View style={{flex:1}}>
                            <Image source={require('../img/thaole.jpg')} style={{width:40,height:40,marginTop:10,marginLeft:10,borderColor:'white',borderWidth:1,borderRadius:100}}/>
                          </View>
                          <View style={{flex:3,borderColor:'#BDBDBD'}}>

                          </View>
                          <View style={{flex:4}}>

                          </View>
                        </View>

                            <View style={{padding: 10}}>

                          <Button onPress={()=>this.btn_DangNhap_Click()} title={'Đăng Ký'} color='#03A9F4'></Button>
                    </View>
                    </View>
                        </View>
                        <View style={{flex:1}}></View>
                       </View>
                      </Modal>

        </View>


     
    );
  }
  btn_TheoDoiShop(){
     //theo dõi post
    //var flag=-1;
    var d = new Date();//new time now
    var time = d.toString().slice(4,24);//cắt chuỗi thòi gian cần ngày thang năm giờ:phut:giay
    table_follows=database.ref('db_marketsfarmers/table_shops/'+this.props.sid+"/follow");
    table_follows.child('uid').once('value',(data)=>{
      if(this.state.Isfollow==='Theo dõi' && data.exists()){
          var maxid=parseInt(data.val().maxid)+1;//số lượng theo dõi
          //dem++;          
          addfollow=database.ref('db_marketsfarmers/table_shops/'+this.props.sid+"/follow");
          addfollow.child(this.props.uidSession).set({//sét user theo dõi            
            name:this.state.user.hovaten,//tên
            time:time//thời gian theo dõi
          },()=>{

            //set lại số lượng
            updateMaxFollow=database.ref('db_marketsfarmers/table_shops/'+this.props.sid+'/follow');
            updateMaxFollow.child('uid').update({
              maxid:maxid
            });
            
            //set thông báo
            var flag=0;
            //    console.log(this.state.user_own.uid);
            notification=database.ref('db_marketsfarmers/table_notif/'+this.state.shop.user_own);

            notification.orderByKey().limitToLast(1).//once('value')
            //.then(function(snap) {
            on('value',(snap)=>{

              snap.forEach((data)=>{
                console.log(flag+":"+parseInt(data.key));
                if(flag!==parseInt(data.key)){
                  var maxid=parseInt(data.key)+1;
                  //dem++;
                  flag=maxid;
                  insert_noti=database.ref('db_marketsfarmers/table_notif/'+this.state.shop.user_own);
                  insert_noti.child(maxid).set({
                    idpost:this.state.shop.shopid,
                    content:'đã theo dõi shop \''+this.state.shop.tencuahang+'\' của bạn',
                    state:'dagui',
                    time:time,
                    title:this.state.user_guest.hovaten,
                    type:'followshop'
                  },()=>{
                    table_follows.off('value');
                    notification.off('value');
                    Alert.alert('Thông báo','Bạn đã theo dõi cửa hàng này.');
                    this.setState({Isfollow:'Bỏ theo dõi'})
                  });
                }
              });

            });

          });
        }
    else{
      //bỏ theo dõi-xóa user
      deleteFollow=database.ref('db_marketsfarmers/table_shops/'+this.props.sid+'/follow');
      deleteFollow.child(this.props.uidSession).remove();
      Alert.alert('Thông tin','đã bỏ theo dõi');
      //update lại số lượng
      //set lại số lượng
            updateMaxFollow=database.ref('db_marketsfarmers/table_shops/'+this.props.sid+'/follow');
            updateMaxFollow.child('uid').update({
              maxid:data.val().maxid-1
            });
            Alert.alert('Thông báo','Bạn đã bỏ theo dõi cửa hàng này.');
      this.setState({Isfollow:'Theo dõi'})
    }
     
    });
  }
  renderLoaiThongTin(){    
    switch(this.state.loaiThTin){
      case 'loigioithieu':
        return(
          <View>{/*
          <View style={{flexDirection:'row',margin:5}}>
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
            <Text style={{fontSize:18,fontWeight:'bold'}}>Lời giới thiệu: </Text>
            <Text style={{fontSize:18}}>{this.state.shop.gioithieu}</Text>            
          </View>*/}
          <Text>Nhập lời giới thiệu:</Text>
          </View>
        );
      case 'tencuahang':
        return(
          <View>{/*
          <View style={{flexDirection:'row',margin:5}}>
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
            <Text style={{fontSize:18,fontWeight:'bold'}}>Tên cửa hàng: </Text>
            <Text style={{fontSize:18}}>{this.state.shop.tencuahang}</Text>            
          </View>*/}
          <Text>Nhập tên mới:</Text>
          </View>
        );
      case 'loaisp':
        return(
            <View>{/*
          <View style={{flexDirection:'row',margin:5}}>
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
            <Text style={{fontSize:18,fontWeight:'bold'}}>Số điện thoại: </Text>
            <Text style={{fontSize:18}}>{this.state.shop.sdtcuahang}</Text>            
          </View>*/}
          <Text>Chọn loại:</Text>
          <Picker selectedValue={this.state.valueLoaiPicker}
           onValueChange={(value)=>this.setState({valueLoaiPicker:value})}>
            {this.renderItemLoai()}
          </Picker>
          </View>
          );
      case 'sdt':
        return(
            <View>{/*
          <View style={{flexDirection:'row',margin:5}}>
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
            <Text style={{fontSize:18,fontWeight:'bold'}}>Số điện thoại: </Text>
            <Text style={{fontSize:18}}>{this.state.shop.sdtcuahang}</Text>            
          </View>*/}
          <Text>Nhập số điện thoại cửa hàng mới:</Text>
          </View>
          );
      case 'diachi':
        return(
            <View>{/*
          <View style={{flexDirection:'row',margin:5}}>
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
            <Text style={{fontSize:18,fontWeight:'bold'}}>Địa chỉ: </Text>
            <Text style={{fontSize:18}}>{this.state.shop.diachi_txh},{this.state.shop.diachi_t}</Text>            
          </View>*/}
          <Text>Chọn tỉnh/TP:</Text>
          <Picker selectedValue={this.state.valueTinhTPPicker}
           onValueChange={(value)=>this.setState({valueTinhTPPicker:value})}>
            {this.renderItemTinh()}
          </Picker>
          <Text>Nhập địa chỉ:</Text>
          </View>
          );

      case 'anhdaidien':
        return(
          <View>
            <Text style={{color:'black',marginBottom:5}}>Ảnh đại diện:</Text>
{this.state.imagePath ? <Image style={{width:200,height:200,borderWidth:1,borderColor:'#BDBDBD'}} source={{uri:this.state.imagePath}}>          
          </Image>
          :
          <View>
            <View style={{marginBottom:10}} >
<Button title={'Xem ảnh'} onPress={()=>{              
              a=[];
              a.push({url:this.state.user.anhdaidien});              
              this.setState({imagesModal:a,modalImage:!this.state.modalImage});
              }}/>
              </View>
              <Button title={'Đổi ảnh mới'} onPress={()=>{
                this.openImagePicker();                
                }}/>
                </View>
                }

            </View>
        );
      case 'anhbia':
        return(
           <View>
            <Text style={{color:'black',marginBottom:5}} >Ảnh bìa:</Text>
{this.state.imagePath ? <Image style={{width:200,height:200,borderWidth:1,borderColor:'#BDBDBD'}} source={{uri:this.state.imagePath}}>          
          </Image>
          :
          <View>
            <View style={{marginBottom:10}} >
<Button title={'Xem ảnh'} onPress={()=>{              
              a=[];
              a.push({url:this.state.user.anhbia});              
              this.setState({imagesModal:a,modalImage:!this.state.modalImage});
              }}/></View>
              <Button title={'Đổi ảnh mới'} onPress={()=>{
                this.openImagePicker();                
                }}/>
                </View>
                }

            </View>
        );
    }
  }

  _renderOptions(){
    switch (this.state.options) {
      case 1:
          return(
            <View>{this.state.listbd===false?
              <View style={{marginTop:20,width:'100%',alignItems:'center'}} >
              <Text style={{color:'#757575',fontSize:20}} >Không có bài đăng nào .</Text>
              </View>
              :
              
            <ListView
              dataSource={this.state.dataSource}
              enableEmptySections={true}
              renderRow={(rowData)=><ItemListViewStatus uidSession={this.props.uidSession} propsNavigator={this.props.propsNavigator} obj={rowData}

              ></ItemListViewStatus>}
            />
}
            </View>
          );
        
      case 2:
      return(
        <ScrollView>
        <View style={{padding:10,backgroundColor:'white',flex:1}}>
          {/*this.state.isEdit===true?null:
        <View style={{flexDirection:'row',margin:5,justifyContent:'center',borderBottomWidth:1,borderBottomColor:'gray'}}>
          <Image source={require('../img/ic_star_black_24dp.png')} style={{width:40,height:40,marginRight:5}}/>
          <Image source={require('../img/ic_star_black_24dp.png')} style={{width:40,height:40,marginRight:5}}/>
          <Image source={require('../img/ic_star_black_24dp.png')} style={{width:40,height:40,marginRight:5}}/>
          <Image source={require('../img/ic_star_half_black_24dp.png')} style={{width:40,height:40,marginRight:5}}/>
          <Image source={require('../img/ic_star_border_black_24dp.png')} style={{width:40,height:40,marginRight:5}}/>
          <Text style={{fontSize:18,fontWeight:'bold'}}>{this.state.shop.score_star}</Text>
        </View>
        {this.state.isGuest===true && this.state.typeuser!=='admin'?
        <View style={{height:30,marginLeft:10,flexDirection:'row',marginBottom:5,justifyContent:'center'}}>        
        <Button title="đánh giá" onPress={()=>this.btn_DanhGiaShop()} color='#FFA000'></Button><Text>   </Text>        
          <Button title={this.state.Isfollow} onPress={()=>this.btn_TheoDoiShop()} color='#FF3D00'></Button>        
        </View>
        :null}*/}
        
          <View style={{flexDirection:'row',margin:5}}>
            <View style={{flex:2}} >
            <Image source={require('../img/favorite.png')} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
            </View>
              <View style={{flex:10}} >
            <Text style={{fontSize:18,fontWeight:'bold'}}>Lời giới thiệu: </Text>
            <Text style={{fontSize:18}}>{this.state.shop.gioithieu}</Text>
            </View>
              <View style={{flex:1}} >
            {this.state.isEdit===true?
            <TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.setState({loaiThTin:'loigioithieu',modalEdit:!this.state.modalEdit})}>
                  <Image source={require('../img/editpen.png')} style={{ width:25,height:25}}/></TouchableHighlight>
            :null}
              </View>
          </View>
        
          <View style={{flexDirection:'row',margin:5}}>
            <View style={{flex:2}} >
            <Image source={require('../img/shops.png')} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
            </View>
              <View style={{flex:10}} >
            <Text style={{fontSize:18,fontWeight:'bold'}}>Tên cửa hàng: </Text>
            <Text style={{fontSize:18}}>{this.state.shop.tencuahang}</Text>
            </View>
              <View style={{flex:1}} >
            {this.state.isEdit===true?
            <TouchableHighlight underlayColor='#E0F7FA' 
            onPress={()=>this.setState({loaiThTin:'tencuahang',modalEdit:!this.state.modalEdit})}>
                  <Image source={require('../img/editpen.png')} style={{ width:25,height:25}}/></TouchableHighlight>
            :null}
              </View>
          </View>
         <View style={{flexDirection:'row',margin:5}}>
            <View style={{flex:2}} >
            <Image source={require('../img/settings.png')} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
            </View>
              <View style={{flex:10}} >
<Text style={{fontSize:18,fontWeight:'bold'}}>Loại cửa hàng: </Text>
            <Text style={{fontSize:18}}>{this.state.shop.loaisp}</Text>
            </View>
              <View style={{flex:1}} >
            {this.state.isEdit===true?
            <TouchableHighlight underlayColor='#E0F7FA'
             onPress={()=>this.setState({loaiThTin:'loaisp',modalEdit:!this.state.modalEdit})}>
                  <Image source={require('../img/editpen.png')} style={{ width:25,height:25}}/></TouchableHighlight>
            :null}
              </View>
          </View>

          <View style={{flexDirection:'row',margin:5}}>
            <View style={{flex:2}} >
            <Image source={require('../img/mobile-phone.png')} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
          </View> 
              <View style={{flex:10}} >
<Text style={{fontSize:18,fontWeight:'bold'}}>Số điện thoại: </Text>
            <Text style={{fontSize:18}}>{this.state.shop.sdtcuahang}</Text>
            </View>
              <View style={{flex:1}} >
            {this.state.isEdit===true?
            <TouchableHighlight underlayColor='#E0F7FA' 
            onPress={()=>this.setState({loaiThTin:'sdt',modalEdit:!this.state.modalEdit})}>
                  <Image source={require('../img/editpen.png')} style={{ width:25,height:25}}/></TouchableHighlight>
            :null}
              </View>
          </View>
        
          <View style={{flexDirection:'row',margin:5}}>
            <View style={{flex:2}} >
            <Image source={require('../img/placeholder.png')} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
            </View>
              <View style={{flex:10}} >
<Text style={{fontSize:18,fontWeight:'bold'}}>Địa chỉ: </Text>
            <Text style={{fontSize:18}}>{this.state.shop.diachi_txh} {this.state.shop.diachi_t}</Text>
            </View>
              <View style={{flex:1}} >
            {this.state.isEdit===true?
            <TouchableHighlight underlayColor='#E0F7FA'
             onPress={()=>this.setState({loaiThTin:'diachi',modalEdit:!this.state.modalEdit})}>
                  <Image source={require('../img/editpen.png')} style={{ width:25,height:25}}/></TouchableHighlight>
            :null}
              </View>
          </View>
        
          <View style={{flexDirection:'row',margin:5}}>
            <View style={{flex:2}} >
            <Image source={{uri:this.state.user.anhdaidien}}
            style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
            </View>
              <View style={{flex:10}} >
            <Text style={{fontSize:18,fontWeight:'bold'}}>Chủ sở hữu: </Text>
            <Text style={{fontSize:18}}>{this.state.user.hovaten}</Text>
            </View>
              
          </View>
        
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible2}
          onRequestClose={() => Alert.alert('Thông tin',"Modal has been closed.")}
          >
         <View style={{flex:1,backgroundColor:'#000000a0'}}>
          <View style={{flex:1}}></View>
          <View style={{flex:2}}>
          <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
          <View style={{flexDirection:'row',backgroundColor:'#0288D1'}}>
            <View style={{flex:7}}>
              <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Đánh giá cửa hàng</Text>
            </View>
            <View style={{flex:1}}>
              <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                this.setModalVisible2(!this.state.modalVisible2)
              }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
            </View>
          </View>
          <View style={{flexDirection:'row',margin:5,justifyContent:'center',borderBottomWidth:1,borderBottomColor:'gray'}}>
            <Image source={require('../img/ic_star_black_24dp.png')} style={{width:40,height:40,marginRight:5}}/>
            <Image source={require('../img/ic_star_black_24dp.png')} style={{width:40,height:40,marginRight:5}}/>
            <Image source={require('../img/ic_star_black_24dp.png')} style={{width:40,height:40,marginRight:5}}/>
            <Image source={require('../img/ic_star_half_black_24dp.png')} style={{width:40,height:40,marginRight:5}}/>
            <Image source={require('../img/ic_star_border_black_24dp.png')} style={{width:40,height:40,marginRight:5}}/>
            <Text style={{fontSize:18,fontWeight:'bold'}}> 4.5</Text>

          </View>

              <View style={{padding: 10}}>

            <Button onPress={()=>this.btn_DangNhap_Click()} title={'đánh giá'} color='#03A9F4'></Button>
        </View>
        </View>
          </View>
          <View style={{flex:1}}></View>
         </View>
        </Modal>


        </View>
        </ScrollView>
      );
      
      case 3:
      return(
        <View>{this.state.listcd===false?
          <View style={{marginTop:20,width:'100%',alignItems:'center'}} >
              <Text style={{color:'#757575',fontSize:20}} >Không có bài đăng nào đợi duyệt.</Text>
              </View>
              :
          <ListView
              dataSource={this.state.dataSourceChuaDuyet}
              enableEmptySections={true}
              renderRow={(rowData)=><ItemListViewStatus uidSession={this.props.uidSession} propsNavigator={this.props.propsNavigator} obj={rowData}

              ></ItemListViewStatus>}
            />
          }
            

            </View>
      );      
    };
  }
  renderButton(){
    if(this.state.shop.state==='Bình thường'){
    if(this.state.isGuest===false){    
      if(this.state.options===1){
            return(
              <View style={{height:73,width:72,borderRadius:100,backgroundColor:'#BDBDBD',position: 'absolute',
                      bottom: 50,
                      right:20,}}><TouchableHighlight underlayColor="#E0F7FA00" onPress={() => {
                        this.props.propsNavigator.push({
                          screen:'AddPostNew',
                          uidSession:this.props.uidSession,
                          sid:this.props.sid
                        });
                      }}>

                      <View style={{backgroundColor: '#40C4FF',
                    height: 70,
                    width: 70,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: 'black',
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    shadowOffset: {
                    height: 1,
                    width: 1
                    }}}>
                    
                      <Image source={require('../img/ic_add_white_24dp.png')} style={{width:35,height:35,borderRadius:100}}/>
                      
                      </View>
                      </TouchableHighlight>
                            </View>
            );
          }else if(this.state.options==2){
            return(
              <View style={{height:73,width:72,borderRadius:100,backgroundColor:'#BDBDBD',position: 'absolute',
                      bottom: 50,
                      right:20,}}><TouchableHighlight underlayColor="#E0F7FA00" onPress={() => {                  
                        this.setState({isEdit:!this.state.isEdit});
                      }}>

                      <View style={{backgroundColor: '#40C4FF',
                    height: 70,
                    width: 70,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: 'black',
                    shadowOpacity: 1,
                    shadowRadius: 2,
                      shadowOffset: {
                    height: 1,
                    width: 1
                    }}}>
      {this.state.isEdit===false?
                      <Image source={require('../img/ic_edit_white_24dp.png')} style={{width:35,height:35,borderRadius:100}}/>
                      :<Image source={require('../img/ic_done_all_white_24dp.png')} style={{width:35,height:35,borderRadius:100}}/>
                      }</View>
                      </TouchableHighlight>
                            </View>
            );
          }else{
            return null;
          }
    }else
    return null;
    }else{
      return(
        <View style={{height:30,width:'100%',backgroundColor:'#BDBDBDA0',position: 'absolute',
                bottom: 0,
                right:0}}>
                <View style={{backgroundColor:'#CCFF90',height:30,width:'100%',justifyContent:'center',alignItems:'center'}}>
      <Text style={{color:'#64DD17',fontSize:18,fontStyle:'italic'}}>{this.state.shop.state}{this.state.shop.loaivipham!==''? ' ('+this.state.shop.loaivipham+')':''}</Text>
    </View>
                
                      </View>
      );
    }
  }

  ShowInboxButton(){
    if(this.state.mysefl){
      return(
        <View>
          <Text>ShowModalButtonFloat,EditInfor</Text>
        </View>
      );

    }else{
      return(
<TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_Back_Click()}>
        <View style={{flexDirection:'row'}}>
<Image source={require('../img/calendar.png')} style={{width:40,height:40,marginRight:10}}/>
<Image source={require('../img/messendger.png')} style={{width:40,height:40}}/>
        </View>
        </TouchableHighlight>
      );
    }
  }
  btn_SendMessage(){
    this.props.propsNavigator.push({
      screen:'Messendger'
    })
  }
  btn_Event_Click(){
    this.setModalVisible1(true);
  }
  btn_ShowTabBaiDang(){    
    if(this.state.isEdit===false){
      this.setState({options:1});
      this.setState({backgrTab1:'#0288D150',backgrTab2:'#0288D1',backgrTab3:'#0288D1'});
    }else{
      Alert.alert('Thông tin','Đang chỉnh sửa');
    }
  }
  btn_ShowTabThongTin(){
    this.setState({options:2});
    this.setState({backgrTab1:'#0288D1',backgrTab2:'#0288D150',backgrTab3:'#0288D1'});
  }
  btn_ShowTabAnh(){
    if(this.state.isEdit===false){
      this.setState({options:3});
      this.setState({backgrTab1:'#0288D1',backgrTab2:'#0288D1',backgrTab3:'#0288D150'});
    }else{
      Alert.alert('Thông tin','Đang chỉnh sửa');
    }
  }
  btn_Back_Click(){
    this.props.propsNavigator.pop();
  }
}

AppRegistry.registerComponent('Component_API_Demo',()=>InfoPersonal);
