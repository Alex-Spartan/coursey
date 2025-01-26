import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DataCardProps {
  label: string;
  value: number;
  shouldFormat?: boolean;
}


const DataCard = ({ label, value, shouldFormat }: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {label}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
            {shouldFormat ? `$${value}` : value}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
