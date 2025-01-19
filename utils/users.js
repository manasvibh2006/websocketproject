const users = new Map();

/**
 * Join a user to the chat.
 * @param {string} id - The user's unique identifier.
 * @param {string} username - The user's name.
 * @param {string} room - The room the user is joining.
 * @returns {object} The user object.
 */
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.set(id, user); // Store user in the Map
    return user;
}

/**
 * Get the current user by their ID.
 * @param {string} id - The user's unique identifier.
 * @returns {object|null} The user object or null if not found.
 */
function getCurrentUser(id) {
    return users.get(id) || null; // Return null if user is not found
}

/**
 * Remove a user from the chat.
 * @param {string} id - The user's unique identifier.
 * @returns {object|null} The removed user object or null if not found.
 */
function userLeaves(id) {
    const user = users.get(id);
    if (user) {
        users.delete(id); // Remove user from the Map
        return user;
    }
    return null; // Return null if user is not found
}

/**
 * Get all users in a specific room.
 * @param {string} room - The room to get users from.
 * @returns {Array} An array of user objects in the specified room.
 */
function getRoomUsers(room) {
    return Array.from(users.values()).filter(user => user.room === room);
    // Use Array.from for concise Map iteration
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUsers,
};