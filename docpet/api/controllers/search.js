import { db } from "../connect.js";

export const searchUser = (req, res) => {
  const params = `%${req.query.params}%`;

  if (!params) {
    return res.status(422).json({ msg: "É preciso o parâmetro" });
  }

  db.query(
    'SELECT username, "userImg", id FROM codpet.user WHERE username LIKE $1',
    [params],
    (error, data) => {
      if (error) {
        console.log(error);
        res.status(500).json({ msg: "Erro no servidor" });
      } else {
        return res.status(200).json(data.rows);
      }
    }
  );
};

export const searchPost = (req, res) => {
  const params = `%${req.query.params}%`;

  if (!params) {
    return res.status(422).json({ msg: "É preciso o parâmetro" });
  }

  db.query(
    'SELECT p.*, u.username, u."userImg" FROM codpet.posts as p JOIN codpet.user as u ON (u.id = p."userId") WHERE p.post_desc LIKE $1 OR u.username LIKE $1 ORDER BY created_at DESC',
    [params],
    (error, data) => {
      if (error) {
        console.log(error);
        res.status(500).json({ msg: "Erro no servidor" });
      } else {
        return res.status(200).json(data.rows);
      }
    }
  );
};
