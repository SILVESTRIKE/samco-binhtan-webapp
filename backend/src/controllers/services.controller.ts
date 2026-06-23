import { Request, Response } from 'express';
import { ServiceService } from '../services/services.service';
import { NotFoundError, BadRequestError } from '../errors';
import { transformMediaURLs } from '../utils/media.util';
export class ServiceController {
    static async getHomePageLayout(req: Request, res: Response) {
        const layoutData = await ServiceService.getHomePageLayout();
        if (layoutData) {
            const transformedData = transformMediaURLs(req, layoutData);
            res.status(200).json(transformedData);
        }
        else {
            throw new NotFoundError('Layout data not found');
        }
    }
    static async getServices(req: Request, res: Response) {
        const options = {
            page: req.query.page ? parseInt(req.query.page as string) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            search: req.query.search as string,
            isDeleted: req.query.isDeleted ? req.query.isDeleted === 'true' : undefined
        };

        const result = await ServiceService.findAndPaginate(options);
        if (result) {
            const transformedResult = transformMediaURLs(req, result);
            res.status(200).json(transformedResult);
        }
        else {
            throw new NotFoundError("No services found");
        }
    }

    static async getServiceById(req: Request, res: Response) {
        const service_id = parseInt(req.params.id);
        if (isNaN(service_id)) {
            throw new BadRequestError('ID has to be a number.');
        }

        const service = await ServiceService.findById(service_id);
        if (!service) {
            throw new NotFoundError(`Can't find service with ID: ${service_id}`);
        }
        const transfermationService = transformMediaURLs(req, service);
        res.status(200).json(transfermationService);
    }

    static async createService(req: Request, res: Response) {
        const newService = await ServiceService.createService(req.body);
        const transformedService = transformMediaURLs(req, newService);
        res.status(201).json(transformedService);
    }

    static async updateService(req: Request, res: Response) {
        const service_id = parseInt(req.params.id);
        if (isNaN(service_id)) {
            throw new BadRequestError('ID has to be a number.');
        }

        const updatedService = await ServiceService.updateService(service_id, req.body);
        if (!updatedService) {
            throw new NotFoundError(`Can't find media with ID: ${service_id}`);
        }
        const transformedUpdatedService = transformMediaURLs(req, updatedService);
        res.status(200).json(transformedUpdatedService);
    }

    static async deleteService(req: Request, res: Response) {
        const service_id = parseInt(req.params.id);
        if (isNaN(service_id)) {
            throw new BadRequestError('ID has to be a number.');
        }

        const isDeleted = await ServiceService.softDeleteService(service_id);
        if (!isDeleted) {
            throw new NotFoundError(`Can't find media with ID: ${service_id}.`);
        }

        res.status(204).send();
    }

}