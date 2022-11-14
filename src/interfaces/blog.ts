import { Document } from 'mongoose';
import IUser from './user';

export default interface IBlog extends Document {
    title: string;
    content: string;
    tags: Array<string>;
    author: IUser;
    imageUrl?: string;
    viewsCount: number;
}
