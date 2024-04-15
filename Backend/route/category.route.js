const express = require('express');
const { auth } = require('../Middlewares/authorization.middleware');
const { CategoryModel } = require('../Models/category.model');

const categoryRouter = express.Router();



// Get All Categories
categoryRouter.get('/', auth, async (req, res) => {

  try {
    let query = {};

    if (req.query.name) {
      const nameRegex = new RegExp(req.query.name, 'i');
      query = { name: nameRegex };
    }

    const categories = await CategoryModel.find(query);

    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



// Create Category
categoryRouter.post('/', auth, async (req, res) => {
  const user = req.body.userId;
  console.log(user)
  try {
    const { name, slug ,image} = req.body;
    const category = await CategoryModel.create({ name, slug, image, owner: user });
    res.status(201).json({ msg: 'Category created', success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



// Update Category
categoryRouter.patch('/update/:id', auth, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, slug ,image} = req.body;
    const updateFields = { name, slug ,image};

    const category = await CategoryModel.findByIdAndUpdate(
      categoryId,
      updateFields,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ msg: 'Category updated', success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});




// Get Single Category
categoryRouter.get('/:id', auth, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



// Delete Category
categoryRouter.delete('/delete/:id', auth, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await CategoryModel.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



module.exports = {
  categoryRouter
}
