import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema({
    uid: {
        type: String, 
        unique: true 
    },
    name: {
        type: String
    },
    avatarUrl: {
        type: String
    },
},
{
  timestamps: true,
}
);

export default mongoose.model<IUser>('User', UserSchema);
