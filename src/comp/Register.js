import React,{Component} from 'react';
import {Alert,AppRegistry,Text,TextInput,Button,View,Image,TouchableHighlight,Platform} from 'react-native';
import Users from '../entities/Users'
import firebase from '../entities/FirebaseAPI';
export default class Register extends Component{
  constructor(props){
    super(props);
    this.state={
      //input
      ten:'',// họ và tên người dùng
      sdt:'',// số điện thoại
      mk:'',//mật khẩu
      mkxn:'',//nhập lại mật khẩu
      //màu sắc
      tcl1:'white',      
      tcl2:'white',
      tcl4:'white',
      tcl3:'white',
    }
  }
  btn_DangKy_Click(){
    if(this.state.tcl1==='red'||this.state.tcl2==='red'||this.state.tcl3==='red'||this.state.tcl4==='red'){
      Alert.alert('Thông báo','Vui lòng nhập đúng thông tin');
      return
    }
    else if(this.state.ten==='' ||this.state.sdt==='' ||this.state.mk==='' ||this.state.mkxn===''){
      Alert.alert('Thông báo','Vui lòng nhập đủ thông tin');
      return;
    }          
    //khởi tạo dữ liệu kết nối tới fireabase
    database=firebase.database();

    checkexitUser=database.ref('db_marketsfarmers/table_users').orderByChild('sdt').equalTo(this.state.sdt)
    .once('value',(sn)=>{
      if(sn.exists()){
        Alert.alert('Thông báo','Số điện thoại đã tồn tại, vui lòng dùng số khác');
        return;
      }else{
        //checkexitUser.off('value');
          //trỏ tới bảng table_users
    tb_user=database.ref('db_marketsfarmers/table_users');
    //tạo key-tương đương với id của một users, sdt là duy nhất
    tb_user.push({//số điện thoại ko trùng nhau
      //khi push đây, cái màu xanh lá cây sẽ lưu trên firebase luôn
      //do ko có cấu trúc, nên sai là trên firebase cũng lưu sai,
      //mình lưu theo cấu trúc user entities
      hovaten:this.state.ten,
      state:'Bình thường',
      loaivipham:'',
      matkhau:this.state.mk,
      sdt_mk:this.state.sdt+this.state.mk,//cái này dùng để kiểm tra điều kiện đăng nhập, do ko kiểm tra 2 mục 1 lần, nên kết hợp nó lại thành một
      sdt:this.state.sdt,
      diachi_t:'',
      diachi_txh:'',
      email:'',//như trên
      type:'user',
      anhbia:'https://firebasestorage.googleapis.com/v0/b/nodejsdemo-d89c7.appspot.com/o/photos%2Fbanner_users%2Fthiennhiendep201633.jpg?alt=media&token=43daf4e8-8d4c-4203-a355-5b121223095c',
      anhdaidien:'https://firebasestorage.googleapis.com/v0/b/nodejsdemo-d89c7.appspot.com/o/photos%2Favatar_users%2Fuserdefault.png?alt=media&token=3d83631f-594c-4ace-ba78-a92b75fef82c'
    },()=>{
      var d = new Date();//new time now
      var time = d.toString().slice(4,24);
      tb_user.orderByChild('sdt_mk').equalTo(this.state.sdt+this.state.mk).once('value',(snap)=>{
        snap.forEach((data)=>{
          insert_noti=database.ref('db_marketsfarmers/table_notif/'+data.key);
          insert_noti.child('1').set({
            idpost:data.key,
            content:'Chào '+data.val().hovaten+' .Chúc mừng bạn đã đăng ký thành công!',
            state:'dagui',
            time:time,
            title:'Đăng ký thành công.',
            type:'system'
          },()=>
            this.props.propsNavigator.push({//push xong rồi chuyển sang màn hình guest,cái này phải lấy uid mới vừa đk để cho màn hình guestmain, mà chưa làm
            screen:'GuestMain',
            uidSession:data.key
          })
          );
        });
      });
  });
  
      }
    });

  
}
  btn_BackScreen_Click(){
    this.props.propsNavigator.pop();
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
  CheckName(ip){
    if(this.CoKyTuDacBiet(ip)){
      return false;
    }else{
      return true;
    }
  }
  CheckNhapLaiMatKhau(ip){
    if(this.state.mk!==''){
      if(ip===this.state.mk)
        return true;
      return false;
    }
    return false;
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
  renderInput(){
    if(Platform.OS==='ios'){
      return(
        <View style={{flex:2,padding:15}}>
        {/* INPUT ho va ten - onChangeText để lấy dữ liệu nhập vào lưu vào state  */}
          <Text style={{fontWeight:'bold',fontSize:20,color:'#01579B'}}>Họ và tên:</Text>
          <TextInput onChangeText={(value)=>{
              if(this.CheckName(value.trim())){
                this.setState({ten:value.trim(),tcl1:'white'});
              }else{
                this.setState({ten:value.trim(),tcl1:'red'});
              }
            }}
          style={{borderRadius:5,backgroundColor:'white',fontSize:20,height:45}}
          />
          <Text style={{fontWeight:'bold',fontSize:20,color:'#01579B'}}>Số điện thoại:</Text>
  {/* INPUT số điện thoại */}
          <TextInput onChangeText={(value)=>this.setState({sdt:value})}
          style={{borderRadius:5,backgroundColor:'white',fontSize:20,height:45}}
          />
          <Text style={{fontWeight:'bold',fontSize:20,color:'#01579B'}}>Mật khẩu:</Text>
  {/* INPUT mật khẩu */}
          <TextInput onChangeText={(value)=>this.setState({mk:value})}
          style={{borderRadius:5,backgroundColor:'white',fontSize:20,height:45}}
          />
          <Text style={{fontWeight:'bold',fontSize:20,color:'#01579B'}}>Nhập lại mật khẩu:</Text>
  {/* INPUT xác nhận mật khẩu */}
          <TextInput  onChangeText={(value)=>this.setState({xnmk:value})}
          style={{borderRadius:5,backgroundColor:'white',fontSize:20,height:45}}
          />

          <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
            <View style={{height:35,width:'100%',flexDirection:'row',justifyContent:'center',backgroundColor:'red',borderRadius:5,alignItems:'center',marginTop:15}}>
              <TouchableHighlight onPress={()=>this.btn_Huybo_Click()}>
              <Text style={{fontSize:20,color:'white'}}>Huỷ</Text>
              </TouchableHighlight>
              </View>
            </View>
            <View style={{flex:3,marginLeft:10}}>
                <View style={{height:35,width:'100%',flexDirection:'row',justifyContent:'center',backgroundColor:'#03A9F4',borderRadius:5,alignItems:'center',marginTop:15}}>
                  <TouchableHighlight onPress={()=>this.btn_DangKy_Click()}>
                  <Text style={{fontSize:20,color:'white'}}>Đăng nhập</Text>
                  </TouchableHighlight>
                  </View>
            </View>
          </View>
        </View>
      );
    }
    else{
      return(
        <View style={{flex:2,padding:15}}>
        {/* INPUT ho va ten - onChangeText để lấy dữ liệu nhập vào lưu vào state  */}
          <Text style={{fontWeight:'bold',fontSize:20,color:this.state.tcl1}}>Họ và tên:</Text>
          <TextInput onChangeText={(value)=>{
              if(this.CheckName(value.trim())){
                this.setState({ten:value,tcl1:'white'});
              }else{
                this.setState({ten:value,tcl1:'red'});
              }
            }}
          style={{borderRadius:5,backgroundColor:'#ffffff5A',fontSize:20,borderColor:this.state.tcl1,borderWidth:1}} underlineColorAndroid="#ffffff5A"/>
          <Text style={{fontWeight:'bold',fontSize:20,color:this.state.tcl2}}>Số điện thoại:</Text>
  {/* INPUT số điện thoại */}
          <TextInput onChangeText={(value)=>{
            if(this.checkSDT(value.trim())){
              this.setState({sdt:value.trim(),tcl2:'white'});
            }else
              this.setState({sdt:value.trim(),tcl2:'red'});
            }}
            placeholder='09xxx, 01xxx'
          style={{borderRadius:5,backgroundColor:'#ffffff5A',fontSize:20,borderColor:this.state.tcl2,borderWidth:1}} underlineColorAndroid="#ffffff5A"/>
          
          <Text style={{fontWeight:'bold',fontSize:20,color:this.state.tcl3}}>Mật khẩu:</Text>
  {/* INPUT mật khẩu */}
          <TextInput onChangeText={(value)=>{
              if(this.checkPass(value.trim())===true)
                this.setState({mk:value.trim(),tcl3:'white'});
              else
                this.setState({mk:value.trim(),tcl3:'red'});
            }}
          style={{borderRadius:5,backgroundColor:'#ffffff5A',fontSize:20,borderColor:this.state.tcl3,borderWidth:1}} underlineColorAndroid="#ffffff5A"/>
          
          <Text style={{fontWeight:'bold',fontSize:20,color:this.state.tcl4}}>Nhập lại mật khẩu:</Text>
  {/* INPUT xác nhận mật khẩu */}
          <TextInput  onChangeText={(value)=>{
              if(this.CheckNhapLaiMatKhau(value.trim())){
                this.setState({mkxn:value.trim(),tcl4:'white'});
              }else
              this.setState({mkxn:value.trim(),tcl4:'red'});
            }}
          style={{borderRadius:5,backgroundColor:'#ffffff5A',fontSize:20,borderColor:this.state.tcl4,borderWidth:1}} underlineColorAndroid="#ffffff5A"/>
          
          
          <Text>{"\n"}</Text>
          <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
              <Button onPress={()=>this.props.propsNavigator.pop()} title="Hủy bỏ" color='#FF3D00'/>
            </View>
            <View style={{flex:3,marginLeft:10}}>
                <Button onPress={()=>this.btn_DangKy_Click()} title="Đăng Ký"/>
            </View>
          </View>
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
        <Image source={require('../img/icon_logo_1.png')} style={{width:'55%',height:'55%',alignItems:'flex-end',marginTop:30}} resizeMode="contain">          
        </Image>
        <Text style={{color:'white',fontSize:45}} >Chợ Nhà Nông</Text>
        </View>

      </View>
      <View style={{flex:2}}>
      {this.renderInput()}
       </View>
      
          </Image>
        </View>
    );
  }

}
AppRegistry.registerComponent('ChoNhaNong_v1',()=>Register);
