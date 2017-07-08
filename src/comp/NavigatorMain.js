import React,{Component} from 'react';
import {AppRegistry,View,BackHandler,AsyncStorage,Text} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components'
import Users from '../entities/Users'
import FirstDisplay from './FirstDisplay';
import GuestMain from './GuestMain';
import HomeGuest from './HomeGuest';
import Login from './Login';
import Register from './Register'
import InfoPersonal from './InfoPersonal'
import Messendger from './Messendger'
import AddPostNew from './AddPostNew'
import ShopMain from './ShopMain'
import StatusDetail from './StatusDetail'
import ListShops from './ListShops'
import ListUsers from './ListUsers'
import ListMessendger from './ListMessendger'
import HomeAdmin from './HomeAdmin'
import QLShops from './QLShops'
import QLStatus from './QLStatus'
import FollowUser from './FollowUser'
import Notification from './Notification'
import AboutApp from './AboutApp'
import Help from './Help'
export default class NavigatorChuyenTrang extends Component{
  constructor(props) {
      super(props);
      this.navigator = null;
//cái hàm này cho bấm nút quay về trên android-->ok, pop thôi
      this.handleBack = (() => {
        //kiểm tra navigator có null ko và nếu số trang màn hình lớn hơn 1 thì có thể quay về
        if (this.navigator && this.navigator.getCurrentRoutes().length > 1){
          this.navigator.pop();//lấy màn hình hiện tải bỏ đi về màn hình trước
          return true; //avoid closing the app
        }

        return false; //close the app
      }).bind(this) //don't forget bind this, you will remenber anyway.

      //
      this.state={
        uid:'-1'//tạo uid giá trị ban đầu là -1 là cái id của user : -1 có nghĩa là không có user nào
      };//giống cờ flag á,

      //hàm getItem lấy uid đã đăng nhập lưu trong key uid_store gán cho state.uid

        AsyncStorage.getItem("uid_store").then((value) => {
          if(value===null){
            this.setState({"uid": '0'});
          }else
          this.setState({"uid": value});

        }).done();

    }

    componentDidMount() {//cái hàm này của nút back trên android, gọi cái hàm ở trên,ko cần hiểu, biết là dc
      BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {//cái hàm này của nút back trên android, gọi cái hàm ở trên,ko cần hiểu, biết là dc
      BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }

  _renderScene(route,navigator){
    let name=route.screen;//chuyển tới màn hình
    let data=route.datanavi;//chưa xài, ai viết vậy
    let uidSession=route.uidSession;//uid là id của user  cũng để gửi dữ liệu qua 2 màn hình
    let uidadmin=route.uidadmin;
    let uidguest=route.uidguest;
    let userSession=route.userSession;//object user gửi dữ liệu user đang đăng nhập tới màn hình tiếp theo
    let sid=route.sid;//sid là idshops
    let uidGetMessage=route.uidGetMessage;//uid người nhận tin nhắn
    let idPost=route.idPost;//id của post
    switch (name) {
      // hiển thị trang đầu tiên, chọn mua hoặc bán
      case 'AboutApp':
        return <AboutApp propsNavigator={navigator}/>
        case 'Help':
        return <Help propsNavigator={navigator}/>
      case 'Notification':
        return <Notification propsNavigator={navigator} uidSession={uidSession}/>
      case 'ListShops':
        return <ListShops propsNavigator={navigator} uidSession={uidSession}/>
      case 'FollowUser':
        return <FollowUser propsNavigator={navigator} uidSession={uidSession}/>
      case 'QLStatus':
        return <QLStatus propsNavigator={navigator} uidSession={uidSession}/>
      case 'QLShops':
        return <QLShops propsNavigator={navigator} uidSession={uidSession}/>
      case 'ListUsers':
        return <ListUsers propsNavigator={navigator} uidSession={uidSession}/>                  
      case 'StatusDetail':
        return <StatusDetail propsNavigator={navigator} uidSession={uidSession} idPost={idPost}/>
        
      case 'ShopMain':
        return <ShopMain propsNavigator={navigator} uidadmin={uidadmin} uidSession={uidSession} sid={sid}/>        

      case 'AddPostNew':
          return <AddPostNew propsNavigator={navigator} uidSession={uidSession} sid={sid}/>
          
      case 'Messendger':
          return <Messendger propsNavigator={navigator} uidSession={uidSession} uidGetMessage={uidGetMessage}/>
          
      case 'InfoPersonal':
          return <InfoPersonal propsNavigator={navigator} uidSession={uidSession} uidguest={uidguest} uidadmin={uidadmin}/>
          
      case 'Register':
          return <Register propsNavigator={navigator}/>
          
      case 'FirstDisplay':
        return <FirstDisplay propsNavigator={navigator}/>
        
      case 'Login':
          return <Login propsNavigator={navigator}/>
          
      // hiển thị màn hình trang chủ khách
      case 'GuestMain':
        return <GuestMain propsNavigator={navigator} uidSession={uidSession}/>
        
      case 'HomeAdmin':
        return <HomeAdmin propsNavigator={navigator} uidSession={uidSession}/>
        
      case 'HomeGuest':
          return <HomeGuest propsNavigator={navigator}/>
          
      //hiển thị màn hình danh sách tin nhắn
      case 'ListMessendger':
          return <ListMessendger propsNavigator={navigator} uidSession={uidSession}/>
                
          
      //case 'FirebaseKey':return <FirebaseKey propsNavigator={navigator} {...data}/>
    }
  }
  UserLogined(){//hàm này kiểm tra uid có trống ko
    if(this.state.uid==='0'){
      //user đã đăng xuất--> tới màn hình Login,đúng là màn hình HomeGuest,sửa sau
      return(
        <Navigator
          initialRoute={{screen:'HomeGuest'}}
          ref={navigator => {this.navigator = navigator}}
          renderScene={this._renderScene.bind(this)}
        />
);
    }else if(this.state.uid!=='0' && this.state.uid!=='-1' && this.state.uid!==null){
      //user đã đăng nhập, đã lưu uid vào máy-vào màn hinh guestmain có modal menu chọn
      //uid đã lấy từ máy xong gán vào state.uid, rồi render navigator màn hình guest main,
      //truền uid đó tới màn hình guestmain chứa trong uidSession
      return(
        <Navigator
          initialRoute={{screen:'GuestMain',uidSession:this.state.uid}}
          ref={navigator => {this.navigator = navigator}}
          renderScene={this._renderScene.bind(this)}
        />
      );
    }else{
      //trong lúc nó chạy nền lấy dữ liệu uid lưu trong máy thì nó phải render cái gì đó
      //ko thì nó báo lỗi nên phải render cái màn hình chờ với progressbar
      return(
        <View><Text>Waiting
        </Text></View>
      );
    }
  }
  render(){
    //initialRoute là màn hình chạy đầu tiên,chạy hàm dưới để render
    return(

      this.UserLogined()

    );
  }
}
AppRegistry.registerComponent('ChoNhaNong_v2',()=>NavigatorChuyenTrang);
