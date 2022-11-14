import express from 'express';
import controller from '../controllers/blog';
import { postCreateValidation, handleValidationErrors } from "../utils";

const router = express.Router();

router.get('/', controller.readAll);
router.get('/read/:id', controller.read);
router.get('/tags', controller.readLastTags);
router.post('/create', 
  postCreateValidation,
  handleValidationErrors,
  controller.create);
router.post('/query', controller.query);
router.patch('/update/:id',
  postCreateValidation,
  handleValidationErrors,
  controller.update);
router.delete('/:id', controller.remove);

export default router;
