import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SeatSelection = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const seatOptions = [25, 20, 15, 12, 10];

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
  };

  return (
    <Card className="relative p-6 bg-gray-800 rounded-xl mb-8">
      <div className="flex justify-between items-center">

        <div className="flex mt-2 space-x-3">
          {seatOptions.map((seat) => (
            <Button
              key={seat}
              onClick={() => handleSeatClick(seat)}
              className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                selectedSeat === seat
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-gray-300"
              } hover:bg-orange-600`}
            >
              {seat}
            </Button>
          ))}
        </div>
        <Label className="text-gray-300 mb-11">تحديد عدد المقاعد</Label>
      </div>
    </Card>
  );
};

export default SeatSelection;
