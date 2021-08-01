import { accessSync, constants, createWriteStream, mkdirSync, createReadStream, ReadStream } from "fs";
import { join } from 'path';
import { get } from 'config';
import { writeFile, readFile, rm, access } from "fs/promises";
import ImageCompress from './image-compress'

export class FSManager {
  static createDirIfNotExist(dirName) {
    try {
      accessSync(dirName, constants.F_OK);
    } catch (e) {
      if (e.code === 'ENOENT') {
        mkdirSync(dirName);
      }
    }
  }

  static async removeDir(dirName, recursive = true) {
    await rm(dirName, {recursive: recursive});
  }

  static async removeFile(path) {
    await rm(path, { force: true });
  }
}

export class StorageManager {
  private readonly rootDir: string;
  private readonly defaultThumbnailFormat = 'jpeg';
  constructor(rootDir: string) {
    this.rootDir = rootDir;
    FSManager.createDirIfNotExist(this.rootDir);
  }

  private getUserDir(userID) {
    return join(this.rootDir, userID);
  }

  private getAlbumDir(userID, albumID) {
    return join(this.getUserDir(userID), 'albums', albumID);
  }

  private getPhotoPath(userID, albumID, fileName) {
    return join(this.getAlbumDir(userID, albumID), 'photos', fileName);
  }

  private getThumbnailDir(userID, albumID) {
    return join(this.getAlbumDir(userID, albumID), 'thumbnails');
  }

  private getThumbnailPath(userID, albumID, photoID, width, height, format) {
    const thumbnailDir = this.getThumbnailDir(userID, albumID);
    return join(thumbnailDir, [photoID, width, height].join('_')) + '.' + format;
  }

  createUserDir(userID: string) {
    const p = this.getUserDir(userID);
    FSManager.createDirIfNotExist(p);
    FSManager.createDirIfNotExist(join(p, 'albums'));
  }

  createAlbumDir(userID: string, albumID: string) {
    const p = this.getAlbumDir(userID, albumID);
    FSManager.createDirIfNotExist(p);
    FSManager.createDirIfNotExist(join(p, 'photos'));
    FSManager.createDirIfNotExist(this.getThumbnailDir(userID, albumID));
  }

  async deleteAlbumDir(userID: string, albumID: string) {
    const p = this.getAlbumDir(userID, albumID);
    await FSManager.removeDir(p);
  }

  async writePhoto(
    userID: string,
    albumID: string,
    fileName: string,
    buffer: Buffer,
  ) {
    const path = this.getPhotoPath(userID, albumID, fileName);
    await writeFile(path, buffer);
  }

  readPhoto(
    userID: string,
    albumID: string,
    fileName: string,
  ):ReadStream {
    const path = this.getPhotoPath(userID, albumID, fileName);
    return createReadStream(path);
  }

  async deletePhoto(
    userID: string,
    albumID: string,
    fileName: string,
  ) {
    const path = this.getPhotoPath(userID, albumID, fileName);
    await FSManager.removeFile(path);
  }

  async readThumbnail(
    userID: string,
    albumID: string,
    photoID: string,
    fileName: string,
    width: number,
    height: number,
    format: string,
  ):Promise<ReadStream> {
    if (!format) format = this.defaultThumbnailFormat;
    const wantThumbnailPath = this.getThumbnailPath(userID, albumID, photoID, width, height, format);
    try {
      await access(wantThumbnailPath);
      return createReadStream(wantThumbnailPath);
    } catch (e) {
      const rawPhotoPath = this.getPhotoPath(userID, albumID, fileName);
      const s = await ImageCompress.compress(rawPhotoPath, width, height, format);
      s.pipe(createWriteStream(wantThumbnailPath));
      return s;
    }
  }
}

let mediaFileRoot = join(__dirname, '../../medias');
if (get('mediaFileRoot')) {
  mediaFileRoot = get('mediaFileRoot');
}

const storageManager = new StorageManager(mediaFileRoot);
export default storageManager;
