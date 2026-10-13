import Contact from "../models/Contact.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import type { Request, Response } from "express";
import { validationResult } from "express-validator";

export const createContact = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, JSON.stringify(errors.array()));
        }

        const { name, email, message } = req.body;

        const newContact = Contact.create({ name, email, message });

        if (!newContact) {
            throw new ApiError(500, "Failed to create contact");
        }

        res.sendResponse(200, "Contact created successfully", newContact);
    }
);

export const getLatestContact = asyncHandler(
    async (req: Request, res: Response) => {
        const latestContact = await Contact.findOne().sort({ createdAt: -1 });

        if (!latestContact) {
            throw new ApiError(404, "No contacts found");
        }

        res.sendResponse(200, "Latest contact retrieved successfully", latestContact);
    }
);

export const getAllContacts = asyncHandler(
    async (req: Request, res: Response) => {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.sendResponse(200, "Contacts retrieved successfully", contacts);
    }
);

export const getContactById = asyncHandler(
    async (req: Request, res: Response) => {
        const contactId = req.params.id;

        const contact = await Contact.findById(contactId);

        if (!contact) {
            throw new ApiError(404, "Contact not found");
        }

        res.sendResponse(200, "Contact retrieved successfully", contact);
    }
);

export const deleteContactById = asyncHandler(
    async (req: Request, res: Response) => {
        const contactId = req.params.id;

        const contact = await Contact.findByIdAndDelete(contactId);

        if (!contact) {
            throw new ApiError(404, "Contact not found");
        }

        res.sendResponse(200, "Contact deleted successfully", contact);
    }
);  
