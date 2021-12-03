var express = require("express");
var router = express.Router();
const Book = require("../models").Book;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/* GET home page. -ORIGINAL NO SEARCH
  Put all books in a 'books' variable*/
// router.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     const books = await Book.findAll({});
//     res.render("index", { books });

//     //     // /*Assignment for first part to log books and render the json
//     //     // res.json(books);
//     //     // console.log(books);
//   })
// );

//Home page - all books WITH Search functionality
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // /Pagination. size refers to number per page. Default is 10. A portion of the pagination code was gathered from the very helpful tutorial from 'Programming with Basar' on Youtube.

    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }

    let size = 10;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
      size = sizeAsNumber;
    }

    //All books first
    const books = await Book.findAndCountAll({
      offset: page * size - size,
      limit: size,
    });

    //Searched books. Using the 'like' operator to get results that are similar, not necessarily exact matches.
    let query = req.query.search;
    const result = await Book.findAndCountAll({
      where: {
        [Op.or]: [
          {
            Title: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            Author: {
              [Op.like]: `%${query}%`,
            },
          },

          {
            Genre: {
              [Op.like]: `%${query}%`,
            },
          },

          {
            Year: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
      offset: page * size - size,
      limit: size,
    });

    if (query) {
      res.render("index", {
        books: result.rows,
        pages: Math.ceil(result.count / size),
      });
    } else {
      res.render("index", {
        books: books.rows,
        pages: Math.ceil(books.count / size),
      });
    }
  })
);

// /*Assignment for first part to log books and render the json-originally include in the home get.
// res.json(books);
// console.log(books);

/* Create a new book . */
router.get("/new-book", (req, res) => {
  res.render("new-book", { book: {}, title: "New book" });
});

/* POST new book added and redirects back to main book list (new books are appended at the end) */
router.post(
  "/new-book",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New book",
        });
      } else {
        throw error;
      }
    }
  })
);

/* Shows book detail form */
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    let id = req.params.id;
    const book = await Book.findByPk(id);
    if (book) {
      res.render("update-book", { book, title: book.title });
    } else {
      const err = new Error("page not found");
      err.status = 404;
      err.message = "I'm sorry but this book cannot be found";
      next(err);
    }
  })
);

/* Updates book info in the database */
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", {
          article,
          errors: error.errors,
          title: "Edit Book",
        });
      } else {
        throw error;
      }
    }
  })
);

/* Page to redirect to delete a book */
router.get(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    let id = req.params.id;
    const book = await Book.findByPk(id);
    if (book) {
      res.render("delete", { book });
    } else {
      res.sendStatus(404);
    }
  })
);

//Actual deletion
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    let id = req.params.id;
    const book = await Book.findByPk(id);
    if (book) {
      await book.destroy();
      res.redirect("/");
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;
