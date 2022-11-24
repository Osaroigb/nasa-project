import mongoose from 'mongoose';

const launchSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
        default: 100,
        min: 100,
        max: 1000
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    target: {
        type: String, // mongoose.ObjectId
        required: false
        // ref: 'Planet'
    },
    customers: {
        type: [ String ],
        required: false
    },
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }

});

// connects launchSchema with the 'launches' collection
export default mongoose.model('Launch', launchSchema);
