import mongoose, { Schema } from "mongoose";

const OtpTokenSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    resendAt: {
        type: Date,
        required: true
    },
});

const OtpToken = mongoose.models.OtpToken || mongoose.model("OtpToken", OtpTokenSchema);
export default OtpToken;