import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Image,TextInput,
Picker,Button } from 'react-native';

export default class ItemModalRegisterStore extends Component {
  constructor(props){
    super(props);
    this.state = {
      modalVisible: false,
    };
  }


  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }



  render() {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
          <View>
              <Image source={require('../img/thaole.jpg')} style={{width:100,height:100,marginTop:10,marginLeft:10,borderColor:'white',borderWidth:1,borderRadius:100}}/>
              <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here "/>
          <Picker
    selectedValue={this.state.language}
    onValueChange={(lang) => this.setState({language: lang})}>
    <Picker.Item label="Trái Cây" value="java" />
    <Picker.Item label="Gia Cầm" value="js" />
          </Picker>

            <Button onPress={()=>this.btn_DangNhap_Click()} title={'Đăng Ký'} color='pink'></Button>

      </View>
            <TouchableHighlight underlayColor='#FAFAFA' onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>

        <TouchableHighlight underlayColor='#FAFAFA' onPress={() => {
          this.setModalVisible(true)
        }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>

      </View>
    );
  }
  btn_DangNhap_Click(){
    alert('button danh nhap dc click');
  }
}
