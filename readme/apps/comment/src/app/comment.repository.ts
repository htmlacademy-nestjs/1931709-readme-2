import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '@readme/shared-types';
import { Model } from 'mongoose';
import { CommentEntity } from './comment.entity';
import { CommentsModel } from './comment.model';

const MAX_COMMENT_LENGTH = 50;

@Injectable()
export class CommentRepository {
  constructor (
   @InjectModel(CommentsModel.name) private readonly commentModel: Model<CommentsModel>) {}

  public async create(item: CommentEntity): Promise<CommentEntity> {
    const { _id, text, userId, postId } = await new this.commentModel(item).save();

    item.fillEntity({
      _id: _id.toString(),
      text,
      userId,
      postId
    });

    return item;
  }

  public async findById(postId: string): Promise<Comment[]> {
    const commentList = await this.commentModel.find({postId}, {}, {limit: MAX_COMMENT_LENGTH}).exec();

    return commentList;
  }
}