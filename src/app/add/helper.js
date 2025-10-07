import * as Yup from "yup";

export const validationSchema = Yup.object({
  word: Yup.string().required("Word is required"),
  type: Yup.string().required("Word type is required"),
  pronunciation: Yup.string().required("Pronunciation is required"),
  definition: Yup.string()
    .min(10, "Definition must be at least 10 characters long")
    .required("Definition is required"),
  example: Yup.string()
    .min(10, "Example must be at least 10 characters long")
    .required("Usage example is required"),
  imageUrl: Yup.string().url("Must be a valid URL").required("Image URL is required"),
  origin: Yup.string().required("Origin is required"),
  synonyms: Yup.string().required("Synonyms is required"),
  etymology: Yup.string().required("Etymology is required"),
  etymologyStory: Yup.string().required("Story is required"),
  mnemonics: Yup.string().required("Mnemonics is required"),
  tags: Yup.string().required("Tags is required"),
});
