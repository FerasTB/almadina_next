import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const Summary = ({ formData }) => {
    return (
      <div>
        <h3 className="text-lg text-white mb-4">Summary</h3>
        <p className="text-gray-300 mb-2">
          <strong>Seats:</strong> {formData.seatCount}
        </p>
        <p className="text-gray-300 mb-2">
          <strong>Trip Points:</strong>
        </p>
        {formData.tripPoints.map((point, index) => (
          <div key={index} className="text-gray-300 mb-2">
            {index + 1}. {point.name}{" "}
            {point.duration && `- ${point.duration} minutes`}
          </div>
        ))}
        <p className="text-gray-300 mb-2">
          <strong>Cost:</strong> {formData.cost}
        </p>
        <p className="text-gray-300 mb-2">
          <strong>Note:</strong> {formData.note || "No notes added"}
        </p>
        <p className="text-gray-300 mb-2">
          <strong>Date:</strong> {formData.date}
        </p>
        <p className="text-gray-300 mb-2">
          <strong>Time:</strong> {formData.time}
        </p>
      </div>
    );
  };
  
  export default Summary;