import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import { configureViewEngine } from "./connections/views.connection";
import { mediaRouter } from "./routes/medias.route";
import { serviceRouter } from "./routes/services.routes";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware";
import { BannerIntroducesRouter } from "./routes/banner_introduces.routes";
import { introCardsRouter } from "./routes/intro_cards.routes";
import { productRouter } from "./routes/products.route";
import { categoryRouter } from "./routes/categories.route";
import { heroArticlesRouter } from "./routes/hero_article.routes";
import { navbarItemRouter } from "./routes/header_categories.route";
import { footerItemRouter } from "./routes/footer_categories.route";
import { userRouter } from "./routes/users.route";

dotenv.config();
const app = express();

// Configure view engine
configureViewEngine(app);

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true, // Allow cookies
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth routes
app.use(userRouter);

// Feature routes
app.use(mediaRouter);
app.use(navbarItemRouter);
app.use(footerItemRouter);
app.use(BannerIntroducesRouter);
app.use(introCardsRouter);
app.use(serviceRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(heroArticlesRouter);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Error handling middleware
app.use(errorHandlerMiddleware);
export default app;
