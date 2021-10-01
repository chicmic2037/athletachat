const config = require('config');

exports.getResetPassword = (token, _id) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Password</title>
      </head>
      <body>
        <form class="login-form" action="${config.get(
        'BASE_URL'
    )}admin/resetPassword" method="POST">
          <div class="form-control">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" required />
          </div>
          <input type="hidden" value="${token}" name="token" />
          <input type="hidden" value="${_id}" name="userId" />
          <button class="btn" type="submit">Update Password</button>
        </form>
      </body>
    </html>
    `;
};

exports.sendVerifyLink = (token, email) => {
    return `  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Link</title>
    </head>
    <body>
      <form method="post" action="${config.get('BASE_URL')}customer/verifyLink">
        <input type="hidden" name="token" value="${token}" />
        <input type="hidden" name="email" value="${email}" />
        <button type="submit">
          Verify Link
        </button>
      </form>
    </body>
  </html>`;
};


