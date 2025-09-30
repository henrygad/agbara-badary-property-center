
type Props = {
  multiple: boolean
  accept?: string
  inputRef: React.RefObject<HTMLInputElement | null>
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void,
  onFiles: (files: FileList | null) => void
};

const InputImage = ({ multiple, accept, inputRef, onDrop, onFiles}: Props) => {
  return (
    <div
      className="w-full max-w-[480px] h-[200px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center text-gray-500 hover:border-gray-400"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <p className="mb-3">Drag & drop images here, or</p>
      <button
        type="button"
        className="px-3 py-1 rounded bg-blue-600 text-white cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        Browse
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept || "image/*"}
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
    </div>
  );
};

export default InputImage;
