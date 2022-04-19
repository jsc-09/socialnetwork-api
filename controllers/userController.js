const { User, Thought } = require('../models');

module.exports = {
    // GET all users; /api/users
    getUsers(req, res) {
        User.find()
        .populate(
            {path: "thoughts"}
        )
        .populate( 

            {path: "friends"}
        )
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err))
    },
    // GET a single user by its _id and populated thought and friend data; api/users/:id
    getSingleUser(req, res) {
        User.findOne({ _id: req.params._id })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'no user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    // POST a new user; /api/users
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    // PUT to update a user by its _id; api/users/:id
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params._id },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // DELETE to remove user by its _id; api/users/:id
    // Bonus: Remove a user's associated thoughts when deleted

    deleteUser(req, res) {
        User.findOneAndDelete(
            { _id: req.params._id },
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
            .catch((err) => res.status(500).json(err));
    },
    // POST to add a new friend to a user's friend list; /api/users/:userId/friends/:friendId
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params._id },
            { $push: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // DELETE to remove a friend from a user's friend list; /api/users/:userId/friends/:friendId
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params._id },
            { $pull: { friends: req.params.friendId }},
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'No user found with that ID :(' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
};
