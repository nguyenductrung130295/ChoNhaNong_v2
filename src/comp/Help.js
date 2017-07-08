import React,{Component} from 'react'
import {View,Text,Image,TouchableHighlight} from 'react-native'

export default class Help extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={{flex:1}} >
                <Image source={require('../img/help.jpg')} style={{width:'100%',height:'100%'}} resizeMode='contain'>
                    <View style={{flexDirection:'row',backgroundColor:'#00000000',borderBottomColor:'white',borderBottomWidth:1}}>
        <View style={{flex:1}}><TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.props.propsNavigator.pop()} 
            style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_arrow_back_white_24dp.png')} /></TouchableHighlight></View>
        <View style={{flex:7,paddingLeft:5}}>
{/* SEARCH INPUT */}
        <Text style={{fontSize:20,color:'white',marginTop:10}}>Liên hệ</Text>
        </View>

{/* ICON BUTTON options */}
        <View style={{flex:1}}>{/*<TouchableHighlight underlayColor='#E0F7FA' onPress={()=>this.btn_DangNhap_Click()} style={{width:40,height:40,marginTop:5,borderRadius:20}}><Image source={require('../img/ic_more_vert_white_24dp.png')} /></TouchableHighlight>
         */}
        </View>
        </View>
        <Text style={{color:'white',fontSize:20,marginTop:40,marginLeft:10}}>Email 1: trungnguyencntt1302@gmail.com {'\n'}
            Email 2: 13110182@student.hcmute.edu.vn {'\n'}
            Email 3: dinhdieu138@gmail.com {'\n'}
            SĐT 1: 0963576506 (Trung) {'\n'}
            SĐT 2: 0963576506 (Dinh) {'\n'}
        </Text>
                </Image>
            </View>
        );
    }
}