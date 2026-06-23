import { Application } from "express";
import path from "path";

/**
 * Configure EJS as the view engine
 */
export function configureViewEngine(app: Application): void {
    // Set EJS as template engine
    app.set("view engine", "ejs");

    // Set views directory
    app.set("views", path.join(__dirname, "..", "views"));

    console.log("[VIEWS] EJS view engine configured");
    console.log("[VIEWS] Views directory:", path.join(__dirname, "..", "views"));
}
