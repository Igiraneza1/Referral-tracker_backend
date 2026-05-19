"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const Referral_1 = __importDefault(require("./models/Referral"));
const User_1 = __importDefault(require("./models/User"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const referralRoutes_1 = __importDefault(require("./routes/referralRoutes"));
const _models = { Referral: Referral_1.default, User: User_1.default };
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use('/api/referrals', referralRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});
const connectAndStart = async () => {
    try {
        await database_1.default.authenticate();
        console.log('Models registered:', Object.keys(database_1.default.models));
        await database_1.default.sync();
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};
connectAndStart();
