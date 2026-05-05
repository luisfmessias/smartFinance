import { Router } from 'express';
import { ReceitasController } from '../controllers/ReceitasController';
import { DespesasController } from '../controllers/DespesasController';
import { DashboardController } from '../controllers/DashboardController';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'SmartFinance API running' });
});

// Receitas routes
router.get('/receitas', ReceitasController.getAll);
router.post('/receitas', ReceitasController.create);
router.get('/receitas/:id', ReceitasController.getById);
router.put('/receitas/:id', ReceitasController.update);
router.delete('/receitas/:id', ReceitasController.delete);

// Despesas routes
router.get('/despesas', DespesasController.getAll);
router.post('/despesas', DespesasController.create);
router.get('/despesas/:id', DespesasController.getById);
router.put('/despesas/:id', DespesasController.update);
router.delete('/despesas/:id', DespesasController.delete);

// Dashboard routes
router.get('/dashboard/saldo', DashboardController.getSaldo);

export default router;
