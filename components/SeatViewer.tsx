import { Button } from "@/components/ui/button";

const SeatViewer = ({ seats, onSeatAction }) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {seats.map((seat) => (
        <Seat key={seat.id} seat={seat} onSeatAction={onSeatAction} />
      ))}
    </div>
  );
};

const Seat = ({ seat, onSeatAction }) => {
  const handleClick = () => {
    onSeatAction(seat);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "available":
        return "bg-gray-200 text-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-12 h-12 flex items-center justify-center ${getStatusColor(seat.status)} rounded-lg`}
    >
      {seat.status === "approved" ? seat.user.name : seat.id}
    </button>
  );
};

export default SeatViewer;
