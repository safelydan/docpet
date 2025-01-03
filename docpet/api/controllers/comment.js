import { db } from "../connect.js";

export const createComment = (req, res) => {
  const { comment_desc, post_id, comment_user_id } = req.body;

  if (!comment_desc) {
    return res.status(422).json({ msg: "O comentário precisa de texto" });
  }

  db.query(
    "INSERT INTO codpet.comments (comment_desc, post_id, comment_user_id) VALUES ($1, $2, $3)",
    [comment_desc, post_id, comment_user_id],
    (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ msg: "Erro no servidor" });
      } else {
        return res.status(200).json({ msg: "Comentário feito com sucesso" });
      }
    }
  );
};

export const getComment = (req, res) => {
  db.query(
    'SELECT c.*, u.username, u."userImg" FROM codpet.comments AS c JOIN codpet.user AS u ON (u.id = c.comment_user_id) WHERE post_id = $1 ORDER BY created_at ASC',
    [req.query.post_id],
    (error, data) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ msg: "Erro no servidor" });
      } else if (data.rows.length > 0) {
        return res.status(200).json({ data: data.rows });
      } else {
        return res
          .status(404)
          .json({ msg: "Nenhum comentário encontrado para este post" });
      }
    }
  );
};
