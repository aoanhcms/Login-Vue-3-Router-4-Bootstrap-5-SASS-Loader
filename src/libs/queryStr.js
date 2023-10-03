
const splitStr = (url) => {
  const queryStartIndex = url.indexOf('?');

  if (queryStartIndex !== -1) {
      const queryString = url.slice(queryStartIndex + 1); // Lấy phần query sau dấu '?'
      const queryParams = queryString.split('&'); // Tách các tham số truy vấn thành mảng

    const queryObject = {};
    queryParams.forEach(param => {
        const [key, value] = param.split('=');
        queryObject[key] = value;
    });

    return queryObject
  }
  return {}
}
export default splitStr