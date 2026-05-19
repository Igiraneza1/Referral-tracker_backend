import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id: number;
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'DEVELOPER' | 'FACILITY_ADMIN' | 'REFERRAL_OFFICER' | 'VIEWER';
  facility?: string;
  isActive: boolean;
}
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'isActive' | 'facility'> {}
// 3. The Sequelize model class
class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public fullName!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: 'ADMIN' | 'DEVELOPER' | 'FACILITY_ADMIN' | 'REFERRAL_OFFICER' | 'VIEWER';
  public facility?: string;
  public isActive!: boolean;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('ADMIN', 'DEVELOPER', 'FACILITY_ADMIN', 'REFERRAL_OFFICER', 'VIEWER'),
      allowNull: false,
    },
    facility: { type: DataTypes.STRING, allowNull: true },
     isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);
export default User;