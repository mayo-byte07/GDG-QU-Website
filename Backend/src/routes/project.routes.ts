import { Router } from "express";
import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
} from "../controllers/project.controller";
import adminAuthMiddleware from "../middlewares/adminAuth.middleware";
import { body, param } from "express-validator";

const projectRouter = Router();

projectRouter.get("/", getProjects);

projectRouter.use(adminAuthMiddleware);
projectRouter.post(
    "/",
    [
        body("name")
            .isString()
            .withMessage("Name must be a string")
            .notEmpty()
            .withMessage("Name is required"),
        body("description")
            .isString()
            .withMessage("Description must be a string")
            .notEmpty()
            .withMessage("Description is required"),
        body("createdBy")
            .isString()
            .withMessage("CreatedBy must be a string")
            .notEmpty()
            .withMessage("CreatedBy is required"),
        body("photosUrls").isArray().withMessage("PhotosUrls must be an array"),
        body("coverUrl")
            .isString()
            .withMessage("CoverUrl must be a string")
            .notEmpty()
            .withMessage("CoverUrl is required")
            .isURL()
            .withMessage("CoverUrl must be a valid URL"),
        body("tags").isArray().withMessage("Tags must be an array"),
        body("githubUrl")
            .optional()
            .isString()
            .withMessage("GithubUrl must be a string")
            .isURL()
            .withMessage("GithubUrl must be a valid URL"),
        body("readmeUrl")
            .optional()
            .isString()
            .withMessage("ReadmeUrl must be a string")
            .isURL()
            .withMessage("ReadmeUrl must be a valid URL"),
        body("liveUrl")
            .optional()
            .isString()
            .withMessage("LiveUrl must be a string")
            .isURL()
            .withMessage("LiveUrl must be a valid URL"),
    ],
    createProject
);
projectRouter.put(
    "/:id",
    [
        param("id")
            .isMongoId()
            .withMessage("Project ID must be a valid Mongo ID"),
        body("name").optional().isString().withMessage("Name must be a string"),
        body("description")
            .optional()
            .isString()
            .withMessage("Description must be a string"),
        body("createdBy")
            .optional()
            .isString()
            .withMessage("CreatedBy must be a string"),
        body("photosUrls")
            .optional()
            .isArray()
            .withMessage("PhotosUrls must be an array"),
        body("coverUrl")
            .optional()
            .isString()
            .withMessage("CoverUrl must be a string")
            .isURL()
            .withMessage("CoverUrl must be a valid URL"),
        body("tags").optional().isArray().withMessage("Tags must be an array"),
        body("githubUrl")
            .optional()
            .isString()
            .withMessage("GithubUrl must be a string")
            .isURL()
            .withMessage("GithubUrl must be a valid URL"),
        body("readmeUrl")
            .optional()
            .isString()
            .withMessage("ReadmeUrl must be a string")
            .isURL()
            .withMessage("ReadmeUrl must be a valid URL"),
        body("liveUrl")
            .optional()
            .isString()
            .withMessage("LiveUrl must be a string")
            .isURL()
            .withMessage("LiveUrl must be a valid URL"),
    ],
    updateProject
);
projectRouter.delete(
    "/:id",
    [
        param("id")
            .isMongoId()
            .withMessage("Project ID must be a valid Mongo ID"),
    ],
    deleteProject
);

export default projectRouter;
