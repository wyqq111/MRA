const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 确保初始化环境

exports.main = async (event, context) => {
  const db = cloud.database();
  const { category } = event; // 获取传入的分类参数

  try {
    // 从数据库中查询菜品
    const result = await db.collection('dishes').where({ category }).get();
    
    // 返回查询结果
    return {
      dishes: result.data,
    };
  } catch (error) {
    console.error('Failed to fetch dishes:', error);
    return {
      error: `Failed to fetch dishes: ${error.message}`,
    };
  }
};
