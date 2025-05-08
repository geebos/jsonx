import { jsonDetector } from './json-detector';

describe('JsonDetector', () => {
  // 基本功能测试
  test('应该能识别简单的 JSON 对象', () => {
    const text = '{"name": "John", "age": 30}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('{"name": "John", "age": 30}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(27);
  });

  test('应该能识别简单的 JSON 数组', () => {
    const text = '[1, 2, 3]';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('[1, 2, 3]');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(9);
  });

  // 多个 JSON 字符串测试
  test('应该能识别多个 JSON 字符串', () => {
    const text = '{"a": 1} {"b": 2} [3, 4]';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(3);
    expect(results[0].content).toBe('{"a": 1}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(8);
    expect(results[1].content).toBe('{"b": 2}');
    expect(results[1].start).toBe(9);
    expect(results[1].end).toBe(17);
    expect(results[2].content).toBe('[3, 4]');
    expect(results[2].start).toBe(18);
    expect(results[2].end).toBe(24);
  });

  // 嵌套结构测试
  test('应该能识别嵌套的 JSON 结构', () => {
    const text = '{"nested": {"key": "value"}}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('{"nested": {"key": "value"}}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(28);
  });

  // 转义字符测试
  test('应该能正确处理转义字符', () => {
    const text = '{"escaped": "Line 1\\nLine 2\\tTabbed"}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('{"escaped": "Line 1\\nLine 2\\tTabbed"}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(37);
  });

  test('应该能正确处理引号转义', () => {
    const text = '{"quoted": "\\"quoted\\""}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('{"quoted": "\\"quoted\\""}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(24);
  });

  // Unicode 测试
  test('应该能正确处理 Unicode 字符', () => {
    const text = '{"unicode": "\\u4F60\\u597D"}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('{"unicode": "\\u4F60\\u597D"}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(27);
  });

  // 无效 JSON 测试
  test('应该能识别无效的 JSON 字符串', () => {
    const text = '{"invalid": json} {"valid": "json"}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(2);
    expect(results[0].content).toBe('{"invalid": json}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(17);
    expect(results[1].content).toBe('{"valid": "json"}');
    expect(results[1].start).toBe(18);
    expect(results[1].end).toBe(35);
  });

  // 位置信息测试
  test('应该返回正确的位置信息', () => {
    const text = 'prefix {"key": "value"} suffix';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('{"key": "value"}');
    expect(results[0].start).toBe(7);
    expect(results[0].end).toBe(23);
  });

  // 空输入测试
  test('应该处理空字符串', () => {
    const results = jsonDetector.findJsonSubstrings('');
    expect(results).toHaveLength(0);
  });

  // 无 JSON 测试
  test('应该处理不包含 JSON 的字符串', () => {
    const text = 'This is a normal string without any JSON';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(0);
  });

  // 性能优化测试
  test('应该正确跳过已识别的区间', () => {
    const text = '{"a": 1} {"b": 2} {"c": 3}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(3);
    expect(results[0].content).toBe('{"a": 1}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(8);
    expect(results[1].content).toBe('{"b": 2}');
    expect(results[1].start).toBe(9);
    expect(results[1].end).toBe(17);
    expect(results[2].content).toBe('{"c": 3}');
    expect(results[2].start).toBe(18);
    expect(results[2].end).toBe(26);
  });

  test('应该从下一个括号开始解析', () => {
    const text = '{"invalid": json} {"valid": "json"} {"another": "valid"}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(3);
    expect(results[0].content).toBe('{"invalid": json}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(17);
    expect(results[1].content).toBe('{"valid": "json"}');
    expect(results[1].start).toBe(18);
    expect(results[1].end).toBe(35);
    expect(results[2].content).toBe('{"another": "valid"}');
    expect(results[2].start).toBe(36);
    expect(results[2].end).toBe(56);
  });

  test('应该正确处理嵌套的无效 JSON', () => {
    const text = '{"outer": {"invalid": json}} {"valid": "json"}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(2);
    expect(results[0].content).toBe('{"outer": {"invalid": json}}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(28);
    expect(results[1].content).toBe('{"valid": "json"}');
    expect(results[1].start).toBe(29);
    expect(results[1].end).toBe(46);
  });

  test('应该正确处理连续的无效 JSON', () => {
    const text = '{"invalid1": json} {"invalid2": json} {"valid": "json"}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(3);
    expect(results[0].content).toBe('{"invalid1": json}');
    expect(results[0].start).toBe(0);
    expect(results[0].end).toBe(18);
    expect(results[1].content).toBe('{"invalid2": json}');
    expect(results[1].start).toBe(19);
    expect(results[1].end).toBe(37);
    expect(results[2].content).toBe('{"valid": "json"}');
    expect(results[2].start).toBe(38);
    expect(results[2].end).toBe(55);
  });

  test('应该正确处理混合的嵌套结构', () => {
    const text = `
      {"invalid": json}
      {"outer": {"inner": {"invalid": json}}}
      {"valid": "json"}
      [1, 2, 3]
    `;
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(4);
    expect(results[0].content).toBe('{"invalid": json}');
    expect(results[0].start).toBe(7);
    expect(results[0].end).toBe(24);
    expect(results[1].content).toBe('{"outer": {"inner": {"invalid": json}}}');
    expect(results[1].start).toBe(31);
    expect(results[1].end).toBe(70);
    expect(results[2].content).toBe('{"valid": "json"}');
    expect(results[2].start).toBe(77);
    expect(results[2].end).toBe(94);
    expect(results[3].content).toBe('[1, 2, 3]');
    expect(results[3].start).toBe(101);
    expect(results[3].end).toBe(110);
  });

  test('应该在遇到不完整的 JSON 时跳转到下一个括号位置', () => {
    const text = '{"incomplete": {"nested": } {"valid": "json"}';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(2);
    expect(results[0].content).toBe('{"nested": }');
    expect(results[0].start).toBe(15);
    expect(results[0].end).toBe(27);
    expect(results[1].content).toBe('{"valid": "json"}');
    expect(results[1].start).toBe(28);
    expect(results[1].end).toBe(45);
  });

  test('应该在遇到不完整的 JSON 且没有下一个括号时直接跳转到结尾', () => {
    const text = '{"incomplete": {"nested": } 这是一个普通文本';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('{"nested": }');
    expect(results[0].start).toBe(15);
    expect(results[0].end).toBe(27);
  });

  test('应该在遇到不完整的 JSON 且没有嵌套括号时直接跳转到结尾', () => {
    const text = '{"incomplete": "value" 这是一个普通文本';
    const results = jsonDetector.findJsonSubstrings(text);
    expect(results).toHaveLength(0);
  });
}); 