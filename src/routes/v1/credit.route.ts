import express from 'express';
import { createCredit, deleteCredit, getCredit, getCreditById, updateCredit } from '../../controllers/credit.controller';
const CreditRoute = express.Router();

CreditRoute.get('/', getCredit);
CreditRoute.post('/', createCredit);
CreditRoute.get('/:id', getCreditById);
CreditRoute.put('/:id', updateCredit);
CreditRoute.delete('/:id', deleteCredit);

export default CreditRoute;
