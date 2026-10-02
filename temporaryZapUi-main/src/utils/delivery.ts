export interface DeliveryLocationItem {
  id: string;
  name: string;
  isActive?: boolean;
}

/**
 * Derives the available delivery locations for a selected delivery slot.
 *
 * Rules:
 * 1. Requires selectedSlotId and a valid slotLocationMap mapping.
 * 2. Uses stable database IDs for matching (never names or labels).
 * 3. Returns only locations from allLocations whose ID is in slotLocationMap[selectedSlotId].
 * 4. If no slot selected or zero mapped locations, returns an empty array.
 */
export const getAvailableLocationsForSlot = (
  selectedSlotId: string,
  slotLocationMap: Record<string, string[]>,
  allLocations: DeliveryLocationItem[]
): DeliveryLocationItem[] => {
  if (!selectedSlotId || !slotLocationMap) return [];
  const allowedIds = slotLocationMap[selectedSlotId];
  if (!Array.isArray(allowedIds) || allowedIds.length === 0) return [];
  
  const allowedSet = new Set(allowedIds);
  return allLocations.filter((loc) => allowedSet.has(loc.id));
};

/**
 * Computes the new selected delivery location ID when switching slots.
 *
 * Rules:
 * If the current selected location ID is still available in the new slot, keep it.
 * Otherwise, return '' to clear/reset the selection.
 */
export const getValidDeliveryLocationOnSlotChange = (
  newSlotId: string,
  currentLocationId: string,
  slotLocationMap: Record<string, string[]>
): string => {
  if (!newSlotId || !currentLocationId || !slotLocationMap) return '';
  const allowedIds = slotLocationMap[newSlotId];
  if (!Array.isArray(allowedIds) || !allowedIds.includes(currentLocationId)) {
    return '';
  }
  return currentLocationId;
};
