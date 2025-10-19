// import DataLoader from 'dataloader';
// import {  getRepository } from 'typeorm';
// import { Product } from '../products/entity/products.entity';
// import { Vendor } from 'src/vendors/entity/vendors.entity';

// const batchVednors =new DataLoader( async (genreIds: number[]) => {
//   const Products = await getRepository(Product)
//     .createQueryBuilder('vendor')
//     .leftJoinAndSelect('products.vendor', 'vendor')
//     .where('Products.id IN(:...ids)', {
//       ids: genreIds,
//     })
//     .getMany();

//   return genreIds.map((id) => Products.find((vendor)=>vendor.id===id));
// });
// const genrevendorLoader = () => new DataLoader(batchVednors);

// export { genrevendorLoader };
