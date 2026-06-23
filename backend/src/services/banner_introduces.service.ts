import { BannerIntroduceDoc, BannerIntroduceModel } from "../models/banner_introduces.model";
import { NotFoundError } from "../errors/index"

export interface BannerIntroduceResponse {
    _id: number;
    mediaPath: string | null;
    slug: string;
}

export interface FindAdminBannerIntroduce {
    page?: number; limit?: number; search?: string;
    type?: string; categoryCode?: string; isDeleted?: boolean;
}

export interface PaginatedBannerInfoResult {
    data: BannerIntroduceDoc[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export class BannerIntroduceService {
    private static async tranfermation(doc: BannerIntroduceDoc): Promise<BannerIntroduceResponse> {
        return {
            _id: doc._id,
            mediaPath: doc.media?.mediaPath || null,
            slug: doc.BannerSlug
        };
    }

    // <== Start: get area ==>
    static async getAllBannerIntroduces() {
        const bannerIntroduces = await BannerIntroduceModel.find({
            isdeleted: false,
            $or: [
                { isDisplay: true },
                { end_date: { $gte: new Date() }, isDisplay: true }
            ]
        })
            .populate({ path: 'media', select: 'mediaPath' });
        return Promise.all(bannerIntroduces.map(bi => this.tranfermation(bi)));
    }

    static async getBannerIntroduceById(bannerId: number) {
        const bannerIntroduce = await BannerIntroduceModel.findOne({
            isdeleted: false,
            $or: [
                { isDisplay: true },
                { end_date: { $gte: new Date() }, isDisplay: true }
            ],
            _id: bannerId
        })
            .populate({ path: 'media', select: 'mediaPath' });
        if (!bannerIntroduce) {
            throw new NotFoundError('Banner introduce not found');
        }
        return this.tranfermation(bannerIntroduce);
    }

    static async getBannerIntroduceBySlug(slug: string) {
        const bannerIntroduce = await BannerIntroduceModel.findOne({
            BannerSlug: slug,
            isdeleted: false,
            $or: [
                { isDisplay: true },
                { end_date: { $gte: new Date() }, isDisplay: true }
            ]
        })
            .populate({ path: 'media', select: 'mediaPath' });
        if (!bannerIntroduce) {
            throw new NotFoundError('Banner introduce not found');
        }
        return this.tranfermation(bannerIntroduce);
    }

    static async findAndPaginateForAdmin(options: FindAdminBannerIntroduce): Promise<PaginatedBannerInfoResult> {
        const { page = 1, limit = 10, search, type, categoryCode, isDeleted } = options;

        const query: any = { isdeleted: isDeleted !== undefined ? isDeleted : false };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        if (type) {
            query.type = type;
        }

        if (categoryCode) {
            query.categoryCode = categoryCode;
        }

        const totalItems = await BannerIntroduceModel.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const currentPage = page;

        const sortOptions = { created_date: -1 };

        const bannerIntroduces = await BannerIntroduceModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(sortOptions);

        return {
            data: bannerIntroduces,
            pagination: {
                totalItems,
                totalPages,
                currentPage,
                limit,
            },
        };
    }
    // <== End: get area ==>

    // <== Start: create area ==>
    static async createBannerIntroduce(data: any) {
        const bannerIntroduce = BannerIntroduceModel.build(data);
        await bannerIntroduce.save();

        const bannerIntroduceFinal = await bannerIntroduce.populate({ path: 'media', select: 'mediaPath' });
        return this.tranfermation(bannerIntroduceFinal);
    }
    // <== End: create area ==>

    // <== Start: update area ==>
    static async updateBannerIntroduce(bannerId: number, data: any) {
        const bannerIntroduce = await BannerIntroduceModel.findByIdAndUpdate(bannerId, data, { new: true })
            ?.populate({ path: 'media', select: 'mediaPath' });
        if (!bannerIntroduce) {
            throw new NotFoundError('Banner introduce not found');
        }
        return this.tranfermation(bannerIntroduce);
    }
    // <== End: update area ==>

    // <== Start: delete area ==>
    static async deleteBannerIntroduce(bannerId: number) {
        const bannerIntroduce = await BannerIntroduceModel.findByIdAndDelete(bannerId);
        if (!bannerIntroduce) {
            throw new NotFoundError('Banner introduce not found');
        }

        bannerIntroduce.isdeleted = true;
        bannerIntroduce.isDisplay = false;
        await bannerIntroduce.save();
        const bannerIntroduceFinal = await bannerIntroduce.populate({ path: 'media', select: 'mediaPath' });
        return this.tranfermation(bannerIntroduceFinal);
    }
    // <== End: delete area ==>
}
