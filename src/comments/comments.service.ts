import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { commentDto } from './dto/comment.dto';
import { Request } from 'express';
import { ClientsService } from 'src/clients/clients.service';
import { ProductsService } from 'src/products/products.service';
import { privateDecrypt } from 'crypto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private CommentRepo: Repository<Comment>,
    private CleintService: ClientsService,
    private ProductSerive:ProductsService

  ) {}

  async createComment(
    commentInput: commentDto,
    req: Request,
  ): Promise<Comment> {
    const token = req?.cookies?.access_token;
    const decode = await this.CleintService.decode(token);
    const client_exist = await this.CleintService.findClientByUserId(
      decode.sub,
    );

    if (!client_exist) {
      throw new NotFoundException('this client with this user id not exist');
    }
    const product=await this.ProductSerive.findProductById(commentInput.product_id);
    if(!product){
        throw new NotFoundException("this product with this id not exist")
    }
    const comment = this.CommentRepo.create({
        product:product,
        content:commentInput.constent,
        author:client_exist
    });
    return await this.CommentRepo.save(comment);
  }
}
