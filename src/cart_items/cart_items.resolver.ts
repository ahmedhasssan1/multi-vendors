import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CartItemsService } from './cart_items.service';
import { CartItemDto } from './dto/createCartItem.dto';
import { Request } from 'express';
import { Response } from 'express';
import { CartItem } from './entity/cart_item.entity';
import { UseGuards } from '@nestjs/common';
import { clientGuard } from 'src/common/guards/client.guard';
import { QuantityDto } from './dto/updateQuantity.dto';
import { recommendedRules } from 'graphql';
@Resolver()
export class CartItemsResolver {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Mutation(() => CartItem)
  @UseGuards(clientGuard)
  async addProduct(
    @Args('addProductInfo') product: CartItemDto,
    @Context() ctx: { req: Request; res: Response },
  ) {
    return await this.cartItemsService.createCartItem(product, ctx.req);
  }

  @Mutation(() => CartItem)
  async increaseCartItemQuantiy(
    @Args('increaseData') info: QuantityDto,
    @Context() ctx: { req: Request },
  ) {
    return await this.cartItemsService.updateCartItemQuantity(info, ctx.req);
  }
  @Mutation(()=>String)
  async deleteCartItem(@Args("cartItemData")product_id:number,@Context() ctx:{req:Request}){
    return await this.cartItemsService.deleteCartItem(product_id,ctx.req); 
  }
}
