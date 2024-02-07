import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly supportedMimeTypes = ['text/csv'];

  /**
   * Find the unique pairs houseId-houseAddress
   * Code complexity: 0(3n) ~ 0(n)
   *
   * @returns
   */
  findUniqueHouses(housePairs: Array<HousePair>) {
    const idAddressesMap = this.buildIdAddressMap(housePairs);
    const addressIdsMap = this.buildAddressIdMap(housePairs);

    let countDuplication = 0;

    // Loop for each houseId in id-addresses table then reference to address-ids table to find the duplications
    idAddressesMap.forEach((houseAddresses) => {
      houseAddresses.forEach((address) => {
        // all other ids except the current one (in current iteration) are counted as duplications
        countDuplication += addressIdsMap.get(address).size - 1;
      });
    });

    // divided by 2 because the duplication is counted twice, for ex id 1 is considered the same as 2 and 2 is considered the same as 1
    return idAddressesMap.size - countDuplication / 2;
  }

  /**
   * Build map table between houseId and many houseAddresses
   *
   * @param data
   * @returns
   */
  private buildIdAddressMap(data: Array<HousePair>) {
    const idAddressesMap = new Map<string, Set<string>>();

    data.forEach((pair) => {
      if (!idAddressesMap.has(pair.houseId)) {
        idAddressesMap.set(pair.houseId, new Set());
      }

      idAddressesMap.get(pair.houseId).add(pair.houseAddress);
    });

    return idAddressesMap;
  }

  /**
   * Build map table between houseAddress and many houseIds
   *
   * @param data
   * @returns
   */
  private buildAddressIdMap(data: Array<HousePair>) {
    const addressIdsMap = new Map<string, Set<string>>();

    data.forEach((pair) => {
      if (!addressIdsMap.has(pair.houseAddress)) {
        addressIdsMap.set(pair.houseAddress, new Set());
      }

      addressIdsMap.get(pair.houseAddress).add(pair.houseId);
    });

    return addressIdsMap;
  }

  isSupportedMimeType(mimeType: string) {
    return this.supportedMimeTypes.includes(mimeType);
  }
}

export interface HousePair {
  houseId: string;
  houseAddress: string;
}
