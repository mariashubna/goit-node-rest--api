import {
  listContacts,
  getContact,
  removeContact,
  addContact,
  changeContact,
  changeFavorite,
} from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

const getAllContacts = async (req, res, next) => {
  const { id } = req.user;

  const { page = 1, limit = 20, favorite } = req.query;

  const skip = (page - 1) * limit;
  const filters = { owner: id };

  if (favorite !== undefined) {
    filters.favorite = favorite === "true";
  }

  const { total, contacts } = await listContacts(filters, {
    offset: skip,
    limit: +limit,
  });

  const totalPages = Math.ceil(total / limit);

  if (page > totalPages && totalPages !== 0) {
    throw HttpError(
      400,
      `Page ${page} does not exist. Total pages: ${totalPages}`
    );
  }

  res.status(200).json({
    total,
    totalPages,
    page: +page,
    limit: +limit,
    contacts,
  });
};

const getOneContact = async (req, res, next) => {
  const { id: owner } = req.user;
  const id = req.params.id;
  const contact = await getContact({ id, owner });
  if (!contact) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(contact);
};

const deleteContact = async (req, res, next) => {
  const { id: owner } = req.user;
  const id = req.params.id;
  const deletedContact = await removeContact({ id, owner });
  if (!deletedContact) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(deletedContact);
};

const createContact = async (req, res, next) => {
  const { id } = req.user;
  const { name, email, phone } = req.body;
  const newContact = await addContact({ name, email, phone, owner: id });
  res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
  const { id: owner } = req.user;
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, "Body must have at least one field");
  const updatedContact = await changeContact(
    { id, owner },
    { name, email, phone }
  );

  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(updatedContact);
};

const updateFavorite = async (req, res, next) => {
  const { id: owner } = req.user;
  const { id } = req.params;
  const { favorite } = req.body;
  if (Object.keys(req.body).length === 0)
    throw HttpError(400, "Body must have at least field 'favorite'");
  const updatedFavorite = await changeFavorite({ id, owner }, { favorite });

  if (!updatedFavorite) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(updatedFavorite);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
