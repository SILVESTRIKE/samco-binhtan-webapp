import { IntroCardsModel, IntroCardsDoc } from '../models/intro_cards.model';
import { CreateIntroCardsZodType, UpdateIntroCardsZodType } from '../types/intro_cards.type';
import { FilterQuery } from 'mongoose';

export interface IntroCardsDisplayView {
    title: string;
    // description: string;
    linkText: string;
    linkURL: string;
    mediaPath: string | null;
}

export interface HomepageIntroCardsLayout {
    HomepageArticle: IntroCardsDisplayView | null;
}
export interface FindIntroCardsOptions {
    page?: number;
    limit?: number;
    search?: string;
}
export class IntroCardsService {
    static async createIntroCards(data: CreateIntroCardsZodType) {
        return IntroCardsModel.create(data);
    }
    static async updateIntroCards(id: number, data: UpdateIntroCardsZodType): Promise<IntroCardsDoc | null> {
        return IntroCardsModel.findByIdAndUpdate(id, data, { new: true });
    }
    static async softDeleteIntroCards(_id: number) {
        const article = await IntroCardsModel.findByIdAndUpdate(
            _id,
            { isDeleted: true },
            { new: true }
        );
        return article;
    }
    static async getIntroCards() {
        const introCards = await IntroCardsModel.find({ isDeleted: false }).lean();
        return introCards;
    }

    static async getIntroCardsById(id: number) {
        const introCard = await IntroCardsModel.findById(id).lean();
        if (!introCard || introCard.isDeleted) {
            throw new Error('Intro Card not found');
        }
        return introCard;
    }

    static async findAndPaginate(options: FindIntroCardsOptions) {
        const { page = 1, limit = 10, search } = options;
        const filter: FilterQuery<IntroCardsDoc> = { isDeleted: false };
        if (search) filter.title = new RegExp(search, "i");

        const [totalItems, data] = await Promise.all([
            IntroCardsModel.countDocuments(filter),
            IntroCardsModel.find(filter).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit)
                .populate({ path: 'image', select: 'mediaPath' }),
        ]);

        return { data, pagination: { totalItems, totalPages: Math.ceil(totalItems / limit), currentPage: page, limit } };
    }

    static async findById(id: number): Promise<IntroCardsDoc | null> {
        return IntroCardsModel.findOne({ _id: id, isDeleted: false })
            .populate({ path: 'image', select: 'mediaPath description' });
    }

    static async getHomepageLayout(): Promise<any> { // Bạn có thể cần thay đổi kiểu trả về
        const HOMEPAGE = "homepage";

        const [homepageIntroCards] = await Promise.all([
            IntroCardsModel.find({ tags: HOMEPAGE, isDeleted: false }).populate({ path: 'image', select: 'mediaPath' }),
        ]);

        const transform = (introCard: IntroCardsDoc, linkText: string): IntroCardsDisplayView => {
            return {
                title: introCard.title,
                linkText: linkText,
                linkURL: introCard.articleURL || `/articles/${introCard.slug}`,
                mediaPath: introCard.image?.mediaPath || null
            };
        };

        const response = {
            HomepageArticles: homepageIntroCards.map(card => transform(card, "TÌM HIỂU THÊM")),
        };

        return response;
    }
}