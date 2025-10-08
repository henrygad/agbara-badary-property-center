
type Props = {
  multiple: boolean
  accept?: string
  inputRef: React.RefObject<HTMLInputElement | null>
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void,
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
};

const UploadImage = ({ multiple, accept, inputRef, onDrop, handleUpload }: Props) => {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center text-gray-500 hover:border-gray-400"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <p className="mb-3">Drag & drop images here, or</p>
      <button
        type="button"
        className="mt-4 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
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
        onChange={(e) => handleUpload(e)}
      />
    </div>
  );
};

export default UploadImage;
