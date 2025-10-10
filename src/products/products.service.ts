import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/products.entity';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/CreateProduct.dto';
import { Vendor } from 'src/vendors/entity/vendors.entity';
import { VendorsService } from 'src/vendors/vendors.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private ProductRepo: Repository<Product>,
    private VendorService: VendorsService,
  ) {}

  async vendorVerfied(vendorId: number): Promise<Vendor> {
    const vendor_exist = await this.VendorService.findVendorById(vendorId);
    if (vendor_exist?.status == 'pending') {
      throw new UnauthorizedException('this vendor not verified yet');
    }
    return vendor_exist;
  }
  async createProduct(productInput: ProductDto): Promise<Product> {
    const product = await this.ProductRepo.findOne({
      where: { name: productInput.name },
    });
    await this.vendorVerfied(productInput.vendor_id);
    if (product && product.vendor_id === productInput.vendor_id) {
      throw new BadRequestException('this vendor has same product name');
    }
    const new_product = this.ProductRepo.create({
      ...productInput,
      stock_quantity: productInput.quantity,
    });
    return await this.ProductRepo.save(new_product);
  }
  async findProductById(id: number): Promise<Product> {
    const product = await this.ProductRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('this product npt exist');
    }
    return product;
  }
}
