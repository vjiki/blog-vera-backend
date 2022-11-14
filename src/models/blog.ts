import mongoose, { Schema } from 'mongoose';
import IBlog from '../interfaces/blog';

const BlogSchema: Schema = new Schema(
    {
        title: { 
            type: String,
            unique: true,
            required: true,
        },
        content: { 
            type: String,
            unique: true,
            required: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        author: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        imageUrl: { 
            type: String
        },
        viewsCount: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
