const response = require("../utils/response");
const { isFilled, isExists } = require("../utils/validator");
const bookModel = require("../models/book");
const pagination = require("../utils/pagination");

const imgConvert = require("image-convert");
const fs = require("fs");

require("dotenv").config();

module.exports = {
  popular: async (req, res) => {
    const { APP_URL } = process.env;
    const data = await bookModel.popular();
    return res.status(200).send(
      response(
        true,
        data.map((val, index) => ({
          ...val,
          ...{ image: `${APP_URL}public/uploads/books/${val.image}` },
        })),
        "List popular"
      )
    );
  },
  review: async (req, res) => {
    const { review, stars } = req.body;
    const userId = req.me.id;
    const { id: bookId } = req.params;

    if (!isFilled({ review, stars, bookId })) {
      return res
        .status(400)
        .send(
          response(false, req.body, "book_id, review, stars must be valid data")
        );
    }

    if (!isExists({ id: bookId }, "books")) {
      return res.status(400).send(response(false, req.body, "book_id"));
    }

    const createReview = await bookModel.review({
      book_id: bookId,
      user_id: userId,
      reviews: review,
      stars,
    });
    if (createReview) {
      return res
        .status(201)
        .send(response(true, req.body, "Review successfully created"));
    } else {
      return res
        .status(500)
        .send(response(false, req.body, "internal server error"));
    }
  },
  get: async (req, res) => {
    const { APP_URL } = process.env;

    const data = await pagination(req.query, bookModel, "books", "books");
    data.data = data.data.map((val, index) => {
      return {
        ...val,
        ...{ image: `${APP_URL}public/uploads/books/${val.image}` },
      };
    });

    return res
      .status(200)
      .send(
        response(data.success, data.data, data.msg, { pageInfo: data.pageInfo })
      );
  },
  getOne: async (req, res) => {
    const { id } = req.params;
    const { APP_URL } = process.env;

    const bookExists = await isExists({ id }, "books");
    if (!bookExists)
      return res.status(404).send(response(false, { id }, "Book is not found"));

    const reviews = await bookModel.getReview(id);
    const score = await bookModel.getScore(id);
    const data = await bookModel.getOne({ id });
    const newReviews = await reviews.map((val, index) => ({
      ...val,
      profile:
        val.profile !== null
          ? `${APP_URL}public/uploads/profile/`.concat(val.profile)
          : null,
    }));
    const result = {
      ...data.data,
      ...{ image: `${APP_URL}public/uploads/books/` + data.data.image },
      histories: data.histories,
      ...{ newReviews, score },
    };
    return res.status(200).send(response(true, result, `Book with ID #${id}`));
  },
  post: async (req, res) => {
    const {
      title,
      description,
      genre_id: genreId,
      author_id: authorId,
    } = req.body;

    const data = {
      ...req.body,
      ...{ image: req.file ? req.file.filename : null },
    };

    if (!isFilled({ title, description, genreId, authorId, file: req.file })) {
      if (req.file) {
        await fs.unlinkSync(`public/uploads/books/${req.file.filename}`);
      }
      return res
        .status(400)
        .send(
          response(
            false,
            data,
            "Title, description, image, genre_id, and author_id must be filled"
          )
        );
    }

    const genreExists = await isExists({ id: genreId }, "genres");
    const authorExists = await isExists({ id: authorId }, "authors");
    if (!genreExists || !authorExists) {
      await fs.unlinkSync(`public/uploads/books/${req.file.filename}`);
      return res
        .status(400)
        .send(
          response(false, data, "Genre_id or author_id must be valid data")
        );
    }

    // Convert from png to jpg
    let image = req.file.filename;
    // if (req.file.mimetype === 'image/png') {
    //   const promiseFileConvert = new Promise((resolve, reject) => {
    //     const oldImage = `${APP_URL}public/uploads/books/` + req.file.filename
    //     imgConvert.fromURL({
    //       url: oldImage,
    //       quality: 100,
    //       output_format: 'jpg'
    //     }, async (err, buffer, file) => {
    //       await fs.writeFile(`./public/uploads/books/${file.name}`, buffer, async (err) => {
    //         await fs.unlinkSync(`public/uploads/books/${image}`)
    //         resolve(file.name)
    //         reject(image)
    //       })
    //     })
    //   })

    //   await promiseFileConvert.then((res) => {
    //     image = res
    //   })
    //   .catch((rej) => {
    //     image = rej
    //   })
    // }

    const result = await bookModel.create({
      title,
      description,
      genre_id: genreId,
      author_id: authorId,
      image: image,
      book_status_id: 1,
    });
    if (result)
      return res
        .status(201)
        .send(response(true, data, "Book successfully created"));
    else {
      await fs.unlinkSync(`public/uploads/books/${image}`);
      res
        .status(500)
        .send(
          response(false, data, "Internal server error or unhandled error")
        );
    }
  },
  patch: async (req, res) => {
    const { id } = req.params;

    const {
      title,
      description,
      genre_id: genreId,
      author_id: authorId,
    } = req.body;

    const data = { ...req.body, ...{ id } };

    if (!isFilled({ title, description, genreId, authorId, id })) {
      if (req.file) {
        await fs.unlinkSync(`public/uploads/books/${req.file.filename}`);
      }
      return res
        .status(400)
        .send(
          response(
            false,
            data,
            "Title, description, genre_id, and author_id must be filled"
          )
        );
    }

    const bookExists = await isExists({ id }, "books");
    const genreExists = await isExists({ id: genreId }, "genres");
    const authorExists = await isExists({ id: authorId }, "authors");
    if (!genreExists || !authorExists || !bookExists) {
      if (req.file) {
        await fs.unlinkSync(`public/uploads/books/${req.file.filename}`);
      }
      return res
        .status(400)
        .send(
          response(
            false,
            data,
            "Genre_id or book_id or author_id must be valid data"
          )
        );
    }

    let image = bookExists.image;
    if (req.file) {
      try {
        await fs.unlinkSync(`public/uploads/books/${image}`);
      } catch (e) {
        console.log(e);
      }
      image = req.file.filename;
    }

    const result = bookModel.update([
      {
        title,
        description,
        genre_id: genreId,
        author_id: authorId,
        image,
      },
      { id },
    ]);
    if (result)
      return res
        .status(200)
        .send(response(true, data, "Book has been updated"));
    else {
      if (req.file) {
        await fs.unlinkSync(`public/uploads/books/${req.file.filename}`);
      }
      res
        .status(500)
        .send(
          response(false, data, "Internal server error or unhandled error")
        );
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;

    const data = { id };

    if (!isFilled({ id })) {
      return res
        .status(400)
        .send(response(false, data, "book_id must be filled"));
    }

    const bookExists = await isExists({ id }, "books");
    if (!bookExists) {
      return res
        .status(400)
        .send(response(false, data, "Book_id must be valid data"));
    }

    try {
      await fs.unlinkSync(`public/uploads/books/${bookExists.image}`);
    } catch (e) {
      console.log(e);
    }

    const result = await bookModel.delete({ id });
    if (result)
      return res
        .status(200)
        .send(response(true, data, "Book has been deleted"));
    else
      return res
        .status(500)
        .send(
          response(false, data, "Internal server error or unhandled error")
        );
  },
};
