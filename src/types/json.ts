/**
 * JSON 子字符串信息
 */
export interface JsonSubstring {
  /** 开始位置 */
  start: number;
  /** 结束位置 */
  end: number;
  /** 内容 */
  content: string;
}

/**
 * JSON 检测器接口
 */
export interface JsonDetector {
  /**
   * 在字符串中查找所有可能的 JSON 子字符串
   * @param str 要搜索的字符串
   * @returns 包含所有找到的 JSON 子字符串信息的数组
   */
  findJsonSubstrings(str: string): JsonSubstring[];
} 