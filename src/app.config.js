// export default defineAppConfig({
//   pages: [
//     'pages/index/index'
//   ],
//   window: {
//     backgroundTextStyle: 'light',
//     navigationBarBackgroundColor: '#fff',
//     navigationBarTitleText: 'WeChat',
//     navigationBarTextStyle: 'black'
//   }
// })
export default defineAppConfig({
  pages: [
    
    'pages/home/index',
    'pages/dining/index',
    'pages/choosing/index',
    'pages/about/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fcf7b6',
    navigationBarTitleText: '奇异妙妙餐厅',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    
     
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'images/home.png',         // 未选中图标
        selectedIconPath: 'images/home (1).png' 
      },
      {
        pagePath: 'pages/dining/index',
        text: '点餐',
        iconPath: 'images/cutlery.png',    
        selectedIconPath: 'images/cutlery (1).png' 
      },
      {
        pagePath: 'pages/choosing/index',
        text: '选座',
        iconPath: 'images/armchair.png',    
        selectedIconPath: 'images/armchair (1).png' 
      },
      {
        pagePath: 'pages/about/index',
        text: '我的',
        iconPath: 'images/girl.png',    
        selectedIconPath: 'images/girl (1).png' 
      }
    ],
   
    color: '#999999', // 默认字体颜色
    selectedColor: '#791ef1', // 选中时字体颜色
    backgroundColor: '#ffffff', // TabBar 背景颜色
    borderStyle: 'black' // TabBar 边框颜色
  
  },
  lazyCodeLoading: 'requiredComponents',
});