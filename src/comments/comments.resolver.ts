import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entity/comment.entity';
import { commentDto } from './dto/comment.dto';
import { Request } from 'express';
@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(()=>Comment)
  async createComment(@Args("commentInfo")commentData:commentDto,@Context() ctx:{req:Request}){
    return await this.commentsService.createComment(commentData,ctx.req)
  }
}
