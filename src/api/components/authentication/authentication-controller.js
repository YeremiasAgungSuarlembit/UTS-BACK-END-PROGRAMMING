const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
var count = 0;
var timeout = false;
var timeoutStartTime;

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Tambah counter percobaaan ketika gagal login
      count = count + 1;

      // Jika sudah mencoba 5 kali maka akan di timeout selama 30 menit
      if (count == 5) {
        // Set timeout true dan simpan waktu timeout
        timeout = true;
        timeoutStartTime = Date.now();
        setTimeout(
          () => {
            timeout = false;
          },
          30 * 60 * 1000
        );
        throw errorResponder(
          errorTypes.INVALID_CREDENTIALS,
          'Wrong email or password Attempt - ' +
            count +
            ' Try Again in 30 Minutes'
        );
      }

      // Jika timeout true maka percobaan login akan throw error
      if (timeout == true) {
        const remainingTime = 30 * 60 * 1000 - (Date.now() - timeoutStartTime);
        throw errorResponder(
          errorTypes.INVALID_CREDENTIALS,
          `Limit Reached Try Again in ${Math.ceil(remainingTime / (60 * 1000))} Minutes`
        );
      }

      // Jika gagal login maka akan throw error
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password Attempt - ' + count
      );
    }

    // Reset Counter jika Berhasil Login
    count = 0;
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
