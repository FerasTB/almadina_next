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

const StepTwo = ({ formData, onDataChange }) => {
    return (
      <div>
        <Label className="text-gray-300">Date of the Trip</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => onDataChange({ date: e.target.value })}
          className="w-full bg-gray-300 rounded-md p-2 mt-2"
        />
      </div>
    );
  };
  
  export default StepTwo;