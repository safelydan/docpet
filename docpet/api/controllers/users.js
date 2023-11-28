import { db } from '../connect.js';

export const getUser = (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(422).json({ msg: 'É preciso o ID' });
  }

  db.query('SELECT username, userImg, bgImg FROM user WHERE id = ?', [id], (error, data) => {
    if (error) {
      console.log(error);
      res.status(500).json({ msg: 'Erro no servidor' });
    } else {
      return res.status(200).json(data);
    }
  });
};

export const updateUser = (req, res) => {
  const { username, userImg, bgImg, id } = req.body;

  if (!username || !userImg || !bgImg) {
    // Se todas forem negativas
    return res.status(422).json({ msg: 'Sem alterações para serem feitas' });
  }

  db.query('UPDATE user SET username = ?, userImg = ?, bgImg = ? WHERE id = ?', [username, userImg, bgImg, id], (error, data) => {
    // Cada ponto de interrogação desse será atendido por uma dessas variáveis

    if (error) {
      console.log(error);
      res.status(500).json({ msg: 'Erro no servidor' });
    }
    if (data.affectedRows > 0) {
      return res.status(200).json('Atualizado com sucesso');
    }
  });
};

export const deleteUser = (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(422).json({ msg: 'É preciso o ID' });
  }

  db.query('DELETE FROM user WHERE id = ?', [id], (error, data) => {
    if (error) {
      console.log(error);
      res.status(500).json({ msg: 'Erro no servidor' });
    } else {
      if (data.affectedRows > 0) {
        return res.status(200).json('Usuário excluído com sucesso');
      } else {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
      }
    }
  });
};
