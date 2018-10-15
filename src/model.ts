export class Commodity {
	constructor(
		public name: string, // 商品名
		public spotGoods: SpotGoods, // 现货
		public recentContracts: Contracts, // 最近合约
		public mainContracts: Contracts, // 主力合约
	) {
	}
}

export class SpotGoods {
	constructor(
		public price: number // 价格
	) {
	}
}


export class Contracts {
	constructor(
		public code: string, // 代码
		public price: number, // 价格
		public numbricValue: string, // 现期差数值
		public percentValue: string, // 现期差百分比
	) {
	}
}