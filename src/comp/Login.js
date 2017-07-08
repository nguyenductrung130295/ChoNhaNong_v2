import React,{Component} from 'react';
import {Alert,AppRegistry,Text,TextInput,View, Button,Image,TouchableHighlight,AsyncStorage,Platform} from 'react-native';
import Users from '../entities/Users'
import firebase from '../entities/FirebaseAPI';
export default class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      sdt:'',
      mk:'',
      us_uid:'',// cái này là uid session chứa cái data.key là uid cửa user mới đăng nhập
      tcl1:'white',      
      tcl2:'white',
    };
  }
  CoKyTuDacBiet(ip){
    
    if(ip.indexOf('~')===-1 &&
    ip.indexOf('!')===-1 &&
    ip.indexOf('#')===-1 &&
    ip.indexOf('$')===-1 &&
    ip.indexOf('%')===-1 &&
    ip.indexOf('^')===-1 &&
    ip.indexOf('&')===-1 &&
    ip.indexOf('*')===-1 &&
    ip.indexOf('(')===-1 &&
    ip.indexOf(')')===-1 &&
    ip.indexOf('_')===-1 &&
    ip.indexOf('-')===-1 &&
    ip.indexOf('=')===-1 &&
    ip.indexOf('+')===-1 &&//
    ip.indexOf('{')===-1 &&
    ip.indexOf('}')===-1 &&
    ip.indexOf('[')===-1 &&
    ip.indexOf(']')===-1 &&
    ip.indexOf('\\')===-1 &&//
    ip.indexOf('\/')===-1 &&
    ip.indexOf('\'')===-1 &&
    ip.indexOf('\"')===-1 &&
    ip.indexOf(':')===-1 &&
    ip.indexOf(';')===-1 &&
    //ip.indexOf('')===-1 &&
    ip.indexOf('<')===-1 &&
    ip.indexOf('>')===-1 &&
    ip.indexOf(',')===-1 &&
    ip.indexOf('.')===-1 &&
    ip.indexOf('?')===-1)
      return false;    
    return true;
  } 
  checkSDT(ip){
    if(isNaN(ip)===false){//toàn số
      if(ip.charAt(0)==='0')
        return true;
      return false;
    }else
      return false;    
  }
  checkPass(ip){    
    //alert(this.CoKyTuDacBiet(ip));
    if(this.CoKyTuDacBiet(ip)===true)
      return false;
    else{
      if(ip.indexOf(' ')===-1){//trong mật khẩu có khoảng trắng
        return true;
      }
      else
        return false;
      
    }
  }
  btn_DangNhap_Click(){
    if(this.state.tcl1==='red'||this.state.tcl2==='red'||
    this.state.sdt==='' ||this.state.mk==='' ){
      Alert.alert('Thông báo','Vui lòng nhập đúng và đủ số điện thoại và mật khẩu');
      return;
    } 
    //kết nối firebase
    database=firebase.database();
    //trỏ đến bảng table_users
    tb_user=database.ref('db_marketsfarmers/table_users');
    //câu truy vấn kiểm tra điều kiện đăng nhập
    //orderByChild() dùng để so sánh tại cột sdt_mk
    //equalTo(): chứa giá trị so sánh
    const query=tb_user.orderByChild('sdt_mk').equalTo(this.state.sdt+this.state.mk);
    //flag
    co='0';
    query.on('value',(snap)=>{//snap hay snapshot do mình đặt, chứa dữ liệu lấy về dc
        if(snap.exists()){//kiểm tra tồn tại user
          snap.forEach((data)=>{//data là "1" user lấy dc trong danh sách user trong list snap
            if(data.val().state==='Bình thường'){
                           
              //luu uid trên máy sau khi đăn nhập
              //hàm setItem để lưu uid của user vào biến uid_store lưu trên máy, lần sau mở ứng dụng
              //sẽ tự động lấy thông tin user,ko cần đăng nhập
            
            if(data.val().type==='admin'){
              this.props.propsNavigator.push({
                screen:'HomeAdmin',
                uidSession:data.key,//gửi uid sesion tới màn hình tiếp
              });
            }else{
              AsyncStorage.setItem('uid_store',data.key);//set uid
            this.props.propsNavigator.push({
              screen:'GuestMain',
              uidSession:data.key,//gửi uid sesion tới màn hình tiếp
            });//
          }            
            }else{
              Alert.alert('Thông báo','Tài khoản của bạn đang bị khóa');
            }            
          });
          if(co==='1'){
            
        }
        }else{
          Alert.alert('Thông báo','Đăng nhập sai. Xin vui lòng thử lại!');
        }
    });
  }
  btn_DangKy_Click(){
    this.props.propsNavigator.push({
      screen:'Register'
    })

  }
  btn_WithFacebook_Click(){
    Alert.alert('Thông báo','button Facebook dc click');
  }
  btn_WithGoogle_Click(){
    Alert.alert('Thông báo','button Google dc click');
  }
  btn_BackScreen_Click(){
    this.props.propsNavigator.pop();
  }
  renderPlatformInput(){
    if(Platform.OS==='ios'){
      return(
        <View style={{margin:15}}>
          <Text style={{fontWeight:'bold',fontSize:20,color:'#01579B'}}>Số điện thoại</Text>
  {/* INPUT  số diendj thoại*/}

          <TextInput style={{borderRadius:5,backgroundColor:'white',fontSize:20,height:45}}
          onChangeText={(value)=>this.setState({sdt:value})}/>

          <View style={{flexDirection:'row',marginTop:7}}>
            <View style={{flex:1}}><Text style={{fontWeight:'bold',fontSize:20,color:'#01579B',marginTop:7}}>Mật khẩu</Text></View>
            <View style={{flex:2,alignItems:'flex-end'}}>{/*<Text style={{fontStyle:'italic',marginTop:7,fontSize:15,color:'#FF9800'}}>Quên mật khẩu?</Text>*/}</View>
          </View>
  {/* INPUT  mật khẩu  -underlineColorAndroid: màu gạch chân trong input,
    onSubmitEditing: gọi hàm btn_DangNhap_Click() khi nhập xong password*/}

          <TextInput secureTextEntry={true}
          onSubmitEditing={()=>this.btn_DangNhap_Click()}
          style={{borderRadius:5,backgroundColor:'white',fontSize:20,height:45}}
           onChangeText={(value)=>this.setState({mk:value})}/>
          <View style={{height:35,width:'100%',flexDirection:'row',justifyContent:'center',backgroundColor:'#03A9F4',borderRadius:5,alignItems:'center',marginTop:15}}>
            <TouchableHighlight onPress={()=>this.btn_DangNhap_Click()}>
            <Text style={{fontSize:20,color:'white'}}>Đăng nhập</Text>
            </TouchableHighlight>
            </View>
          <View style={{alignItems:'flex-end'}}>
          <Text onPress={()=>this.btn_DangKy_Click()}  style={{fontStyle:'italic',marginTop:7,fontSize:20,color:'#FF9800'}}> Đăng ký tài khoản mới</Text></View>
        </View>
      );
    }else{
      return(
        <View style={{margin:15}}>
          <Text style={{fontWeight:'bold',fontSize:20,color:this.state.tcl1}}>Số điện thoại</Text>
  {/* INPUT  số diendj thoại*/}

          <TextInput style={{borderRadius:5,backgroundColor:'#ffffff5A',fontSize:20,borderColor:this.state.tcl1,borderWidth:1}}
          underlineColorAndroid="#ffffff5A" 
          onChangeText={(value)=>{
            if(this.checkSDT(value.trim()))
              this.setState({sdt:value.trim(),tcl1:'white'});
            else
              this.setState({sdt:value.trim(),tcl1:'red'});
          }}/>

          <View style={{flexDirection:'row',marginTop:7}}>
            <View style={{flex:1}}><Text style={{fontWeight:'bold',fontSize:20,color:this.state.tcl2,marginTop:7}}>Mật khẩu</Text></View>
            <View style={{flex:2,alignItems:'flex-end'}}><Text style={{fontStyle:'italic',marginTop:7,fontSize:15,color:'#FFFF00'}}>Quên mật khẩu?</Text></View>
          </View>
  {/* INPUT  mật khẩu  -underlineColorAndroid: màu gạch chân trong input,
    onSubmitEditing: gọi hàm btn_DangNhap_Click() khi nhập xong password*/}

          <TextInput secureTextEntry={true}
          onSubmitEditing={()=>this.btn_DangNhap_Click()}
          style={{borderRadius:5,backgroundColor:'#ffffff5A',fontSize:20,borderColor:this.state.tcl2,borderWidth:1}}
          underlineColorAndroid="#ffffff5A"
           onChangeText={(value)=>{
            if(this.checkPass(value.trim()))
              this.setState({mk:value.trim(),tcl2:'white'});
            else
              this.setState({mk:value.trim(),tcl2:'red'});
           }}/>
          <Text>{"\n"}</Text>
          <Button onPress={()=>this.btn_DangNhap_Click()} title={'Đăng nhập'} color='#03A9F4'></Button>
            <Text>{"\n"}</Text>
          <View style={{alignItems:'flex-end'}}>
          <Text onPress={()=>this.btn_DangKy_Click()}  style={{fontStyle:'italic',marginTop:7,fontSize:20,color:'#FFFF00'}}> Đăng ký tài khoản mới</Text></View>
        </View>
      );
    }
  }
  render(){
    return(
      <View>
          <Image style={{height:'100%',width:'100%'}} source={require('../img/loginback1.jpg')} >
             
      <View style={{flex:1}}>
        <View style={{margin:5,justifyContent:'center',alignItems:'center'}}>
        <Image source={require('../img/icon_logo_1.png')} style={{width:'65%',height:'65%',alignItems:'flex-end',marginTop:30}} resizeMode="contain">          
        </Image>
        <Text style={{color:'white',fontSize:45}} >Chợ Nhà Nông</Text>
        </View>

      </View>
      <View style={{flex:1}}>
      {this.renderPlatformInput()}
      </View>
      
          </Image>
        </View>
    );
  }

}
AppRegistry.registerComponent('ChoNhaNong_v1',()=>Login);
