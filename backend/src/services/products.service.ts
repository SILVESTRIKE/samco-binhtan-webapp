import { FilterQuery } from "mongoose";
import { ProductModel, ProductDoc } from "../models/products.model";
import {
  ProductZodType,
  UpdateProductZodType,
  VariantZodType,
} from "../types/products.type";
import { CategoryService } from "./categories.service";
import { CategoryModel } from "../models/categories.model";
import { NotFoundError, BadRequestError } from "../errors";

export interface HomepageSliderItem {
  id: number;
  name: string;
  productImageUrl: string | null;
  keyAttributes: { name: string; value: string }[];
  priceDisplay: string;
  detailUrl: string;
}

export interface BuyingGuideItem {
  id: number;
  slug: string;
  priceDisplay: string;
  variants: {
    sku: string;
    mediaPath: string | null;
  }[];
  keyAttributes: { name: string; value: string }[];
  productName: string;
  base_price: number;
}

export interface VerticalSliderMotorItem {
  id: number;
  name: string;
  mediaPath: string | null;
  slug: string;
  active: boolean;
}

export interface HomepageSlidersData {
  carSliderItems: HomepageSliderItem[];
  motorcycleSliderItems: HomepageSliderItem[];
}

export interface PaginatedProductCardResult {
  data: ProductCardView[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
export interface FilterOptions {
  type?: string;
  tag?: string;
  slug?: string;
}
interface ImageSliderItem {
  mediaPath: string | null;
  description: string | null;
}
export interface ProductCardView {
  id: number;
  name: string;
  slug: string;
  priceDisplay: string;
  status: string; // 'Mới', 'Bán chạy',...
  slogan: string | null;
  featureSlider?: ImageSliderItem[];
  mediaPath?: string | null;
}

export interface PaginatedProductResult {
  data: ProductDoc[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
export interface FindAdminProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  categoryCode?: string;
  isDeleted?: boolean;
  slug?: string;
}
export interface FindPublicProductsOptions {
  page?: number;
  limit?: number;
}
// Interface cho các tùy chọn tìm kiếm công khai
export interface FindProductsByFiltersOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

//Service class để quản lý các sản phẩm
export class ProductService {
  private static _calculateVariantPrice(
    variant: Pick<VariantZodType, "selected_options">,
    productData: Pick<ProductZodType, "base_price" | "configurable_options">
  ): number {
    let calculatedPrice = productData.base_price || 0;

    if (productData.configurable_options) {
      for (const selected of variant.selected_options) {
        const optionGroup = productData.configurable_options.find(
          (g) => g.name === selected.option_name
        );
        if (optionGroup) {
          const optionValue = optionGroup.values.find(
            (v) => v.value === selected.option_value
          );
          if (optionValue) {
            calculatedPrice += optionValue.price_adjustment;
          }
        }
      }
    }
    return calculatedPrice;
  }
  private static _transformToCardView(product: ProductDoc): ProductCardView {
    const sloganAttr = product.attributes.find((attr) => attr.key === "slogan");
    return {
      id: product._id,
      name: product.name,
      slug: product.slug,
      priceDisplay: `${product.base_price?.toLocaleString("vi-VN")} đ`,
      status: product.status,
      slogan: sloganAttr ? sloganAttr.value : null,
      mediaPath: product.main_image ? product.main_image.mediaPath : null,
    };
  }
  //=== Các hàm CRUD ===
  static async createProduct(productData: ProductZodType): Promise<ProductDoc> {
    const category = await CategoryService.findByCode(
      productData.category_code
    );
    if (!category) {
      throw new NotFoundError(
        `Category with code '${productData.category_code}' does not exist.`
      );
    }

    if (productData.variants) {
      const skus = productData.variants.map((v) => v.sku);
      if (new Set(skus).size !== skus.length) {
        throw new BadRequestError(
          "Duplicate SKUs found in the provided variants."
        );
      }

      productData.variants.forEach((variant) => {
        variant.final_price = this._calculateVariantPrice(variant, productData);
      });
    }

    const newProduct = await ProductModel.create(productData);
    return (await this.findById(newProduct._id))!;
  }

  static async updateProduct(
    productId: number,
    productData: UpdateProductZodType
  ): Promise<ProductDoc | null> {
    if (productData.category_code) {
      const category = await CategoryService.findByCode(
        productData.category_code
      );
      if (!category) {
        throw new NotFoundError(
          `Category with code '${productData.category_code}' does not exist.`
        );
      }
    }

    const product = await this.findById(productId);
    if (!product)
      throw new NotFoundError(`Product with ID ${productId} not found.`);

    const needPriceRecalculation =
      productData.base_price !== undefined ||
      productData.configurable_options !== undefined;

    if (needPriceRecalculation) {
      const futureProductState = { ...product.toObject(), ...productData };

      futureProductState.variants.forEach((variant: any) => {
        variant.final_price = this._calculateVariantPrice(
          variant,
          futureProductState
        );
      });
      productData.variants = futureProductState.variants;
    }

    return ProductModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { $set: productData },
      { new: true }
    ).populate("category");
  }

  static async softDeleteProduct(id: number): Promise<ProductDoc | null> {
    return ProductModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
  static async getHomepageSlidersData(): Promise<{
    cars: ProductDoc[];
    motorcycles: ProductDoc[];
  }> {
    const [cars, motorcycles] = await Promise.all([
      ProductModel.find({ type: "o-to", isDeleted: false })
        .sort({ _id: 1 })
        .populate({ path: "main_image", select: "mediaPath name description" }),

      ProductModel.find({ type: "xe-may", isDeleted: false })
        .sort({ _id: 1 })
        .populate({ path: "main_image", select: "mediaPath name description" }),
    ]);
    return { cars, motorcycles };
  }
  static async findProductCards(
    tag: string,
    options: FindPublicProductsOptions
  ): Promise<PaginatedProductCardResult> {
    const { page = 1, limit = 12 } = options;
    const filter = { tags: tag, isDeleted: false };
    const [totalItems, products] = await Promise.all([
      ProductModel.countDocuments(filter),
      ProductModel.find(filter)
        .sort({ _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "main_image", select: "mediaPath" }),
    ]);

    const transformedData = products.map((product) => {
      const card = this._transformToCardView(product);
      return card;
    });

    return {
      data: transformedData,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }

  static async findProductFeatureSliders(
    tag: string,
    options: FindPublicProductsOptions
  ): Promise<PaginatedProductCardResult> {
    const { page = 1, limit = 4 } = options;
    const filter = { tags: tag, isDeleted: false };
    const [totalItems, products] = await Promise.all([
      ProductModel.countDocuments(filter),
      ProductModel.find(filter)
        .sort({ _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "main_image gallery_images",
          select: "mediaPath description",
        }),
    ]);

    const transformedData = products.map((product) => {
      const card = this._transformToCardView(product);
      (card as any).gallery_images = (product.gallery_images || []).map(
        (img: any) => ({
          description: img.description,
          mediaPath: img.mediaPath,
        })
      );
      return card;
    });

    return {
      data: transformedData,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }
  static async findAndPaginateForAdmin(
    options: FindAdminProductsOptions
  ): Promise<PaginatedProductResult> {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      categoryCode,
      isDeleted = false,
      slug,
    } = options;
    const filter: FilterQuery<ProductDoc> = { isDeleted };
    if (search) filter.name = new RegExp(search, "i");
    if (type) filter.type = type;
    if (categoryCode) filter.category_code = categoryCode;
    if (slug) filter.slug = slug;

    const sortOptions = { created_date: -1 };

    const [totalItems, data] = await Promise.all([
      ProductModel.countDocuments(filter),
      ProductModel.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category"),
    ]);

    return {
      data,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }

  /**
   * PHƯƠNG THỨC MỚI ĐỂ SỬA LỖI
   * Tìm và phân trang sản phẩm dựa trên nhiều bộ lọc khác nhau.
   */
  static async findByFilters(
    filters: FilterOptions,
    options: FindProductsByFiltersOptions
  ): Promise<PaginatedProductResult> {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_date",
      sortOrder = "desc",
      search,
    } = options;

    const filterQuery: FilterQuery<ProductDoc> = { isDeleted: false };

    if (search) {
      filterQuery.name = new RegExp(search, "i");
    }
    if (filters.type) {
      filterQuery.type = filters.type;
    }
    if (filters.tag) {
      filterQuery.tags = { $in: [filters.tag] }; // Tìm sản phẩm có tag nằm trong mảng tags
    }
    if (filters.slug) {
      filterQuery.slug = filters.slug;
    }

    const sortOptions: { [key: string]: 1 | -1 } = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [totalItems, data] = await Promise.all([
      ProductModel.countDocuments(filterQuery),
      ProductModel.find(filterQuery)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category")
        .populate({ path: "main_image", select: "mediaPath" }),
    ]);

    return {
      data,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
    };
  }

  static async findById(productId: number): Promise<ProductDoc | null> {
    return ProductModel.findOne({ _id: productId, isDeleted: false })
      .populate("category")
      .populate({ path: "main_image", select: "id name mediaPath description" })
      .populate({
        path: "gallery_images",
        select: "id name mediaPath description",
      });
  }

  //=== trang chi tiết sản phẩm ===
  static async findBySlug(slug: string): Promise<ProductDoc | null> {
    return ProductModel.findOne({ slug, isDeleted: false })
      .populate("category")
      .populate({ path: "main_image", select: "id name mediaPath description" })
      .populate({
        path: "gallery_images",
        select: "id name mediaPath description",
      })
      .populate({
        path: "variants.variant_medias",
        select: "id sku mediaPath",
      });
  }

  static async getProductOverview(
    productId: number
  ): Promise<Partial<ProductDoc> | null> {
    return ProductModel.findOne({ _id: productId, isDeleted: false })
      .select("name slug base_price status tags main_image_id")
      .populate({ path: "main_image", select: "mediaPath" });
  }

  static async getProductGallery(productId: number): Promise<any[]> {
    const product = await ProductModel.findOne({
      _id: productId,
      isDeleted: false,
    })
      .select("gallery_image_ids")
      .populate({ path: "gallery_images", select: "mediaPath description" });
    if (!product || !product.gallery_images) {
      return [];
    }
    return product.gallery_images;
  }

  static async getProductSpecifications(
    productId: number
  ): Promise<any[] | null> {
    const product = await ProductModel.findOne({
      _id: productId,
      isDeleted: false,
    }).select("attributes");
    return product ? product.attributes : null;
  }

  static async getProductConfiguration(productId: number): Promise<any | null> {
    const product = await ProductModel.findOne({
      _id: productId,
      isDeleted: false,
    }).select("configurable_options variants");
    if (!product) return null;
    return {
      options: product.configurable_options,
      variants: product.variants,
    };
  }
  //=== Các hàm chờ cho việc tăng giảm tồn kho ===
  static async addVariant(
    productId: number,
    variantData: VariantZodType
  ): Promise<ProductDoc> {
    const product = await this.findById(productId);
    if (!product)
      throw new NotFoundError(`Product with ID ${productId} not found.`);
    if (product.variants.some((v) => v.sku === variantData.sku)) {
      throw new BadRequestError(
        `Variant with SKU='${variantData.sku}' already exists.`
      );
    }

    const calculatedPrice = this._calculateVariantPrice(variantData, product);

    const completeVariant = {
      ...variantData,
      final_price: calculatedPrice,
      stock_quantity: variantData.stock_quantity || 0,
    };

    product.variants.push(completeVariant as any);
    await product.save();
    return product;
  }

  static async updateVariant(
    productId: number,
    sku: string,
    variantUpdateData: Partial<VariantZodType>
  ): Promise<ProductDoc> {
    const product = await this.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product with ID ${productId} not found.`);
    }

    const variantIndex = product.variants.findIndex((v) => v.sku === sku);
    if (variantIndex === -1) {
      throw new NotFoundError(
        `Variant with SKU='${sku}' not found in this product.`
      );
    }

    const existingVariant = product.variants[variantIndex];
    const updatedVariantData = { ...existingVariant, ...variantUpdateData };

    updatedVariantData.final_price = this._calculateVariantPrice(
      updatedVariantData,
      product
    );

    product.variants[variantIndex] = updatedVariantData as any;

    await product.save();
    return product;
  }

  static async removeVariant(
    productId: number,
    sku: string
  ): Promise<ProductDoc> {
    const product = await this.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product with ID ${productId} not found.`);
    }

    const initialLength = product.variants.length;
    product.variants = product.variants.filter((v) => v.sku !== sku);

    if (product.variants.length === initialLength) {
      throw new NotFoundError(
        `Variant with SKU='${sku}' not found in this product.`
      );
    }

    await product.save();
    return product;
  }

  //các hàm chờ cho việc tăng giảm tồn kho
  static async decreaseStock(
    productId: number,
    sku: string,
    quantityToDecrease: number
  ): Promise<void> {
    throw new Error(`Function 'decreaseStock' is not implemented yet.`);
  }
  static async increaseStock(
    productId: number,
    sku: string,
    quantityToIncrease: number
  ): Promise<void> {
    throw new Error(`Function 'increaseStock' is not implemented yet.`);
  }
  static async getVerticalSliderMotorItems(
    slug: string
  ): Promise<VerticalSliderMotorItem[]> {
    const motorcycles = await ProductModel.find({
      type: "xe-may",
      isDeleted: false,
    })
      .sort({ _id: 1 })
      .select("name slug main_image_id")
      .populate({ path: "main_image", select: "mediaPath" });
    return motorcycles.map((moto) => ({
      id: moto._id,
      name: moto.name,
      mediaPath: moto.main_image ? moto.main_image.mediaPath : null,
      slug: moto.slug,
      active: moto.slug === slug,
    }));
  }

  private static _transformToBuyingView(product: ProductDoc): BuyingGuideItem {
    return {
      id: product._id,
      productName: product.name,
      slug: product.slug,
      priceDisplay: `${product.base_price?.toLocaleString("vi-VN")} đ`,
      keyAttributes: product.attributes.slice(0, 3),
      base_price: product.base_price,
      variants: product.variants.map((variant) => ({
        sku: variant.sku,
        mediaPath: variant.variant_medias
          ? variant.variant_medias[1].mediaPath
          : null,
      })),
    };
  }

  static async getBuyingProducts(slug: string): Promise<BuyingGuideItem> {
    const product = await this.findBySlug(slug);

    if (!product) {
      throw new NotFoundError(`Product with slug '${slug}' not found.`);
    }

    const result = this._transformToBuyingView(product);
    return result;
  }

  static async getMegaMenuProducts(): Promise<{ [categoryName: string]: any[] }> {
    const categories = await CategoryModel.find({ isDeleted: false }).lean();
    const products = await ProductModel.find({ isDeleted: false })
      .populate({ path: 'main_image', select: 'mediaPath' })
      .lean();
      
    const result: { [categoryName: string]: any[] } = {};
    for (const cat of categories) {
      const catProducts = products.filter(p => p.category_code === cat.code);
      if (catProducts.length > 0) {
        result[cat.name] = catProducts.map(p => ({
          id: p.slug,
          name: p.name,
          mediaPath: p.main_image ? p.main_image.mediaPath : null
        }));
      }
    }
    return result;
  }
}
