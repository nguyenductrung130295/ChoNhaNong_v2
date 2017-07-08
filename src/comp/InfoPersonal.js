import React,{Component} from 'react';
import {Alert,AppRegistry,Platform,View,Image,Text,TouchableHighlight,ListView,Button,Modal,Picker,PickerItem,TextInput} from 'react-native';
import ItemListViewStatus from '../item_customer/ItemListViewStatus';
//import ItemShowAllImage from '../item_customer/ItemShowAllImage';
import AddPostNew from './AddPostNew'
import firebase from '../entities/FirebaseAPI'
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
    const imageRef=firebase.storage().ref('photos/avatar_users').child(imageName);
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
    const imageRef=firebase.storage().ref('photos/banner_users').child(imageName);
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
export default class InfoPersonal extends Component{
  constructor(props){
    super(props);

    this.state={
      dataSource:ds.cloneWithRows([]),
      dataSourceChuaDuyet:ds.cloneWithRows([]),
      modalXoa:false,
      modalKhoa:false,
      modalEdit:false,       
      imgyes:false,
      options:1,//1:bài đăng,2:thông tin,3:ảnh
      mysefl:false,
      //false: là khách xem ,true: là ban than ca nhan ho xem minh
      user:new Users(),
      typeuser:'',
      backgrTab1:'#0288D150',
      backgrTab2:'#0288D1',
      backgrTab3:"#0288D1",
      isEdit:false,//đang chỉnh sửa thông tin cá nhân
      loaiThTin:'',
      txt_thongtin:'',
      valueTinhTPPicker:'Tp.Hồ Chí Minh',//chọn giá trị mặc đinh cho picker tỉnh/thành phố
      modalImage:false,//modal xem full image
      imagesModal:[],//mảng chứa hình cho ImageViewer
      imageName:'',//tên file
      imagePath:'',//đường dẫn ảnh
      imageHeight:'',//chiều cao ảnh
      imageWidth:'',//rộng ảnh
      arrayImage:[],//mảng chứa đường dẫn ảnh
      listdb:false,//list bài đăng không rỗng
      listcd:false,//list bài đăng chờ duyệt không rỗng
      select_loaivipham:'Vũ khí cấm sử dụng'
    }
    tinh=['Hà Nội','Tp.Hồ Chí Minh','Hải Phòng','Đà Nẵng','Cần Thơ','An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu','Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cao Bằng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang','Hà Nam','Hải Dương','Hậu Giang','Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai','Long An','Nam Định','Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Quảng Bình','Quảng Nam','Quãng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa','Thừa Thiên Huế','Tiền Giang','Trà Vinh','Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái','Phú Yên'];// picker chứa tỉnh thành phố
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

    database=firebase.database();
    tb_user=database.ref('db_marketsfarmers/table_users');
    us=new Users();

    tb_user.orderByKey().equalTo(this.props.uidSession).on('value',(snap)=>{
      if(snap.exists()){
        snap.forEach((data)=>{
          us.uid=data.key;
          us.hovaten=data.val().hovaten;
          us.sdt=data.val().sdt;
          us.diachi=data.val().diachi_txh+'-'+data.val().diachi_t;
          us.email=data.val().email;
          us.anhdaidien=data.val().anhdaidien;
          us.anhbia=data.val().anhbia;
          us.state=data.val().state;
          us.loaivipham=data.val().loaivipham;
          us.matkhau=data.val().matkhau;
        });
        this.setState({user:us});
      }
      else{
        alert('firebase error');
      }
  });
if(this.props.uidadmin!=='0'&& this.props.uidadmin!=='guest'){
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
        alert('firebase error');
      }
  });
  }

  //bên này thì tương tự như SHOPMAIN.js
  tb_listposts=database.ref('db_marketsfarmers/table_posts/Bán').limitToLast(10);//trỏ đến chổ table_shops
  var postTam=[];//tạm lưu 1 post hiện tại
  var postTamChuaDuyet=[];//tạm lưu 1 post hiện tại
  var postKey=[];
  var postKeyChuaDuyet=[];
        tb_listposts.orderByChild('uid_own')//xếp theo idpost_uid_own
        .equalTo(this.props.uidSession)//idpost_uid_own===idpostTam_uidsession
        .on('value',(snapshot)=>{
          snapshot.forEach((data)=>{
            flag=0;//chưa tồn tại post trong list
            if(data.val().idshop_own==='0'){
              if(data.val().statecheck==='Bình thường'){
                  for(let i=0;i<postTam.length;i++){
                    if(postTam[i].idpost===data.key){
                      //có tồn tại rồi, update lại thôi
                      postTam[i].idpost=data.key;
                      postTam[i].diachi_t=data.val().diachi_t;
                      postTam[i].giaban=data.val().giaban;
                      //postTam[i].loaitien=data.val().loaitien;
                      postTam[i].thoigiandang=data.val().thoigiandang;
                      postTam[i].tieude=data.val().tieude;
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
              }else{
                    for(let i=0;i<postTamChuaDuyet.length;i++){
                      if(postTamChuaDuyet[i].idpost===data.key){
                        //có tồn tại rồi, update lại thôi
                        postTamChuaDuyet[i].idpost=data.key;
                        postTamChuaDuyet[i].diachi_t=data.val().diachi_t;
                        postTamChuaDuyet[i].giaban=data.val().giaban;
                        //postTamChuaDuyet[i].loaitien=data.val().loaitien;
                        postTamChuaDuyet[i].thoigiandang=data.val().thoigiandang;
                        postTamChuaDuyet[i].tieude=data.val().tieude;
                        //postTam[i].linkhinh=datahinh.val().linkpost;
                        flag=1;//báo có tồn tại
                        table_hinhs=database.ref('db_marketsfarmers/table_posts/Bán/'+data.key+'/images/');
                        table_hinhs.limitToFirst(1).on('value',(snapHinh)=>{
                          snapHinh.forEach((datahinh)=>{
                            //alert(datahinh.val().linkpost);
                            postTamChuaDuyet[i].linkhinh=datahinh.val().linkpost;
                          });
                        });

                      }
                    }
              }
          
            //console.log(datahinh.val().linkpost);
            if(flag===0){//không tồn tại, thêm mới post vào
              table_hinhs=database.ref('db_marketsfarmers/table_posts/Bán/'+data.key+'/images/');
              table_hinhs.limitToFirst(1).on('value',(snapHinh)=>{
                snapHinh.forEach((datahinh)=>{
                  //alert(datahinh.val().linkpost);
                  if(data.val().statecheck==='Bình thường'){
                    postKey.push(data.key);
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
                    postKeyChuaDuyet.push(data.key);
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

            }
            }
          });


//MUA
          tb_listpostsMUA=database.ref('db_marketsfarmers/table_posts/Mua').limitToLast(10);//trỏ đến chổ table_shops

          //var postTam=[];//tạm lưu 1 post hiện tại

                tb_listpostsMUA.orderByChild('uid_own')//xếp theo idpost_uid_own
                .equalTo(this.props.uidSession)//idpost_uid_own===idpostTam_uidsession
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
                  //thêm vào datasource cho listView in ra
                  postKey.sort(function(a, b){return b-a});
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
                  if(postTamMain.length===0){
                    this.setState({listbd:false});
                  }else{
                    this.setState({listbd:true});
                  }


                  postKeyChuaDuyet.sort(function(a, b){return b-a});
                  var postTamMainChuaDuyet=[];
                  k=0;
                  for(let i=0;i<postKeyChuaDuyet.length;i++){
                    for(let j=0;j<postTamChuaDuyet.length;j++){
                      if(postTamChuaDuyet[j].idpost===postKeyChuaDuyet[i]){
                        postTamMainChuaDuyet[k]=postTamChuaDuyet[j];
                        k++;
                      }
                    }
                  }
                  this.setState({dataSourceChuaDuyet:ds.cloneWithRows(postTamMainChuaDuyet)});
                  if(postTamMainChuaDuyet.length===0){
                    this.setState({listcd:false});
                  }else{
                    this.setState({listcd:true});
                  }
                  //alert(this.state.dataSource.length);
                });



        });
  }

  yesImg(){
    if(this.state.imgyes){
      return(
        <Text onPress={()=>alert('doi anh')} style={{color:'red'}}>Đổi ảnh</Text>
      );
    }else{
      return(
        <Text onPress={()=>alert('thêm anh')} style={{color:'red'}}>Thêm ảnh</Text>
      );
    }
  }
  btn_KhoaUser_Admin(){
    this.setState({modalKhoa:!this.state.modalKhoa});//ẩn modal khi click khóa hoặc hủy khóa    
    database=firebase.database();
    update_user=database.ref('db_marketsfarmers/table_users');
    if(this.state.user.state==='Đang bị khóa'){//nếu đang khóa thì mở
      update_user.child(this.props.uidSession).update({//hàm update để update tại child id user
            state:'Bình thường',//mở
            loaivipham:''// vì sao bị khóa
          });
          Alert.alert('Thông báo',this.state.user.hovaten+' đã hoạt động bình thường.');
    }else if(this.state.user.state==='Bình thường'){//đang mở thì khóa
      update_user.child(this.props.uidSession).update({
            state:'Đang bị khóa',//khóa
            loaivipham:this.state.select_loaivipham// vì sao bị khóa
          });
          Alert.alert('Thông báo',this.state.user.hovaten+' đã bị khóa tài khoản.');
    }
    
    
  }
  btn_XoaUser_Click(){
    this.setState({modalXoa:!this.state.modalXoa});
    database=firebase.database();
    update_user=database.ref('db_marketsfarmers/table_users');
    update_user.child(this.props.uidSession).remove();
    Alert.alert('Thông báo','Đã xóa '+this.state.user.hovaten+'  thành công')    ;
    this.props.propsNavigator.pop();    
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
        case 'hovaten':
          if(this.state.txt_thongtin.trim()===''){
            Alert.alert('Thông báo','Vui lòng nhập họ và tên');
            return;
          }
          updatehovatenuser=database.ref('db_marketsfarmers/table_users').child(this.props.uidSession)
          .update({hovaten:this.state.txt_thongtin});
          break;
        case 'sdt':
          if(this.state.txt_thongtin.trim()===this.state.user.sdt){
            Alert.alert('Thông báo','Trùng với số đang dùng hiện tại.');
          }else{
            if(this.checkSDT(this.state.txt_thongtin.trim())===false){
              Alert.alert('Thông báo','Số điện thoại không hợp lệ.');
              return;
            }

            sdttrung=database.ref('db_marketsfarmers/table_users')
            .orderByChild('sdt').equalTo(this.state.txt_thongtin.trim())
            .on('value',(sn)=>{
              if(sn.exists()){
                Alert.alert('Thông báo','Số điện thoại đã được đăng ký');
              }else{
                updatehovatenuser=database.ref('db_marketsfarmers/table_users').child(this.props.uidSession)
                .update({sdt:this.state.txt_thongtin.trim(),
                        sdt_mk:this.state.txt_thongtin.trim()+this.state.user.matkhau
                  });
                sdttrung.off('value');
              }
            });
          }
          
          break;
        case 'diachi':
          updatehovatenuser=database.ref('db_marketsfarmers/table_users').child(this.props.uidSession)
          .update({
            diachi_txh:this.state.txt_thongtin,
            diachi_t:this.state.valueTinhTPPicker
          });
          break;
        case 'email':
        if(this.state.txt_thongtin.trim().indexOf('@')===-1){//không tìm thấy dấu @
          Alert.alert('Thông báo','Email không hợp lệ, vui lòng nhập lại.');
          return;
        }
        updatehovatenuser=database.ref('db_marketsfarmers/table_users').child(this.props.uidSession)
          .update({email:this.state.txt_thongtin});
          break;
        case 'anhdaidien':

        var str=this.state.user.anhdaidien;
          var n = str.indexOf("avatar_users%2F");
    var m=str.indexOf("?");
    str=str.slice(n+15,m);
    if(str!=='userdefault.png'){
      var storage = firebase.storage();//khởi tạo nơi lưu trữ file trong storeage firebase
                // Create a storage reference from our storage service
          var storageRef = storage.ref('photos/avatar_users/');// tại gốc
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
                  updateanhdaidien=database.ref('db_marketsfarmers/table_users').child(this.props.uidSession)
                  .update({anhdaidien:responseData});
                  this.setState({arrayImage:[],imagePath:''});
                }).done();
          break;
        case 'anhbia':
         var str=this.state.user.anhbia;
          var n = str.indexOf("banner_users%2F");
    var m=str.indexOf("?");
    str=str.slice(n+15,m);
    if(str!=='thiennhiendep201633.jpg'){
      var storage = firebase.storage();//khởi tạo nơi lưu trữ file trong storeage firebase
                // Create a storage reference from our storage service
          var storageRef = storage.ref('photos/banner_users/');// tại gốc
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
                  updateanhdaidien=database.ref('db_marketsfarmers/table_users').child(this.props.uidSession)
                  .update({anhbia:responseData});
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
    Alert.alert('Thông báo','Lưu chỉnh sửa thành công.');
    this.setState({loaiThTin:''});
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
  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flex:1}}>
          <Image style={{width:'100%',height:'100%'}}  source={{uri:this.state.user.anhbia}}>
          <View style={{flexDirection:'row',backgroundColor:'#00000000'}}>
<View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_Back_Click()}><Image source={require('../img/ic_arrow_back_white_24dp.png')} style={{width:40,height:40,marginTop:5}}/></TouchableHighlight></View>
          <View style={{flex:6}}>
          </View>
          <View style={{flex:1}}></View>
          </View>
            <Image style={{width:100,height:100,borderRadius:100,borderWidth:1,borderColor:'white',marginLeft:15,marginTop:30}} source={{uri:this.state.user.anhdaidien}}/>
            <View style={{flexDirection:'row',height:30}}>
            <View style={{flex:6}}>
            {this.state.isEdit===false?<Text style={{marginLeft:10,marginTop:5,color:'white',fontSize:20}}>{this.state.user.hovaten}
            </Text>:
            <View style={{marginLeft:5,flexDirection:'row'}}>
              <View style={{backgroundColor:'#2121215a',padding:5,marginTop:5,flexDirection:'row',borderRadius:3,borderColor:'white',borderWidth:1}} >
                             <Image source={require('../img/ic_edit_white_24dp.png')} style={{ width:17,height:17,marginTop:3}}/>
               <Text  onPress={()=>this.setState({loaiThTin:'anhdaidien',modalEdit:!this.state.modalEdit})}
                 style={{fontSize:15,marginLeft:5,fontWeight:'bold',color:'white',textDecorationLine:'underline'}} >Sửa ảnh đại diện</Text>
                 </View>
               </View>
            }
              </View>
              <View style={{flex:3,paddingRight:10,paddingBottom:3}}>
              {this.ShowInboxButton()}
              </View>
            </View>
            </Image>

        </View>

        <View style={{flex:2,backgroundColor:'#E0E0E0'}}>
        <View style={{flexDirection:'row',height:40}}>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:this.state.backgrTab1}}><Text style={{color:'white',fontSize:18}} onPress={()=>this.btn_ShowTabBaiDang()}>Bài Đăng</Text></View>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:this.state.backgrTab2}}><Text style={{color:'white',fontSize:18}} onPress={()=>this.btn_ShowTabThongTin()}>Thông Tin</Text></View>
          {this.props.uidadmin==='guest'?
          null:<View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:this.state.backgrTab3}}><Text style={{color:'white',fontSize:18}} onPress={()=>this.btn_ShowTabAnh()}>Chờ duyệt</Text></View>
          }
          
        </View>
        <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
        <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
        <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
        {this._renderOptions()}


<Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalEdit}
              onRequestClose={() =>console.log('c')}
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
                {this.state.loaiThTin!=='anhbia'&&this.state.loaiThTin!=='anhdaidien'?
              <TextInput style={{borderRadius:4,borderWidth:1,borderColor:'#BDBDBD',height:38,color:'black'}}
          onChangeText={(value)=>this.setState({txt_thongtin:value})}/>
          :null}</View>
          {(this.state.loaiThTin==='anhbia'||this.state.loaiThTin==='anhdaidien') && !this.state.imagePath ?
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
              visible={this.state.modalXoa}
              onRequestClose={() => Alert.alert('Thông báo',"Modal has been closed.")}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1'}}>
                <View style={{flex:7}}>
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Xóa User</Text>
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setState({modalXoa:!this.state.modalXoa})
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                </View>
              </View>
              
                
                {/* picker loại sp cúả cửa hàng*/}
                <Text>Bạn có chắc muốn xóa {this.state.user.hovaten} không?</Text>
                              

                  <View style={{flexDirection:'row',padding: 10}}>
                    <View style={{flex:1}}></View>
                  <View style={{flex:1}}><Button color={'red'} title={'Hủy'} onPress={()=>this.setState({modalXoa:!this.state.modalXoa})}/></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}></View>
                  <View style={{flex:1}}><Button onPress={()=>this.btn_XoaUser_Click()} title={'Xóa'} color='blue'></Button></View>
                   <View style={{flex:1}}></View>
                
          </View>
          </View>
              </View>
              <View style={{flex:1}}></View>
             </View>
            </Modal>

