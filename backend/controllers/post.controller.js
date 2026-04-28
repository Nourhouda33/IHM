const postService = require('../services/post.service');

const getAll = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();
    res.json({ ok: true, posts });
  } catch (err) { next(err); }
};

const getMine = async (req, res, next) => {
  try {
    const posts = await postService.getMyPosts(req.user.id);
    res.json({ ok: true, posts });
  } catch (err) { next(err); }
};

const getPending = async (req, res, next) => {
  try {
    const posts = await postService.getPendingPosts();
    res.json({ ok: true, posts });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { topic_id, topic, texte, content, image } = req.body;
    const post = await postService.createPost({
      user_id: req.user.id,
      topic_id: topic_id ? parseInt(topic_id) : null,
      topic: topic || null,
      texte: texte || content || null,
      image: req.file ? req.file.filename : image || null,
    });
    res.status(201).json({ ok: true, post });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const post = await postService.updatePost(req.params.id, req.user.id, req.user.role, req.body);
    res.json({ ok: true, post });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id, req.user.id, req.user.role);
    res.json({ ok: true, message: 'Post supprimé' });
  } catch (err) { next(err); }
};

const validate = async (req, res, next) => {
  try {
    const post = await postService.validatePost(req.params.id, req.user.id);
    res.json({ ok: true, post });
  } catch (err) { next(err); }
};

const reject = async (req, res, next) => {
  try {
    await postService.rejectPost(req.params.id, req.user.id);
    res.json({ ok: true, message: 'Post rejeté' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getPending, getMine, create, update, remove, validate, reject };
