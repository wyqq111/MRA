import React from 'react';
import { View, Swiper, SwiperItem, Button, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.css';

// 引入图片
const image1 = require('../../images/1.jpg');
const image2 = require('../../images/2.jpg');
const image3 = require('../../images/3.jpg');
import eeeImg from '../../images/vegetarian (1).png';
import wwwImg from '../../images/online-shopping.png';

function Home() {
  return (
    <View className='home'>
      <Swiper className='swiper' indicatorDots autoplay interval={3000}>
        <SwiperItem>
          <View className='swiper-image' style={{ backgroundImage: `url(${image1})` }} />
        </SwiperItem>
        <SwiperItem>
          <View className='swiper-image' style={{ backgroundImage: `url(${image2})` }} />
        </SwiperItem>
        <SwiperItem>
          <View className='swiper-image' style={{ backgroundImage: `url(${image3})` }} />
        </SwiperItem>
        <SwiperItem>
          <View className='swiper-image' style={{ backgroundImage: `url(${image1})` }} />
        </SwiperItem>
      </Swiper>
      <View className='options'>
       
        <Button className='option-button' onClick={() => Taro.switchTab({ url: '/pages/choosing/index' })}>
           <Image src={eeeImg} className='icon-image' />
           <Text>堂食</Text>
        </Button>
        <Button className='option-button' onClick={() => Taro.switchTab({ url: '/pages/dining/index' })}>
          <Image src={wwwImg} className='icon-image' />
          <Text>外带</Text>
          </Button>

      </View>
    
    </View>
  );
}

export default Home;
