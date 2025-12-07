const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Buat user baru
async function createUser(fullname, username, passwordHash, pinHash, profilePictureUrl = null) {
    const query = `
        INSERT INTO users(fullname, username, password_hash, pin, profile_picture_url)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [fullname, username, passwordHash, pinHash, profilePictureUrl];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Cari user berdasarkan username
async function findUserByUsername(username) {
    const query = `
        SELECT *
        FROM users
        WHERE username = $1
        LIMIT 1;
    `;
    const { rows } = await pool.query(query, [username]);
    return rows[0];
}

// Update password user
async function updateUserPassword(username, newPasswordHash) {
    const query = `
        UPDATE users
        SET password_hash = $1,
            updated_at = NOW()
        WHERE username = $2
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [newPasswordHash, username]);
    return rows[0];
}

// Verifikasi PIN user
async function verifyUserPin(username, pin) {
    const user = await findUserByUsername(username);
    if (!user) return null;

    const match = await bcrypt.compare(pin, user.pin);
    if (!match) return null;

    return user;
}

// Update fullname
async function updateUserFullname(username, newFullname) {
    const query = `
        UPDATE users
        SET fullname = $1,
            updated_at = NOW()
        WHERE username = $2
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [newFullname, username]);
    return rows[0];
}

// Update username
async function updateUsername(userId, newUsername, oldUsername) {
    const query = `
        UPDATE users
        SET username = $1,
            updated_at = NOW()
        WHERE id = $2 AND username = $3
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [newUsername, userId, oldUsername]);
    return rows[0];
}

// Update/hapus profile picture
async function updateProfilePicture(userId, profilePictureUrl) {
    const query = `
        UPDATE users
        SET profile_picture_url = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *;
    `;

    const result = await pool.query(query, [profilePictureUrl, userId]);

    if (!result || result.rows.length === 0) {
        console.warn("⚠️ Update profile picture tidak mengubah row. userId:", userId);
        return null;
    }

    console.log("💾 Foto profil berhasil disimpan ke DB:", userId);
    return result.rows[0];
}

async function removeProfilePicture(userId) {
    const query = `
        UPDATE users
        SET profile_picture_url = NULL,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;

    const result = await pool.query(query, [userId]);

    if (!result || result.rows.length === 0) {
        console.warn("⚠️ Remove profile picture tidak mengubah row. userId:", userId);
        return null;
    }

    console.log("💾 Foto profil dihapus dari DB untuk userId:", userId);
    return result.rows[0];
}

// Hapus user
async function deleteUser(username) {
    const query = `
        DELETE FROM users
        WHERE username = $1
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [username]);
    return rows[0];
}

module.exports = {
    createUser,
    findUserByUsername,
    updateUserPassword,
    updateUserFullname,
    updateUsername,
    updateProfilePicture,
    removeProfilePicture,
    verifyUserPin,
    deleteUser,
};
