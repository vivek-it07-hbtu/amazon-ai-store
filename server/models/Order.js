const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      // Format: [{ productId, name, price, quantity, image }]
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false,
      // Format: { street, city, state, zipCode, country }
    },
    billingAddress: {
      type: DataTypes.JSON,
    },
    paymentMethod: {
      type: DataTypes.ENUM('card', 'paypal', 'cod', 'Credit Card'),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    orderStatus: {
      type: DataTypes.ENUM(
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      ),
      defaultValue: 'pending',
    },
    trackingNumber: {
      type: DataTypes.STRING,
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
    },
    deliveredAt: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['orderNumber'] },
      { fields: ['orderStatus'] },
      { fields: ['createdAt'] },
    ],
  }
);

module.exports = Order;
