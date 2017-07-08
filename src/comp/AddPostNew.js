import React,{Component} from 'react';
import {Alert,AppRegistry,View,ScrollView,Image,Text,TextInput,Platform,TouchableHighlight,Picker,Button} from 'react-native';
//import thư viện để lấy ảnh
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
//import thư viện firebase
import firebase from '../entities/FirebaseAPI';

//cái khỉ gì vậy?
const Blob=RNFetchBlob.polyfill.Blob;
const fs=RNFetchBlob.fs;
window.XMLHttpRequest=RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob=Blob;
// hàm uploadImage vào firebase uri là đường dẫn file ảnh
//ko cần hiểu biết xài là dc,
const uploadImage=(uri,imageName,mime='image/jpg')=>{
  return new Promise((resolve,reject)=>{
    //nếu là IOS thì uri.replace() không thì sau : uri
    const uploadUri=Platform.OS==='ios'? uri.replace('file://',''):uri;
    let uploadBlob=null;
    //lưu vào storage trên firebase
    const imageRef=firebase.storage().ref('photos/photo_posts').child(imageName);
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
export default class AddPostNew extends Component{

  constructor(props){
    super(props);
    arrayImagePath=[];
    muaban=['Mua','Bán'];
    //tien=['VND','USD'];//khởi tạo giá trị cho picker loại giá tiền
    loai=['Hoa, cây cảnh','Rau củ','Trái cây','Cây Tinh Bột','Thủy, hải sản','Gia súc, gia cầm','Cây công nghiệp','Cây Thuốc'];//khởi tạo giá trị cho picker Loại sẩn phẩm đăng tin
    tinh=['Hà Nội','Tp.Hồ Chí Minh','Hải Phòng','Đà Nẵng','Cần Thơ','An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu','Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cao Bằng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang','Hà Nam','Hải Dương','Hậu Giang','Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai','Long An','Nam Định','Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Quảng Bình','Quảng Nam','Quãng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa','Thừa Thiên Huế','Tiền Giang','Trà Vinh','Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái','Phú Yên'];// picker chứa tỉnh thành phố
    this.state={
      imageName:'',//tên file
      imagePath:'',//đường dẫn ảnh      
      imageHeight:'',//chiều cao ảnh
      imageWidth:'',//rộng ảnh
      key:'',//?
      //thoogn tin posts input
      txt_tieude:'',//txt input tiêu đề
      txt_gia:'',//giá
      txt_diachi_txh:'',//thôn xã huyện
      txt_noidung:'',//nội dung bài đăng
      cur_img:-1,// thứ tự image dang hien trong cái xem hinh ở trên màn hình
      sum_img:0,//tổng image trong arrayImage
      arrayImage:[],//mảng chứa đường dẫn ảnh
     // valueTienPicker:'VND',//chọn giá trị mặc đinh cho picker giá
      valueLoaiPicker:'Trái cây',//chọn giá trị mặc đinh cho picker loại
      valueTinhTPPicker:'Hồ Chí Minh',//chọn giá trị mặc đinh cho picker tỉnh/thành phố
      valueMuaBan:'Bán',//chọn giá trị mua hoặc bán
    };

  }
  btn_Submit(){
    if(this.state.txt_diachi_txh.trim()===''||this.state.txt_tieude.trim()===''){
      Alert.alert('Thông báo', 'Không được để trống tiêu đề và địa chỉ');
      return;
    }
    //tui lưu cái danh sách hình trong this.state.arrayImage
    //giờ mình in ra thử nó trước
    //for(let i=0;i<this.state.arrayImage.length;i++){
      //console.log(this.state.arrayImage[i]);
    //}
    //khởi tạo dữ liệu firebase
    database=firebase.database();
    table_post=database.ref('db_marketsfarmers/table_posts/').orderByKey().equalTo('maxid');
    table_post.on('value',(snap1)=>{
      snap1.forEach((data1)=>{
        var maxid=parseInt(data1.val().maxid)+1;
        table_post.off('value');
        tb_post=database.ref('db_marketsfarmers/table_posts/'+this.state.valueMuaBan);
        var date = new Date();
        var datepost = date.toISOString();
        var idp="idp"+datepost.slice(0,12)+datepost.slice(14,16)+datepost.slice(17,19)+datepost.slice(20,24);
        idshop_own1='0';
        if(this.props.sid!=='0')//nếu #0 thì là shops đăng, ==0 là user đăng
          idshop_own1=this.props.sid;
        tb_post.child(maxid).set({
          idpost:idp,
          tieude:this.state.txt_tieude,
          noidung:this.state.txt_noidung,
          loaisp:this.state.valueLoaiPicker,
          diachi_txh:this.state.txt_diachi_txh,
          diachi_t:this.state.valueTinhTPPicker,
          thoigiandang:date.toString().slice(4,24),
          giaban:this.state.txt_gia,
          muahayban:this.state.valueMuaBan,
          //loaitien:this.state.valueTienPicker,
          uid_own:this.props.uidSession,
          idshop_own:idshop_own1,
          idpost_uid_own:idp+"_"+this.props.uidSession,
          command:{
            0:{
              defaul:'honggnuhnhuynhneyugn',
            }
          },
          follow:{
            uid:{
              maxid:0
            }
          },
          statecheck:'Chưa duyệt',
          loaivipham:''

        },()=>{

          postnew=database.ref('db_marketsfarmers/table_posts/'+this.state.valueMuaBan);
          postnew.orderByChild('idpost').equalTo(idp).once('value',(data)=>{
            //snapshot.forEach((data)=>{
              //trỏ tới table_post
              table_hinhs=database.ref('db_marketsfarmers/table_posts/'+this.state.valueMuaBan+"/"+maxid+'/images');
              //upload danh sách hình vào


              i=0;// id hình lỡ 2 hình cùng id
              if(this.state.arrayImage.length===0){
                var d = new Date();
                var n = d.toISOString();
                var a,b,c,d1;
                a=n.slice(0,12);
                b=n.slice(14,16);
                c=n.slice(17,19);
                d1=n.slice(20,24);
                n=a+b+c+d1;//tên file mới
                table_hinhs.push({
                      idhinh:n,
                      linkpost:'https://firebasestorage.googleapis.com/v0/b/nodejsdemo-d89c7.appspot.com/o/photos%2Fimages_system%2Fno-image.jpg?alt=media&token=5a68d532-2fb6-4644-aba3-7efec4372824'
                    });
              }else{
              for(let i=0;i<this.state.arrayImage.length;i++){
    //alert(i);
                //tạo tên mới theo thời gian quá haya
                var d = new Date();
                var n = d.toISOString();
                var a,b,c,d1;
                a=n.slice(0,12);
                b=n.slice(14,16);
                c=n.slice(17,19);
                d1=n.slice(20,24);
                n=a+b+c+d1;//tên file mới

                flat=false;
                  //cái hàm uploadImage này là nó upload cái hình tại đường dẫn Path tên
                uploadImage(this.state.arrayImage[i],n+".jpg").then((responseData)=>{
                  //i++;
                  //mỗi lần upload 1 file lên sẽ trả về link URI image của
                  //ảnh đó về chứa trong responseData

                  if(flat===false){
                    table_hinhs.push({
                      idhinh:n,
                      linkpost:responseData
                    },()=>{
                      flat=true;
                      //postnew.off('value');
                    });
                  }
                  //lưu id hình mới tạo
                }).done();
                //console.log(this.state.arrayImage[i]);
              }
              }
            //});
          });
          updatemaxIDpost=database.ref('db_marketsfarmers/table_posts/maxid');
          updatemaxIDpost.set({
            maxid:maxid
          },()=>{
            Alert.alert('Thông báo','Đã thêm \"'+this.state.txt_tieude+'\" vào danh sách đợi duyệt.');
            this.props.propsNavigator.pop();              
          });
        });
      });
    });





//    hàm upload ảnh vào storage trên firebase
// khi nó upload xong sẽ trả về trả về responseData là cái link ảnh
/*
    uploadImage(this.state.imagePath,'KH4.jpg').then((responseData)=>{
      KhachHang.child('KH4').set({
        url:responseData,
        age:'22',
        firstname:this.state.firstname,
        lastname:this.state.lastname,
      });
    }).done();
    */
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
  /*
  renderItemTien(){
    //render picker loại tiến ra màn hình
    items=[];
    for(let item of tien){
      items.push(<Picker.Item key={item} label={item} value={item}/>)
    }
    return items;
  }*/
  renderItemMuaBan(){
    //render picker loại tiến ra màn hình
    items=[];
    for(let item of muaban){
      items.push(<Picker.Item key={item} label={item} value={item}/>)
    }
    return items;
  }
  renderItemLoai(){
    //render picker loại sp ra màn hình
    items=[];
    for(let item of loai){
      items.push(<Picker.Item key={item} label={item} value={item}/>)
    }
    return items;
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
        <View style={{flexDirection:'row',backgroundColor:'#03A9F4',justifyContent:'center'}}>
<View style={{flex:1}}><TouchableHighlight underlayColor='pink' onPress={()=>this.btn_Back_Click()}>
<Image source={require('../img/ic_arrow_back_white_24dp.png')} style={{width:40,height:40}}/></TouchableHighlight></View>
        <View style={{flex:6,justifyContent:'center'}}><Text style={{color:'white',fontSize:20}}>Đăng bài</Text>
        </View>
        <View style={{flex:1}}></View>
        </View>
        <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
        <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
        <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
<ScrollView>
          {this.state.imagePath ? <Image resizeMode='stretch' style={{width:"100%",height:200,borderWidth:1,borderColor:'#BDBDBD'}} source={{uri:this.state.imagePath}}>
          <View style={{flex:1,flexDirection:'row'}}>
            <View style={{flex:1,backgroundColor:'#00000010',justifyContent:'center'}}>
              <TouchableHighlight onPress={()=>this.btn_PreviousImage()}>
               <Image source={require('../img/ic_keyboard_arrow_left_white_24dp.png')}></Image>
              </TouchableHighlight>
            </View>
            <View style={{flex:7,justifyContent:'flex-end'}}>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'white',fontSize:18}}>{this.state.cur_img+1}/{this.state.sum_img} ảnh</Text>
              </View>
              <View style={{flex:1,alignItems:'center',flexDirection:'row'}}>
                <View style={{backgroundColor:'#00000030',margin:5,borderRadius:2}}>
                <TouchableHighlight onPress={()=>this.btn_AddImage()}>
                 <Image source={require('../img/ic_add_white_24dp.png')}></Image>
                </TouchableHighlight>
                </View>
                <View style={{backgroundColor:'#00000030',margin:5,borderRadius:2}}>
                <TouchableHighlight onPress={()=>this.btn_DeleteImageCurrent()}>
                 <Image source={require('../img/ic_remove_white_24dp.png')}></Image>
                </TouchableHighlight>
                </View>
              </View>
              </View>
            </View>
            <View style={{flex:1,backgroundColor:'#00000010',justifyContent:'center'}}>
              <TouchableHighlight onPress={()=>this.btn_NextImage()}><Image source={require('../img/ic_keyboard_arrow_right_white_24dp.png')}></Image>
              </TouchableHighlight>
            </View>
          </View>
          </Image>

          :
          <TouchableHighlight onPress={()=>this.btn_AddImage()}>
          <Image source={require('../img/add_image_postnew.png')} style={{backgroundColor:'#616161',width:"100%",height:200,borderWidth:1,borderColor:'#BDBDBD'}}>
          </Image></TouchableHighlight>}
          <View style={{padding:10,backgroundColor:'#E0E0E0'}}>
          {/* INPUT TIÊU ĐỀ BÀI ĐĂNG */}
        <TextInput placeholder="Tiêu đề bài đăng"
        underlineColorAndroid="white"
        onChangeText={(value)=>this.setState({txt_tieude:value})}
        style={{backgroundColor:'white',fontSize:18,color:'blue',height:45,borderWidth:1,borderColor:'#03A9F4',borderRadius:2}}/>



          <View style={{flexDirection:'row',marginTop:5}}>
          <View style={{flex:4,justifyContent:'center'}}>
            <View style={{backgroundColor:'white',borderWidth:1,borderColor:'#03A9F4',borderRadius:2,height:45}}>
          {/* PICKER LOẠI SP */}
            <Picker mode='dropdown' selectedValue={this.state.valueLoaiPicker} onValueChange={(value)=>this.setState({valueLoaiPicker:value})}>
            {this.renderItemLoai()}
          </Picker></View>
          </View>

          {/* PICKER MuaBan */}
            <View style={{flex:3,justifyContent:'center'}}>
<View style={{backgroundColor:'white',borderWidth:1,borderColor:'#03A9F4',borderRadius:2,height:45,marginLeft:5}}>
            <Picker selectedValue={this.state.valueMuaBan} onValueChange={(value)=>this.setState({valueMuaBan:value})}>
              {this.renderItemMuaBan()}
            </Picker>
          </View>
            </View>
        </View>
        <View style={{marginTop:5}}>
  {/*   <View style={{flex:6}}>
           INPUT GIÁ */}
          <TextInput underlineColorAndroid="white"
          onChangeText={(value)=>this.setState({txt_gia:value})}
          style={{backgroundColor:'white',fontSize:18,color:'red',height:45,borderWidth:1,borderColor:'#03A9F4',borderRadius:2}} placeholder="Giá"/></View>
 {/* PICKER LOẠI TIỀN 
          <View style={{flex:4}}><View style={{backgroundColor:'white',borderWidth:1,borderColor:'#03A9F4',borderRadius:2,height:45,marginLeft:5}}>

          <Picker selectedValue={this.state.valueTienPicker} onValueChange={(value)=>this.setState({valueTienPicker:value})}>
            {this.renderItemTien()}
          </Picker></View></View>
         
        </View> */}
        <View style={{flexDirection:'row',marginTop:5}}>
          <View style={{flex:6}}>
{/* INPUT DIACHI THÔN XÃ HUYỆN */}
          <TextInput underlineColorAndroid="white"
          onChangeText={(value)=>this.setState({txt_diachi_txh:value})}
          style={{backgroundColor:'white',fontSize:18,color:'black',height:45,borderWidth:1,borderColor:'#03A9F4',borderRadius:2}} placeholder="Địa chỉ"/></View>
          <View style={{flex:4}}><View style={{backgroundColor:'white',borderWidth:1,borderColor:'#03A9F4',borderRadius:2,height:45,marginLeft:5}}>
{/* PICKER TỈNH THÀNH PHỐ */}
          <Picker selectedValue={this.state.valueTinhTPPicker}
           onValueChange={(value)=>this.setState({valueTinhTPPicker:value})}>
            {this.renderItemTinh()}
          </Picker></View></View>
        </View>
        {/* INPUT Nội dung  */}
        <TextInput underlineColorAndroid="white"
        placeholder="Nội dung" multiline={true}
        numberOfLines = {8}
        onChangeText={(value)=>this.setState({txt_noidung:value})}
        style={{backgroundColor:'white',marginTop:5,marginBottom:5,fontSize:18,color:'black',borderWidth:1,borderColor:'#03A9F4',borderRadius:2}}/>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1}}>            
          </View>
          <View style={{flex:1,marginLeft:10}}>
              <Button onPress={()=>this.btn_Submit()} title="Đăng bài"/>
          </View>
        </View>


 </View>


      {/*
        {this.state.imagePath ? <Image style={{width:100,height:100}} source={{uri:this.state.imagePath}}/>:null}
        <Text>{this.state.imagePath}</Text>
        <Text onPress={this.openImagePicker.bind(this)}>OpenImage
        </Text>
        <Text>{this.state.arrayImage[0]}</Text>
        <TextInput placeholder="username" onChangeText={(value)=>this.setState({firstname:value})}/>
        <TextInput placeholder="password" onChangeText={(value)=>this.setState({lastname:value})}/>
        <Text onPress={this.submit.bind(this)}>push</Text>*/}

        </ScrollView>
      </View>
    );
  }
  //bấm nút nét gọi hàm này
  btn_NextImage(){
    // kiểm tra tổng hình có >0 là coi có hình nào dc chọn chưa
    //cur_img<sum_img-1 là kiểm tra thử vị trí hình đang hiện ko là hình cuối trong danh sách, nói chung điều kiện để next tiếp
    if(this.state.sum_img>0 && (this.state.cur_img < this.state.sum_img-1)){
      //khi next dc thì set vị trí hình đang xem hiện tại lại, tăng lên 1 trong mang arrayImaàm
      this.setState({
        cur_img:this.state.cur_img+1,
        imagePath:this.state.arrayImage[this.state.cur_img+1]
      });
    }

  }
  btn_AddImage(){
    this.openImagePicker();
  }
  btn_PreviousImage(){
    if(this.state.sum_img>0 && (this.state.cur_img > 0)){
      this.setState({
        cur_img:this.state.cur_img-1,
        imagePath:this.state.arrayImage[this.state.cur_img-1]
      });
    }

  }
  btn_DeleteImageCurrent(){

    var data=this.state.arrayImage;

    //xóa phần tử tại vị trí , nhưng không giảm số lượng phần tử arrayImage
    //delete data[this.state.cur_img];

    s=this.state.arrayImage.length-1;
    data.splice(this.state.cur_img,1);
    if(this.state.cur_img==s){
      this.setState({
        arrayImage:data,
        cur_img:this.state.cur_img-1,
        sum_img:this.state.sum_img-1,
        imagePath:data[this.state.cur_img-1]
      });
    }else{
      this.setState({
        arrayImage:data,
        sum_img:this.state.sum_img-1,
        imagePath:data[this.state.cur_img]
      });
    }



  }
  btn_Back_Click(){
    this.props.propsNavigator.pop();
  }
}
AppRegistry.registerComponent('ChoNhaNong_v1',()=>AddPostNew);
