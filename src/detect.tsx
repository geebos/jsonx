/**
 * 在字符串中查找所有可能的 JSON 子字符串
 * @param str 要搜索的字符串
 * @returns 包含所有找到的 JSON 子字符串信息的数组
 */
export function findJsonSubstrings(str: string) {
  const results: Array<{
    start: number;
    end: number;
    content: string;
  }> = [];
  
  // 遍历所有可能的起始位置
  for (let i = 0; i < str.length; i++) {
    // 如果当前位置是 { 或 [
    if (str[i] === '{' || str[i] === '[') {
      let stack = 1;
      let j = i + 1;
      let inString = false;
      let escapeNext = false;
      let nextBracketPos = -1; // 记录下一个括号的位置
      
      // 继续查找直到找到匹配的结束括号
      while (j < str.length && stack > 0) {
        const char = str[j];
        
        // 处理字符串中的转义
        if (inString) {
          if (escapeNext) {
            escapeNext = false;
          } else if (char === '\\') {
            escapeNext = true;
          } else if (char === '"' && !escapeNext) {
            inString = false;
          }
        } else {
          // 处理括号匹配
          if (char === '"') {
            inString = true;
          } else if (char === '{' || char === '[') {
            stack++;
            // 记录第一个遇到的括号位置
            if (nextBracketPos === -1) {
              nextBracketPos = j;
            }
          } else if (char === '}' || char === ']') {
            stack--;
          }
        }
        
        j++;
      }
      
      // 如果找到了匹配的结束括号
      if (stack === 0) {
        const content = str.slice(i, j);
        // 记录位置和内容
        results.push({
          start: i,
          end: j,
          content
        });
        // 直接将 i 设置为当前 JSON 的结尾位置
        i = j - 1; // 减1是因为循环会自增
      } else if (nextBracketPos !== -1) {
        // 如果没有找到匹配的结束括号，但有记录下一个括号位置，直接跳转到该位置
        i = nextBracketPos - 1; // 减1是因为循环会自增
      } else {
        // 如果没有找到匹配的结束括号，也没有找到下一个括号位置，直接跳转到字符串结尾
        i = str.length;
      }
    }
  }
  
  return results;
}

// 使用示例
/*
const text = `
这是一个测试文本：
{"name": "John", "age": 30} 这是一个普通的 JSON
[1, 2, 3] 这是一个数组
{"nested": {"key": "value"}} 这是一个嵌套的 JSON
`;

const results = findJsonSubstrings(text);
console.log(results);
*/ 