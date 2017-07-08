/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
//index chợ nhà nông
import React,{Component} from 'react';
import {
  AppRegistry
} from 'react-native';
//import HomeGuest from './src/comp/HomeGuest';
//import ItemListViewStatus from './src/item_customer/ItemListViewStatus';
//import GuestMain from './src/comp/GuestMain';
//import InfoPersonal from './src/comp/InfoPersonal';
//import Messendger from './src/comp/Messendger';
//import StatusDetail from './src/comp/StatusDetail';
//import ItemCommand from './src/item_customer/ItemCommand';
//import FirstDisplay from './src/comp/FirstDisplay';
//import Login from './src/comp/Login';
//import Register from './src/comp/Register';


//chạy navigator điều khiển chuyển trang đầu tiên
//import Demo from './Demo';
import NavigatorMain from './src/comp/NavigatorMain';
AppRegistry.registerComponent('ChoNhaNong_v2', ()=>NavigatorMain);
