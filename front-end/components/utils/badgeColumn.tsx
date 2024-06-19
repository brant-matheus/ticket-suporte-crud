import { Badge } from "@/components/ui/badge";

interface BadgeColumnProps {
  title: string;
  hex: string;
}

export default function BadgeColumn({ hex, title }: BadgeColumnProps) {
  const color = { backgroundColor: hex };
  return (
    <Badge style={color}>
      <p className="text-black"> {title}</p>
    </Badge>
  );
}
