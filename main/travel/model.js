"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Commodity {
    constructor(name, // 商品名
    spotGoods, // 现货
    recentContracts, // 最近合约
    mainContracts) {
        this.name = name;
        this.spotGoods = spotGoods;
        this.recentContracts = recentContracts;
        this.mainContracts = mainContracts;
    }
}
exports.Commodity = Commodity;
class SpotGoods {
    constructor(price // 价格
    ) {
        this.price = price;
    }
}
exports.SpotGoods = SpotGoods;
class Contracts {
    constructor(code, // 代码
    price, // 价格
    numbricValue, // 现期差数值
    percentValue) {
        this.code = code;
        this.price = price;
        this.numbricValue = numbricValue;
        this.percentValue = percentValue;
    }
}
exports.Contracts = Contracts;
//# sourceMappingURL=model.js.map