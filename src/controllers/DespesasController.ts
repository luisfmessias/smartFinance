import { Request, Response } from 'express';
import db from '../database';
import { Despesa } from '../models/Despesa';

export class DespesasController {
  static getAll(req: Request, res: Response) {
    db.all('SELECT * FROM despesas', [], (err, rows: Despesa[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  }

  static create(req: Request, res: Response) {
    const { descricao, valor, data, categoria }: Despesa = req.body;
    db.run(
      'INSERT INTO despesas (descricao, valor, data, categoria) VALUES (?, ?, ?, ?)',
      [descricao, valor, data, categoria],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID });
      }
    );
  }

  static getById(req: Request, res: Response) {
    const { id } = req.params;
    db.get('SELECT * FROM despesas WHERE id = ?', [id], (err, row: Despesa) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Despesa not found' });
        return;
      }
      res.json(row);
    });
  }

  static update(req: Request, res: Response) {
    const { id } = req.params;
    const { descricao, valor, data, categoria }: Despesa = req.body;
    db.run(
      'UPDATE despesas SET descricao = ?, valor = ?, data = ?, categoria = ? WHERE id = ?',
      [descricao, valor, data, categoria, id],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ changes: this.changes });
      }
    );
  }

  static delete(req: Request, res: Response) {
    const { id } = req.params;
    db.run('DELETE FROM despesas WHERE id = ?', [id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
          return;
        }
        res.json({ changes: this.changes });
      });
  }
}