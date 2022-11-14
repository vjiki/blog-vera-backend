import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import BlogModel from '../models/blog';
import mongoose from 'mongoose';

const create = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to create blog ...');

    let { author, title, tags, content, imageUrl } = req.body;

    const blog = new BlogModel({
        _id: new mongoose.Types.ObjectId(),
        title,
        tags,
        content,
        author,
        imageUrl
    });

    return blog
        .save()
        .then((newBlog) => {
            logging.info(`New blog created`);

            return res.status(201).json({ blog: newBlog });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    logging.info(`Incoming read for blog with id ${_id}`);

    BlogModel.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      })
        .populate('author')
        .exec()
        .then((blog) => {
            if (blog) {
                return res.status(200).json({ blog });
            } else {
                return res.status(404).json({
                    error: 'Blog not found.'
                });
            }
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                error: error.message
            });
        });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Returning all blogs ');

    BlogModel.find()
        .populate('author')
        .exec()
        .then((blogs) => {
            return res.status(200).json({
                count: blogs.length,
                blogs: blogs
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const readLastTags = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Returning last 5 tags ');

      BlogModel.find()
      .limit(5)
      .exec()
      .then((blogs) => {
        const tags = blogs
        .map((obj) => obj.tags)
        .flat()
        .slice(0, 5);
        return res.status(200).json({
            count: tags.length,
            tags: tags
        });
    })
    .catch((error) => {
        logging.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });
};

const query = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Query route called');

    BlogModel.find(req.body)
        .populate('author')
        .exec()
        .then((blogs) => {
            return res.status(200).json({
                count: blogs.length,
                blogs: blogs
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called');

    const _id = req.params.id;

    BlogModel.updateOne(
        {
            _id: _id
        },
        req.body)
        .exec()
        .then((savedBlog) => {
            logging.info(`Blog with id ${_id} updated`);

                return res.status(201).json({
                    blog: savedBlog
                });
        })
        .catch((error) => {
        logging.error(error.message);

        return res.status(500).json({
            message: error.message
        });
    });
};

const remove = (req: Request, res: Response, next: NextFunction) => {
    logging.warn('Delete route called');

    const _id = req.params.id;

    BlogModel.findByIdAndDelete(_id)
        .exec()
        .then(() => {
            return res.status(201).json({
                message: 'Blog deleted'
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

export default {
    create,
    read,
    readAll,
    query,
    update,
    remove,
    readLastTags
};
