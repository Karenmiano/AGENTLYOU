import { HiOutlinePencil } from "react-icons/hi";

import type { PropsWithChildren } from "react";

interface EditableFieldProps {
  disabled?: boolean;
  onEdit: () => void;
}

function EditableField({
  disabled = false,
  onEdit,
  children,
}: PropsWithChildren<EditableFieldProps>) {
  return (
    <div className="flex justify-between p-2">
      <div>{children}</div>

      <button
        className="p-2 hover:bg-gray-100 rounded-full"
        onClick={onEdit}
        disabled={disabled}
      >
        <HiOutlinePencil />
      </button>
    </div>
  );
}

export default EditableField;
