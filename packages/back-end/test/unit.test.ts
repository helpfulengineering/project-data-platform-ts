import { describe, it, expect } from "vitest";
import { getFileNameAndFileType } from "../src/utils/utils.js";
import {
  hasOverlapKeywords,
  normalizeKeywords,
  convertToProduct,
} from "../src/functions/httpFunctions.js";

describe("getFileNameAndFileType", () => {
  it("splits a simple filename", () => {
    expect(getFileNameAndFileType("bread.yml")).toEqual({
      fileName: "bread",
      fileType: "yml",
    });
  });

  it("keeps dots before the last one as part of the name", () => {
    expect(getFileNameAndFileType("my.recipe.json")).toEqual({
      fileName: "my.recipe",
      fileType: "json",
    });
  });

  it("throws when there is no extension", () => {
    expect(() => getFileNameAndFileType("bread")).toThrow();
  });
});

describe("normalizeKeywords", () => {
  it("returns an empty array for null/undefined", () => {
    expect(normalizeKeywords(null)).toEqual([]);
    expect(normalizeKeywords(undefined)).toEqual([]);
  });

  it("splits a comma-separated string and trims whitespace", () => {
    expect(normalizeKeywords(" bread , cookies ,,gluten-free")).toEqual([
      "bread",
      "cookies",
      "gluten-free",
    ]);
  });

  it("filters non-string entries out of an array", () => {
    expect(normalizeKeywords(["bread", " ", 42 as unknown as string, "cookies"])).toEqual([
      "bread",
      "cookies",
    ]);
  });
});

describe("hasOverlapKeywords", () => {
  it("is case-insensitive and trims whitespace", () => {
    expect(hasOverlapKeywords(["Bread"], [" bread "])).toBe(true);
  });

  it("returns false when there is no overlap", () => {
    expect(hasOverlapKeywords(["bread"], ["cookies"])).toBe(false);
  });

  it("returns false for empty inputs", () => {
    expect(hasOverlapKeywords([], ["bread"])).toBe(false);
    expect(hasOverlapKeywords(["bread"], [])).toBe(false);
  });
});

describe("convertToProduct", () => {
  it("returns null for non-object input", () => {
    expect(convertToProduct("f.json", null, 0)).toBeNull();
    expect(convertToProduct("f.json", "not an object", 0)).toBeNull();
  });

  it("maps OKH fields to the product summary shape", () => {
    const product = convertToProduct(
      "bread.json",
      {
        title: "Bread",
        description: "Tasty bread",
        image: "https://example.com/bread.png",
        "project-link": "https://example.com/bread",
        "manifest-author": { name: "Jane Doe" },
      },
      3
    );
    expect(product).toEqual({
      id: 3,
      fname: "bread.json",
      name: "Bread",
      image: "https://example.com/bread.png",
      shortDescription: "Tasty bread",
      projectLink: "https://example.com/bread",
      manifestAuthor: "Jane Doe",
    });
  });

  it("falls back to a placeholder image and 'none' author when missing", () => {
    const product = convertToProduct("bread.json", { title: "Bread" }, 0);
    expect(product.image).toBe("https://placecats.com/300/200");
    expect(product.manifestAuthor).toBe("none");
  });

  it("prefers the nested metadata.original.manifest_author name over manifest-author", () => {
    const product = convertToProduct(
      "bread.json",
      {
        title: "Bread",
        metadata: { original: { manifest_author: { name: "Nested Author" } } },
        "manifest-author": { name: "Flat Author" },
      },
      0
    );
    expect(product.manifestAuthor).toBe("Nested Author");
  });
});
