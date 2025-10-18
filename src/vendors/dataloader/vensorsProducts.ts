import * as DataLoader from 'dataloader';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import { VendorsService } from 'src/vendors/vendors.service';

export function createVendorLoader(vendorsService: VendorsService) {
  return new DataLoader<number, Vendor>(async (vendorIds: readonly number[]) => {
    // Make sure your service accepts vendorIds array
    const vendors = await vendorsService.findByIds(vendorIds as number[]);

    // Create a map for O(1) lookup
    const vendorMap = new Map<number, Vendor>();
    vendors.forEach((vendor) => vendorMap.set(vendor.id, vendor));

    // Ensure every vendorId returns a Vendor or throw Error (DataLoader requirement)
    return vendorIds.map((id) => {
      const vendor = vendorMap.get(id);
      if (!vendor) throw new Error(`Vendor not found for ID: ${id}`);
      return vendor;
    });
  });
}
