import { db } from "../connect.js";

export const getUser = (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(422).json({ msg: "É preciso o ID" });
  }

  db.query(
    'SELECT name, username, "userImg", "bgImg" FROM codpet.user WHERE id = $1',
    [id],
    (error, data) => {
      if (error) {
        console.error(error);
        res.status(500).json({ msg: "Erro ao obter usuário" });
      } else {
        return res.status(200).json(data.rows);
      }
    }
  );
};

export const updateUser = (req, res) => {
  const { name, username, userImg, bgImg } = req.body;
  const { id } = req.query; // Extraindo o ID da URL

  if (!id) {
    return res.status(422).json({ msg: "É preciso o ID" });
  }

  if (!name && !username && !userImg && !bgImg) {
    return res.status(422).json({ msg: "Sem alterações para serem feitas" });
  }

  const updateFields = [];
  const values = [];

  // Adicionando campos dinamicamente
  if (name) {
    updateFields.push('"name" = $' + (values.length + 1));
    values.push(name);
  }

  if (username) {
    updateFields.push('"username" = $' + (values.length + 1));
    values.push(username);
  }

  if (userImg) {
    updateFields.push('"userImg" = $' + (values.length + 1));
    values.push(userImg);
  }

  if (bgImg) {
    updateFields.push('"bgImg" = $' + (values.length + 1));
    values.push(bgImg);
  }

  // Construindo a query
  const updateQuery = `UPDATE codpet.user SET ${updateFields.join(
    ", "
  )} WHERE id = $${values.length + 1}`;

  // Adicionando o ID ao final dos valores
  values.push(id);

  db.query(updateQuery, values, (error, data) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro ao atualizar usuário" });
    }

    if (data.rowCount > 0) {
      return res.status(200).json({ msg: "Usuário atualizado com sucesso" });
    } else {
      return res
        .status(404)
        .json({ msg: "Nenhum usuário encontrado para atualizar" });
    }
  });
};
export const deleteUser = (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(422).json({ msg: "É preciso o ID" });
  }

  db.query("DELETE FROM codpet.user WHERE id = $1", [id], (error, data) => {
    if (error) {
      console.error(error);
      res.status(500).json({ msg: "Erro ao excluir usuário" });
    } else {
      if (data.rowCount > 0) {
        return res.status(200).json({ msg: "Usuário excluído com sucesso" });
      } else {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }
    }
  });
};
