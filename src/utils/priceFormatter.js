/**
 * 价格格式化工具函数
 * 统一商品价格显示格式：两位小数 + 千分位分隔符
 */

/**
 * 格式化价格为统一格式
 * @param {number|string} price - 价格数值
 * @returns {string} 格式化后的价格字符串，如 "¥1,299.00"
 */
export const formatPrice = (price) => {
  // 处理空值或无效值
  if (price === null || price === undefined || price === '') {
    return '¥0.00'
  }
  
  // 转换为数字
  const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price)
  
  // 检查是否为有效数字
  if (isNaN(numPrice)) {
    console.warn('价格格式化失败，无效的价格值:', price)
    return '¥0.00'
  }
  
  // 格式化为两位小数
  const fixedPrice = numPrice.toFixed(2)
  
  // 添加千分位分隔符
  const parts = fixedPrice.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  return `¥${parts.join('.')}`
}

/**
 * 批量格式化价格数组
 * @param {Array} prices - 价格数组
 * @returns {Array} 格式化后的价格数组
 */
export const formatPrices = (prices) => {
  if (!Array.isArray(prices)) {
    console.warn('formatPrices: 参数必须是数组')
    return []
  }
  
  return prices.map(price => formatPrice(price))
}

/**
 * 格式化价格范围
 * @param {number} minPrice - 最低价格
 * @param {number} maxPrice - 最高价格
 * @returns {string} 格式化后的价格范围，如 "¥99.00 - ¥199.00"
 */
export const formatPriceRange = (minPrice, maxPrice) => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice)
  }
  
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
}

/**
 * 测试用例（开发时使用）
 */
export const testPriceFormatting = () => {
  const testCases = [
    99,           // 整数
    129.5,        // 一位小数
    199.00,       // 两位小数
    88.9,         // 一位小数
    0,            // 零
    null,         // 空值
    undefined,    // 未定义
    'invalid',    // 无效字符串
    1234.56,      // 千分位测试
    1234567.89,   // 百万分位测试
  ]
  
  console.log('=== 价格格式化测试 ===')
  testCases.forEach((price, index) => {
    console.log(`测试 ${index + 1}: ${price} -> ${formatPrice(price)}`)
  })
}