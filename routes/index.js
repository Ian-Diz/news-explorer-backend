const router = require("express").Router();
const articles = require("./articles");
const user = require("./users");
const NotFoundError = require("../errors/NotFoundError");
const { login, createUser } = require("../controllers/user");
const auth = require("../middlewares/auth");
const {
  validateUserInfo,
  validateUserLogin,
} = require("../middlewares/validator");

router.use("/articles", auth, articles);

router.use("/users", auth, user);

router.post("/signin", validateUserLogin, login);

router.post("/signup", validateUserInfo, createUser);

router.use(auth, () => {
  throw new NotFoundError("This route does not exist");
});

module.exports = router;
