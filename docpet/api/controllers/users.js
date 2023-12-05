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

  // Pode ter outras condições de validação aqui, dependendo dos requisitos do seu sistema

  // Verifica se pelo menos uma alteração está sendo feita
  if (!username && !userImg && !bgImg) {
    return res.status(422).json({ msg: 'Sem alterações para serem feitas' });
  }

  // Monta a parte dinâmica da query baseada nas alterações que estão sendo feitas
  const updateFields = [];
  const values = [];

  if (username) {
    updateFields.push('username = ?');
    values.push(username);
  }

  if (userImg) {
    updateFields.push('userImg = ?');
    values.push(userImg);
  }

  if (bgImg) {
    updateFields.push('bgImg = ?');
    values.push(bgImg);
  }

  // Executa a query apenas se houver campos para serem atualizados
  if (updateFields.length > 0) {
    const updateQuery = `UPDATE user SET ${updateFields.join(', ')} WHERE id = ?`;
    values.push(id);

    db.query(updateQuery, values, (error, data) => {
      if (error) {
        console.log(error);
        res.status(500).json({ msg: 'Erro no servidor' });
      } else {
        if (data.affectedRows > 0) {
          return res.status(200).json({ msg: 'Atualizado com sucesso' });
        } else {
          return res.status(400).json({ msg: 'Nenhum usuário encontrado para atualizar' });
        }
      }
    });
  } else {
    return res.status(422).json({ msg: 'Sem alterações para serem feitas' });
  }
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
