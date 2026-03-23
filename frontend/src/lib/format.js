export function formatDate(dateString) {
  if (!dateString) {
    return "档期未定";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(dateString));
}

export function formatRating(value) {
  if (value === null || value === undefined) {
    return "暂无";
  }

  return Number(value).toFixed(1);
}

export function formatCount(count) {
  if (!count) {
    return "暂无评分";
  }

  return `${count} 人评分`;
}

