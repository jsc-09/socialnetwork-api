const { User, Thought } = require('../models');

module.exports = {

    // GET to get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err))
    },


    // GET to get a single thought by its _id
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params._id })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },


    // POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true, runValidators: true }
                );
            })
            .then((thought) =>
                !thought
                    ? res.status(404).json({
                        message: 'Thought created, but found no user with that ID',
                    })
                    : res.json('Created the thought')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // PUT to update a thought by its _id
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params._id },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id!' })
                    : res.json(thought)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // DELETE to remove a thought by its _id
    deleteThought(req, res) {
        Thought.findOneAndDelete(
            { _id: req.params._id }
        )
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },

    // POST to create a reaction stored in a single thought's reactions array field

    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { new: true },
        )
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },

    // DELETE to pull and remove a reaction by the reaction's reactionId value
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        )
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },
}

