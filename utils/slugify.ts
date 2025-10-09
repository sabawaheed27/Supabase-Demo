export const slugify = (text: string) => {
  const baseSlug = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  // Add a short unique suffix (timestamp)
  const uniqueSuffix = Date.now().toString(36); // e.g. 'lkh2z9'
  return `${baseSlug}-${uniqueSuffix}`;
};
