import { db } from '../connect.js';

export const addFriendship = (req, res) => {
    const { follower_id, followed_id } = req.body;

    db.query('INSERT INTO codpet.friendship (follower_id, followed_id) VALUES ($1, $2)', [follower_id, followed_id], (error) => {
        if (error) {
            handleServerError(res, error);
        } else {
            res.status(200).json({ msg: 'Você está seguindo esta pessoa com sucesso' });
        }
    });
};

export const deleteFriendship = (req, res) => {
    const { follower_id, followed_id } = req.query;

    db.query(
        'DELETE FROM codpet.friendship WHERE follower_id = $1 AND followed_id = $2',
        [follower_id, followed_id],
        (error) => {
            if (error) {
                handleServerError(res, error);
            } else {
                res.status(200).json({ msg: 'Você não está mais seguindo esse usuário' });
            }
        }
    );
};

export const getFriendship = (req, res) => {
    const { follower_id } = req.query;

    db.query(
        `SELECT f.*, u.username, u."userImg" FROM codpet.friendship as f JOIN codpet.user as u ON (u.id = f.followed_id) WHERE follower_id = $1`,
        [follower_id],
        (error, data) => {
            if (error) {
                handleServerError(res, error);
            } else if (data.rows.length > 0) {
                res.status(200).json({ data: data.rows });
            } else {
                res.status(404).json({ msg: 'Nenhuma amizade encontrada para este usuário' });
            }
        }
    );
};

function handleServerError(res, error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro no servidor' });
}
