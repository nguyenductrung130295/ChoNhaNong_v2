import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'

export default class ItemTimePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      time: '20:00',

    };
  }



  render(){
    return (

      <DatePicker
          style={{width: 200}}
          date={this.state.time}
          mode="time"
          format="HH:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          minuteInterval={10}
          onDateChange={(time) => {this.setState({time: time});}}
        />

    )
  }
}
