import sequelize from "../../config/database";
import { DataTypes, Model, Optional } from "sequelize";

interface PostAttributes {
  id: number;
  title: string;
  image: number;
  like: number;
}

// We have to declare the PostCreationAttributes to tell Sequelize what's allowed to be passed to create functions
interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public title!: string;
  public image!: number;
  public like!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    like:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
  
  },
  {
    sequelize,
    modelName: "ms_Post"
  }
);


export default Post