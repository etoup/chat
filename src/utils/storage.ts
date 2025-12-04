interface IStorage {
  setItem(key: string, value: any): void
  getItem(key: string): any
  removeItem(key: string): void
  clear(): void
  length?: number
  key?(index: number): string | null
}

class Storage {
  // 缓存前缀
  prefix = ''

  // 缓存驱动
  storage: IStorage = localStorage

  constructor(prefix = '', storage: IStorage) {
    this.prefix = prefix
    this.storage = storage
  }

  cacheKey(key: string) {
    return `${this.prefix}_${key}`.toUpperCase()
  }

  get(key: string, def: any = '') {
    try {
      const cacheKey = this.cacheKey(key);
      
      const item = this.storage.getItem(cacheKey);
      
      if (!item) {
        return def;
      }
  
      try {
        const { value, expire } = JSON.parse(item);
  
        // 在有效期内直接返回
        if (expire === null || expire >= Date.now()) {
          return value;
        }
  
        this.remove(key);
      } catch (e) {
        console.warn(`Storage: Error parsing item for key: ${cacheKey}`, e);
      }
  
      return def;
    } catch (error) {
      console.error(`Storage: Error in get for key: ${key}`, error);
      return def;
    }
  }

  /**
   * 设置缓存
   *
   * @param {String} key // 缓存KEY
   * @param {Any} value // 缓存值
   * @param {Number|null} expire // 缓存时间单位秒
   */
  set(key: string, value: any, expire: number | null = 60 * 60 * 24) {
    try {
      const cacheKey = this.cacheKey(key);
      const expireTime = expire !== null ? new Date().getTime() + expire * 1000 : null;
      const dataToStore = JSON.stringify({
        value,
        expire: expireTime
      });
      
      console.log(`Storage: Setting item with key: ${cacheKey}, expires: ${expireTime}`);
      
      try {
        // 检查存储限制
        if (this.storage === localStorage) {
          const testKey = `__storage_test_${Date.now()}`;
          localStorage.setItem(testKey, '1');
          localStorage.removeItem(testKey);
        }
        
        this.storage.setItem(cacheKey, dataToStore);
        console.log(`Storage: Successfully set item with key: ${cacheKey}`);
        
        // 验证设置是否成功
        const storedItem = this.storage.getItem(cacheKey);
        if (!storedItem) {
          console.warn(`Storage: Verification failed for key: ${cacheKey}`);
          return false;
        }
        
        return true;
      } catch (e) {
        if (e instanceof DOMException && (
          // Chrome
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          e.name === 'QuotaExceededError' ||
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        ) {
          console.error('Storage: localStorage quota exceeded');
          
          // 尝试清理一些旧数据
          this.cleanOldItems();
          
          // 再次尝试保存
          try {
            this.storage.setItem(cacheKey, dataToStore);
            return true;
          } catch (retryError) {
            console.error('Storage: Failed to save item even after cleanup');
            return false;
          }
        } else {
          console.error(`Storage: Error setting item with key: ${cacheKey}`, e);
          return false;
        }
      }
    } catch (error) {
      console.error(`Storage: Error in set for key: ${key}`, error);
      return false;
    }
  }

  remove(key: string) {
    try {
      const cacheKey = this.cacheKey(key);
      console.log(`Storage: Removing item with key: ${cacheKey}`);
      this.storage.removeItem(cacheKey);
    } catch (error) {
      console.error(`Storage: Error removing item with key: ${key}`, error);
    }
  }

  clear() {
    try {
      console.log('Storage: Clearing all items');
      this.storage.clear();
    } catch (error) {
      console.error('Storage: Error clearing storage', error);
    }
  }
  
  // 清理过期项目
  cleanOldItems() {
    try {
      console.log('Storage: Cleaning old items');
      const now = Date.now();
      
      // 只处理带有前缀的项目
      if (typeof this.storage.length === 'number' && typeof this.storage.key === 'function') {
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key && key.startsWith(this.prefix)) {
            try {
              const item = this.storage.getItem(key);
              if (item) {
                const { expire } = JSON.parse(item);
                if (expire && expire < now) {
                  console.log(`Storage: Removing expired item: ${key}`);
                  this.storage.removeItem(key);
                }
              }
            } catch (e) {
              // 跳过解析错误的项目
            }
          }
        }
      } else {
        console.log('Storage: Cannot clean old items, storage interface does not support enumeration');
      }
    } catch (error) {
      console.error('Storage: Error cleaning old items', error);
    }
  }
}

export default Storage

export const storage = new Storage('im', localStorage)
