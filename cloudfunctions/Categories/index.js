const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 确保初始化环境

exports.main = async (event, context) => {
  const db = cloud.database();
  console.log('Fetching categories from database...'); // 增加日志

  try {
    const result = await db.collection('categories').get();
    console.log('Categories fetched:', result.data); // 打印查询结果

    if (result.data && Array.isArray(result.data)) {
      return {
        categories: result.data,
      };
    } else {
      throw new Error('No categories found or data format is incorrect');
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return {
      error: `Failed to fetch categories: ${error.message}`,
    };
  }
};
