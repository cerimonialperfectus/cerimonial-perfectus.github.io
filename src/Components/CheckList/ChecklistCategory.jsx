// src/ChecklistCategory.jsx
import React, { useState } from "react";
import ChecklistItem from "./ChecklistItem";

export default function ChecklistCategory({ category, onUpdate, onDelete }) {
  const [itemName, setItemName] = useState("");

  const handleAddItem = () => {
    if (!itemName.trim()) return;
    const updatedItems = [
      ...category.items,
      { name: itemName, checked: false },
    ];
    onUpdate({ ...category, items: updatedItems });
    setItemName("");
  };

  const handleToggleItem = (index) => {
    const updatedItems = category.items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    onUpdate({ ...category, items: updatedItems });
  };

  const handleDeleteItem = (index) => {
    const updatedItems = category.items.filter((_, i) => i !== index);
    onUpdate({ ...category, items: updatedItems });
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{category.name}</h2>
        <button onClick={onDelete} className="text-red-500 font-bold text-xl">
          ×
        </button>
      </div>
      {category.items.map((item, index) => (
        <ChecklistItem
          key={index}
          item={item}
          onToggle={() => handleToggleItem(index)}
          onDelete={() => handleDeleteItem(index)}
        />
      ))}
      <div className="flex mt-2 gap-2">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="flex-1 px-2 py-1 border rounded"
          placeholder="Novo item"
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
