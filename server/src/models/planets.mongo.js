import mongoose from 'mongoose';

export const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true
    }
});

// connects planetSchema with the 'planets' collection
export default mongoose.model('Planet', planetSchema);
