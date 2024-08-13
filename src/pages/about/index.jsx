// import React, { useState, useEffect } from 'react';
// import Taro from '@tarojs/taro';
// import { View, Text } from '@tarojs/components';
// import './index.css';

// const About = () => {
//   const [orders, setOrders] = useState([]);

//   const fetchOrders = async () => {
//     try {
//       const res = await Taro.cloud.callFunction({ name: 'Orders' });
//       if (res.result && Array.isArray(res.result.orders)) {
//         setOrders(res.result.orders);
//       } else {
//         Taro.showToast({
//           title: '没有订单信息',
//           icon: 'none'
//         });
//       }
//     } catch (error) {
//       Taro.showToast({
//         title: `获取订单失败: ${error.message}`,
//         icon: 'none'
//       });
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
   
//       <View className="about-container">
//         <Text className="title">订单信息</Text>
//         {orders.length > 0 ? (
//           orders.map((order) => (
//             <View key={order._id} className="order-item">
//               <Text>座位号: {order.seatNumber}</Text>
//               <Text>下单时间: {new Date(order.orderTime).toLocaleString()}</Text>
//               <Text>总金额: ¥{parseFloat(order.totalPrice).toFixed(2)}</Text>
//               <Text>菜品:</Text>
//               {Array.isArray(order.dishes) ? (
//                 order.dishes.map((dish) => (
//                   <Text key={dish.dishId}>{dish.name}: {dish.quantity}份</Text>
//                 ))
//               ) : (
//                 <Text>菜品信息不正确</Text>
//               )}
//             </View>
//           ))
//         ) : (
//           <Text>暂无订单信息</Text>
//         )}
//       </View>
//     );
    
  
// };

// export default About;
import React, { useState,useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Swiper, SwiperItem } from '@tarojs/components';
import './index.css';

const About = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await Taro.cloud.callFunction({ name: 'Orders' });
      setOrders(res.result.orders);
    } catch (error) {
      Taro.showToast({
        title: `Failed to fetch orders: ${error.message}`,
        icon: 'none'
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDrawer = () => {
    setSelectedOrder(null);
  };

  return (
    <View className="about-container">
      <Text className="title">我的订单</Text>
      {orders.length > 0 ? (
        orders.map((order) => (
          <View key={order._id} className="order-item">
            <Text>座位号: {order.seatNumber}</Text>
            <Text>下单时间: {new Date(order.orderTime).toLocaleString()}</Text>
            <Text>总金额: ¥{parseFloat(order.totalPrice).toFixed(2)}</Text>
            <Button onClick={() => handleOrderClick(order)}>查看详情</Button>
          </View>
        ))
      ) : (
        <Text>暂无订单信息</Text>
      )}

      {selectedOrder && (
        <View className="drawer">
          <Button className="close-button" onClick={handleCloseDrawer}>关闭</Button>
          <View className="drawer-content">
            <Text>座位号: {selectedOrder.seatNumber}</Text>
            <Text>下单时间: {new Date(selectedOrder.orderTime).toLocaleString()}</Text>
            <Text>总金额: ¥{parseFloat(selectedOrder.totalPrice).toFixed(2)}</Text>
            <View className="dish-list">
              <Text>菜品:</Text>
              {Array.isArray(selectedOrder.dishes) ? (
                selectedOrder.dishes.map((dish) => (
                  <Text key={dish.dishId}>{dish.name}: {dish.quantity}份</Text>
                ))
              ) : (
                <Text>菜品信息不正确</Text>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default About;
