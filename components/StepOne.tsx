import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust import paths as needed
import { PlusCircle, Trash } from "lucide-react"; // Icons

const StepOne = ({ formData, onDataChange }) => {
  const [points, setPoints] = useState(formData.tripPoints || [{ name: "", duration: "" }]);

  const handlePointChange = (index, field, value) => {
    const updatedPoints = [...points];
    updatedPoints[index][field] = value;
    setPoints(updatedPoints);
    onDataChange({ tripPoints: updatedPoints });
  };

  const handleAddPoint = () => {
    setPoints([...points, { name: "", duration: "" }]);
  };

  const handleRemovePoint = (index) => {
    const updatedPoints = points.filter((_, i) => i !== index);
    setPoints(updatedPoints);
    onDataChange({ tripPoints: updatedPoints });
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-300">Trip Points</h3>
      <Table className="mt-2">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Duration to Next (min)</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {points.map((point, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  placeholder={`Point ${index + 1} Name`}
                  value={point.name}
                  onChange={(e) =>
                    handlePointChange(index, "name", e.target.value)
                  }
                  required
                  className="bg-gray-300 rounded-md"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Duration"
                  value={point.duration}
                  onChange={(e) =>
                    handlePointChange(index, "duration", e.target.value)
                  }
                  required={index !== points.length - 1}
                  disabled={index === points.length - 1}
                  className="bg-gray-300 rounded-md"
                />
              </TableCell>
              <TableCell className="flex justify-end">
                {index !== points.length - 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePoint(index)}
                    className="text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full flex items-center justify-center"
        onClick={handleAddPoint}
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Another Point
      </Button>
    </div>
  );
};

export default StepOne;
