import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly supportedMimeTypes = ['text/csv'];

  /**
   * Find the unique pairs houseId-houseAddress
   * Code complexity: 0(n)
   *
   * @returns
   */
  findUniqueHouses(housePairs: Array<HousePair>) {
    const houseIdsMap = new Map<number, number>();
    const houseAddressesMap = new Map<string, number>();
    const groupedHouses: Array<Array<HousePair>> = [];

    housePairs.forEach((housePair) => {
      const { houseId, houseAddress } = housePair;

      const houseIdGroupIndex = houseIdsMap.get(houseId);
      const houseAddressGroupIndex = houseAddressesMap.get(houseAddress);

      if (houseIdGroupIndex !== undefined) {
        // If the houseId was seen before, add the pair to its group
        groupedHouses[houseIdGroupIndex].push(housePair);

        // Also update the address map to reflect the group index, in case it's not already set
        houseAddressesMap.set(houseAddress, houseIdGroupIndex);
      } else if (houseAddressGroupIndex !== undefined) {
        // If the houseAddress was seen before, but not the houseId
        groupedHouses[houseAddressGroupIndex].push(housePair);

        // Update the houseId map to reflect the group index
        houseIdsMap.set(houseId, houseAddressGroupIndex);
      } else {
        // If neither the houseId nor the houseAddress was seen before, create a new group
        groupedHouses.push([housePair]);

        const newIndex = groupedHouses.length;

        houseIdsMap.set(houseId, newIndex);
        houseAddressesMap.set(houseAddress, newIndex);
      }
    });

    return groupedHouses.length;
  }

  isSupportedMimeType(mimeType: string) {
    return this.supportedMimeTypes.includes(mimeType);
  }
}

export interface HousePair {
  houseId: number;
  houseAddress: string;
}
