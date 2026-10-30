// These defaults are public Sauce Demo accounts, not production credentials.
export const users = {
  standard: {
    username: process.env.SWAG_USERNAME || 'standard_user',
    password: process.env.SWAG_PASSWORD || 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
};
