import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { CounterModel } from "../models/counters.model";
import { UserModel } from "../models/users.model";
import { MediaModel } from "../models/medias.model";
import { CategoryModel } from "../models/categories.model";
import { ProductModel } from "../models/products.model";
import { BannerIntroduceModel } from "../models/banner_introduces.model";
import { IntroCardsModel } from "../models/intro_cards.model";
import { HeroArticlesModel } from "../models/hero_articles.model";

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/samco_db";

/**
 * Helper to download external images and save them under uploads/images/YYYY/MM
 */
async function downloadImageAndCreateMedia(url: string, name: string, description: string, creatorId: number): Promise<any> {
    try {
        const fileTypeDir = "images";
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, "0"); 
        const dateString = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${now.getFullYear()}`;
        const randomChars = crypto.randomBytes(3).toString("hex").slice(0, 5);
        
        let extension = ".png";
        try {
            const urlPath = new URL(url).pathname;
            const ext = path.extname(urlPath);
            if (ext && ext.length <= 5) extension = ext;
        } catch (e) {}

        const newFilename = `${dateString}_${randomChars}${extension}`;
        const relativeFolder = path.join("uploads", fileTypeDir, year, month);
        const absoluteFolder = path.join(process.cwd(), relativeFolder);
        
        // Ensure folder exists
        fs.mkdirSync(absoluteFolder, { recursive: true });
        
        const destinationPath = path.join(absoluteFolder, newFilename);
        const relativeMediaPath = path.join(relativeFolder, newFilename).replace(/\\/g, "/");

        console.log(`Downloading: ${url} -> ${relativeMediaPath}`);
        
        const response = await axios({
            method: "get",
            url: url,
            responseType: "stream",
            timeout: 10000 // 10s timeout
        });

        const writer = fs.createWriteStream(destinationPath);
        response.data.pipe(writer);

        await new Promise<void>((resolve, reject) => {
            writer.on("finish", () => resolve());
            writer.on("error", (err) => reject(err));
        });

        // Create Media Model entry
        const mediaDoc = new MediaModel({
            name,
            mediaPath: relativeMediaPath,
            description,
            type: "image",
            creator_id: creatorId
        });
        await mediaDoc.save();
        return mediaDoc;
    } catch (err: any) {
        console.error(`Failed to download image ${url} (${err.message}). Using external fallback.`);
        // Return a mock fallback Media document using external link if download fails
        const mediaDoc = new MediaModel({
            name,
            mediaPath: url,
            description,
            type: "image",
            creator_id: creatorId
        });
        await mediaDoc.save();
        return mediaDoc;
    }
}

const seed = async () => {
    try {
        console.log(`Connecting to MongoDB at: ${DATABASE_URL}...`);
        await mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("Connected to MongoDB successfully!");

        // Drop existing collections to start fresh
        const collections = ["users", "counters", "medias", "categories", "products", "banner_introduce", "intro_cards", "hero_articles", "refresh_tokens"];
        for (const col of collections) {
            try {
                await mongoose.connection.db.dropCollection(col);
                console.log(`Dropped collection: ${col}`);
            } catch (err) {
                // Collection might not exist, ignore
            }
        }

        // 1. Seed Counters
        console.log("Seeding counters...");
        await CounterModel.insertMany([
            { _id: "user_id", seq: 0 },
            { _id: "media_id", seq: 0 },
            { _id: "category_id", seq: 0 },
            { _id: "product_id", seq: 0 },
            { _id: "banner_introduce_id", seq: 0 },
            { _id: "intro_cards_id", seq: 0 },
            { _id: "hero_articles_id", seq: 0 }
        ]);

        // 2. Seed Users
        console.log("Seeding users...");
        const adminPassword = await bcrypt.hash("admin123", 10);
        const adminUser = new UserModel({
            username: "Administrator",
            email: "admin@gmail.com",
            password: adminPassword,
            role: "admin",
            verify: true
        });
        await adminUser.save();
        console.log(`Admin user created: admin@gmail.com / admin123`);

        // 3. Seed Categories
        console.log("Seeding categories...");
        const catList = [
            { code: "xe-khach-xe-buyt", name: "Xe khách - Xe buýt" },
            { code: "xe-chuyen-dung", name: "Xe chuyên dụng" },
            { code: "xe-du-lich", name: "Xe du lịch" },
            { code: "xe-tai", name: "Xe tải" },
            { code: "can-cau", name: "Cần cẩu" },
            { code: "dich-vu-cho-thue", name: "Dịch vụ cho thuê" },
            { code: "o-to", name: "Ô tô" },
            { code: "xe-may", name: "Xe máy" },
            { code: "phu-kien", name: "Phụ kiện" }
        ];

        const categoryDocs: { [code: string]: any } = {};
        for (const cat of catList) {
            const doc = new CategoryModel({
                code: cat.code,
                name: cat.name,
                parent_code: null,
                ancestors: []
            });
            await doc.save();
            categoryDocs[cat.code] = doc;
        }

        // 4. Seed Products and download assets dynamically
        console.log("Downloading and seeding products...");

        // Product list with names, categories, and external image URLs
        const rawProducts = [
            // Xe khách - Xe buýt
            {
                name: "SAMCO GROWIN LI.29/34",
                category: "xe-khach-xe-buyt",
                url: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/growin/thumbs/(570x380)_crop_web_Growin.png",
                price: 1850000000,
                attributes: [{ key: "engine", name: "Động cơ", value: "ISUZU 4HK1E4CC" }]
            },
            {
                name: "SAMCO ALLERGO SI 29",
                category: "xe-khach-xe-buyt",
                url: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_samco-allergo-2024.jpg",
                price: 1450000000,
                attributes: [{ key: "seats", name: "Số ghế", value: "29 chỗ" }]
            },
            {
                name: "SAMCO WENDA SD.47",
                category: "xe-khach-xe-buyt",
                url: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_samco_wenda_ksd5.png",
                price: 3250000000,
                attributes: [{ key: "seats", name: "Số ghế", value: "47 chỗ" }]
            },
            {
                name: "SAMCO NEW FELIX CI",
                category: "xe-khach-xe-buyt",
                url: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_samco-felix-2024.jpg",
                price: 1680000000,
                attributes: [{ key: "engine", name: "Động cơ", value: "ISUZU Nhật Bản" }]
            },
            {
                name: "SAMCO CITY I.40 DIESEL",
                category: "xe-khach-xe-buyt",
                url: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_product-05.png",
                price: 1980000000,
                attributes: [{ key: "type", name: "Loại hình", value: "Xe buýt nội đô" }]
            },
            {
                name: "SAMCO CITY I.51 DIESEL",
                category: "xe-khach-xe-buyt",
                url: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/thumbs/(570x380)_crop_product-05.png",
                price: 2150000000,
                attributes: [{ key: "type", name: "Loại hình", value: "Xe buýt nội đô lớn" }]
            },
            {
                name: "SAMCO CITY D.60",
                category: "xe-khach-xe-buyt",
                url: "https://samco.com.vn/vnt_upload/product/xe_khach_xe_bus/D60/thumbs/(570x380)_crop_IMG_8761.jpg",
                price: 2450000000,
                attributes: [{ key: "type", name: "Động cơ", value: "Doosan Hàn Quốc" }]
            },
            
            // Xe chuyên dụng
            {
                name: "Xe ben",
                category: "xe-chuyen-dung",
                url: "https://samco.com.vn/vnt_upload/product/isuzu/xe-ben-samco-isuzu-nqr-5-tan_2.png",
                price: 980000000,
                attributes: [{ key: "capacity", name: "Tải trọng", value: "5 Tấn" }]
            },
            {
                name: "Xe cứu hộ",
                category: "xe-chuyen-dung",
                url: "https://samco.com.vn/vnt_upload/product/cuu-ho-giao-thong/fvr/SAMCO-FVR-1.png",
                price: 1350000000,
                attributes: [{ key: "type", name: "Mục đích", value: "Cứu hộ giao thông" }]
            },

            // Xe du lịch
            {
                name: "SAMCO FELIX Limousine",
                category: "xe-du-lich",
                url: "https://samco.com.vn/vnt_upload/product/limousine/felix/SAMCO-FELIX-LIMOUSINE-1.png",
                price: 2100000000,
                attributes: [{ key: "class", name: "Phân khúc", value: "Hạng sang Limousine" }]
            },

            // Xe tải
            {
                name: "ISUZU N-Series",
                category: "xe-tai",
                url: "https://samco.com.vn/vnt_upload/product/isuzu/xe-tai-isuzu-n-series-thung-mui-bat-1.png",
                price: 680000000,
                attributes: [{ key: "series", name: "Dòng xe", value: "N-Series nhẹ" }]
            },
            {
                name: "ISUZU F-Series",
                category: "xe-tai",
                url: "https://samco.com.vn/vnt_upload/product/isuzu/SAMCO-ISUZU-FRR-MUI-BAT.png",
                price: 1100000000,
                attributes: [{ key: "series", name: "Dòng xe", value: "F-Series tải trung" }]
            },

            // Cần cẩu
            {
                name: "Cần cẩu UNIC",
                category: "can-cau",
                url: "https://samco.com.vn/vnt_upload/product/can-cau-unic/urv-340/3_tan/Can-cau-UNIC-URV-343-3-tan-3-khuc.png",
                price: 450000000,
                attributes: [{ key: "brand", name: "Thương hiệu", value: "UNIC Nhật Bản" }]
            },
            {
                name: "Cần cẩu FASSI",
                category: "can-cau",
                url: "https://samco.com.vn/vnt_upload/product/can-cau-fassi/fassi-f110b/Can-cau-FASSI-F110B.2.22-e-active-5.png",
                price: 620000000,
                attributes: [{ key: "brand", name: "Thương hiệu", value: "FASSI Ý" }]
            },

            // Dịch vụ cho thuê
            {
                name: "Cho thuê xe",
                category: "dich-vu-cho-thue",
                url: "https://samco.com.vn/vnt_upload/product/dich-vu-cho-thue/CHO-THUE-XE-1.png",
                price: 5000000,
                attributes: [{ key: "type", name: "Dịch vụ", value: "Thuê xe du lịch/xe khách" }]
            },

            // Default demo car
            {
                name: "HERIO GREEN",
                category: "o-to",
                url: "https://xekhach-bacviet.vn/wp-content/uploads/2024/11/hyundai-solti-dl-e5-mau-den-6.jpg",
                price: 850000000,
                attributes: [
                    { key: "dimensions", name: "Kích thước tổng thể (mm)", value: "3967 x 1723 x 1579" },
                    { key: "wheelbase", name: "Chiều dài cơ sở", value: "2514 mm" },
                    { key: "ground_clearance", name: "Khoảng sáng gầm xe", value: "160 mm" },
                    { key: "power", name: "Công suất tối đa", value: "100 kW" }
                ]
            }
        ];

        // Seed products and map their media downloads
        for (const item of rawProducts) {
            // Slugify product name
            const slug = item.name.toLowerCase()
                .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ặ|ẵ|â|ấ|ầ|ẩ|ậ|ẫ/g, "a")
                .replace(/đ/g, "d")
                .replace(/é|è|ẻ|ẹ|ẽ|ê|ế|ề|ể|ệ|ễ/g, "e")
                .replace(/í|ì|ỉ|ị|ĩ/g, "i")
                .replace(/ó|ò|ỏ|ọ|õ|ô|ố|ồ|ổ|ộ|ỗ|ơ|ớ|ờ|ở|ợ|ỡ/g, "o")
                .replace(/ú|ù|ủ|ụ|ũ|ư|ứ|ừ|ử|ự|ữ/g, "u")
                .replace(/ý|ỳ|ỷ|ỵ|ỹ/g, "y")
                .replace(/\s+/g, "-")
                .replace(/[^\w\-]+/g, "")
                .replace(/\-\-+/g, "-");

            const mediaDoc = await downloadImageAndCreateMedia(
                item.url, 
                `${item.name} main image`, 
                `Local media asset for ${item.name}`,
                adminUser._id
            );

            // Special gallery image for HERIO GREEN
            const galleryMediaIds = [];
            if (item.name === "HERIO GREEN") {
                const specMedia = await downloadImageAndCreateMedia(
                    "https://static.automotor.vn/w640/images/upload/2024/11/05/pin-the-ran-xe-dien-vneconomyautomotive.jpeg",
                    "Herio Green specs page",
                    "Specification details",
                    adminUser._id
                );
                galleryMediaIds.push(specMedia._id);
            }

            const productDoc = new ProductModel({
                name: item.name,
                slug: slug,
                type: item.category === "xe-may" ? "xe-may" : (item.category === "phu-kien" ? "phu-kien" : "o-to"),
                category_code: item.category,
                base_price: item.price,
                status: "Mới",
                tags: ["xe-viet", "samco"],
                attributes: item.attributes,
                configurable_options: [],
                variants: [
                    {
                        sku: `${slug.toUpperCase()}-STD`,
                        final_price: item.price,
                        stock_quantity: 5,
                        variant_media_ids: [mediaDoc._id],
                        selected_options: []
                    }
                ],
                main_image_id: mediaDoc._id,
                gallery_image_ids: [mediaDoc._id, ...galleryMediaIds],
                articleURL: null
            });
            await productDoc.save();
        }

        // 5. Seed Banners and download its image
        console.log("Seeding banners...");
        const bannerMedia = await downloadImageAndCreateMedia(
            "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200",
            "Banner main promote",
            "Main slide promotional asset",
            adminUser._id
        );

        const banner1 = new BannerIntroduceModel({
            media_id: bannerMedia._id,
            BannerSlug: "khuyen-mai-mua-he",
            BannerPath: "/vehicles/herio-green",
            isDisplay: true,
            start_date: new Date(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        await banner1.save();

        // 6. Seed News and Intro Cards
        console.log("Seeding news and intro cards...");
        const newsMedia = await downloadImageAndCreateMedia(
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600",
            "News cover image",
            "News cover asset",
            adminUser._id
        );

        const card1 = new IntroCardsModel({
            title: "Khám phá các dòng xe điện VinFast mới nhất tại SAMCO Bình Tân",
            slug: "vinfast-samco-binhtan",
            tags: ["tin-tuc", "vinfast"],
            articleURL: "/vehicles/herio-green",
            image_id: newsMedia._id
        });
        await card1.save();

        const article1 = new HeroArticlesModel({
            title: "Chính sách bảo hành pin xe điện VinFast lên đến 10 năm tại hệ thống SAMCO",
            description: "VinFast và SAMCO tiếp tục khẳng định cam kết chất lượng thông qua việc gia tăng thời hạn bảo hành pin xe điện, mang lại sự an tâm tuyệt đối cho khách hàng sở hữu dòng xe xanh.",
            slug: "bao-hanh-pin-xe-dien-vinfast-10-nam",
            tags: ["chinh-sach", "bao-hanh"],
            articleURL: "/about",
            image_id: newsMedia._id
        });
        await article1.save();

        console.log("Database seeded successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Database seeding failed:", error);
        mongoose.connection.close();
    }
};

seed();
