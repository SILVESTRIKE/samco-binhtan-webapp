import { FilterQuery } from "mongoose";
import { ServiceModel, ServiceDoc } from "../models/services.model";
import { CreateServiceZodType, UpdateServiceZodType } from "../types/services.type";

export interface ServiceDisplayView {
  id: number;
  title: string;
  slug: string;
  description: string;
  mediaPath?: string | null;
  detailLink: string;
}

export interface HomePageLayoutData {
  carChargerServices: ServiceDisplayView[];
  motorbikeChargerServices: ServiceDisplayView[];
  mobileChargerFeature: ServiceDisplayView | null;
}

export interface FindServicesOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  isDeleted?: boolean;
}

export interface PaginatedServiceResult {
  data: ServiceDoc[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export class ServiceService {

  static async createService(serviceData: CreateServiceZodType): Promise<ServiceDoc> {
    return ServiceModel.create(serviceData);
  }

  static async updateService(id: number, serviceData: UpdateServiceZodType): Promise<ServiceDoc | null> {
    return ServiceModel.findByIdAndUpdate(id, serviceData, { new: true });
  }

  static async softDeleteService(_id: number): Promise<ServiceDoc | null> {
    const service = await ServiceModel.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true }
    );
    return service;
  }

  static async findAndPaginate(
    options: FindServicesOptions
  ): Promise<PaginatedServiceResult> {
    const page = options.page || 1;
    const limit = options.limit || 10;


    const filter: FilterQuery<ServiceDoc> = {
      isDeleted: options.isDeleted !== undefined ? options.isDeleted : false,
    };

    if (options.search) {
      filter.title = new RegExp(options.search, "i");
    }

    const sortOptions = { title: 1 }; // Sắp xếp theo alphabet cho dễ quản lý


    const [totalItems, services] = await Promise.all([
      ServiceModel.countDocuments(filter),
      ServiceModel.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: 'image', select: 'mediaPath' }) // Populate ảnh để xem trong danh sách admin

    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: services,
      pagination: { totalItems, totalPages, currentPage: page, limit },
    };
  }

  static async findById(service_id: number): Promise<ServiceDoc | null> {
    return await ServiceModel.findOne({ _id: service_id, isDeleted: false })
      .populate({ path: 'image', select: 'mediaPath description' });
  }
  static async getHomePageLayout(): Promise<HomePageLayoutData> {
    const CAR_CHARGER_SLUG = 'pin-tram-sac-o-to-dien';
    const MOTORBIKE_CHARGER_SLUG = 'pin-tram-sac-xe-may-dien';
    const MOBILE_CHARGER_SLUG = 'thiet-bi-sac-di-dong';

    const [
      carService,
      motorbikeService,
      mobileChargerService
    ] = await Promise.all([
      ServiceModel.findOne({ slug: CAR_CHARGER_SLUG, isDeleted: false }).populate({ path: 'image', select: 'mediaPath' }),

      ServiceModel.findOne({ slug: MOTORBIKE_CHARGER_SLUG, isDeleted: false }).populate({ path: 'image', select: 'mediaPath' }),
      ServiceModel.findOne({ slug: MOBILE_CHARGER_SLUG, isDeleted: false }).populate({ path: 'image', select: 'mediaPath' })

    ]);
    const transformToDisplayView = (service: ServiceDoc | null): ServiceDisplayView | null => {
      // Logic bên trong đã đúng: kiểm tra null trước.
      if (!service) {
        return null;
      }

      return {
        id: service._id,
        title: service.title,
        slug: service.slug,
        description: service.description,
        mediaPath: service?.image?.mediaPath || null,
        detailLink: service.urlDetail || `/services/${service.slug}`
      };
    };

    const response: HomePageLayoutData = {

      // Logic này bây giờ đã hoàn toàn an toàn.
      // Nếu carService là null, transformToDisplayView sẽ trả về null.
      // Hàm IIFE sẽ nhận null và trả về mảng rỗng [].
      carChargerServices: ((view) => view ? [view] : [])(transformToDisplayView(carService)),

      motorbikeChargerServices: ((view) => view ? [view] : [])(transformToDisplayView(motorbikeService)),

      mobileChargerFeature: transformToDisplayView(mobileChargerService)
    };

    return response;
  }
}
