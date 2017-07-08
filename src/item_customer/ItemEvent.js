import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View,TextInput,Button } from 'react-native';
import ItemDatePicker from './ItemDatePicker';
import ItemTimePicker from './ItemTimePicker';
export default class ModalExample extends Component {

  state = {
    modalVisible: false,
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
            <Text>Hello World!</Text>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
            <View>
              <Text>Tạo sự kiện</Text>
              <Text>Ngày Bắt Đầu</Text>
              <ItemDatePicker/>
              <Text>Ngày Kết Thúc</Text>
              <ItemDatePicker/>
              <TextInput style={{height: 40}} placeholder="Nhập Tên Sự Kiện"/>
              <TextInput style={{height: 40}} placeholder="Nhập lời nhắc..."/>
              <ItemTimePicker/>
              <Button onPress={()=>this.btn_Taosukien_Click()} title={'Đăng nhập'} color='green'></Button>
</View>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>

        <TouchableHighlight onPress={() => {
          this.setModalVisible(true)
        }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>

      </View>
    );
  }
  btn_Taosukien_Click(){
    alert('button tao su kien dc click');
  }
}
