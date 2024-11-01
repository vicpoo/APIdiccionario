import { Router } from 'express';
import { getWords, searchWord, createWord, updateWord, deleteWord } from '../controllers/diccionaryControllers';

const diccionaryRoutes: Router = Router();

diccionaryRoutes.get('/', getWords);
diccionaryRoutes.get('/search/:searchTerm', searchWord);
diccionaryRoutes.post('/', createWord);
diccionaryRoutes.put('/:word_id', updateWord);
diccionaryRoutes.delete('/:word_id', deleteWord);

export default diccionaryRoutes;
