import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Button,Picker} from '@tarojs/components';
import { AtIcon, AtList, AtListItem  } from 'taro-ui';
import './index.css';
import defaultImage from '../../images/1.jpg';

const Index = () => {
  //分类
  const [categories, setCategories] = useState([]);
  //菜品列表
  const [dishes, setDishes] = useState([]);
  //选中的分类
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState('');
  // 用于存储每个菜品的数量
  const [cart, setCart] = useState({}); 
  const [totalPrice, setTotalPrice] = useState(0);
  const [seatNumber, setSeatNumber] = useState(null);
  // 获取菜品分类
  const fetchCategories = async () => {
    try {
      const res = await Taro.cloud.callFunction({ name: 'Categories' });
      console.log('Categories response:', res.result);
      if (res.result && Array.isArray(res.result.categories)) {
        setCategories(res.result.categories);
        if (res.result.categories.length > 0) {
          setSelectedCategory(res.result.categories[0].category);
        }
      } else {
        setError('No categories found in the response');
      }
    } catch (error) {
      setError(`Failed to fetch categories: ${error.message}`);
    }
  };

  // 获取菜品
  const fetchDishes = async (category) => {
    try {
      const res = await Taro.cloud.callFunction({ name: 'Dishes', data: { category } });
      console.log('Dishes response:', res.result);
      if (res.result && Array.isArray(res.result.dishes)) {
        setDishes(res.result.dishes);
        // 初始化购物车状态
        const initialCart = res.result.dishes.reduce((acc, dish) => {
          acc[dish._id] = 0;
          return acc;
        }, {});
        setCart(initialCart);
      } else {
        setError('No dishes found in the response');
      }
    } catch (error) {
      setError(`Failed to fetch dishes: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchDishes(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const app = Taro.getApp();
    const selectedSeat = app.globalData.selectedSeat;

    if (selectedSeat) {
      setSeatNumber(selectedSeat);
    } else {
      Taro.showToast({
        title: '未选择座位',
        icon: 'none'
      });
    }
  }, []);

  const getImageSrc = (imageName) => {
    try {
      const imagePath = require(`../../images/${imageName}`);
      return imagePath;
    } catch (error) {
      return defaultImage;
    }
  };

  const handleIncrease=(dishId,price)=>{
   setCart(prevCart=>{
    const newQuantity=(prevCart[dishId]||0)+1;
    const newCart={...prevCart,[dishId]:newQuantity};
    updateTotalPrice(newCart);
    return newCart;
   })
  }
  const handleDecrease=(dishId,price)=>{
    setCart(prevCart=>{
      const newQuantity=Math.max((prevCart[dishId]||0)-1,0);
      const newCart={...prevCart,[dishId]:newQuantity};
      updateTotalPrice(newCart);
      return newCart;

    });
  };


// 更新总价格
const updateTotalPrice = (newCart) => {
  const newTotalPrice = Object.keys(newCart).reduce((total, dishId) => {
    const dish = dishes.find(d => d._id === dishId); // 查找当前菜品的价格
    const dishPrice = dish ? dish.price : 0; // 获取菜品价格，若未找到则为 0
    return total + (newCart[dishId] * dishPrice); // 计算总价格
  }, 0);
  setTotalPrice(newTotalPrice);
};
const handleCheckout = async () => {
  if (!seatNumber) {
    Taro.showToast({
      title: '座位号未选择',
      icon: 'none'
    });
    return;
  }

  const orderDetails = {
    seatNumber,
    orderTime: new Date().toISOString(),
    totalPrice,
    dishes: Object.entries(cart).map(([dishId, quantity]) => ({ dishId, quantity }))
  };

  try {
    await Taro.cloud.callFunction({
      name: 'Submit',
      data: orderDetails
    });
    Taro.showToast({
      title: '订单提交成功',
      icon: 'success'
    });

    setCart({});
    setTotalPrice(0);
  } catch (error) {
    Taro.showToast({
      title: `订单提交失败: ${error.message}`,
      icon: 'none'
    });
  }
};

  return (
    <View className="container">
      {error && <Text className="error-message">{error}</Text>}
     
      <View className="categories">
      <Text>您的座位号: {seatNumber || '加载中...'}</Text>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <Button
              key={cat._id}
              className={`category-item ${selectedCategory === cat.category ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(cat.category)}
            >
              {cat.category}
            </Button>
          ))
        ) : (
          <Text>Loading categories...</Text>
        )}
      </View>
      <View className="dishes">
        {dishes.length > 0 ? (
          dishes.slice(0, 5).map((dish) => (
            <View key={dish._id} className="dish-item">
              <Image
                className="dish-image"
                src={getImageSrc(dish.image)}
                onError={(e) => { e.target.src = defaultImage; }}
              />
              <View className="dish-details">
                <Text className="dish-name">{dish.name}</Text>
                <Text className="dish-price">¥{dish.price}</Text>
                <View className="dish-controls">
                  <Button
                    className="control-button"
                    onClick={() => handleDecrease(dish._id, dish.price)}
                  >
                    - 
                  </Button>
                  <Text className="dish-quantity">{cart[dish._id] || 0}</Text>
                  <Button
                    className="control-button"
                    onClick={() => handleIncrease(dish._id, dish.price)}
                  >
                    + 
                  </Button>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>No dishes available</Text>
        )}
      </View>
      {/* <View className="cart">
      <AtIcon value="shopping-bag" size="25" color="#791ef1" className="cart-icon" />
        <Text className="cart-total">合计 ¥{totalPrice.toFixed(2)}</Text>
        
      </View> */}
      <View className="cart">
  <View className="cart-icon-container">
    <AtIcon value="shopping-bag" size="25" color="#791ef1" className="cart-icon" />
    {Object.values(cart).reduce((total, qty) => total + qty, 0) > 0 && (
      <View className="cart-count">{Object.values(cart).reduce((total, qty) => total + qty, 0)}</View>
    )}
  </View>
  <Text className="cart-total">合计 ¥{totalPrice.toFixed(2)}</Text>
  <Button className="cart-button" onClick={handleCheckout}>结算</Button>
</View>

    </View>
  );
};

export default Index;

