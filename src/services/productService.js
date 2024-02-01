const slugify = require("slugify");
const Product = require("../models/productModel");
const createHttpError = require("http-errors");

const createProduct = async (productData) => {
  const {
    name,
    description,
    price,
    quantity,
    shipping,
    category,
    imageBufferString,
  } = productData;

  const productExists = await Product.exists({ name: name });
  if (productExists) {
    throw createHttpError(409, "Product with this name alrady exist. ");
  }

  const product = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    shipping: shipping,
    image: imageBufferString,
    category: category,
  });

  return product;
};

const getProducts = async (page = 1, limit = 4) => {
  const products = await Product.find({})
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!products) {
    throw createError(404, "No product found");
  }
  const count = await Product.find({}).countDocuments();
  return {
    products,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug }).populate("category");
  if (!product) {
    throw createError(404, "No product found");
  }

  return {
    product,
  };
};

const deleteProductBySlug = async (slug) => {
  const product = await Product.findOneAndDelete({ slug });
  if (!product) {
    throw createError(404, "No product found");
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductBySlug,
  deleteProductBySlug,
};
