/* -------- Helper functions về faker -------- */
/**
 * Create a fake loading such as fake API
 * @param {Object} data Dữ liệu đầu vào
 * @param {*} data.data Dữ liệu sẽ được trả
 * @param {Function} data.func Function sẽ được gọi
 * @param {Number} data.millisecond Thời gian delay (millisecond)
 */
export const fakerLoading = ({ data, func = null, millisecond = 3000 }) => new Promise((resolve) => {
  setTimeout(() => {
    if (!func) {
      return resolve(data);
    }
    return resolve(func());
  }, millisecond);
});

export default fakerLoading;
