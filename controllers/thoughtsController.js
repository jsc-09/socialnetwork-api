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
        console.log(req.params)

        Thought.findOne({ _id: req.params.thoughtId })
            // .populate (
            //     { path: "reactions"}
            // )
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
                });
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
            { _id: req.params.thoughtId },
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

        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) => {
          res.json(thought);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    //     Thought.findOneAndRemove({ _id: req.params.thoughtId })
    //   .then((thought) =>
    //     !thought
    //       ? res.status(404).json({ message: 'No such thought exists' })
    //       : User.findOneAndUpdate(
    //           { username: thought.username },
    //           { $pull: { thoughts: thought.thoughtId } },
    //           { new: true }
    //         )
    //   )
    //   .then((thought) =>
    //     !thought
    //       ? res.status(404).json({
    //           message: 'User found, Thought Not Deleted',
    //         })
    //       : res.json({ message: 'Thought successfully deleted' })
    //   )
    //   .catch((err) => {
    //     console.log(err);
    //     res.status(500).json(err);
    //   });
    },
    // User.findOneAndUpdate(
    //     { _id: req.params.thoughtId },
    //     { $pull: { thoughts: { _id: req.params.thoughtId } } },
    //     { runValidators: true, new: true }
    //   )
    //     .then((thought) =>
    //       !thought
    //         ? res
    //             .status(404)
    //             .json({ message: 'No thought found with that ID' })
    //         : res.json(thought)
    //     )
    //     .catch((err) => res.status(500).json(err));

    // },

    // POST to create a reaction stored in a single thought's reactions array field

    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { new: true },
        )
            .then((reaction) => res.json(reaction))
            .catch((err) => res.status(500).json(err));
    },

    // DELETE to pull and remove a reaction by the reaction's reactionId value
    deleteReaction(req, res) {
        console.log(req.params)
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        )
        .then((reaction) =>
        !reaction
            ? res
                .status(404)
                .json({ message: 'No reaction found with that ID :(' })
            : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
    },
}

