import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const dataBuffer = await fs.readFile(contactsPath);
  const contactsList = JSON.parse(dataBuffer);
  return contactsList;
}

async function getContactById(contactId) {
  const contactsList = await listContacts();
  const contact = contactsList.find((contact) => contact.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contactsList = await listContacts();
  const removeContact = await getContactById(contactId);
  if (!removeContact) return null;

  const newList = contactsList.filter((contact) => contact.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(newList, null, 2));

  return removeContact;
}

async function addContact(name, email, phone) {
  const id = uuid();
  const newContact = { id, name, email, phone };
  const contactsList = await listContacts();
  const newList = [...contactsList, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(newList, null, 2));
  return newContact;
}

async function changeContact(id, updateData) {
  const contactById = await getContactById(id);
  if (!contactById) return null;
  const updateContact = {
    id: contactById.id,
    name: updateData.name || contactById.name,
    email: updateData.email || contactById.email,
    phone: updateData.phone || contactById.phone,
  };
  const contactsList = await listContacts();
  const newList = [
    ...contactsList.filter((contact) => contact.id !== id),
    updateContact,
  ];
  await fs.writeFile(contactsPath, JSON.stringify(newList, null, 2));
  return updateContact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  changeContact,
};
