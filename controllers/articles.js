const Article = require("../models/article");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

module.exports.addArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;

  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => {
      res.status(201);
      res.send({ data: article });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Data provided is invalid"));
      } else {
        next(err);
      }
    });
};

module.exports.removeArticle = (req, res, next) => {
  const owner = req.user._id;

  Article.findById(req.params.articleId)
    .orFail(() => {
      throw new NotFoundError("Article with this ID does not exist");
    })
    .then((article) => {
      if (String(article.owner) !== owner) {
        return next(
          new ForbiddenError(
            "You do not have permission to remove this resource"
          )
        );
      }

      return article.deleteOne().then(() => res.send({ data: article }));
    })
    .catch(next);
};
