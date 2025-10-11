import {
  BadRequestException,
  ForbiddenException,
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
import { UpdateProductInput } from './dto/updateProduct.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private ProductRepo: Repository<Product>,
    private VendorService: VendorsService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
  async saveProduct(product: Product): Promise<Product> {
    return await this.ProductRepo.save(product);
  }
  async updateProduct(updateProduct: UpdateProductInput) {
    const token = updateProduct.req.cookies.access_token;
    const decode = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const findvendor = await this.VendorService.findVendorByUserId(decode.sub);
    const product = await this.ProductRepo.findOne({
      where: { id: updateProduct.product_id },
    });
    if (!product) {
      throw new NotFoundException('this proudct not exist');
    }
    if (product?.vendor_id === findvendor.id) {
      throw new ForbiddenException(
        'this product does not belong to this vendor',
      );
    }
    await this.ProductRepo.update(updateProduct.product_id, {
      ...updateProduct,
    });
    return 'product updteed';
  }
  async getAllProducts(pagination:PaginationDto):Promise<Product[]>{
    const {page,limit,category}=pagination
    const whereCaulse=category?{category}:{};
    const products=await this.ProductRepo.find({
      where:whereCaulse,
      skip:(page-1)*limit,
      take:limit
    });
    if(products.length<1){
      throw new BadRequestException("no products  exist");
      
    }
    return products
  }
}
