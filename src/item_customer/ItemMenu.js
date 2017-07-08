import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View,Image } from 'react-native';

export default class ItemMenu extends Component {


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
            animationType={"fade"}
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
                <Text>Hide Modal</Text>
              </TouchableHighlight>

            </View>
           </View>
          </Modal>

          <TouchableHighlight underlayColor='#FAFAFA' onPress={() => {
            this.setModalVisible(true)
          }}>
            <Image source={require('../img/ic_power_settings_new_black_24dp.png')} style={{width:25,height:25}}/>
          </TouchableHighlight>

        </View>
      );
    }
  }
