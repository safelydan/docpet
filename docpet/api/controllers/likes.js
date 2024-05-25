import { db } from '../connect.js';

export const addLikes = (req, res) => {
    const { likes_user_id, likes_post_id } = req.body;

    pool.query('INSERT INTO codpet.likes (likes_user_id, likes_post_id) VALUES ($1, $2)', [likes_user_id, likes_post_id], (error) => {
        if (error) {
            handleServerError(res, error);
        } else {
            res.status(200).json({ msg: 'Like dado com sucesso' });
        }
    });
};

export const deleteLikes = (req, res) => {
    const { likes_user_id, likes_post_id } = req.query;

    db.query(
        'DELETE FROM codpet.likes WHERE likes_user_id = $1 AND likes_post_id = $2',
        [likes_user_id, likes_post_id],
        (error) => {
            if (error) {
                handleServerError(res, error);
            } else {
                res.status(200).json({ msg: 'Like deletado com sucesso' });
            }
        }
    );
};

export const getLikes = (req, res) => {
    const { likes_post_id } = req.query;

    db.query(
        'SELECT l.*, u.username FROM codpet.likes as l JOIN codpet.user as u ON (u.id = l.likes_user_id) WHERE likes_post_id = $1',
        [likes_post_id],
        (error, data) => {
            if (error) {
                handleServerError(res, error);
            } else if (data.rows.length > 0) {
                res.status(200).json({ data: data.rows });
            } else {
                res.status(404).json({ msg: 'Nenhum like encontrado para este post' });
            }
        }
    );
};

function handleServerError(res, error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor' });
}
