import { Request, Response } from "express";
import {
  ProductService,
  FindAdminProductsOptions,
  FindPublicProductsOptions,
  HomepageSlidersData,
  HomepageSliderItem,
  FindProductsByFiltersOptions,
  FilterOptions,
} from "../services/products.service";
import { BadRequestError, NotFoundError } from "../errors";
import { transformMediaURLs } from "../utils/media.util";

export class ProductController {
  // === CONTROLLERS CHO PRODUCTS ===
  static async getHomepageSliders(req: Request, res: Response) {
    const { cars, motorcycles } = await ProductService.getHomepageSlidersData();

    const transformedCars = transformMediaURLs(req, cars);
    const transformedMotorcycles = transformMediaURLs(req, motorcycles);

    const transformToSliderItem = (product: any): HomepageSliderItem => {
      const carAttributeKeys = [
        "dong-xe",
        "so-cho-ngoi",
        "quang-duong-len-toi",
      ];
      const motorcycleAttributeKeys = [
        "toc-do-toi-da",
        "quang-duong-1-lan-sac",
        "cop-xe",
      ];
      let keyAttributes: { key: string; name: string; value: string }[] = [];

      if (product.type === "o-to") {
        keyAttributes = product.attributes.filter((attr: any) =>
          carAttributeKeys.includes(attr.key)
        );
      } else if (product.type === "xe-may") {
        keyAttributes = product.attributes.filter((attr: any) =>
          motorcycleAttributeKeys.includes(attr.key)
        );
      }

      return {
        id: product.id,
        name: product.name,
        productImageUrl: product.main_image?.mediaURL || null,
        keyAttributes: keyAttributes.map((attr) => ({
          name: attr.name,
          value: attr.value,
        })),
        priceDisplay: `Giá từ ${product.base_price?.toLocaleString(
          "vi-VN"
        )} VNĐ`,
        detailUrl: `/products/${product.slug}`,
      };
    };

    const slidersData: HomepageSlidersData = {
      carSliderItems: transformedCars.map(transformToSliderItem),
      motorcycleSliderItems: transformedMotorcycles.map(transformToSliderItem),
    };

    res.status(200).json(slidersData);
  }

  static async getProductCards(req: Request, res: Response) {
    const tag = req.query.tag as string;
    if (!tag) {
      throw new BadRequestError("Tham số 'tag' là bắt buộc.");
    }

    const options: FindPublicProductsOptions = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 12,
    };

