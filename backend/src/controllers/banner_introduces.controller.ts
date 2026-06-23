import { NextFunction, Request, Response } from "express";
import { BannerIntroduceService, FindAdminBannerIntroduce } from "../services/banner_introduces.service";
import { BannerIntroduceZodSchema } from "../types/banner_introduces.types";
import { BadRequestError, NotFoundError } from "../errors";
import { transformMediaURLs } from "../utils/media.util";

export class BannerIntroducesController {

    // <=== Start: get area ===>
    static async getAllBannerIntroduce(req: Request, res: Response, next: NextFunction) {
        const bannerIntroduce = await BannerIntroduceService.getAllBannerIntroduces();

        if (bannerIntroduce) {
            const transformedBannerIntroduce = transformMediaURLs(req, bannerIntroduce);
            res.status(200).json({
                success: true,
                message: "Banner introduce fetched successfully",
                data: transformedBannerIntroduce,
            });
        } else {
            throw new NotFoundError("Failed to fetch banner introduce");
        }
    }

    static async getBannerIntroduceById(req: Request, res: Response, next: NextFunction) {
        const bannerIntroduceId = req.params.id;
        const bannerIntroduce = await BannerIntroduceService.getBannerIntroduceById(Number(bannerIntroduceId));
        if (bannerIntroduce) {
            const transformedBannerIntroduce = transformMediaURLs(req, bannerIntroduce);
            res.status(200).json({
                success: true,
                message: "Banner introduce fetched successfully",
                data: transformedBannerIntroduce,
            });
        } else {
            throw new NotFoundError("Failed to fetch banner introduce");
        }
    }

    static async getBannerIntroduceBySlug(req: Request, res: Response, next: NextFunction) {
        const bannerIntroduceSlug = req.params.slug;
        const bannerIntroduce = await BannerIntroduceService.getBannerIntroduceBySlug(bannerIntroduceSlug);
        if (bannerIntroduce) {
            const transformedBannerIntroduce = transformMediaURLs(req, bannerIntroduce);
            res.status(200).json({
                success: true,
                message: "Banner introduce fetched successfully",
                data: transformedBannerIntroduce,
            });
        } else {
            throw new NotFoundError("Failed to fetch banner introduce");
        }
    }

    static async getBannerIntroduceForAdmin(req: Request, res: Response, next: NextFunction) {
        const options: FindAdminBannerIntroduce = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            search: req.query.search as string,
            type: req.query.type as string,
            categoryCode: req.query.categoryCode as string,
            isDeleted: req.query.isDeleted === 'true'
        };
        const bannerIntroduce = await BannerIntroduceService.findAndPaginateForAdmin(options);
        if (bannerIntroduce) {
            const transformedBannerIntroduce = transformMediaURLs(req, bannerIntroduce);
            res.status(200).json({
                success: true,
                message: "Banner introduce fetched successfully",
                data: transformedBannerIntroduce,
            });
        } else {
            throw new NotFoundError("Failed to fetch banner introduce");
        }
    }
    // <=== End: get area ===>

    // <=== Start: create area ===>
    static async createBannerIntroduce(req: Request, res: Response, next: NextFunction) {

        const validatedSchema = BannerIntroduceZodSchema.safeParse(req.body);

        const newBannerIntroduce = await BannerIntroduceService.createBannerIntroduce(validatedSchema.data);

        if (newBannerIntroduce) {
            const transformedBannerIntroduce = transformMediaURLs(req, newBannerIntroduce);
            res.status(201).json({
                success: true,
                message: "Banner introduce created successfully",
                data: transformedBannerIntroduce,
            });
        } else {
            throw new BadRequestError("Failed to create banner introduce");
        }
    }
    // <=== End: create area ===>

    // <=== Start: update area ===>
    static async updateBannerIntroduce(req: Request, res: Response, next: NextFunction) {
        const bannerIntroduceId = req.params.id;
        const validatedSchema = BannerIntroduceZodSchema.safeParse(req.body);

        if (!validatedSchema.success) {
            throw new BadRequestError("Invalid data provided");
        }

        const updatedBannerIntroduce = await BannerIntroduceService.updateBannerIntroduce(Number(bannerIntroduceId), validatedSchema.data);

        if (updatedBannerIntroduce) {
            const transformedBannerIntroduce = transformMediaURLs(req, updatedBannerIntroduce);
            res.status(200).json({
                success: true,
                message: "Banner introduce updated successfully",
                data: transformedBannerIntroduce,
            });
        } else {
            throw new NotFoundError("Failed to update banner introduce");
        }
    }
    // <=== End: update area ===>

    // <=== Start: delete area ===>
    static async deleteBannerIntroduce(req: Request, res: Response, next: NextFunction) {
        const bannerIntroduceId = req.params.id;

        const deletedBannerIntroduce = await BannerIntroduceService.deleteBannerIntroduce(Number(bannerIntroduceId));

        if (deletedBannerIntroduce) {
            res.status(204).send();
        } else {
            throw new NotFoundError("Failed to delete banner introduce");
        }
    }
    // <=== End: delete area ===>
}