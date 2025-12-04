import { storage } from './storage'

const AccessToken = 'AUTH_TOKEN'

/**
 * 验证是否登录
 *
 * @returns token
 */
export function isLoggedIn() {
  const token = getAccessToken();
  // 注释掉频繁输出的日志
  // console.log('isLoggedIn check, token exists:', !!token);
  return token !== ''
}

/**
 * 获取登录授权 Token
 *
 * @returns token
 */
export function getAccessToken() {
  try {
    const token = storage.get(AccessToken) || '';
    return token;
  } catch (error) {
    console.error('Error in getAccessToken:', error);
    return '';
  }
}

/**
 * 设置登录授权 Token
 *
 * @returns token
 */
export function setAccessToken(token = '', expire = 60 * 60 * 2) {
  try {
    
    // 确保token不为空
    if (!token) {
      return false;
    }
    
    // 确保过期时间合理
    if (typeof expire !== 'number' || isNaN(expire) || expire <= 0) {
      expire = 60 * 60 * 2; // 默认2小时
    }
    
    // 尝试保存token
    storage.set(AccessToken, token, expire);
    
    // 验证是否成功保存
    const savedToken = storage.get(AccessToken);
    
    return !!savedToken;
  } catch (error) {
    console.error('Error in setAccessToken:', error);
    return false;
  }
}

/**
 * 删除登录授权 Token
 */
export function delAccessToken() {
  try {
    storage.remove(AccessToken);
    console.log('Token removed');
  } catch (error) {
    console.error('Error removing token:', error);
  }
}
