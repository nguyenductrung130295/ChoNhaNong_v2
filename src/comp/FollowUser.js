import React,{Component} from 'react'
import {Text,ListView,AppRegistry,TouchableHighlight,Image,View,Modal,TextInput,Picker,Button} from 'react-native'
import ItemShop from '../item_customer/ItemShop'
import firebase from '../entities/FirebaseAPI'
import Shops from '../entities/Shops'
import Users from '../entities/Users'
import ItemListEvents from '../item_customer/ItemListEvents'
import ItemListViewStatus from '../item_customer/ItemListViewStatus';
const ds=new ListView.DataSource({rowHasChanged:(r1,r2) => r1 !== r2});
export default class ListShops extends Component{

  constructor(props){
    super(props);
    this.state={
        options:1,//1:bài đăng,2:thông tin,3:ảnh
        backgrTab1:'#0288D150',
      backgrTab2:'#0288D1',
      backgrTab3:'#0288D1',
      dataSourceCuaHang:ds.cloneWithRows([]),
      dataSourceBaiDang:ds.cloneWithRows([]),
      dataSourceSuKien:ds.cloneWithRows([]),
    }
  }
  componentWillMount(){
    database=firebase.database();
    postFollow=[];
    postKey=[];
    //danh sách key post
    listkeyposts=database.ref('db_marketsfarmers/table_posts/Mua');
    listkeyposts.on('value',(snMua)=>{
        //kiểm tra có theo dõi ko
        snMua.forEach((dataMua)=>{
            followIs=database.ref('db_marketsfarmers/table_posts/Mua/'+dataMua.key+'/follow/'+this.props.uidSession);
            followIs//.child(this.props.uidSession)
            .once('value',(snap)=>{
                if(snap.exists()){
                    
                    table_hinhs=database.ref('db_marketsfarmers/table_posts/Mua/'+dataMua.key+'/images/');
                      table_hinhs.limitToFirst(1).on('value',(snapHinh)=>{
                        snapHinh.forEach((datahinh)=>{
                          //alert(datahinh.val().linkpost);
                          postKey.push(dataMua.key);
                          postFollow.push({
                        idpost:dataMua.key,
                        tieude:dataMua.val().tieude,
                        giaban:dataMua.val().giaban,
                        thoigiandang:dataMua.val().thoigiandang,
                        diachi_t:dataMua.val().diachi_t,
                        linkhinh:datahinh.val().linkpost,
                        muahayban:dataMua.val().muahayban

                    });                          
                        });
                      });
                }
            });
        });
        

        ///\BÁN

        listkeypostsB=database.ref('db_marketsfarmers/table_posts/Bán');
    listkeypostsB.on('value',(snBan)=>{
        //kiểm tra có theo dõi ko
        snBan.forEach((dataBan)=>{
            followIsB=database.ref('db_marketsfarmers/table_posts/Bán/'+dataBan.key+'/follow');
            followIsB.child(this.props.uidSession).once('value',(snapB)=>{
                if(snapB.exists()){
                    
                    table_hinhsB=database.ref('db_marketsfarmers/table_posts/Bán/'+dataBan.key+'/images/');
                      table_hinhsB.limitToFirst(1).on('value',(snapHinhB)=>{
                        snapHinhB.forEach((datahinhBan)=>{
                          //alert(datahinh.val().linkpost);
                          postKey.push(dataBan.key);
                          postFollow.push({
                        idpost:dataBan.key,
                        tieude:dataBan.val().tieude,
                        giaban:dataBan.val().giaban,
                        thoigiandang:dataBan.val().thoigiandang,
                        diachi_t:dataBan.val().diachi_t,
                        linkhinh:datahinhBan.val().linkpost,
                        muahayban:dataBan.val().muahayban
                    });                          
                        });
                      });
                }
            });
        });
        var postSK=[];
        postKey.sort(function(a, b){return b-a});
                  var postTamMain=[];
                  k=0;
                  
                  for(let i=0;i<postKey.length;i++){
                    for(let j=0;j<postFollow.length;j++){
                      if(postFollow[j].idpost===postKey[i]){
                        postTamMain[k]=postFollow[j];
                        k++;
                        tb_sk=database.ref('db_marketsfarmers/table_posts/'+postFollow[j].muahayban+'/'+postFollow[j].idpost+'/events');
                        tb_sk.on('value',(sn)=>{
                            sn.forEach((dt)=>{
                                postSK.push({
                                    idpost:postFollow[j].idpost,//idpost chứa sự kiện
                                    batdau:dt.val().batdau,
                                    ketthuc:dt.val().ketthuc,
                                    noidungsk:dt.val().noidungsk,
                                    tensk:dt.val().tensk,
                                    trangthai:dt.val().trangthai,
                                    tieude:postFollow[j].tieude,
                                    linkhinh:postFollow[j].linkhinh
                                });
                            });
                            if(i===postKey.length-1){
                                this.setState({dataSourceSuKien:ds.cloneWithRows(postSK)});
                            }
                        });
                      }
                    }
                  }
                  this.setState({dataSourceBaiDang:ds.cloneWithRows(postTamMain)});            
        });
    });
    lsshop=database.ref('db_marketsfarmers/table_shops/');
    shopfollow=[];
    lsshop.on('value',(sn)=>{
      sn.forEach((data)=>{
        //alert('-')
        shfollow=database.ref('db_marketsfarmers/table_shops/'+data.key+'/follow');
        shfollow.child(this.props.uidSession).once('value',(snf)=>{
          if(snf.exists()){
            database.ref('db_marketsfarmers/table_shops/').child(data.key).once('value',(data)=>{
              shopfollow.push({
                shopid:data.key,
          tencuahang:data.val().tencuahang,
          loaisp:data.val().loaisp,
          logoshop:data.val().logoshop,
              });         
              //alert('--')     
            });
          }
        });
      });  
      this.setState({dataSourceCuaHang:ds.cloneWithRows(shopfollow)});    
    });

  }
  _renderOptions(){
    switch (this.state.options) {
      case 1:
          return(
            <View>
              <ListView
                dataSource={this.state.dataSourceBaiDang}
                enableEmptySections={true}
                renderRow={(rowData)=>
                  <ItemListViewStatus uidSession={this.props.uidSession} propsNavigator={this.props.propsNavigator} obj={rowData}
                ></ItemListViewStatus>}
              />
            </View>
          );              
      case 2:
      return(
         <View>
              <ListView
          dataSource={this.state.dataSourceCuaHang}
          enableEmptySections={true}
          renderRow={(rowData)=><ItemShop uidSession={this.props.uidSession} sid={rowData.shopid} propsNavigator={this.props.propsNavigator} obj={rowData}
          ></ItemShop>}
        />
            </View>
      );
      case 3:
      return(
         <View>
              <ListView
          dataSource={this.state.dataSourceSuKien}
          enableEmptySections={true}
          renderRow={(rowData)=><ItemListEvents uidSession={this.props.uidSession} propsNavigator={this.props.propsNavigator} obj={rowData}
          ></ItemListEvents>}
        />
            </View>
      );
      
    };
  }
  btn_ShowTabBaiDang(){
      this.setState({options:1});
      this.setState({backgrTab1:'#0288D150',backgrTab2:'#0288D1',backgrTab3:'#0288D1'});
  }
  btn_ShowTabCuaHang(){
      this.setState({options:2});
this.setState({backgrTab1:'#0288D1',backgrTab2:'#0288D150',backgrTab3:'#0288D1'});
  }
  btn_ShowTabSuKien(){
      this.setState({options:3});
      this.setState({backgrTab1:'#0288D1',backgrTab2:'#0288D1',backgrTab3:'#0288D150'});
  }
  render(){
    return(
      <View style={{flex:1}}>
      <View style={{backgroundColor:'#03A9F4'}}>
      <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_Back_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_arrow_back_white_24dp.png')} /></TouchableHighlight></View>
        <View style={{flex:7,paddingLeft:5}}>
{/* SEARCH INPUT */}
        <Text style={{fontSize:20,color:'white',marginTop:10}}>Đang theo dõi</Text>
        </View>

{/* ICON BUTTON options */}
        <View style={{flex:1}}></View>
      </View>
      
        <View style={{flexDirection:'row',height:40}}>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:this.state.backgrTab1}}><Text style={{color:'white',fontSize:18}} onPress={()=>this.btn_ShowTabBaiDang()}>Bài Đăng</Text></View>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:this.state.backgrTab2}}><Text style={{color:'white',fontSize:18}} onPress={()=>this.btn_ShowTabCuaHang()}>Cửa hàng</Text></View>
          <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:this.state.backgrTab3}}><Text style={{color:'white',fontSize:18}} onPress={()=>this.btn_ShowTabSuKien()}>Sự kiện</Text></View>          
        </View>
        
      <View style={{height:1,backgroundColor:'#9E9E9Ed4'}}></View>
      <View style={{height:2,backgroundColor:'#BDBDBDc4'}}></View>
      <View style={{height:2,backgroundColor:'#E0E0E0'}}></View>
      </View>
      {this._renderOptions()}
      </View>
    );
  }
  btn_Back_Click(){
    this.props.propsNavigator.pop();
  }
}
