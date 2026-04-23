import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from 'src/dto/allDTO';
import { User, UserDocument } from 'src/schema/userSchema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<UserDocument> {
    return await this.userModel.create(registerUserDto);
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec();
  }

  async findAllUsers(): Promise<UserDocument[]> {
    return await this.userModel.find().select('-password').exec();
  }

  async getUserProfile(userId: string): Promise<UserDocument | null> {
    return await this.userModel
      .findById(userId)
      .select('-password')
      .exec();
  }
}