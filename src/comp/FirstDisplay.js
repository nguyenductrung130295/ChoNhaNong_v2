import React, {Component} from 'react';
import {StyleSheet,Text,Image,View,Button,Picker,Item,AppRegistry} from 'react-native';
export default class FirstDisplay extends Component{
  constructor(props){
    super(props);
    vung=['Hà Nội','Tp.Hồ Chí Minh','Hải Phòng','Đà Nẵng','Cần Thơ','An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu','Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cao Bằng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang','Hà Nam','Hải Dương','Hậu Giang','Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai','Long An','Nam Định','Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Quảng Bình','Quảng Nam','Quãng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa','Thừa Thiên Huế','Tiền Giang','Trà Vinh','Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái','Phú Yên'];
    this.state={
      selected:'Hà Nội'
    }
  }
  renderItem(){
    items=[];
    for(let item of vung){
      items.push(<Picker.Item key={item} label={item} value={item}/>)
    }
    return items;
  }

  btn_CanMua(){
    alert('Can Mua clicked!!!'+this.state.selected);
    this.props.propsNavigator.push({
      screen:'HomeGuest'
    });

  }
  btn_CanBan(){
    alert('Can Ban clicked!!!'+this.state.selected);
    if(datauser.exit()===true){//exit() để kiểm tra tồn tại
      console.log('key:'+datauser.key);//--> key:-KnMns5WaqfEo30SSS_T
      console.log('hovaten:'+datauser.val().hovaten);
      //--> hovaten:Kiều Nữ Ngọc Dinh
    }
  }
  render(){
    return(
      <View style={styles.container}>
      <View style={styles.logo}>
      <Text>CHỢ NHÀ NÔNG
      </Text>
    <Image source={require('../img/icondefault.jpg')}/>
      </View>
        <View style={styles.selectPicker}>

          <Text>Chọn vùng gần bạn
          </Text>

        <Picker selectedValue={this.state.selected} onValueChange={(value)=>this.setState({selected:value})}>
          {this.renderItem()}
        </Picker>
        </View>
        <View style={styles.buttongroup}>
        <View style={{flexDirection:'row'}}>
          <View style={styles.button1}>
<Button title={'Cần Bán'} onPress={()=>this.btn_CanBan()}></Button>

          </View>
          <View style={styles.button2}>
        <Button title={'Cần Mua'} onPress={()=>this.btn_CanMua()}></Button>
          </View>
        </View>
        </View>
      </View>

    );
  }
}
var styles=StyleSheet.create({
  container:{
    backgroundColor:'green',
    flex:1
  },
  logo:{
    flex:4
  },
  selectPicker:{
    flex:2
  },
  buttongroup:{
    flex:2
  },
  button1:{
    flex:1
  },
  button2:{
    flex:1
  }
});


AppRegistry.registerComponent('ChoNhaNong_v1',()=>FirstDisplay);
