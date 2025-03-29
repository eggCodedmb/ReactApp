// 生成随机id
export const randomId = () => {
  return (
    'task(' +
    Math.random().toString(36).slice(2, 7) +
    Math.random().toString(36).slice(2, 7) +
    Math.random().toString(36).slice(2, 7) +
    ')'
  );
};
