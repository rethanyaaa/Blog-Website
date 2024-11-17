import Comment from "../model/comment.js";

export const newComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    comment.date = new Date(); // Ensure the date is set here
    await comment.save();
    return res.status(200).json(comment); // Return the saved comment, including the valid date
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const getComments = async (request, response) => {
  try {
      const comments = await Comment.find({ postId: request.params.id });
      
      response.status(200).json(comments);
  } catch (error) {
      response.status(500).json(error)
  }
}

export const deleteComment = async (request, response) => {
  try {
      const comment = await Comment.findById(request.params.id);

      await Comment.findByIdAndDelete(comment._id)
      response.status(200).json('comment deleted successfully');
  } catch (error) {
      response.status(500).json(error)
  }
}
