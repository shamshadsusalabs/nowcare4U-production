const Blog = require('../models/Blog');


// Optimized query for getting all blogs with pagination
exports.getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    const query = type ? { type } : {};

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// Optimized query for getting a single blog
exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// Create blog with image upload
exports.createBlog = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    console.log('Raw body:', req.body);
    console.log('File:', req.file);

    const blogData = {
      title: req.body.title?.trim(),
      description: req.body.description?.trim(),
      type: req.body.type?.trim(),
      author: req.body.author?.trim(),
      image: {
        url: req.file.path
      }
    };

    if (!blogData.title || !blogData.description || !blogData.author) {
      return res.status(400).json({
        success: false,
        message: 'Title, description and author are required'
      });
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // If new image is uploaded, replace only the URL
    if (req.file) {
      blog.image = {
        url: req.file.path
      };
    }

    Object.keys(req.body).forEach(key => {
      if (['title', 'description', 'type', 'author'].includes(key)) {
        blog[key] = req.body[key]?.trim();
      }
    });

    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


// Search blogs with full-text search
exports.searchBlogs = async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const blogs = await Blog.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};