import React,{Component} from 'react';
import {View,Text,Image,StyleSheet,TextInput,ListView} from 'react-native';

export default class ItemShowAllImage extends Component {
  constructor(props){
    super(props);
    data=[
        {
          idh:1,
          imgsrc:"https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-1/c0.27.100.100/p100x100/16298502_1821740334734783_649746552886407600_n.jpg?oh=a82ab51c245047c0493edfc8a4252fac&oe=5930F951",
        },
        {
          idh:2,
          imgsrc:"https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-1/c0.27.100.100/p100x100/16298502_1821740334734783_649746552886407600_n.jpg?oh=a82ab51c245047c0493edfc8a4252fac&oe=5930F951",
        },
        {
          idh:3,
          imgsrc:"https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-1/c0.27.100.100/p100x100/16298502_1821740334734783_649746552886407600_n.jpg?oh=a82ab51c245047c0493edfc8a4252fac&oe=5930F951",
        },
        {
          idh:4,
          imgsrc:"https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-1/c0.27.100.100/p100x100/16298502_1821740334734783_649746552886407600_n.jpg?oh=a82ab51c245047c0493edfc8a4252fac&oe=5930F951",
        },
        {
          idh:5,
          imgsrc:"https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-1/c0.27.100.100/p100x100/16298502_1821740334734783_649746552886407600_n.jpg?oh=a82ab51c245047c0493edfc8a4252fac&oe=5930F951",
        },
        {
          idh:6,
          imgsrc:"https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-1/c0.27.100.100/p100x100/16298502_1821740334734783_649746552886407600_n.jpg?oh=a82ab51c245047c0493edfc8a4252fac&oe=5930F951",
        },
        {
          idh:7,
          imgsrc:"https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-1/c0.27.100.100/p100x100/16298502_1821740334734783_649746552886407600_n.jpg?oh=a82ab51c245047c0493edfc8a4252fac&oe=5930F951",
        },
        {
          idh:8,
          imgsrc:"https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-1/c0.27.100.100/p100x100/16298502_1821740334734783_649746552886407600_n.jpg?oh=a82ab51c245047c0493edfc8a4252fac&oe=5930F951",
        },
        {
          idh:9,
          imgsrc:"https://scontent.fsgn2-2.fna.fbcdn.net/v/t1.0-1/c0.27.100.100/p100x100/16298502_1821740334734783_649746552886407600_n.jpg?oh=a82ab51c245047c0493edfc8a4252fac&oe=5930F951",
        }
    ];
      const ds=new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});
      this.state={
        dataSource:ds.cloneWithRows(data),
      }
  }
  _renderRow(data){
    return(
      <View style={styles.box}>
        <Image source={{uri:data.imgsrc}} style={{width:'100%',height:'100%'}}>
          <Text>{data.idh}</Text>
        </Image>
      </View>
    );
  }
  render() {
    return(
      <View style={styles.conatiner}>
      <ListView
      renderRow={this._renderRow.bind(this)}
      dataSource={this.state.dataSource}
      contentContainerStyle={{flexDirection:'row',flexWrap:'wrap'}}
      pageSize={data.length}
      />
      </View>
    );

  }
}
const styles=StyleSheet.create({
  conatiner:{
    flex:1,
    alignItems:'center',
    padding:5
  },
  textInput:{
    width: 200,
    borderWidth: 1,
    borderColor:'black'
  },
  image:{
    width:200,
    height:200
  },
  box:{
    width:130,
    height:130,
    backgroundColor:'gray',
    borderWidth:1,
    borderColor:'white',
    justifyContent:'center',

  }
});
