import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TableActions({ onEdit, onDelete }: TableActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      {onEdit && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
      )}
      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      )}
    </div>
  );
} 