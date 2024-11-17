import Post from "../model/post.js";

export const createPost = async (request, response) => {
  try {
    const post = await new Post(request.body);
    post.save();

    response.status(200).json("Post saved successfully");
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getAllPosts = async (request, response) => {
  try {
    const { category } = request.query;

    // If category is provided, filter by it; otherwise, retrieve all posts
    let filter = category ? { categories: category } : {};
    let posts = await Post.find(filter);

    return response.status(200).json(posts);
  } catch (error) {
    response.status(500).json({ msg: error.message });
  }
};

export const getPost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);

    return response.status(200).json(post);
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};

export const updatePost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);

    if (!post) {
      response.status(404).json({ msg: "Post not found" });
    }

    await Post.findByIdAndUpdate(request.params.id, { $set: request.body });

    return response.status(200).json("post updated successfully");
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const deletePost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);

    if (!post) {
      response.status(404).json({ msg: "Post not found" });
    }

    await Post.findByIdAndDelete(post._id)

    return response.status(200).json("post deleted successfully");
  } catch (error) {
    return response.status(500).json(error);
  }
};
