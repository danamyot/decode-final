export function arrayCapitalize(arr) {
  return arr.map(item => {
    if (typeof item !== "string") return item;
    return item.slice(0, 1).toUpperCase() + item.slice(1);
  });
}
