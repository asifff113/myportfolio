import { useState, useEffect } from 'react';
import { reorderItems } from '@/lib/supabase-queries';

export function useReorder<T extends { id?: string; order?: number }>(
  initialItems: T[],
  tableName: string,
  onUpdate?: () => void
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleMoveUp = async (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (index === 0) return;
    
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    
    // Update order property locally
    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      order: idx
    }));

    setItems(updatedItems);
    
    try {
      setLoading(true);
      // Filter out items without ID (shouldn't happen for persisted items)
      const itemsToUpdate = updatedItems
        .filter(item => item.id)
        .map((item, idx) => ({ id: item.id!, order: idx }));
        
      if (itemsToUpdate.length > 0) {
        await reorderItems(tableName, itemsToUpdate);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Failed to reorder:", error);
      // Revert state on error
      setItems(items);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveDown = async (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (index === items.length - 1) return;
    
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    
    // Update order property locally
    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      order: idx
    }));

    setItems(updatedItems);

    try {
      setLoading(true);
      const itemsToUpdate = updatedItems
        .filter(item => item.id)
        .map((item, idx) => ({ id: item.id!, order: idx }));
        
      if (itemsToUpdate.length > 0) {
        await reorderItems(tableName, itemsToUpdate);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Failed to reorder:", error);
      setItems(items);
    } finally {
      setLoading(false);
    }
  };

  return { items, handleMoveUp, handleMoveDown, loading };
}
