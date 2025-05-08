/**
 * 将 JSON 字符串压缩为一行
 * @param jsonString 要压缩的 JSON 字符串
 * @returns 压缩后的 JSON 字符串，如果输入无效则返回原字符串
 */
export const compressJson = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (e) {
    console.error('Invalid JSON:', e);
    return jsonString;
  }
};

/**
 * 将字符串进行 JSON 转义
 * @param str 要转义的字符串
 * @returns 转义后的字符串
 */
export const escapeString = (str: string): string => {
  try {
    // 使用 JSON.stringify 进行转义，然后去掉首尾的引号
    return JSON.stringify(str).slice(1, -1);
  } catch (e) {
    console.error('String escape failed:', e);
    return str;
  }
};

/**
 * 将转义的字符串还原
 * @param str 要还原的转义字符串
 * @returns 还原后的字符串
 */
export const unescapeString = (str: string): string => {
  try {
    // 将字符串包装在引号中，然后使用 JSON.parse 解析
    return JSON.parse(`"${str}"`);
  } catch (e) {
    console.error('String unescape failed:', e);
    return str;
  }
};

/**
 * 更新 JSON 对象中指定路径的值
 * @param data 要更新的 JSON 对象
 * @param path 要更新的路径，使用点号分隔，支持数组索引，如：$.hobbies[2]
 * @param value 新的值
 * @returns 更新后的 JSON 对象
 */
export const updateJsonValue = (data: any, path: string, value: any): any => {
  // 如果是根节点（路径为 $），直接返回新值
  if (path === '$') {
    return value;
  }

  // 移除路径中的 $ 前缀
  const cleanPath = path.startsWith('$.') ? path.slice(2) : path;
  
  // 解析路径，处理数组索引
  const parsePath = (path: string): string[] => {
    const parts: string[] = [];
    let current = '';
    let inBracket = false;
    
    for (let i = 0; i < path.length; i++) {
      const char = path[i];
      
      if (char === '[') {
        if (current) {
          parts.push(current);
          current = '';
        }
        inBracket = true;
      } else if (char === ']') {
        if (current) {
          parts.push(current);
          current = '';
        }
        inBracket = false;
      } else if (char === '.' && !inBracket) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current) {
      parts.push(current);
    }
    
    return parts;
  };
  
  // 根据路径更新数据
  const updateValue = (obj: any, parts: string[]): any => {
    if (parts.length === 0) return value;
    
    const key = parts[0];
    const isArrayIndex = /^\d+$/.test(key);
    const index = isArrayIndex ? parseInt(key, 10) : key;
    
    if (parts.length === 1) {
      // 到达目标路径，更新值
      if (Array.isArray(obj)) {
        const newArray = [...obj];
        newArray[index as number] = value;
        return newArray;
      }
      return { ...obj, [key]: value };
    }
    
    // 递归更新子对象
    const currentValue = obj?.[index];
    if (Array.isArray(obj)) {
      const newArray = [...obj];
      newArray[index as number] = updateValue(currentValue, parts.slice(1));
      return newArray;
    }
    return {
      ...obj,
      [key]: updateValue(currentValue, parts.slice(1))
    };
  };

  return updateValue(data, parsePath(cleanPath));
}; 