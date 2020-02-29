let count = 0;

module.exports = function(req, res, next) {
  if (count == 5) {
    res.status(429).send();
  } else {
    count += 1;
    next();
  }
};
