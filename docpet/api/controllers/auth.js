//import { JsonWebTokenError } from 'jsonwebtoken'; // importa o erro específico para tokens JWT
import { db } from "../connect.js"; // importa o objeto de conexão com o banco de dados
import bcrypt from "bcrypt"; // importa a biblioteca para criptografia de senhas
import jwt from "jsonwebtoken"; // importa a biblioteca para geração e verificação de tokens JWT

// função para registrar um novo usuário
export const register = (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // verificação do username
  if (!username) {
    return res.status(422).json({ msg: "O username é obrigatório" });
  }
  if (!/^[a-zA-Z0-9_-]{3,16}$/.test(username)) {
    return res
      .status(422)
      .json({
        msg: 'Username inválido. Use apenas letras, números, "-" e "_", com 3 a 16 caracteres.',
      });
  }

  // verificação do email
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório" });
  }
  if (!/^\S+@\S+$/.test(email)) {
    return res.status(422).json({ msg: "Formato de email inválido." });
  }

  // verificação da senha
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória" });
  }
  if (password.length < 8) {
    return res
      .status(422)
      .json({ msg: "A senha deve ter no mínimo 8 caracteres" });
  }
  if (confirmPassword !== password) {
    return res.status(422).json({ msg: "As senhas estão diferentes" });
  }

  // verifica se o email já está registrado
  db.query(
    "SELECT email FROM codpet.user WHERE email = $1",
    [email],
    async (error, emailData) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ msg: "Erro no servidor" });
      }

      if (emailData.rows.length > 0) {
        return res.status(422).json({ msg: "Este email já está registrado" });
      }

      // verifica se o username já está registrado
      db.query(
        "SELECT username FROM codpet.user WHERE username = $1",
        [username],
        async (error, usernameData) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ msg: "Erro no servidor" });
          }

          if (usernameData.rows.length > 0) {
            return res
              .status(422)
              .json({ msg: "Este username já está em uso" });
          }

          // tanto o email quanto o username estão disponíveis, continua com o processo de registro
          const passwordHash = await bcrypt.hash(password, 8);
          db.query(
            "INSERT INTO codpet.user (username, email, password) VALUES ($1, $2, $3)",
            [username, email, passwordHash],
            (error) => {
              if (error) {
                console.log(error);
                return res.status(500).json({ msg: "Erro no servidor" });
              } else {
                return res
                  .status(200)
                  .json({ msg: "Cadastro efetuado com sucesso" });
              }
            }
          );
        }
      );
    }
  );
};

// função para fazer login
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Digite o e-mail e a senha." });
  }

  db.query(
    "SELECT * FROM codpet.user WHERE email = $1",
    [email],
    async (error, data) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ msg: "Erro no servidor" });
      }
      if (data.rows.length === 0) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      } else {
        const user = data.rows[0];
        console.log(data.rows);
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
          return res.status(422).json({ msg: "Senha incorreta" });
        }

        try {
          // gera tokens de acesso e refresh
          const refreshToken = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
              id: user.password,
            },
            process.env.REFRESH,
            { algorithm: "HS256" }
          );
          const token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 3600,
              id: user.password,
            },
            process.env.TOKEN,
            { algorithm: "HS256" }
          );

          delete user.password; // remove a senha do objeto de usuário antes de enviá-lo na resposta

          // configuração de cookies e resposta ao usuário
          res
            .cookie("accessToken", token, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .status(200)
            .json({ msg: "Usuário logado com sucesso", user });
          // quando fizer o login recebe o user completo e os tokens, serve para salvar e usar depois dentro da aplicação
        } catch (error) {
          console.log(error);
          return res.send(500).json({ msg: "Error" });
        }
      }
    }
  );
};

// função para atualizar tokens
export const refresh = (req, res) => {
  const authHeader = req.headers.cookie?.split(";")[1];
  const refresh = authHeader && authHeader.split("=")[1];
  const tokenStruct = refresh.split(".")[1];
  const payload = atob(tokenStruct); // descripto na base64

  try {
    // gera novos tokens de acesso e refresh
    const refreshToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        id: JSON.parse(payload).id,
      },
      process.env.REFRESH,
      { algorithm: "HS256" }
    );
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 3600,
        id: JSON.parse(payload).id,
      },
      process.env.TOKEN,
      { algorithm: "HS256" }
    );

    // configuração de cookies e resposta ao usuário
    res
      .cookie("accessToken", token, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .status(200)
      .json({ msg: "Token atualizado com sucesso" });
    // quando fizer o login recebe o user completo e os tokens, serve para salvar e usar depois dentro da aplicação
  } catch (error) {
    console.log(error);
    return res.send(500).json({ msg: "Error" });
  }
};

// função para fazer logout e limpar cookies
export const logout = (req, res) => {
  return res
    .clearCookie("accessToken", { secure: true, sameSite: "none" })
    .clearCookie("refreshToken", { secure: true, sameSite: "none" })
    .status(200)
    .json({ msg: "Logout efetuado com sucesso" });
};

// função para excluir um usuário
export const deleteUser = (req, res) => {
  const userId = req.user.id; // assumindo que você tenha um middleware que define req.user após a autenticação

  db.query("DELETE FROM codpet.user WHERE id = $1", [userId], (error) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ msg: "Erro no servidor" });
    } else {
      return res.status(200).json({ msg: "Usuário excluído com sucesso" });
    }
  });
};
