import { db } from "../connect.js";

// Função para criar uma nova postagem
export const createPost = (req, res) => {
  const { post_desc, img, userId } = req.body;

  // Verifica se o post tem texto ou imagem
  if (!post_desc && !img) {
    return res.status(422).json({ msg: "O post precisa de texto ou imagem" });
  }

  // Verifica se a postagem já existe com o mesmo 'post_desc' e 'img'
  db.query(
    'SELECT * FROM codpet.posts WHERE post_desc = $1 AND img = $2 AND "userId" = $3',
    [post_desc, img, userId],
    (error, results) => {
      if (error) {
        console.error(error);
        handleServerError(res, error);
      } else if (results.rows.length > 0) {
        return res
          .status(400)
          .json({ msg: "Já existe uma postagem com essas informações" });
      } else {
        // Extrai o nome do arquivo da URL do Cloudinary (caso a imagem seja do Cloudinary)
        const imgUrl = typeof img === "object" ? img.url : img;
        const fileName = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);

        // Insere os dados da postagem no banco de dados
        db.query(
          'INSERT INTO codpet.posts (post_desc, img, "userId") VALUES ($1, $2, $3) RETURNING id',
          [post_desc, fileName, userId],
          (error, results) => {
            if (error) {
              console.error(error);
              handleServerError(res, error);
            } else {
              res.status(200).json({
                msg: "Postagem feita com sucesso",
                postId: results.rows[0].id,
              });
            }
          }
        );
      }
    }
  );
};

// Função para obter as postagens
// Função para obter as postagens
export const getPost = (req, res) => {
  const userId = req.query.id;

  // Constrói a query SQL com ou sem filtro de usuário
  const query = userId
    ? 'SELECT p.*, u.username, u."userImg" FROM codpet.posts as p JOIN codpet.user as u ON (u.id = p."userId") WHERE u.id = $1 ORDER BY created_at DESC'
    : 'SELECT p.*, u.username, u."userImg" FROM codpet.posts as p JOIN codpet.user as u ON (u.id = p."userId") ORDER BY created_at DESC';

  // Executa a query no banco de dados
  db.query(query, userId ? [userId] : [], (error, data) => {
    if (error) {
      console.error("Erro ao executar a consulta:", error);
      handleServerError(res, error);
    } else {
      if (data.rows.length > 0) {
        res.status(200).json({ data: data.rows });
      } else {
        res.status(404).json({ msg: "Nenhuma postagem encontrada" });
      }
    }
  });
};

// Função para excluir uma postagem
export const deletePost = (req, res) => {
  const postId = req.query.id;

  // Verifica se o ID da postagem foi fornecido
  if (!postId) {
    return res
      .status(422)
      .json({ msg: "É preciso o ID da postagem a ser excluída" });
  }

  // Executa a query para excluir a postagem no banco de dados
  db.query(
    "DELETE FROM codpet.posts WHERE id = $1",
    [postId],
    (error, data) => {
      if (error) {
        handleServerError(res, error);
      } else {
        if (data.rowCount > 0) {
          res.status(200).json("Postagem excluída com sucesso");
        } else {
          res.status(404).json({ msg: "Postagem não encontrada" });
        }
      }
    }
  );
};

// Função para tratar erros de servidor
function handleServerError(res, error) {
  console.error(error);
  res.status(500).json({ msg: "Erro no servidor" });
}
