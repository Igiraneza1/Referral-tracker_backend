import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ReferralAttributes {
  id: number;
  patientId: string;
  patientName: string;
  referringFacility: string;
  receivingFacility: string;
  reason: string;
  status: 'pending' | 'accepted' | 'attended' | 'feedback_received' | 'closed';
  notes?: string;
  referralDate: Date;
  createdBy: string;
}

interface ReferralCreationAttributes
  extends Optional<ReferralAttributes, 'id' | 'status' | 'notes' | 'createdBy'> {}

class Referral extends Model<ReferralAttributes, ReferralCreationAttributes>
  implements ReferralAttributes {
  public id!: number;
  public patientId!: string;
  public patientName!: string;
  public referringFacility!: string;
  public receivingFacility!: string;
  public reason!: string;
  public status!: 'pending' | 'accepted' | 'attended' | 'feedback_received' | 'closed';
  public notes?: string;
  public referralDate!: Date;
  public createdBy!: string;
}

Referral.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patientId: { type: DataTypes.STRING, allowNull: false },
    patientName: { type: DataTypes.STRING, allowNull: false },
    referringFacility: { type: DataTypes.STRING, allowNull: false },
    receivingFacility: { type: DataTypes.STRING, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'attended', 'feedback_received', 'closed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    notes: { type: DataTypes.TEXT, allowNull: true },
    referralDate: { type: DataTypes.DATEONLY, allowNull: false },
    createdBy: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: 'referrals',
    timestamps: true,
  }
);

export default Referral;