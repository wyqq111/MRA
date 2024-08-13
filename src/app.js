import React, { useState, useEffect } from 'react';

import Taro from '@tarojs/taro';
import { useLaunch } from '@tarojs/taro';
import { View } from '@tarojs/components';
import 'taro-ui/dist/style/index.scss';

import './app.css';

function App({ children }) {
  const [globalData,setGlobalData] = useState({
    selectedSeat: null, // 用于存储选座信息
  });
  useLaunch(() => {
    console.log('App launched.');

    // Initialize cloud development environment
    Taro.cloud.init({
      env: 'ypt-1101-2g8uaqg15c043413', 
      traceUser: true,
    });
  });
  Taro.getApp = () => ({
    globalData,
    setGlobalData,
  });

  return (
    <View className='app'>
      {children}
      {/* <TabBar /> */}
    </View>
  );
}

export default App;
