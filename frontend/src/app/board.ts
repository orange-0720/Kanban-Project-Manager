export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  title: string;
  cards: Card[];
};

export const initialColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "card-1", title: "Research competitors", details: "Review onboarding patterns and capture key differences." },
      { id: "card-2", title: "Write product brief", details: "Define the MVP scope and launch metrics." },
    ],
  },
  {
    id: "planned",
    title: "Planned",
    cards: [
      { id: "card-3", title: "Set up analytics", details: "Track activation and completed-project events." },
    ],
  },
  {
    id: "progress",
    title: "In progress",
    cards: [
      { id: "card-4", title: "Build board experience", details: "Create the primary Kanban interface and interactions." },
      { id: "card-5", title: "Review empty states", details: "Polish the first-run experience and guidance." },
    ],
  },
  {
    id: "review",
    title: "Review",
    cards: [
      { id: "card-6", title: "Mobile layout QA", details: "Check the board at common tablet and phone widths." },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      { id: "card-7", title: "Create visual direction", details: "Finalize typography, spacing, and the color system." },
    ],
  },
];

export function renameColumn(columns: Column[], columnId: string, title: string): Column[] {
  return columns.map((column) => (column.id === columnId ? { ...column, title } : column));
}

export function addCard(columns: Column[], columnId: string, card: Card): Column[] {
  return columns.map((column) =>
    column.id === columnId ? { ...column, cards: [...column.cards, card] } : column,
  );
}

export function deleteCard(columns: Column[], cardId: string): Column[] {
  return columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => card.id !== cardId),
  }));
}

export function moveCard(columns: Column[], cardId: string, targetId: string, placeAfter = false): Column[] {
  const source = columns.find((column) => column.cards.some((card) => card.id === cardId));
  if (!source) return columns;

  const card = source.cards.find((item) => item.id === cardId);
  if (!card) return columns;

  const target = columns.find((column) =>
    column.id === targetId || column.cards.some((item) => item.id === targetId),
  );
  if (!target) return columns;

  if (source.id === target.id) {
    const oldIndex = source.cards.findIndex((item) => item.id === cardId);
    let targetIndex =
      targetId === target.id
        ? source.cards.length - 1
        : source.cards.findIndex((item) => item.id === targetId);
    if (targetId !== target.id && placeAfter) targetIndex += 1;
    if (targetIndex < 0 || oldIndex === targetIndex) return columns;

    const cards = [...source.cards];
    cards.splice(oldIndex, 1);
    cards.splice(targetIndex, 0, card);
    return columns.map((column) => (column.id === source.id ? { ...column, cards } : column));
  }

  let targetIndex =
    targetId === target.id
      ? target.cards.length
      : target.cards.findIndex((item) => item.id === targetId);
  if (targetId !== target.id && placeAfter) targetIndex += 1;
  const sourceCards = source.cards.filter((item) => item.id !== cardId);
  const targetCards = [...target.cards];
  targetCards.splice(targetIndex >= 0 ? targetIndex : targetCards.length, 0, card);

  return columns.map((column) => {
    if (column.id === source.id) return { ...column, cards: sourceCards };
    if (column.id === target.id) return { ...column, cards: targetCards };
    return column;
  });
}