    const result = await ProductService.findProductCards(tag, options);
    if (result.data) {
      result.data = transformMediaURLs(req, result.data);
    }
    res.status(200).json(result);
  }

  static async getProductFeatureSliders(req: Request, res: Response) {
    const tag = req.query.tag as string;
    if (!tag) {
      throw new BadRequestError("Tham số 'tag' là bắt buộc.");
    }

    const options: FindPublicProductsOptions = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 4,
    };

    const result = await ProductService.findProductFeatureSliders(tag, options);
    if (result.data) {
      result.data = transformMediaURLs(req, result.data);
    } else {
      throw new NotFoundError("No products found matching the provided tag.");
    }
    res.status(200).json(result);
  }

  //admin controllers
  static async getAllProductsForAdmin(req: Request, res: Response) {
    const options: FindAdminProductsOptions = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      search: req.query.search as string,
      type: req.query.type as string,
      categoryCode: req.query.categoryCode as string,
      isDeleted: req.query.isDeleted === "true",
      slug: req.query.slug as string,
    };

    const result = await ProductService.findAndPaginateForAdmin(options);
    res.status(200).json(result);
  }

  static async getProductById(req: Request, res: Response) {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      throw new BadRequestError("ID phải là một con số.");
    }

    const product = await ProductService.findById(productId);
    if (!product) {
      throw new NotFoundError(`Không tìm thấy sản phẩm với ID: ${productId}`);
    }
    const responseData = transformMediaURLs(req, product);
    res.status(200).json(responseData);
  }

  static async getProductBySlug(req: Request, res: Response) {
    const slug = req.params.slug;
    const product = await ProductService.findBySlug(slug);
    if (!product) {
      throw new NotFoundError(`Không tìm thấy sản phẩm với slug: ${slug}`);
    }
    const responseData = transformMediaURLs(req, product);
    res.status(200).json(responseData);
  }

  static async getMegaMenuProducts(req: Request, res: Response) {
    const megaMenuData = await ProductService.getMegaMenuProducts();
    const responseData = transformMediaURLs(req, megaMenuData);
    res.status(200).json(responseData);
  }

  //CRUD operations for products
  static async createProduct(req: Request, res: Response) {
    const newProduct = await ProductService.createProduct(req.body);
    const responseData = transformMediaURLs(req, newProduct);
    res.status(201).json(responseData);
  }

  static async updateProduct(req: Request, res: Response) {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId))
      throw new BadRequestError("Product ID must be a number.");

    const updatedProduct = await ProductService.updateProduct(
      productId,
      req.body
    );
    if (!updatedProduct)
      throw new NotFoundError(`Product with ID ${productId} not found.`);
    const responseData = transformMediaURLs(req, updatedProduct);
    res.status(200).json(responseData);
  }

  static async deleteProduct(req: Request, res: Response) {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId))
      throw new BadRequestError("Product ID must be a number.");

    const deletedProduct = await ProductService.softDeleteProduct(productId);
    if (!deletedProduct)
      throw new NotFoundError(`Product with ID ${productId} not found.`);

    res.status(200).json({
      message: "Product soft-deleted successfully.",
      product: deletedProduct,
    });
  }

  // --- CONTROLLERS CHO VARIANTS ---
  static async addVariant(req: Request, res: Response) {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId))
      throw new BadRequestError("Product ID must be a number.");

    const updatedProduct = await ProductService.addVariant(productId, req.body);
    res.status(200).json(updatedProduct);
  }

  static async updateVariant(req: Request, res: Response) {
    const productId = parseInt(req.params.id, 10);
    const sku = req.params.sku;
    if (isNaN(productId))
      throw new BadRequestError("Product ID must be a number.");

    const updatedProduct = await ProductService.updateVariant(
      productId,
      sku,
      req.body
    );
    res.status(200).json(updatedProduct);
  }

  static async removeVariant(req: Request, res: Response) {
    const productId = parseInt(req.params.id, 10);
    const sku = req.params.sku;
    if (isNaN(productId))
      throw new BadRequestError("Product ID must be a number.");

    const updatedProduct = await ProductService.removeVariant(productId, sku);
    res.status(200).json(updatedProduct);
  }

  static async getVerticalSliderMotorItems(req: Request, res: Response) {
    const activeSlug = req.params.slug || "";
    const items = await ProductService.getVerticalSliderMotorItems(activeSlug);
    if (!items) {
      throw new NotFoundError("No motorcycle products found.");
    }

    const transformedItems = transformMediaURLs(req, items);
    res.status(200).json(transformedItems);
  }

  static async getBuyingGuideItems(req: Request, res: Response) {
    const slug = req.params.slug as string;
    if (!slug) {
      throw new BadRequestError("Tham số 'slug' là bắt buộc.");
    }
    const product = await ProductService.getBuyingProducts(slug);
    if (!product) {
      throw new NotFoundError(`No buying guide found for slug: ${slug}`);
    }
    const responseData = transformMediaURLs(req, product);
    res.status(200).json(responseData);
  }
  // === Controllers cho các chức năng khác ===
  static async findByFilters(req: Request, res: Response) {
    const filters: FilterOptions = {
      type: req.query.type as string,
      tag: req.query.tag as string,
      slug: req.query.slug as string,
    };

    if (!filters.type && !filters.tag && !filters.slug) {
      throw new BadRequestError(
        "Cần cung cấp ít nhất một bộ lọc (type, tag, hoặc slug)."
      );
    }

    const options: FindProductsByFiltersOptions = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
      search: req.query.search as string,
    };

    const result = await ProductService.findByFilters(filters, options);
    if (!result.data.length) {
      throw new NotFoundError(
        "Không tìm thấy sản phẩm nào phù hợp với bộ lọc."
      );
    }

    // Áp dụng transformMediaURLs cho kết quả trả về
    result.data = transformMediaURLs(req, result.data);

    res.status(200).json(result);
  }
}
