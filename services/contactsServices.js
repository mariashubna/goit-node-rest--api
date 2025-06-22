import Contact from "../db/contacts.js";

async function listContacts(filters, options = {}) {
  const { count, rows } = await Contact.findAndCountAll({
    where: filters,
    offset: options.offset || 0,
    limit: options.limit || 20,
  });

  return {
    total: count,
    contacts: rows,
  };
}

async function getContact({ id, owner }) {
  const contact = await Contact.findOne({ where: { id, owner } });
  return contact || null;
}

async function removeContact(query) {
  const contact = await getContact(query);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

async function addContact({ name, email, phone, owner }) {
  const newContact = await Contact.create({ name, email, phone, owner });
  return newContact;
}

async function changeContact(query, updateData) {
  const contact = await getContact(query);
  if (!contact) return null;
  await contact.update(updateData);
  return contact;
}

async function changeFavorite(query, updateData) {
  const contact = await getContact(query);
  if (!contact) return null;
  await contact.update(updateData);
  return contact;
}

export {
  listContacts,
  getContact,
  removeContact,
  addContact,
  changeContact,
  changeFavorite,
};
