import React,{Component} from 'react'
import {Image,View,Text,TouchableHighlight} from 'react-native'

export default class ItemListEvents extends Component{
    constructor(props){
        super(props);
        this.state={
            colorTinhtrang:'black',
            colornoidung:'black',
            tt:0
        }
             
    }
    componentWillMount(){
        now=new Date();
        bd=new Date(this.props.obj.batdau);
        kt=new Date(this.props.obj.ketthuc);
        if(now>=bd){
            if(now<=kt)
                this.setState({colorTinhtrang:'green',tt:1});
            else
                this.setState({colorTinhtrang:'gray',colornoidung:'gray',tt:0});
        }else{
            this.setState({colorTinhtrang:'black',tt:2});
        }   
    }
    renderTrTr(){
        if(this.state.tt===0){
            return null;
        }else if(this.state.tt===1)
            return 'Đang diễn ra |  ';
        else
            return 'Sắp diễn ra |  ';
    }
    render(){
        return(
            <TouchableHighlight onPress={()=>{                
                this.props.propsNavigator.push({
                    screen:'StatusDetail',
                    uidSession:this.props.uidSession,
                    idPost:this.props.obj.idpost
                });
                }}>
            <View style={{borderBottomColor:'#B3E5FC',borderBottomWidth:1,padding:5,flexDirection:'row'}} >
                <View style={{flex:1,padding:5}}>
                    <Image source={{uri:this.props.obj.linkhinh}} resizeMode='contain' style={{width:80,height:80,borderWidth:1,borderColor:'#B3E5FC'}}/>
                </View>
                <View style={{flex:4,paddingLeft:10}}>
                    <Text style={{color:this.state.colorTinhtrang,fontSize:20,textDecorationLine:'underline'}} >{this.props.obj.tensk}</Text>
                    <Text style={{color:this.state.colorTinhtrang,fontSize:10,marginBottom:5}} >{this.renderTrTr()}Bài đăng {this.props.obj.tieude}</Text>
                    <Text style={{color:this.state.colornoidung,fontSize:15}} >{this.props.obj.noidungsk}</Text>
                    <Text style={{color:'gray',fontSize:12}} >{this.props.obj.batdau}  -->  {this.props.obj.ketthuc}</Text>
                </View>                
                </View>
            </TouchableHighlight>
        );
    }

}