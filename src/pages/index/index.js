import { flow } from 'lodash';

const delay = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef

Page({
	data: {
		motto: 'Hello World',
		userInfo: {
			avatarUrl: 'https://pic2.zhimg.com/6c3e4f09100f35d70c4f7ab86b0a68c1_xll.jpg',
			nickName: 'LucasHC'
		},
	},
	// 事件处理函数
	bindViewTap() {
		wx.navigateTo({
			url: '../logs/logs',
		})
	},
	async onLoad() {
		await delay()

		const log = flow(() => {
			console.log('is wechat mini program: ', __WECHAT__);
			console.log('is ali mini program: ', __ALIPAY__);
			console.log('is baidu mini program: ', __BAIDU__);
			console.log('DEV: ', __DEV__);
		})

		log()

		// 调用应用实例的方法获取全局数据
		app.getUserInfo(userInfo => {
			// 更新数据
			this.setData({ userInfo })
		})
	},
});
