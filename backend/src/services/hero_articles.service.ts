import { HeroArticlesModel, HeroArticlesDoc } from '../models/hero_articles.model';
import { CreateHeroArticlesZodType, UpdateHeroArticlesZodType } from '../types/hero_articles.type';
import { FilterQuery } from 'mongoose';

export interface HeroArticlesDisplayView {
    title: string;
    description: string;
    linkText: string;
    linkURL: string;
    mediaPath: string | null;
}

export interface HomepageHeroArticlesLayout {
    HomepageArticle: HeroArticlesDisplayView | null;
}
export interface FindHeroArticlesOptions {
    page?: number;
    limit?: number;
    search?: string;
}
export class HeroArticlesService {
    static async createHeroArticles(data: CreateHeroArticlesZodType) {
        return HeroArticlesModel.create(data);
    }
    static async updateHeroArticles(id: number, data: UpdateHeroArticlesZodType): Promise<HeroArticlesDoc | null> {
        return HeroArticlesModel.findByIdAndUpdate(id, data, { new: true });
    }
    static async softDeleteHeroArticles(_id: number) {
        const article = await HeroArticlesModel.findByIdAndUpdate(
            _id,
            { isDeleted: true },
            { new: true }
        );
        return article;
    }
    static async getHeroArticles() {
        const heroArticles = await HeroArticlesModel.find({ isDeleted: false }).lean();
        return heroArticles;
    }

    static async getHeroArticlesById(id: number) {
        const heroArticle = await HeroArticlesModel.findById(id).lean();
        if (!heroArticle || heroArticle.isDeleted) {
            throw new Error('Hero Article not found');
        }
        return heroArticle;
    }

    static async findAndPaginate(options: FindHeroArticlesOptions) {
        const { page = 1, limit = 10, search } = options;
        const filter: FilterQuery<HeroArticlesDoc> = { isDeleted: false };
        if (search) filter.title = new RegExp(search, "i");

        const [totalItems, data] = await Promise.all([
            HeroArticlesModel.countDocuments(filter),
            HeroArticlesModel.find(filter).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit)
                .populate({ path: 'image', select: 'mediaPath' }),
        ]);

        return { data, pagination: { totalItems, totalPages: Math.ceil(totalItems / limit), currentPage: page, limit } };
    }

    static async findById(id: number): Promise<HeroArticlesDoc | null> {
        return HeroArticlesModel.findOne({ _id: id, isDeleted: false })
            .populate({ path: 'image', select: 'mediaPath description' });
    }

    static async getHomepageLayout(): Promise<HomepageHeroArticlesLayout> {
        const HOMEPAGE = "homepage";

        const [HomepageHeroArticles] = await Promise.all([
            HeroArticlesModel.findOne({ tags: HOMEPAGE, isDeleted: false }).populate({ path: 'image', select: 'mediaPath' }),
            // ArticleIntroducesModel.findOne({ slug: COMMUNITY_SLUG, isDeleted: false }).populate({ path: 'image', select: 'mediaURL mediaPath' })
        ]);

        const transform = (heroArticle: HeroArticlesDoc | null, linkText: string): HeroArticlesDisplayView | null => {
            if (!heroArticle) return null;
            return {
                title: heroArticle.title,
                description: heroArticle.description,
                linkText: linkText,
                linkURL: heroArticle.articleURL || `/articles/${heroArticle.slug}`,
                mediaPath: heroArticle.image?.mediaPath || null
            };
        };
        const response: HomepageHeroArticlesLayout = {
            HomepageArticle: transform(HomepageHeroArticles, "TÌM HIỂU THÊM"),
            // communityArticle: transform(communityArticle, "TÌM HIỂU THÊM")
        };
        return response;
    }
}