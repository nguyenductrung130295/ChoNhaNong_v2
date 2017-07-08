import React,{Component} from 'react'
import {Alert,Text,ListView,AppRegistry,TouchableHighlight,Image,View,Modal,TextInput,Picker,Button} from 'react-native'
import ItemShop from '../item_customer/ItemShop'
import firebase from '../entities/FirebaseAPI'
import Shops from '../entities/Shops'
import Users from '../entities/Users'
const ds=new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});    
export default class ListShops extends Component{

  constructor(props){
    super(props);

    this.state={
      dataSource:null,//datasource cho ListView
      modalVisible: false,//ẩn hiện modal tạo cửa hàng mới
      txt_tencuahangmoi:'',//tên cửa hàng mới
      diachi_t:'Hồ Chí Minh',//value địa chỉ, thành phố default
      loaisp:'Trái cây',//value loại sản phẩm cửa hàng mặc định,
      txt_search:'',
      user:new Users(),
    };
  }
  //hàm này chạy trước khi render ra màn hình
  componentWillMount(){
    //list shops: danh sách shops rỗng, là mảng các đối tượng shops
    list_shop=[];
    
    //alert(this.props.us_uid);
    //khởi tạo dữ liệu firebase lấy danh sách shops
    database=firebase.database();

    tb_listshop=database.ref('db_marketsfarmers/table_shops');//trỏ đến chổ table_shops
    tb_listshop.orderByChild('user_own').equalTo(this.props.uidSession)
    .on('value',(snapshot)=>{
      list_shop=[];//cứ mỗi lần thây đổi là phải set nó rỗng chứ ko nó sẽ lặp lại danh sách
      snapshot.forEach((data)=>{
        list_shop.push({//push đối tượng thông tin shops vào list_shop
          shopid:data.key,
          tencuahang:data.val().tencuahang,
          loaisp:data.val().loaisp,
          //diachi_txh:data.val().diachi_txh,
          //diachi_t:data.val().diachi_t,
          //sdtcuahang:data.val().sdtcuahang,
          //score_star:data.val().score_star,
          logoshop:data.val().logoshop,
          //anhbiashop:data.val().anhbiashop,
          //user_own:data.val().user_own,
        });

      });
      //khi push xong hết rồi set nó vào dataSource của listview
      this.setState({dataSource:ds.cloneWithRows(list_shop)})
    });

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
  checkSDT(ip){
    if(isNaN(ip)===false){//toàn số
      if(ip.charAt(0)==='0')
        return true;
      return false;
    }else
      return false;    
  }
  btn_TimKiemShops(){
    database=firebase.database();
    if(this.checkSDT(this.state.txt_search)===false){//tên
      database.ref('db_marketsfarmers/table_shops/')
      .orderByChild('tencuahang')
      .startAt(this.state.txt_search)//bắt đầu bằng
      .endAt(this.state.txt_search+'\uf8ff')//kết thúc, uf8ff
      .on('value',(sn)=>{
        list_shop=[];
        sn.forEach((data)=>{
          list_shop.push({//push đối tượng thông tin shops vào list_shop
          shopid:data.key,
          tencuahang:data.val().tencuahang,
          loaisp:data.val().loaisp,
          //diachi_txh:data.val().diachi_txh,
          //diachi_t:data.val().diachi_t,
          //sdtcuahang:data.val().sdtcuahang,
          //score_star:data.val().score_star,
          logoshop:data.val().logoshop,
          //anhbiashop:data.val().anhbiashop,
          //user_own:data.val().user_own,
        });
      });
      this.setState({dataSource:ds.cloneWithRows(list_shop)})
      });
    }else{//sdt
      database.ref('db_marketsfarmers/table_shops/')
      .orderByChild('sdtcuahang')
      .equalTo(this.state.txt_search)
      .on('value',(sn)=>{
        list_shop=[];
        sn.forEach((data)=>{
          list_shop.push({//push đối tượng thông tin shops vào list_shop
          shopid:data.key,
          tencuahang:data.val().tencuahang,
          loaisp:data.val().loaisp,
          //diachi_txh:data.val().diachi_txh,
          //diachi_t:data.val().diachi_t,
          //sdtcuahang:data.val().sdtcuahang,
          //score_star:data.val().score_star,
          logoshop:data.val().logoshop,
          //anhbiashop:data.val().anhbiashop,
          //user_own:data.val().user_own,
        });
        });
    this.setState({dataSource:ds.cloneWithRows(list_shop)})  
    });
    }
  }
  btn_TaoCuaHangMoi_Click(){
    if(this.state.txt_tencuahangmoi.trim()===''){
      Alert.alert('Thông báo','Vui lòng nhập tên cửa hàng.');
      return;
    }
    //khởi tạo dữ liệu kết nối tới fireabase
    database=firebase.database();
    //trỏ tới bảng table_shops
    tb_shops=database.ref('db_marketsfarmers/table_shops');
    //insert
    tb_shops.push({
      tencuahang:this.state.txt_tencuahangmoi,//ten cửa hàng mới
      loaisp:this.state.loaisp,//loại sản phẩm( picker )
      sdtcuahang:this.state.user.sdt,//so dien thoại cửa hàng
      diachi_txh:'',//thôn xã huyện
      diachi_t:this.state.diachi_t,//tỉnh/tp (picker)
      score_star:'0',//số sao đánh giá
      anhbiashop:'https://firebasestorage.googleapis.com/v0/b/nodejsdemo-d89c7.appspot.com/o/photos%2Fbanner_shops%2Fbannerdefaultshop.png?alt=media&token=c08ad408-defc-4c15-9130-2d30ffd26ddb',
      logoshop:'https://firebasestorage.googleapis.com/v0/b/nodejsdemo-d89c7.appspot.com/o/photos%2Flogo_shops%2Fshops.jpg?alt=media&token=9172e3cc-1801-4835-96bc-16141055bd17',
      user_own:this.props.uidSession,//user chủ sở hữu cửa hàng
      gioithieu:'',
      state:'Bình thường',//tình trạng hoạt động của shops,
      loaivipham:'',
      follow:{
          uid:{
             maxid:0
          }
      }
    },()=>{Alert.alert('Thông báo','Đã thêm cửa hàng '+this.state.txt_tencuahangmoi);
          this.setState({modalVisible:!this.state.modalVisible});
    });// hiện thông báo sau khi làm push xong
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
          renderRow={(rowData)=><ItemShop uidSession={this.props.uidSession} sid={rowData.shopid} propsNavigator={this.props.propsNavigator} obj={rowData}
          ></ItemShop>}
        />
      );
    }else if(this.state.dataSource===null){
      return(
        <View><Text>Waiting</Text></View>
      );
    }

  }
  render(){
    return(
      <View style={{flex:1}}>
      <View style={{backgroundColor:'#29B6F6'}}>
      <View style={{flexDirection:'row',backgroundColor:'#03A9F4'}}>
        <View style={{flex:1}}><TouchableHighlight underlayColor='#FAFAFA' onPress={()=>this.btn_Back_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_arrow_back_white_24dp.png')} /></TouchableHighlight></View>
        <View style={{flex:7,paddingLeft:5}}>
{/* SEARCH INPUT */}
        <Text style={{fontSize:20,color:'white',marginTop:10}}>Cửa hàng của tôi</Text>
        </View>

{/* ICON BUTTON options */}
        <View style={{flex:1}}>
          {/*
          <TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_TimKiem_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_search_white_24dp.png')} /></TouchableHighlight>
          */}
          </View>
      </View>
      <View style={{flexDirection:'row',marginTop:5,marginBottom:5}}>
        <View style={{flex:5,paddingLeft:10}}>
          <TextInput placeholder="  Số điện thoại hoặc tên cửa hàng"
          style={{backgroundColor:'white',borderRadius:4,borderWidth:1,borderColor:'#BDBDBD',height:38,color:'black'}}
          onChangeText={(value)=>this.setState({txt_search:value})}
          />
        </View>
        <View style={{flex:1,paddingLeft:10,paddingRight:10}}>                    
            <TouchableHighlight  underlayColor='#FAFAFA'style={{height:35,justifyContent:'center',alignItems:'center',backgroundColor:'#4FC3F7',borderRadius:2,borderColor:'white',borderWidth:1}} 
            onPress={()=>this.btn_TimKiemShops()}><Text style={{color:'#ffffff'}}>Tìm</Text></TouchableHighlight>
        
        </View>

      </View>
      <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
      <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
      <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
      
      </View>

      {this.renderList()}

      <View style={{height:73,width:72,borderRadius:100,backgroundColor:'#BDBDBD',position: 'absolute',
      bottom: 50,
      right:20,}}><TouchableHighlight underlayColor="#E0F7FA00" onPress={() => {
        this.setModalVisible(true)
      }}>
{/* button nổi để hiện modal thêm cửa hàng */}
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
{/* Modal thêm cửa hàng mới */}
            <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => alert("Modal has been closed.")}
              >
             <View style={{flex:1,backgroundColor:'#000000a0'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:2}}>
              <View style={{margin:20,backgroundColor:'white',borderRadius:5}}>
              <View style={{flexDirection:'row',backgroundColor:'#0288D1',borderTopLeftRadius:4,borderTopRightRadius:4}}>
                <View style={{flex:7}}>
                  <Text style={{fontSize:20,color:'white',marginLeft:10,marginTop:10}}>Tạo Cửa hàng mới</Text>
                </View>
                <View style={{flex:1}}>
                  <TouchableHighlight underlayColor='#E0F7FA' onPress={() => {
                    this.setModalVisible(!this.state.modalVisible)
                  }} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_clear_white_24dp.png')} /></TouchableHighlight>
                </View>
              </View>
              <View style={{flexDirection:'row'}}>                
                <View style={{flex:3,borderColor:'#BDBDBD'}}>
                {/* picker loại sp cúả cửa hàng*/}
                <Picker
          selectedValue={this.state.loaisp}
          onValueChange={(value) => this.setState({loaisp: value})}>
          <Picker.Item label="Trái Cây" value="Trái cây" />
          <Picker.Item label="Hoa, cây cảnh" value="Hoa, cây cảnh" />
          <Picker.Item label="Gia súc, Gia Cầm" value="Gia súc, Gia Cầm" />
          <Picker.Item label="Cây công nghiệp" value="Cây công nghiệp" />
          <Picker.Item label="Cây tinh bột" value="Cây tinh bột" />
          <Picker.Item label="Thủy hải sản" value="Thủy hải sản" />
          <Picker.Item label="Rau củ" value="Rau củ" />
          <Picker.Item label="Cây thuốc" value="Cây thuốc" />
                </Picker>
                </View>
                <View style={{flex:4}}>
                {/* picker tỉnh thành phố sp cúả cửa hàng*/}
                <Picker
          selectedValue={this.state.diachi_t}
          onValueChange={(value) => this.setState({diachi_t: value})}>
          <Picker.Item label="Hà Nội" value="Hà Nội" />
          <Picker.Item label="Hồ Chí Minh" value="Hồ Chí Minh" />
          <Picker.Item label="Đà Nẵng" value="Đà Nẵng" />
          <Picker.Item label="Hải Phòng" value="Hải Phòng" />
          <Picker.Item label="Cần Thơ" value="Cần Thơ" />
          <Picker.Item label="An Giang" value="An Giang" />
          <Picker.Item label="Bà Rịa - Vũng Tàu" value="Bà Rịa - Vũng Tàu" />
          <Picker.Item label="Bắc Giang" value="Bắc Giang" />
          <Picker.Item label="Bắc Kạn" value="Bắc Kạn" />
          <Picker.Item label="Bạc Liêu" value="Bạc Liêu" />
          <Picker.Item label="Bắc Ninh" value="Bắc Ninh" />
          <Picker.Item label="Bến Tre" value="Bến Tre" />
          <Picker.Item label="Bình Định" value="Bình Định" />
          <Picker.Item label="Bình Dương" value="Bình Dương" />
          <Picker.Item label="Bình Phước" value="Bình Phước" />
          <Picker.Item label="Bình Thuận" value="Bình Thuận" />
          <Picker.Item label="Cà Mau" value="Cà Mau" />
          <Picker.Item label="Cao Bằng" value="Cao Bằng" />
          <Picker.Item label="Đắk Lắk" value="Đắk Lắk" />
          <Picker.Item label="Đắk Nông" value="Đắk Nông" />
          <Picker.Item label="Điện Biên" value="Điện Biên" />
          <Picker.Item label="Đồng Nai" value="Đồng Nai" />
          <Picker.Item label="Đồng Tháp" value="Đồng Tháp" />
          <Picker.Item label="Gia Lai" value="Gia Lai" />
          <Picker.Item label="Hà Giang" value="Hà Giang" />
          <Picker.Item label="Hà Nam" value="Hà Nam" />
          <Picker.Item label="Hà Tĩnh" value="Hà Tĩnh" />
          <Picker.Item label="Hải Dương" value="Hải Dương" />
          <Picker.Item label="Hậu Giang" value="Hậu Giang" />
          <Picker.Item label="Hòa Bình" value="Hòa Bình" />
          <Picker.Item label="Hưng Yên" value="Hưng Yên" />
          <Picker.Item label="Khánh Hòa" value="Khánh Hòa" />
          <Picker.Item label="Kiên Giang" value="Kiên Giang" />
          <Picker.Item label="Kon Tum" value="Kon Tum" />
          <Picker.Item label="Lai Châu" value="Lai Châu" />
          <Picker.Item label="Lâm Đồng" value="Lâm Đồng" />
          <Picker.Item label="Lạng Sơn" value="Lạng Sơn" />
          <Picker.Item label="Lào Cai" value="Lào Cai" />
          <Picker.Item label="Long An" value="Long An" />
          <Picker.Item label="Nam Định" value="Nam Định" />
          <Picker.Item label="Nghệ An" value="Nghệ An" />
          <Picker.Item label="Ninh Bình" value="Ninh Bình" />
          <Picker.Item label="Ninh Thuận" value="Ninh Thuận" />
          <Picker.Item label="Phú Thọ" value="Phú Thọ" />
          <Picker.Item label="Quảng Bình" value="Quảng Bình" />
          <Picker.Item label="Quảng Nam" value="Quảng Nam" />
          <Picker.Item label="Quảng Ngãi" value="Quảng Ngãi" />
          <Picker.Item label="Quảng Ninh" value="Quảng Ninh" />
          <Picker.Item label="Quảng Trị" value="Quảng Trị" />
          <Picker.Item label="Sóc Trăng" value="Sóc Trăng" />
          <Picker.Item label="Sơn La" value="Sơn La" />
          <Picker.Item label="Tây Ninh" value="Tây Ninh" />
          <Picker.Item label="Thái Bình" value="Thái Bình" />
          <Picker.Item label="Thái Nguyên" value="Thái Nguyên" />
          <Picker.Item label="Thanh Hóa" value="Thanh Hóa" />
          <Picker.Item label="Thừa Thiên Huế" value="Thừa Thiên Huế" />
          <Picker.Item label="Tiền Giang" value="Tiền Giang" />
          <Picker.Item label="Trà Vinh" value="Trà Vinh" />
          <Picker.Item label="Tuyên Quang" value="Tuyên Quang" />
          <Picker.Item label="Vĩnh Long" value="Vĩnh Long" />
          <Picker.Item label="Vĩnh Phúc" value="Vĩnh Phúc" />
          <Picker.Item label="Yên Bái" value="Yên Bái" />
          <Picker.Item label="Phú Yên" value="Phú Yên" />
          
         
                </Picker>
                </View>
              </View>

                  <View style={{padding: 10}}>
            <TextInput
              style={{color:'black',height: 40,marginBottom:10,borderColor:'#BDBDBD',borderWidth:1,borderRadius:2}}
              underlineColorAndroid="white"
              placeholder="Tên cửa hàng mới"
              onChangeText={(value)=>this.setState({txt_tencuahangmoi:value})}
              />
                <Button onPress={()=>this.btn_TaoCuaHangMoi_Click()} title={'Tạo cửa hàng'} color='#03A9F4'></Button>
          </View>
          </View>
              </View>
              <View style={{flex:1}}></View>
             </View>
            </Modal>

      </View>
    );
  }
  btn_Back_Click(){
    this.props.propsNavigator.pop();
  }
}
