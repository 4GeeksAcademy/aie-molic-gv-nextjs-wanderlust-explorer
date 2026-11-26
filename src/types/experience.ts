export const EXPERIENCE_CATEGORIES = [
  "Adventure",
  "Culture",
  "Food",
  "Wellness",
  "Nature",
] as const;

export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];

export const EXPERIENCE_CATEGORY_LABELS: Record<ExperienceCategory, string> = {
  Adventure: "Aventura",
  Culture: "Cultura",
  Food: "Gastronomía",
  Wellness: "Bienestar",
  Nature: "Naturaleza",
};

export interface Experience {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: ExperienceCategory;
  readonly destination: {
    readonly city: string;
    readonly country: string;
  };
  /** Price in euros. */
  readonly price: number;
  readonly rating: number;
  /** Local public path to an image or placeholder. */
  readonly imageUrl: string;
}
