import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Photo } from '../photo/photo.model';
import CryptoTool from '../../utils/crypto-tool';
import { CreateUserDto } from './dto/create-user.dto';
import { WhereOptions } from 'sequelize';
import { Album } from '../album/album.model';

const hashKey = 'salt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: User) {}

  private static hashValue(value) {
    return CryptoTool.hash(value, 'sha256', hashKey);
  }

  static hashPassword(password) {
    return UserService.hashValue(password);
  }

  async findOne(condition: WhereOptions<User>) {
    return await User.findOne({
      where: condition,
    });
  }

  async create(u: CreateUserDto): Promise<User> {
    const { email, password } = u;
    const user = User.build();
    user.email = email;
    user.passwordHash = UserService.hashValue(password);
    user.userID = UserService.hashValue(email);
    return await user.save();
  }

  async listPhotos(userID, offset, limit, order, desc) {
    return await Photo.findAll({
      attributes: [
        'photoID',
        'albumID',
        'photoName',
        'modifiedTime',
        'comment',
        'size',
      ],
      include: {
        model: Album,
        where: {
          userID: userID,
        },
        required: false,
      },
      limit: limit,
      offset: offset,
      order: [[order ? order : 'modifiedTime', desc ? 'desc' : 'asc']],
    });
  }

  async listAlbums(userID, offset, limit, desc) {
    return await Album.findAll({
      attributes: ['userID', 'albumID', 'name', 'createTime'],
      include: {
        model: User,
        where: {
          userID: userID,
        },
        required: false,
      },
      limit: limit,
      offset: offset,
      order: [['name', desc ? 'desc' : 'asc']],
    });
  }
}
