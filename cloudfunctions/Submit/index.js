// // 云函数入口文件
// const cloud = require('wx-server-sdk');

// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 确保初始化环境

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const db = cloud.database();
//   const orders = db.collection('orders');
  
//   try {
//     // 插入订单信息到数据库
//     await orders.add({
//       data: {
//         seatNumber: event.seatNumber,
//         orderTime: event.orderTime,
//         totalPrice: event.totalPrice,
//         dishes: event.dishes
//       }
//     });
//     return { success: true };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const db = cloud.database();
  const orders = db.collection('orders');
  const dishesCollection = db.collection('dishes');

  try {
    // 确保 event.dishes 存在
    if (!event.dishes || !Array.isArray(event.dishes)) {
      return { success: false, error: 'Invalid dishes data' };
    }

    // 查询菜品的详细信息
    const dishIds = event.dishes.map(dish => dish.dishId);
    const dishDetails = await dishesCollection.where({
      _id: db.command.in(dishIds)
    }).get();

    const dishMap = dishDetails.data.reduce((acc, dish) => {
      acc[dish._id] = dish.name;
      return acc;
    }, {});

    const detailedDishes = event.dishes.map(dish => ({
      dishId: dish.dishId,
      name: dishMap[dish.dishId] || '未知',
      quantity: dish.quantity
    }));

    await orders.add({
      data: {
        seatNumber: event.seatNumber,
        orderTime: event.orderTime,
        totalPrice: event.totalPrice,
        dishes: detailedDishes
      }
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

