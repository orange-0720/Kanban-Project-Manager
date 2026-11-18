"use client";

import { FormEvent, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  addCard,
  Card,
  Column,
  deleteCard,
  initialColumns,
  moveCard,
  renameColumn,
} from "./board";

function CardItem({ card, onDelete }: { card: Card; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`card${isDragging ? " cardDragging" : ""}`}
      {...attributes}
      {...listeners}
      role="group"
    >
      <div>
        <h3>{card.title}</h3>
        <p>{card.details}</p>
      </div>
      <button
        type="button"
        className="deleteButton"
        aria-label={`Delete ${card.title}`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onDelete(card.id)}
      >
        <span aria-hidden="true">×</span>
      </button>
    </article>
  );
}

function AddCardForm({ columnId, onAdd, onCancel }: {
  columnId: string;
  onAdd: (columnId: string, card: Card) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd(columnId, {
      id: `card-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: title.trim(),
      details: details.trim(),
    });
  }

  return (
    <form className="addForm" onSubmit={submit}>
      <input
        autoFocus
        aria-label="Card title"
        placeholder="Card title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        aria-label="Card details"
        placeholder="Details"
        value={details}
        onChange={(event) => setDetails(event.target.value)}
      />
      <div className="formActions">
        <button type="button" className="cancelButton" onClick={onCancel}>Cancel</button>
        <button type="submit" className="submitButton">Add card</button>
      </div>
    </form>
  );
}

function BoardColumn({
  column,
  onRename,
  onDelete,
  onAdd,
  adding,
  setAdding,
}: {
  column: Column;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onAdd: (id: string, card: Card) => void;
  adding: boolean;
  setAdding: (id: string | null) => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(column.title);
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  function finishRename() {
    const nextTitle = title.trim();
    if (nextTitle) onRename(column.id, nextTitle);
    else setTitle(column.title);
    setRenaming(false);
  }

  return (
    <section ref={setNodeRef} className={`column${isOver ? " columnOver" : ""}`}>
      <header className="columnHeader">
        {renaming ? (
          <input
            className="titleInput"
            aria-label={`Rename ${column.title}`}
            value={title}
            autoFocus
            onChange={(event) => setTitle(event.target.value)}
            onBlur={finishRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") finishRename();
              if (event.key === "Escape") {
                setTitle(column.title);
                setRenaming(false);
              }
            }}
          />
        ) : (
          <button type="button" className="titleButton" onClick={() => setRenaming(true)}>
            {column.title}
          </button>
        )}
        <span className="count" aria-label={`${column.cards.length} cards`}>{column.cards.length}</span>
      </header>

      <SortableContext
        items={column.cards.map((card) => card.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="cardList">
          {column.cards.map((card) => (
            <CardItem key={card.id} card={card} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>

      {adding ? (
        <AddCardForm columnId={column.id} onAdd={onAdd} onCancel={() => setAdding(null)} />
      ) : (
        <button type="button" className="addButton" onClick={() => setAdding(column.id)}>
          <span aria-hidden="true">+</span> Add card
        </button>
      )}
    </section>
  );
}

export default function Home() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [adding, setAdding] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragStart(event: DragStartEvent) {
    const card = columns.flatMap((column) => column.cards).find((item) => item.id === event.active.id);
    setActiveCard(card ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    if (!event.over) return;
    const activeRect = event.active.rect.current.translated;
    const placeAfter = activeRect
      ? activeRect.top + activeRect.height / 2 > event.over.rect.top + event.over.rect.height / 2
      : false;
    setColumns((current) =>
      moveCard(current, String(event.active.id), String(event.over?.id), placeAfter),
    );
  }

  return (
    <main className="appShell">
      <header className="topbar">
        <div className="brandMark" aria-hidden="true"><span /><span /></div>
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Product launch</h1>
        </div>
      </header>

      <DndContext
        id="product-launch-board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board" aria-label="Product launch kanban board">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              onRename={(id, title) => setColumns((current) => renameColumn(current, id, title))}
              onDelete={(id) => setColumns((current) => deleteCard(current, id))}
              onAdd={(id, card) => {
                setColumns((current) => addCard(current, id, card));
                setAdding(null);
              }}
              adding={adding === column.id}
              setAdding={setAdding}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCard ? (
            <article className="card dragOverlay">
              <div><h3>{activeCard.title}</h3><p>{activeCard.details}</p></div>
            </article>
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}
