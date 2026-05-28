function validateUsername(req, _res, next) {
  const { username } = req.params;
  const githubUsernamePattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

  if (!githubUsernamePattern.test(username)) {
    const error = new Error("Invalid GitHub username");
    error.statusCode = 400;
    error.details =
      "GitHub usernames may contain alphanumeric characters or hyphens, cannot begin or end with a hyphen, and are limited to 39 characters.";
    return next(error);
  }

  return next();
}

module.exports = {
  validateUsername
};
