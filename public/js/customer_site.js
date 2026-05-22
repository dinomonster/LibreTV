// 站点本地覆盖/补充源可以放在这里。
// 如果不需要额外扩展，保持为空对象即可。
const CUSTOMER_SITES = {};

// 调用全局方法合并
if (window.extendAPISites) {
    window.extendAPISites(CUSTOMER_SITES);
} else {
    console.error("错误：请先加载 config.js！");
}
