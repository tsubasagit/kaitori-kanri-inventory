import { Badge } from "@/components/ui";
import { ItemStatus } from "@/types";
import { ITEM_STATUS_LABELS, ITEM_STATUS_COLORS } from "@/constants/statuses";

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  const { color, bgColor } = ITEM_STATUS_COLORS[status];
  return (
    <Badge color={color} bgColor={bgColor}>
      {ITEM_STATUS_LABELS[status]}
    </Badge>
  );
}
