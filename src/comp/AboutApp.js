import React,{Component} from 'react'
import {View,Text,Image,TouchableHighlight} from 'react-native'

export default class AboutApp extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={{flex:1}} >
                <View style={{flexDirection:'row',backgroundColor:'#03A9F4'}}>
        <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.props.propsNavigator.pop()} 
            style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_arrow_back_white_24dp.png')} /></TouchableHighlight></View>
        <View style={{flex:7,paddingLeft:5}}>
{/* SEARCH INPUT */}
        <Text style={{fontSize:20,color:'white',marginTop:10}}>Thông tin ứng dụng</Text>
        </View>

{/* ICON BUTTON options */}
        <View style={{flex:1}}>{/*<TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_DangNhap_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_more_vert_white_24dp.png')} /></TouchableHighlight>
         */}
        </View>
      </View>
                <Image resizeMode='contain' source={{uri:'http://hcmute.edu.vn/Resources/Images/SubDomain/HomePage/Nut/logo-news.png'}} style={{height:150,width:'100%'}}/>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'red',fontSize:35,fontWeight:'bold'}}>Khóa Luận Tốt Nghiệp</Text>
                <Text style={{color:'green',fontSize:25}} >Khoa CNTT</Text>
                </View>
                <View style={{padding:10}} >
                <Text style={{color:'orange',fontSize:20}} >Đề tài: Tìm hiểu React Native và xây dựng ứng dụng minh họa.{"\n"}Năm học: HK2_2016-2017</Text>
                <Text style={{color:'black',fontSize:15}}>Giáo Viên Hướng Dẫn:{"\n"}      ThS.Nguyễn Trần Thi Văn</Text>
                <Text style={{color:'black',fontSize:15}}>Thành viên nhóm:{"\n"}      1.Nguyễn Đức Trung 13110182{"\n"}      2.Kiều Nữ Ngọc Dinh 13110017</Text>
                <Text style={{color:'black',fontSize:15}} >Nội dung thực hiện:{"\n"}- Xây dựng ứng dụng Chợ Nhà Nông, hổ trợ người người mua và người nông dân thuận lợi hơn cho việc sản xuất và mua bán các sản phẩm nông nghiệp, chăn nuôi. {"\n"}- Sử dụng React Native và các kiến thức liên quan để xây dựng ứng dụng di động cho hệ điều hành iOS và Android.</Text>
                </View>
            </View>
        );
    }
}