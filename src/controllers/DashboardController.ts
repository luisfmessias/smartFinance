import { Request, Response } from 'express';
import db from '../database';

export class DashboardController {
  static getSaldo(req: Request, res: Response) {
    const queryReceitas = 'SELECT SUM(valor) as totalReceitas FROM receitas';
    const queryDespesas = 'SELECT SUM(valor) as totalDespesas FROM despesas';

    db.get(queryReceitas, [], (err, receitaRow: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      db.get(queryDespesas, [], (err, despesaRow: any) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        const totalReceitas = receitaRow.totalReceitas || 0;
        const totalDespesas = despesaRow.totalDespesas || 0;
        const saldo = totalReceitas - totalDespesas;
        res.json({ totalReceitas, totalDespesas, saldo });
      });
    });
  }
}