<Modal visible={this.state.modalImage}
transparent={true}
onRequestClose={() =>console.log('b')}>
                <ImageViewer imageUrls={this.state.imagesModal}
                onDoubleClick={()=>this.setState({modalImage:!this.state.modalImage})}/>
            </Modal>

            <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalKhoa}
              onRequestClose={() => console.log('a')}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1',borderTopLeftRadius:4,borderTopRightRadius:4}}>
                <View style={{flex:7}}>
                  {this.state.user.state==='Bình thường'?
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Khóa User</Text>
                  :<Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Mở khóa</Text>
                  }
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setState({modalKhoa:!this.state.modalKhoa})
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                </View>
              </View>
              
                
                {/* picker loại sp cúả cửa hàng*/}
                <View style={{flexDirection:'row'}}>                
                <View style={{flex:3,borderColor:'#BDBDBD'}}>
                {/* picker loại sp cúả cửa hàng*/}
                <Text style={{marginLeft:10,color:'black'}}>Vi phạm</Text>
                </View>
                <View style={{flex:4}}>
                {/* picker tỉnh thành phố sp cúả cửa hàng*/}
                {this.state.user.state==='Bình thường'?
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
                :null
                }
                
                </View>
              </View>
                              

                  <View style={{flexDirection:'row',padding: 10}}>
                    <View style={{flex:1}}></View>
                  <View style={{flex:2}}><Button color={'red'} title={'Hủy'} onPress={()=>this.setState({modalKhoa:!this.state.modalKhoa})}/></View>
                  <View style={{flex:1}}></View>                  
                  <View style={{flex:2}}>
                    {this.state.user.state==='Bình thường'?
                    <Button onPress={()=>this.btn_KhoaUser_Admin()} title={'Khóa Users'} color='blue'></Button>
                    :
                    <Button onPress={()=>this.btn_KhoaUser_Admin()} title={'Mở Khóa'} color='blue'></Button>
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
      <Text style={{color:'#64DD17',fontSize:18,fontStyle:'italic'}}>{this.state.user.state}{this.state.user.loaivipham!==''? ' ('+this.state.user.loaivipham+')':null}</Text>
    </View><View style={{flexDirection:'row'}}>
                <View style={{flex:1,padding:5}}>{this.state.user.state==='Đang bị khóa'? <Button color={'orange'} title={'Mở Khóa'} onPress={()=>this.setState({modalKhoa:!this.state.modalKhoa})}/>:
                  <Button color={'orange'} title={'Khóa User'} onPress={()=>this.setState({modalKhoa:!this.state.modalKhoa})}/>}
                </View>
                <View style={{flex:1,padding:5}}><Button color={'red'} title={'Xóa User'} onPress={()=>this.setState({modalXoa:!this.state.modalXoa})}/></View>
                </View>
                
                      </View>
            : this.renderButton()}

      </View>
    );
  }
  renderLoaiThongTin(){    
    switch(this.state.loaiThTin){
      case 'hovaten':
        return(
          <View>
          {/*<View style={{flexDirection:'row',margin:5,borderBottomWidth:1,borderBottomColor:'gray'}}>
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:30,height:30,marginRight:5}}/>
            <Text style={{fontSize:18,fontWeight:'bold'}}>Họ và tên: </Text>
            <Text style={{fontSize:18}}>{this.state.user.hovaten}</Text>            
          </View>*/}
          <Text style={{color:'black',fontSize:18}}>Nhập họ và tên mới:</Text>
          </View>
        );
      case 'sdt':
        return(
            <View>{/*
          <View style={{flexDirection:'row',margin:5,borderBottomWidth:1,borderBottomColor:'gray'}}>
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:30,height:30,marginRight:5}}/>
            <Text style={{fontSize:18,fontWeight:'bold'}}>Số điện thoại: </Text>
            <Text style={{fontSize:18}}>{this.state.user.sdt}</Text>            
          </View>*/}
          <Text style={{color:'black',fontSize:18}}>Nhập số điện thoại mới:</Text>
          </View>
          );
      case 'diachi':
        return(
            <View>{/*
          <View style={{flexDirection:'row',margin:5,borderBottomWidth:1,borderBottomColor:'gray'}}>
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:30,height:30,marginRight:5}}/>
            <Text style={{fontSize:18,fontWeight:'bold'}}>Địa chỉ: </Text>
            <Text style={{fontSize:18}}>{this.state.user.diachi}</Text>            
          </View>*/}
          <Text style={{color:'black',fontSize:18}}>Chọn tỉnh/TP:</Text>
          <Picker selectedValue={this.state.valueTinhTPPicker}
           onValueChange={(value)=>this.setState({valueTinhTPPicker:value})}>
            {this.renderItemTinh()}
          </Picker>
          <Text style={{color:'black',fontSize:18}}>Nhập địa chỉ:</Text>
          </View>
          );
      case 'email':
        return(
          <View>{/*
          <View style={{flexDirection:'row',margin:5,borderBottomWidth:1,borderBottomColor:'gray'}}>
            <Image source={{uri:this.state.user.anhdaidien}} style={{width:30,height:30,marginRight:5}}/>
            <Text style={{fontSize:18,fontWeight:'bold'}}>Email:</Text>
            <Text style={{fontSize:18}}>{this.state.user.email}</Text>
          </View>*/}
          <Text style={{color:'black',fontSize:18}} >Nhập email mới:</Text>
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
  renderButton(){
    if(this.props.uidadmin==='guest'){}
    else{
    if(this.state.options===1){
      return(
        <View style={{height:73,width:72,borderRadius:100,backgroundColor:'#BDBDBD',position: 'absolute',
                bottom: 50,
                right:20,}}><TouchableHighlight underlayColor={'#E0F7FA00'} onPress={() => {                  
                  this.props.propsNavigator.push({
                    screen:'AddPostNew',
                    uidSession:this.props.uidSession,
                    sid:'0'
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
                right:20,}}><TouchableHighlight underlayColor='#E0F7FA00'
                 onPress={() => {                  
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
                <Image source={require('../img/ic_edit_white_24dp.png')} style={{width:25,height:25,borderRadius:100}}/>
                :<Image source={require('../img/ic_done_all_white_24dp.png')} style={{width:35,height:35,borderRadius:100}}/>
                }</View>
                </TouchableHighlight>
                      </View>
      );
    }else{
      return null;
    }
  }
  }
  _renderOptions(){
    switch (this.state.options) {
      case 1:
          return(
            <View>{this.state.listbd===false?
              <View style={{marginTop:20,width:'100%',alignItems:'center'}} >
              <Text style={{color:'#757575',fontSize:20}} >Không có bài đăng nào.</Text>
              </View>
              :
              <ListView
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                renderRow={(rowData)=>
                  <ItemListViewStatus uidSession={this.props.uidSession} propsNavigator={this.props.propsNavigator} obj={rowData}
                ></ItemListViewStatus>}
              />
              
              }
              
            </View>
          );        
      case 2:
      return(
        <View style={{padding:10,backgroundColor:'white',flex:1}}>
        
          <View style={{flexDirection:'row',margin:5}}>
            <View style={{flex:2}} >
                <Image source={{uri:this.state.user.anhdaidien}} style={{width:50,height:50,borderRadius:100}}/>            
              </View>
              <View style={{flex:10}} >
                <Text style={{fontSize:18,color:'black',fontWeight:'bold'}}>Họ và tên:</Text>
                <Text style={{fontSize:18,color:'black'}}>{this.state.user.hovaten}</Text>  
              </View>
              <View style={{flex:1}} >
                {this.state.isEdit===true?<TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.setState({loaiThTin:'hovaten',modalEdit:!this.state.modalEdit})}>
                  <Image source={require('../img/editpen.png')} style={{ width:25,height:25}}/></TouchableHighlight>:null}  
              </View>            
          </View>
        
        
          <View style={{flexDirection:'row',margin:5}}>
            <View style={{flex:2}} >
<Image source={require('../img/mobile-phone.png')} style={{width:50,height:50,marginRight:5,borderRadius:100}}/>
              </View>
              <View style={{flex:10}} >
                <Text style={{fontSize:18,color:'black',fontWeight:'bold'}}>Số điện thoại:</Text> 
            <Text style={{fontSize:18,color:'black'}}>{this.state.user.sdt}</Text>  
              </View>
              <View style={{flex:1}} >
            
              {this.state.isEdit===true?<TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.setState({loaiThTin:'sdt',modalEdit:!this.state.modalEdit})}>
                  <Image source={require('../img/editpen.png')} style={{ width:25,height:25}}/></TouchableHighlight>:null}  
              </View>
          </View>
        
        
          <View style={{flexDirection:'row',margin:5}}>
            <View style={{flex:2}} >
<Image source={require('../img/placeholder.png')} style={{width:50,height:50,marginRight:5}}/>
              </View>
              <View style={{flex:10}} >
                <Text style={{fontSize:18,color:'black',fontWeight:'bold'}}>Địa chỉ:</Text>
            <Text style={{fontSize:18,color:'black'}}>{this.state.user.diachi}</Text>  
              </View>
              <View style={{flex:1}} >
            
              {this.state.isEdit===true?<TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.setState({loaiThTin:'diachi',modalEdit:!this.state.modalEdit})}>
                  <Image source={require('../img/editpen.png')} style={{ width:25,height:25}}/></TouchableHighlight>:null}
              </View>
            
            
            
          </View>
        
        
          <View style={{flexDirection:'row',margin:5}}>
            <View style={{flex:2}} >
<Image source={require('../img/letter.png')} style={{width:50,height:50,marginRight:5}}/>            
              </View>
              <View style={{flex:10}} >
                <Text style={{fontSize:18,color:'black',fontWeight:'bold'}}>Email:</Text>
              <Text style={{fontSize:18,color:'black'}}>{this.state.user.email}</Text>
              </View>
              <View style={{flex:1}} >
          
              {this.state.isEdit===true?<TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.setState({loaiThTin:'email',modalEdit:!this.state.modalEdit})}>
                  <Image source={require('../img/editpen.png')} style={{ width:25,height:25}}/></TouchableHighlight>:null}
              </View>
          </View>
        


        </View>
      );      
      case 3:      
      return(
         <View>
           {this.state.listcd===false?              
              <View style={{marginTop:20,width:'100%',alignItems:'center'}} >
              <Text style={{color:'#757575',fontSize:20}} >Không có bài đăng nào đợi duyệt.</Text>
              </View>
              :
              <ListView
                dataSource={this.state.dataSourceChuaDuyet}
                enableEmptySections={true}
                renderRow={(rowData)=>
                  <ItemListViewStatus uidSession={this.props.uidSession} propsNavigator={this.props.propsNavigator} obj={rowData}
                ></ItemListViewStatus>}
              />
            }

            </View>
      );
      
    };
    
  }
  ShowInboxButton(){    
      if(this.state.isEdit===false){
      if(this.props.uidadmin!=='guest'){

      }
      else{      
      return(        

        <View style={{backgroundColor:'#2121215a',padding:5,marginTop:5,flexDirection:'row',borderRadius:3,borderWidth:1,borderColor:'white'}} >
                             <Image source={require('../img/ic_chat_white_24dp.png')} style={{ width:17,height:17,marginTop:3}}/>
               <Text  onPress={()=>this.props.propsNavigator.push({
                    screen:'Messendger',
                    uidSession:this.props.uidguest,
                    uidGetMessage:this.props.uidSession
                  })}
                 style={{fontSize:15,marginLeft:5,fontWeight:'bold',color:'white',textDecorationLine:'underline'}} >Gửi tin nhắn</Text>
                 </View>

      );
    }
      }
      else
        return(
          <View style={{backgroundColor:'#2121215a',padding:5,marginTop:5,flexDirection:'row',borderRadius:3,borderColor:'white',borderWidth:1}} >
                             <Image source={require('../img/ic_edit_white_24dp.png')} style={{ width:17,height:17,marginTop:3}}/>
               <Text  onPress={()=>this.setState({loaiThTin:'anhbia',modalEdit:!this.state.modalEdit})}
                 style={{fontSize:15,marginLeft:5,fontWeight:'bold',color:'white',textDecorationLine:'underline'}} >Sửa ảnh bìa</Text>
                 </View>

        );
    
  }
  btn_SendMessage(){
    this.props.propsNavigator.push({
      screen:'Messendger'
    })
  }
  btn_ShowTabBaiDang(){
    if(this.state.isEdit===false){
      this.setState({options:1});
      this.setState({backgrTab1:'#0288D150',backgrTab2:'#0288D1',backgrTab3:'#0288D1'});
    }else{
      Alert.alert('Thông báo','Đang chỉnh sửa');
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
      Alert.alert('Thông báo','Đang chỉnh sửa');
    }
  }
  btn_Back_Click(){
    this.props.propsNavigator.pop();
  }
}

AppRegistry.registerComponent('Component_API_Demo',()=>InfoPersonal);
