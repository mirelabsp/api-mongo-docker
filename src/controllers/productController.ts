import { Request, Response } from 'express';
import Product from '../models/productModel';
import Review from '../models/reviewModel';

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

export const addProduct = async (req: RequestWithFile, res: Response) => {
  try {
    const { title, price, description, published } = req.body;
    const productData = {
      title,
      price: Number(price),
      description,
      published: published === 'true',
      imageUrl: req.file ? req.file.path : ''
    };

    const product = new Product(productData);
    await product.save();
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find({});
  res.status(200).send(products);
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const data = {
        product_id: req.params.id,
        rating: req.body.rating,
        description: req.body.description,
        author: req.body.author || 'Anônimo'
    };
    const review = new Review(data);
    await review.save();
    res.status(200).send(review);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).send('Produto não encontrado.');
    
    const reviews = await Review.find({ product_id: id }).sort({ createdAt: -1 });
    res.status(200).json({ ...product.toObject(), reviews: reviews });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateProduct = async (req: RequestWithFile, res: Response) => {
  try {
    const { id } = req.params;
    const { title, price, description, published } = req.body;

    const updateData: any = {
      title,
      price: Number(price),
      description,
      published: published === 'true',
    };

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).send('Produto não encontrado.');
    
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Review.deleteMany({ product_id: id });
    await Product.findByIdAndDelete(id);
    res.status(200).send('Produto e reviews deletados.');
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Review.findByIdAndDelete(id);
        res.status(200).send('Comentário deletado.');
    } catch (error) {
        res.status(500).send(error);
    }
};