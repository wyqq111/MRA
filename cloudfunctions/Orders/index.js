// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const db = cloud.database();
//   const orders = db.collection('orders');
  
//   try {
//     const res = await orders.get();
//     return { orders: res.data };
//   } catch (error) {
//     return { orders: [], error: error.message };
//   }
// }
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const db = cloud.database();
  const orders = db.collection('orders');

  try {
    // 分页查询订单
    const result = await orders.skip(event.skip || 0).limit(event.limit || 100).get();
    const ordersData = result.data;

    // 查询菜品详细信息
    const dishIds = ordersData.flatMap(order => 
      order.dishes.map(dish => dish.dishId)
    );

    if (dishIds.length === 0) {
      return { orders: ordersData };
    }

    const dishDetails = await db.collection('dishes').where({
      _id: db.command.in(dishIds)
    }).get();

    const dishMap = dishDetails.data.reduce((acc, dish) => {
      acc[dish._id] = dish.name;
      return acc;
    }, {});

    const detailedOrders = ordersData.map(order => ({
      ...order,
      dishes: order.dishes.map(dish => ({
        ...dish,
        name: dishMap[dish.dishId] || '未知'
      }))
    }));

    return { orders: detailedOrders };
  } catch (error) {
    return { orders: [], error: error.message };
  }
};
