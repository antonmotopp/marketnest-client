interface Props {
  otherUserId: string;
  onBack: () => void;
}

export const ChatHeader = ({ otherUserId, onBack }: Props) => {
  return (
    <div className="flex items-center gap-4 p-4">
      <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
        ← Back
      </button>
      <h1 className="text-xl font-semibold">Chat with User {otherUserId}</h1>
    </div>
  );
};
