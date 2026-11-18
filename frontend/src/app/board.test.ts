import { describe, expect, it } from "vitest";
import { addCard, deleteCard, initialColumns, moveCard, renameColumn } from "./board";

describe("board state", () => {
  it("starts with five fixed columns", () => {
    expect(initialColumns).toHaveLength(5);
  });

  it("renames a column", () => {
    const result = renameColumn(initialColumns, "backlog", "Ideas");
    expect(result[0].title).toBe("Ideas");
  });

  it("adds and deletes cards", () => {
    const card = { id: "card-new", title: "New card", details: "New details" };
    const added = addCard(initialColumns, "done", card);
    expect(added[4].cards).toContainEqual(card);

    const deleted = deleteCard(added, "card-new");
    expect(deleted[4].cards).not.toContainEqual(card);
  });

  it("moves cards to another column", () => {
    const result = moveCard(initialColumns, "card-1", "done");
    expect(result[0].cards.some((card) => card.id === "card-1")).toBe(false);
    expect(result[4].cards.some((card) => card.id === "card-1")).toBe(true);
  });

  it("places a reordered card after the target card", () => {
    const result = moveCard(initialColumns, "card-1", "card-2", true);
    expect(result[0].cards.map((card) => card.id)).toEqual(["card-2", "card-1"]);
  });
});
