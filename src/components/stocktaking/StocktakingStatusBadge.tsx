"use client";

import { Badge } from "@/components/ui";
import { StocktakingStatus } from "@/types";
import { STOCKTAKING_STATUS_LABELS, STOCKTAKING_STATUS_COLORS } from "@/constants/statuses";

type Props = {
  status: StocktakingStatus;
};

export function StocktakingStatusBadge({ status }: Props) {
  const colors = STOCKTAKING_STATUS_COLORS[status];
  return (
    <Badge color={colors.color} bgColor={colors.bgColor}>
      {STOCKTAKING_STATUS_LABELS[status]}
    </Badge>
  );
}
